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

var checkForCli = function (path, t) {
  t.ok(fs.readFileSync(path + '/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
  t.ok(fs.readFileSync(path + '/package.json').toString().match('yargs'), 'mks a package.json containing yargs cuz it is YARRRRRRRR time')
}

var checkForTwitter = function (path, t) {
  t.ok(fs.readFileSync(path + '/tweet.js').toString().match('twit'), 'mks a twitter boilerplate file')
  t.ok(fs.readFileSync(path + '/bot.js').toString().match('tweet'), 'mks a botfile')
  t.ok(fs.readFileSync(path + '/package.json').toString().match('twit'), 'mks a package.json containing twit cuz it is tooting time')
}

var checkForBrowser = function (path, t) {
  t.ok(fs.existsSync(path + '/www/main.css'), 'mks a main.css')
  t.ok(fs.existsSync(path + '/www/demo.js'), 'mks a demo.js')
  t.ok(fs.readFileSync(path + '/www/index.html').toString().match('<title>' + path + '</title>'), 'mks some html5 boilerplate')
  var packaged = fs.readFileSync(path + '/package.json').toString()
  t.ok(packaged.match('browserify'), 'mks a package.json containing browserify cuz it is time')
  t.ok(packaged.match('watchify'), 'mks a package.json containing watchify cuz it is cool')
  t.ok(packaged.match('gh-pages-deploy'), 'mks a package.json containing gh-pages-deploy cuz it is sweet')
}

module.exports = function (name, options) {
  var count = 7 // number of files generated == number of logs that happen/get t.ok'd
  var exclusions = [] // files to check for exclusion
  if (options.browserify) {
    count += 9 // 3 files generated + 6 assertions
  } else {
    exclusions.push('www')
  }
  if (options.cli) {
    count += 3 // 1 file generated + 2 assertions
  } else {
    exclusions.push('cmd.js')
  }
  if (options.twitter) {
    count += 5 // 2 files generated + 3 assertions
  } else {
    exclusions.push('tweet.js')
    exclusions.push('bot.js')
  }

  var type = options.browserify ? 'tape' : 'tap'

  cleanUpAndRun(name, reallyTestIt)

  function reallyTestIt () {
    tap.test(name, function (t) {
      t.plan(count + exclusions.length + 12)
      // 3 from index.js, 6 from checkBasics, 1 from generatedApp, 2 for checkForTesty
      options.testing = true
      mkproj(name, options)

      console.log = function (msg) {
        t.ok(msg, 'logs creation')
      }

      setTimeout(function () {
        checkBasics(name, t)
        checkForTesty(name, t, type)
        if (options.browserify) {
          checkForBrowser(name, t)
        }
        if (options.cli) {
          checkForCli(name, t)
        }
        if (options.twitter) {
          checkForTwitter(name, t)
        }

        checkAbsence(name, t, exclusions)
        checkGeneratedApp(name, t, type)
      }, 1000)
    })
  }
}
