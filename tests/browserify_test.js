var tap = require('tap')
var mkproj = require('../')
var fs = require('fs')
var testUtils = require('./test_utils')
var checkBasics = testUtils.checkBasics
var checkAbsence = testUtils.checkAbsence
var cleanUpAndRun = testUtils.cleanUpAndRun
var checkGeneratedApp = testUtils.checkGeneratedApp

var test_name = 'browsy'

cleanUpAndRun(test_name, testIt)

function testIt () {
  tap.test('does the browserify stuff', function (t) {
    t.plan(28)

    mkproj('browsy', {testing: true, browserify: true})

    console.log = function (msg) {
      t.ok(msg, 'logs creation')
    }

    setTimeout(function () {
      checkBasics(test_name, t)
      t.ok(fs.existsSync('browsy/www/main.css'), 'mks a main.css')
      t.ok(fs.existsSync('browsy/www/demo.js'), 'mks a demo.js')
      t.ok(fs.readFileSync('browsy/www/index.html').toString().match('<title>browsy</title>'),
           'mks some html5 boilerplate')
      t.ok(fs.readFileSync('browsy/package.json').toString().match('\"name\": \"browsy\"'),
           'mks a package.json')
      t.ok(fs.readFileSync('browsy/test.js').toString().match('\'tape\''), 'mks a test file containing tape')

      checkAbsence(test_name, t, ['cmd.js', 'bot.js', 'tweet.js'])
      checkGeneratedApp(test_name, t, 'tape')

    }, 1000)
  })
}
