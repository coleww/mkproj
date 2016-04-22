var tap = require('tap')
var mkproj = require('../')
var exec = require('child_process').exec
var rimraf = require('rimraf')
var fs = require('fs')

module.exports = {
  testMkingAProject: testMkingAProject,
  testAddingToAnExistingProject: testAddingToAnExistingProject,
  testHandlingFileCollissionsWhileAdding: testHandlingFileCollissionsWhileAdding
}

function testMkingAProject (options, cb) {
  var name = makeName(options)
  var count = 0
  var exclusions = [] // files to check for exclusion
  if (options.browserify) {
    count += 4 // 6 assertions
  } else {
    exclusions.push('www')
  }

  cleanUpAndRun(name, reallyTestIt)

  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(count + exclusions.length + 8)
      options.noFunnyBusiness = true
      mkproj(name, options, function () {
        t.ok(fs.existsSync(name), 'mks a new directory')
        t.ok(fs.readFileSync(name + '/.gitignore', {encoding: 'utf-8'}).toString().match('/node_modules'), 'echoes node_modules into gitignore')
        t.equal(fs.readFileSync(name + '/.npmignore', {encoding: 'utf-8'}), 'www\ntest.js\n.travis.yml', 'echoes stuff into npmignore')
        t.ok(fs.readFileSync(name + '/README.md', {encoding: 'utf-8'}).toString().match(name + '\n----------------'), 'echoes proj name into README.md')
        t.ok(fs.existsSync(name + '/index.js'), 'mks an index.js')
        t.ok(fs.existsSync(name + '/.travis.yml'), 'mks a trav')
        t.ok(fs.existsSync(name + '/test.js'), 'mks a test file')

        if (options.browserify) {
          checkForBrowser(name, t, true)
        }

        exclusions.forEach(function (filename) {
          t.ok(!fs.existsSync(name + '/' + filename), 'does not make a ' + filename)
        })

        exec('cp -r ./tap_modules ./' + name + '/node_modules && cd ' + name + ' && standard && node test.js', function (error, stdout, stderr) {
          t.ok(!error, 'generated module also works')
          rimraf(name, cb)
        })
      })
    })
  }
}

function testAddingToAnExistingProject (options, cb) {
  var name = makeName(options)
  var count = 0
  if (options.browserify) {
    count += 4
  }
  cleanUpAndRun(name, reallyTestIt)

  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(count)
      mkproj(name, {noFunnyBusiness: true, browserify: false}, function () {
        process.chdir(name)
        options.noFunnyBusiness = true
        mkproj('', options, function () {
          if (options.browserify) {
            checkForBrowser('.', t)
          }
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

// CHANGE DEEZ to check for the project name??
function checkForBrowser (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/www/main.css').toString().match('hidden'), 'mks a main.css')
  t.ok(fs.readFileSync(path + '/www/demo.js').toString().match('document'), 'mks a demo.js')
  t.ok(fs.readFileSync(path + '/www/index.html').toString().match('html'), 'mks some html5 boilerplate')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('build'), 'adds scripts entries for building/watching')
}
