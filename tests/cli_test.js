var tap = require('tap')
var mkproj = require('../')
var fs = require('fs')

var testUtils = require('./test_utils')
var checkBasics = testUtils.checkBasics
var checkAbsence = testUtils.checkAbsence
var cleanUpAndRun = testUtils.cleanUpAndRun
var checkGeneratedApp = testUtils.checkGeneratedApp

var test_name = 'cli'

cleanUpAndRun(test_name, testIt)

function testIt () {
  tap.test('makes a cli thing', function (t) {
    t.plan(24)

    mkproj('cli', {testing: true, cli: true})

    console.log = (function () {
      // var log = console.log
      return function (msg) {
        t.ok(msg, 'logs creation')
        // log.call(console, msg)
      }
    })()

    setTimeout(function () {
      checkBasics(test_name, t)

      t.ok(fs.readFileSync('cli/cmd.js').toString().match('yargs'), 'mks a CLI boilerplate file')
      t.ok(fs.readFileSync('cli/package.json').toString().match('yargs'),
           'mks a package.json containing yargs cuz it is YARRRRRRRR time')
      t.ok(fs.existsSync('cli/test.js'), 'mks a test file')

      checkAbsence(test_name, t, ['tweet.js', 'bot.js', 'www'])
      checkGeneratedApp(test_name, t, 'tap')

    }, 1000)
  })
}