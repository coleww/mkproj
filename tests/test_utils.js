var tap = require('tap')
var mkproj = require('../')
var exec = require('child_process').exec
var rimraf = require('rimraf')
var fs = require('fs')
var templates = require('../templates')

module.exports = function (tc, doThatDance) {
  var expectations = []
  var exclusions = [] // files to check for exclusion
  Object.keys(templates).forEach(function (t) {
    if (tc[t] || (tc.kind = 'create' && (t === 'default' || t === 'test'))) {
      expectations = expectations.concat(templates[t].files)
    } else {
      exclusions = exclusions.concat(templates[t].files)
    }
  })
  tc.expectations = expectations
  tc.exclusions = exclusions
  switch (tc.kind) {
    case 'create':
      testMkingAProject(tc, doThatDance)
      break
    case 'add':
      testAddingToAnExistingProject(tc, doThatDance)
      break
    case 'deny':
      testHandlingFileCollissionsWhileAdding(tc, doThatDance)
      break
  }
}

function testMkingAProject (options, cb) {
  var name = makeName(options)

  var type = options.browserify ? 'tape' : 'tap'
  cleanUpAndRun(name, reallyTestIt)
  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(options.expectations.length + options.exclusions.length + 9)
      options.noFunnyBusiness = true
      mkproj(name, options, function () {
        t.ok(fs.existsSync(name), 'mks a new directory')
        t.ok(fs.readFileSync(name + '/.gitignore', {encoding: 'utf-8'}).toString().match('/node_modules'), 'echoes node_modules into gitignore')
        t.equal(fs.readFileSync(name + '/.npmignore', {encoding: 'utf-8'}), 'www\ntest.js\n.travis.yml', 'echoes stuff into npmignore')
        t.ok(fs.readFileSync(name + '/README.md', {encoding: 'utf-8'}).toString().match(name + '\n----------------'), 'echoes proj name into README.md')
        t.ok(fs.existsSync(name + '/index.js'), 'mks an index.js')
        t.ok(fs.existsSync(name + '/.travis.yml'), 'mks a trav')
        t.ok(fs.existsSync(name + '/package.json'), 'mks a package.json')
        t.ok(fs.readFileSync(name + '/test.js').toString().match('\'' + type + '\''), 'mks a test file that requires ' + type + '.')
        options.expectations.forEach(function (filename) {
          t.ok(fs.existsSync(name + '/' + filename), 'makes a ' + filename)
        })
        options.exclusions.forEach(function (filename) {
          t.ok(!fs.existsSync(name + '/' + filename), 'does not make a ' + filename)
        })
        exec('cp -r ./' + type + '_modules ./' + name + '/node_modules && cd ' + name + ' && standard && node test.js', function (error, stdout, stderr) {
          t.ok(!error, 'generated module also works')
          rimraf(name, cb)
        })
      })
    })
  }
}

function testAddingToAnExistingProject (options, cb) {
  var name = makeName(options)
  var count = Object.keys(options).reduce(function (a, b) {
    return a + options[b].files.length
  }, 0)
  cleanUpAndRun(name, reallyTestIt)

  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(count)
      mkproj(name, {noFunnyBusiness: true, browserify: false, twitter: false, cli: false}, function () {
        process.chdir(name)
        options.noFunnyBusiness = true
        if (options.test) fs.unlinkSync('test.js')
        mkproj('', options, function () {
          options.expectations.forEach(function (filename) {
            t.ok(fs.existsSync(name + '/' + filename), 'makes a ' + filename)
          })
          process.chdir('../')
          rimraf(name, cb)
        })
      })
    })
  }
}

function testHandlingFileCollissionsWhileAdding (options, cb) {
  var name = makeName(options)
  var expectations = options.expectations

  cleanUpAndRun(name, actuallyTestThings)

  function actuallyTestThings () {
    tap.test('logs a helpful message if trying to add a ' + name + ' that already exists', function (t) {
      t.plan(expectations.length)
      options.noFunnyBusiness = true
      mkproj(name, options, function () {
        process.chdir(name)
        var l = console.log
        console.log = function (msg) {
          var i
          if ((i = expectations.indexOf(msg)) !== -1) {
            t.ok(true, 'logs ' + expectations.splice(i, 1) + ' as expected')
          }
          l(msg)
        }
        mkproj('', options, function () {
          console.log = l
          process.chdir('../')
          rimraf(name, cb)
        })
      })
    })
  }
}

function makeName (options) {
  return JSON.stringify(options).replace(/\s+/g, ' ').replace(/\s/g, '-').replace(/\W/g, '').substr(0, 26)
}

function cleanUpAndRun (path, cb) {
  if (fs.existsSync(path)) {
    rimraf(path, function () {
      cb()
    })
  } else {
    cb()
  }
}
