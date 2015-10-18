var tap = require('tap')
var exec = require('child_process').exec
var rimraf = require('rimraf')
var fs = require('fs')
var shuffle = require('shuffle-array')
var mkproj = require('./')
var templates = require('./templates')

process.chdir('./tests')

tap.test('throws an error if not passed a project name', function (t) {
  t.plan(1)
  try {
    mkproj(null, {noFunnyBusiness: true})
  } catch (e) {
    t.ok(e)
  }
})
var tmps = Object.keys(templates)

var testCases = shuffle(tmps.map(function (t) {
  if (t === 'default') {
    return [
      {kind: 'create'},
      tmps.reduce(function (a, b) {
        if (b !== 'default') a[b] = true
        return a
      }, {kind: 'create'})
    ]
  } else {
    return [
      {kind: 'create'},
      {kind: 'add'},
      {kind: 'deny'}
    ].map(function (tc) {
      return (tc[t] = true) && tc
    })
  }
}).reduce(function (a, b) {
  return a.concat(b)
}))

var after = require('after')
var counter = after(testCases.length, function () {
  console.log('CALLED THEM ALL!! ALL OF THEM!!! (but did they all pass? (that is a question for my friend Travis. (he would know!)))')
  setTimeout(function () {
    process.exit(0)
  }, 15000)
})

function doThatDanceEverybody () {
  var tc = testCases.pop()
  console.log('Running one now!!! Ok so like ' + testCases.length + ' tests left!!!')
  if (tc) {
    testThatCase(tc, doThatDanceEverybody)
    counter()
  } else {
    console.log('finished!')
  }
}

doThatDanceEverybody()
setTimeout(function () {
  console.log('whoops something horrible happened')
  process.exit(1)
}, 1000 * 60 * 9.95) // pretty sure that CI would fail after 10 minutes of chilling anyways

// this shoooouuuld be in another module but i dont give a fluff

function testThatCase (tc, doThatDance) {
  console.log(tc)
  console.log(tc.kind)
  var expectations = []
  var exclusions = [] // files to check for exclusion
  Object.keys(templates).forEach(function (t) {
    if (tc[t] || (tc.kind === 'create' && (t === 'default' || t === 'test'))) {
      expectations = expectations.concat(templates[t].files)
    } else {
      exclusions = exclusions.concat(templates[t].files)
    }
  })
  console.log(expectations, exclusions)
  tc.expectations = expectations
  tc.exclusions = exclusions
  tc.scripts = []
  tc.keys = []
  Object.keys(tc).forEach(function (k) {
    tc.scripts = tc.scripts.concat(templates[k].scripts)
    tc.keys = tc.keys.concat(templates[k].keys)
  })
  console.log(tc.kind)
  switch (tc.kind) {
    case 'create':
      console.log('CREATION')
      testMkingAProject(tc, doThatDance)
      break
    case 'add':
      testAddingToAnExistingProject(tc, doThatDance)
      break
    case 'deny':
      testHandlingFileCollissionsWhileAdding(tc, doThatDance)
      break
    default:
      console.log('sup')
  }
}

function testMkingAProject (options, cb) {
  console.log(process.cwd(), 'CWDSTART')
  var name = makeName(options)
  console.log(name)
  var type = options.browserify ? 'tape' : 'tap'
  console.log(type)
  cleanUpAndRun(name, reallyTestIt)
  function reallyTestIt () {
    tap.test(name, function (t) {
      console.log('TESTING', name)
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
        exec('cp -r ../' + type + '_modules ./' + name + '/node_modules && cd ' + name + ' && standard && node test.js', function (error, stdout, stderr) {
          t.ok(!error, 'generated module also works')
          console.log(error, stdout, stderr)
          process.chdir('../')
          console.log(name)
          rimraf(name, cb)
          console.log(process.cwd(), 'CWD')
        })
      })
    })
  }
}

function testAddingToAnExistingProject (options, cb) {
  var name = makeName(options)
  console.log(options)
  var count = options.expectations.length
  cleanUpAndRun(name, reallyTestIt)

  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(count)
      mkproj(name, {noFunnyBusiness: true}, function () {
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
  console.log(options)
  var expectations = options.expectations.map(function (f) {
    return 'BORKED: ' + f + ' already exists! Maybe delete it and try again?'
  })
  if (options.keys) {
    options.keys.forEach(function (k) {
      expectations.push('WEEEOOOO looks like you already have a ' + k + ' entry in yr package.json?')
    })
  }
  if (options.scripts) {
    options.scripts.forEach(function (k) {
      expectations.push('CATastrophic failure occurred while trying to shove stuff into package.json:')
    })
  }
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
