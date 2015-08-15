var tap = require('tap')
var mkproj = require('../')
var fs = require('fs')

var testUtils = require('./test_utils')
var checkBasics = testUtils.checkBasics
var checkAbsence = testUtils.checkAbsence
var cleanUpAndRun = testUtils.cleanUpAndRun
var checkGeneratedApp = testUtils.checkGeneratedApp

var test_name = 'tweety'

cleanUpAndRun(test_name, testIt)

function testIt () {
  tap.test('makes a tweety', function (t) {
    t.plan(25)

    mkproj(test_name, {testing: true, twitter: true})

    console.log = function (msg) {
      t.ok(msg, 'logs creation')
    }

    setTimeout(function () {
      checkBasics(test_name, t)

      t.ok(fs.readFileSync(test_name + '/tweet.js').toString().match('twit'), 'mks a twitter boilerplate file')
      t.ok(fs.readFileSync(test_name + '/bot.js').toString().match('tweet'), 'mks a botfile')
      t.ok(fs.readFileSync(test_name + '/package.json').toString().match('twit'),
           'mks a package.json containing twit cuz it is tooting time')
      t.ok(fs.existsSync(test_name + '/test.js'), 'mks a test file')

      checkAbsence(test_name, t, ['cmd.js', 'www'])
      checkGeneratedApp(test_name, t, 'tap')

    }, 1000)
  })
}
