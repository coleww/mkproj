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

function testMkingAProject (name, options, cb) {
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
      options.noFunnyBusiness = true
      mkproj(name, options, function () {
        t.ok(fs.existsSync(name), 'mks a new directory')
        t.ok(fs.readFileSync(name + '/.gitignore', {encoding: 'utf-8'}).toString().match('/node_modules'), 'echoes node_modules into gitignore')
        t.equal(fs.readFileSync(name + '/.npmignore', {encoding: 'utf-8'}), 'www', 'echoes dubdubdub into npmignore')
        t.ok(fs.readFileSync(name + '/README.md', {encoding: 'utf-8'}).toString().match(name + '\n----------------'), 'echoes proj name into README.md')
        t.ok(fs.existsSync(name + '/index.js'), 'mks an index.js')
        t.ok(fs.existsSync(name + '/.travis.yml'), 'mks a trav')
        t.ok(fs.readFileSync(name + '/package.json').toString().match('\"' + type + '\"'), 'mks a package.json containing ' + type + '.')
        t.ok(fs.readFileSync(name + '/test.js').toString().match('\'' + type + '\''), 'mks a test file that requires ' + type + '.')

        if (options.browserify) {
          checkForBrowser(name, t, true)
        }
        if (options.cli) {
          checkForCli(name, t, true)
        }
        if (options.twitter) {
          checkForTwitter(name, t, true)
        }

        exclusions.forEach(function (filename) {
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

function testAddingToAnExistingProject (name, options, cb) {
  var count = 0
  if (options.browserify) {
    count += 4
  }
  if (options.cli) {
    count += 2
  }
  if (options.twitter) {
    count += 3
  }
  cleanUpAndRun(name, reallyTestIt)

  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(count)
      mkproj(name, {noFunnyBusiness: true, browserify: false, twitter: false, cli: false}, function () {
        process.chdir(name)
        exec('git init', function () {
          options.noFunnyBusiness = true
          mkproj(name, options, function () {
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
            rimraf(name, cb)
          })
        })
      })
    })
  }
}

function testHandlingFileCollissionsWhileAdding (name, options, cb) {
  cleanUpAndRun(name, actuallyTestThings)

  function actuallyTestThings () {
    tap.test('logs a helpful message if trying to add a ' + name + ' that already exists', function (t) {
      t.plan(1)
      options.noFunnyBusiness = true
      mkproj(name, options, function () {
        process.chdir(name)
        exec('git init', function () {
          var l = console.log
          console.log = function (msg) {
            if (msg === options.expected) t.ok(true, 'logs ' + options.expected + ' as expected')
          }
          mkproj(name, options, function () {
            console.log = l
            process.chdir('../')
            rimraf(name, cb)
          })
        })
      })
    })
  }
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

// these next 3 will break if checking for things to beinstalled unless "goThere" NOTE/TODO/FIXTHIS
function checkForCli (path, t, goThere) {
  t.ok(fs.existsSync(path + '/cmd.js'), 'mks a CLI boilerplate file')
  t.ok(fs.readFileSync(path + '/package.json').toString().match('bin'), 'mks a package.json containing bin entry because i am garbage')
  if (goThere) {
    t.ok(fs.readFileSync(path + '/package.json').toString().match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
  }
}

function checkForTwitter (path, t, goThere) {
  t.ok(fs.existsSync(path + '/tweet.js'), 'mks a twitter boilerplate file')
  t.ok(fs.existsSync(path + '/bot.js'), 'mks a botfile')
  t.ok(fs.readFileSync(path + '/package.json').toString().match('node bot.js'), 'mks a package.json containing scripts entry for tooting')
  if (goThere) {
    t.ok(fs.readFileSync(path + '/package.json').toString().match('twit'), 'mks a package.json containing twit cuz it is tooting time')
  }
}

function checkForBrowser (path, t, goThere) {
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
