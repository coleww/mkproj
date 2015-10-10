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
    exclusions.push('config.js')
    exclusions.push('bot.js')
  }
  if (options.server) {
    count += 4 // 3 assertions
  } else {
    exclusions.push('server.js')
  }
  if (options.spider) {
    count += 4 // 3 assertions
  } else {
    exclusions.push('spider.js')
  }
  if (options.synth) {
    count += 4 // 3 assertions
  } else {
    exclusions.push('synth.js')
  }
  if (options.level) {
    count += 4 // 3 assertions
  } else {
    exclusions.push('level.js')
  }
  if (options.canvas) {
    count += 4 // 3 assertions
  } else {
    exclusions.push('canvas.js')
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
        t.equal(fs.readFileSync(name + '/.npmignore', {encoding: 'utf-8'}), 'www\ntest.js\n.travis.yml', 'echoes stuff into npmignore')
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
        if (options.spider) {
          checkForSpider(name, t, true)
        }
        if (options.server) {
          checkForServer(name, t, true)
        }
        if (options.synth) {
          checkForSynth(name, t, true)
        }
        if (options.level) {
          checkForLevel(name, t, true)
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

function testAddingToAnExistingProject (options, cb) {
  var name = makeName(options)
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
  if (options.browserify) {
    count += 4
  }
  if (options.cli) {
    count += 2
  }
  if (options.twitter) {
    count += 3
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
        options.noFunnyBusiness = true
        // IF yr testing "test", rm the test file first.


        mkproj('', options, function () {
          if (options.browserify) {
            checkForBrowser('.', t)
          }
          if (options.cli) {
            checkForCli('.', t)
          }
          if (options.twitter) {
            checkForTwitter('.', t)
          }
          if (options.server) {
            checkForBrowser('.', t)
          }
          if (options.spider) {
            checkForSpider('.', t)
          }
          if (options.level) {
            checkForLevel('.', t)
          }
          if (options.canvas) {
            checkForCanvas('.', t)
          }
          if (options.test) {
            checkForTest('.', t)
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
function checkForCli (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('bin'), 'mks a package.json containing bin entry because i am garbage')
  if (goThere) {
    t.ok(packagedJson.match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
  }
}

function checkForTwitter (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/config.js').toString().match('SPIDERS'), 'mks a twitter boilerplate file')
  t.ok(fs.readFileSync(path + '/bot.js').toString().match('toot'), 'mks a botfile')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('node bot.js'), 'mks a package.json containing scripts entry for tooting')
  if (goThere) {
    t.ok(packagedJson.match('twit'), 'mks a package.json containing twit cuz it is tooting time')
  }
}

function checkForBrowser (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/www/main.css').toString().match('hidden'), 'mks a main.css')
  t.ok(fs.readFileSync(path + '/www/demo.js').toString().match('document'), 'mks a demo.js')
  t.ok(fs.readFileSync(path + '/www/index.html').toString().match('html'), 'mks some html5 boilerplate')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('build'), 'adds scripts entries for building/watching')
  if (goThere) {
    t.ok(packagedJson.match('browserify'), 'mks a package.json containing browserify cuz it is time')
    t.ok(packagedJson.match('watchify'), 'mks a package.json containing watchify cuz it is cool')
    t.ok(packagedJson.match('gh-pages-deploy'), 'mks a package.json containing gh-pages-deploy cuz it is sweet')
  }
}

function checkForSpider (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/cmd.js').toString().match('yargs'), 'mks a Spider boilerplate file')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('bin'), 'mks a package.json containing bin entry because i am garbage')
  if (goThere) {
    t.ok(packagedJson.match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
  }
}
function checkForServer (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('bin'), 'mks a package.json containing bin entry because i am garbage')
  if (goThere) {
    t.ok(packagedJson.match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
  }
}
function checkForSynth (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('bin'), 'mks a package.json containing bin entry because i am garbage')
  if (goThere) {
    t.ok(packagedJson.match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
  }
}
function checkForLevel (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('bin'), 'mks a package.json containing bin entry because i am garbage')
  if (goThere) {
    t.ok(packagedJson.match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
  }
}
function checkForCanvas (path, t, goThere) {
  t.ok(fs.readFileSync(path + '/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
  var packagedJson = fs.readFileSync(path + '/package.json').toString()
  t.ok(packagedJson.match('bin'), 'mks a package.json containing bin entry because i am garbage')
  if (goThere) {
    t.ok(packagedJson.match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
  }
}
