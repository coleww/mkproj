var tap = require('tap')
var mkproj = require('../')
var exec = require('child_process').exec
var rimraf = require('rimraf')
var noop = function () {}
var fs = require('fs')

var checkBasics = function (path, t) {
  t.ok(fs.existsSync(path), 'mks a new directory')
  t.ok(fs.readFileSync(path + '/.gitignore', {encoding: 'utf-8'}).toString().match('/node_modules'),
          'echoes node_modules into gitignore')
  t.equal(fs.readFileSync(path + '/.npmignore', {encoding: 'utf-8'}),
          'www',
          'echoes dubdubdub into npmignore')
  t.ok(fs.readFileSync(path + '/README.md', {encoding: 'utf-8'}).toString().match(path + '\n----------------'),
          'echoes proj name into README.md')
  t.ok(fs.existsSync(path + '/index.js'), 'mks an index.js')
  t.ok(fs.existsSync(path + '/.travis.yml'), 'mks a trav')
}

var checkAbsence = function (path, t, paths) {
  paths.forEach(function (pathe) {
    t.ok(!fs.existsSync(path + '/' + pathe), 'does not make a ' + pathe)
  })
}

var cleanUpAndRun = function (path, cb) {
  if (fs.existsSync(path)) {
    rimraf(path, function () {
      cb()
    })
  } else {
    cb()
  }
}

var checkForTesty = function (path, t, type) {
  t.ok(fs.readFileSync(path + '/package.json').toString().match('\"' + type + '\"'), 'mks a package.json containing ' + type + '.')
  t.ok(fs.readFileSync(path + '/test.js').toString().match('\'' + type + '\''), 'mks a test file that requires ' + type + '.')
}

var checkGeneratedApp = function (path, t, type) {
  exec('cp -r ./' + type + '_modules ./' + path + '/node_modules && cd ' + path + ' && standard && node test.js', function (error, stdout, stderr) {
    t.ok(!error, 'generated module also works' + JSON.stringify(error) + stdout + stderr)
    rimraf(path, noop)
  })
}

var checkForCli = function (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
  t.ok(fs.readFileSync(path + '/package.json').toString().match('bin'), 'mks a package.json containing bin entry because i am garbage')
  if (goThere) {
    t.ok(fs.readFileSync(path + '/package.json').toString().match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
  }
}

var checkForTwitter = function (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/tweet.js').toString().match('twit'), 'mks a twitter boilerplate file')
  t.ok(fs.readFileSync(path + '/bot.js').toString().match('tweet'), 'mks a botfile')
  t.ok(fs.readFileSync(path + '/package.json').toString().match('node bot.js'), 'mks a package.json containing scripts entry for tooting')
  if (goThere) {
    t.ok(fs.readFileSync(path + '/package.json').toString().match('twit'), 'mks a package.json containing twit cuz it is tooting time')
  }
}

var checkForBrowser = function (path, t, goThere) {
  t.ok(fs.existsSync(path + '/www/main.css'), 'mks a main.css')
  t.ok(fs.existsSync(path + '/www/demo.js'), 'mks a demo.js')
  t.ok(fs.existsSync(path + '/www/index.html'), 'mks some html5 boilerplate')
  t.ok(fs.readFileSync(path + '/package.json').toString().match('build'), 'adds scripts entries for building/watching')
  if (goThere) {
    var packaged = fs.readFileSync(path + '/package.json').toString()
    t.ok(packaged.match('browserify'), 'mks a package.json containing browserify cuz it is time')
    t.ok(packaged.match('watchify'), 'mks a package.json containing watchify cuz it is cool')
    t.ok(packaged.match('gh-pages-deploy'), 'mks a package.json containing gh-pages-deploy cuz it is sweet')
  }
}

var testIt = function (name, options) {
  var count = 0
  var exclusions = [] // files to check for exclusion
  if (options.browserify) {
    count += 7 // 6 assertions
  } else {
    exclusions.push('www')
  }
  if (options.cli) {
    count += 3 // 2 assertions
  } else {
    exclusions.push('cmd.js')
  }
  if (options.twitter) {
    count += 4 // 3 assertions
  } else {
    exclusions.push('tweet.js')
    exclusions.push('bot.js')
  }

  var type = options.browserify ? 'tape' : 'tap'

  cleanUpAndRun(name, reallyTestIt)

  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(count + exclusions.length + 9)
      // 6 from checkBasics, 1 from generatedApp, 2 for checkForTesty
      options.noFunnyBusiness = true
      mkproj(name, options)

      setTimeout(function () {
        checkBasics(name, t)
        checkForTesty(name, t, type)
        if (options.browserify) {
          checkForBrowser(name, t, true)
        }
        if (options.cli) {
          checkForCli(name, t, true)
        }
        if (options.twitter) {
          checkForTwitter(name, t, true)
        }

        checkAbsence(name, t, exclusions)
        checkGeneratedApp(name, t, type)
      }, 1000)
    })
  }
}

var testAddingIt = function (name, options) {
  var count = 0
  if (options.browserify) {
    count += 4 // 3 assertions
  }
  if (options.cli) {
    count += 2 // 1 assertions
  }
  if (options.twitter) {
    count += 3 // 2 assertions
  }
  cleanUpAndRun(name, reallyTestIt)

  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(count)
      mkproj(name, {noFunnyBusiness: true, browserify: false, twitter: false, cli: false})

      setTimeout(function () {
        process.chdir(name)
        exec('git init', function () {
          options.noFunnyBusiness = true
          mkproj(name, options)
          setTimeout(function () {
            if (options.browserify) {
              checkForBrowser('.', t)
            }
            if (options.cli) {
              checkForCli('.', t)
            }
            if (options.twitter) {
              checkForTwitter('.', t)
            }
            process.chdir('../')
            rimraf(name, noop)
          }, 2500)
        })
      }, 2500)
    })
  }
}

var testDenyingIt = function (name, expected, options) {
  cleanUpAndRun(name, actuallyTestThings)

  function actuallyTestThings () {
    tap.test('logs a helpful message if trying to add a ' + name + ' that already exists', function (t) {
      t.plan(1)
      options.noFunnyBusiness = true
      mkproj(name, options)

      setTimeout(function () {
        process.chdir(name)
        exec('git init', function () {
          var l = console.log
          console.log = function (msg) {
            if (msg === expected) t.ok(true, 'logs ' + expected + ' as expected')
          }
          mkproj(name, options)
          setTimeout(function () {
            console.log = l
            process.chdir('../')
            rimraf(name, noop)
          }, 2500)
        })
      }, 3500)
    })
  }
}

module.exports = {
  testIt: testIt,
  testAddingIt: testAddingIt,
  testDenyingIt: testDenyingIt
}
