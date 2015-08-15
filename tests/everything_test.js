var tap = require('tap')
var mkproj = require('../')
var fs = require('fs')

var testUtils = require('./test_utils')
var checkBasics = testUtils.checkBasics
var cleanUpAndRun = testUtils.cleanUpAndRun
var checkGeneratedApp = testUtils.checkGeneratedApp

var test_name = 'everything'

cleanUpAndRun(test_name, testIt)

function testIt () {
  tap.test('does everything thing', function (t) {
    t.plan(32)

    mkproj('everything', {testing: true, twitter: true, browserify: true, cli: true})

    console.log = function (msg) {
      t.ok(msg, 'logs creation')
    }

    setTimeout(function () {
      checkBasics(test_name, t)

      t.ok(fs.readFileSync(test_name + '/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
      t.ok(fs.readFileSync(test_name + '/tweet.js').toString().match('twit'), 'mks a twitter boilerplate file')
      t.ok(fs.readFileSync(test_name + '/bot.js').toString().match('tweet'), 'mks a botfile')
      var thePackage = fs.readFileSync(test_name + '/package.json').toString()
      t.ok(thePackage.match('twit'), 'mks a package.json containing twit cuz it is tooting time')
      t.ok(thePackage.match('yargs'), 'mks a package.json containing yargs cuz it is YARR HARR HO SHIVER ME TIMBERS time')
      t.ok(fs.readFileSync(test_name + '/test.js').toString().match('tape'), 'mks a test file requiring tape')
      t.ok(fs.existsSync(test_name + '/www/main.css'), 'mks a main.css')
      t.ok(fs.existsSync(test_name + '/www/demo.js'), 'mks a demo.js')
      t.ok(fs.readFileSync(test_name + '/www/index.html').toString().match('<title>' + test_name + '</title>'), 'mks some html5 boilerplate')

      checkGeneratedApp(test_name, t, 'tape')

    }, 1000)
  })
}
