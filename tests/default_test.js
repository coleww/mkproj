var tap = require('tap')
var mkproj = require('../')
var fs = require('fs')

var testUtils = require('./test_utils')
var checkBasics = testUtils.checkBasics
var checkAbsence = testUtils.checkAbsence
var cleanUpAndRun = testUtils.cleanUpAndRun
var checkGeneratedApp = testUtils.checkGeneratedApp

var test_name = 'defaulty'

cleanUpAndRun(test_name, testIt)

function testIt () {
  tap.test('does the default', function (t) {
    t.plan(23)

    mkproj(test_name, {testing: true})

    console.log = (function () {
      // var log = console.log
      return function (msg) {
        t.ok(msg, 'logs creation')
        // log.call(console, msg)
      }
    })()

    setTimeout(function () {
      checkBasics(test_name, t)

      t.ok(fs.readFileSync('defaulty/package.json').toString().match('\"tap\"'),
           'mks a package.json containing tap instead of tape cuz its no-browser time')

      t.ok(fs.readFileSync('defaulty/test.js').toString().match('\'tap\''), 'mks a test file that requires tap')

      checkAbsence(test_name, t, ['www', 'tweet.js', 'bot.js', 'cmd.js'])

      checkGeneratedApp(test_name, t, 'tap')

    }, 1000)
  })
}
