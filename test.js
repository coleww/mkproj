var testUtils = require('./tests/test_utils')
var testIt = testUtils.testIt
var testAddingIt = testUtils.testAddingIt
var tap = require('tap')
var mkproj = require('./')

process.chdir('./tests')

tap.test('throws an error if not passed a project name', function (t) {
  t.plan(1)
  try {
    mkproj(null, {noFunnyBusiness: true})
  } catch (e) {
    t.ok(e)
  }
})

testIt('defaulty', {twitter: false, browserify: false, cli: false})
testIt('cli', {twitter: false, browserify: false, cli: true})
testIt('browsy', {twitter: false, browserify: true, cli: false})
testIt('tweety', {twitter: true, browserify: false, cli: false})
testIt('browsatweet', {twitter: true, browserify: true, cli: false})
testIt('clibro', {twitter: false, browserify: true, cli: true})
testIt('tweecli', {twitter: true, browserify: false, cli: true})
testIt('everything', {twitter: true, browserify: true, cli: true})

// must do these pseudo-synchronously due to process.chdir shenanigans
setTimeout(function () {
  testAddingIt('brewsy', {twitter: false, browserify: true, cli: false})
  setTimeout(function () {
    testAddingIt('clingy', {twitter: false, browserify: false, cli: true})
    setTimeout(function () {
      testAddingIt('tooty', {twitter: true, browserify: false, cli: false})
    }, 25000)
  }, 55500)
}, 12500)
