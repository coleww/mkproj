var testUtils = require('./tests/test_utils')
var testIt = testUtils.testIt
var testAddingIt = testUtils.testAddingIt
var testDenyingIt = testUtils.testDenyingIt
var tap = require('tap')
var mkproj = require('./')

// DO EVERYTHING from inside the /tests directory so u got a clean state.
process.chdir('./tests')

tap.test('throws an error if not passed a project name', function (t) {
  t.plan(1)
  try {
    mkproj(null, {noFunnyBusiness: true})
  } catch (e) {
    t.ok(e)
  }
})

var creations = [
  ['defaulty', {}],
  ['cli', {cli: true}],
  ['browsy', {browserify: true}],
  ['tweety', {twitter: true}],
  ['browsatweet', {twitter: true, browserify: true}],
  ['clibro', {browserify: true, cli: true}],
  ['tweecli', {twitter: true, cli: true}],
  ['everything', {twitter: true, browserify: true, cli: true}]
]

var additions = [
  ['brewsy', {browserify: true}],
  ['clingy', {cli: true}],
  ['tooty', {twitter: true}]
]

var denials = [
  ['tweetfile', 'BORKED: tweet.js already exists! Maybe delete it and try again?', {twitter: true}],
  ['botfile', 'BORKED: bot.js already exists! Maybe delete it and try again?', {twitter: true}],
  ['tweetscript', 'CATastrophic failure occurred while trying to shove stuff into package.json:', {twitter: true}],

  ['cmdfile', 'BORKED: cmd.js already exists! Maybe delete it and try again?', {cli: true}],
  ['clibin', 'WEEEOOOO looks like you already have a bin entry in yr package.json?', {cli: true}],

  ['browsyscripts', 'CATastrophic failure occurred while trying to shove stuff into package.json:', {browserify: true}],
  ['browsyindex', 'BORKED: www/index.html already exists! Maybe delete it and try again?', {browserify: true}],
  ['browsydemo', 'BORKED: www/demo.js already exists! Maybe delete it and try again?', {browserify: true}],
  ['browsymain', 'BORKED: www/main.css already exists! Maybe delete it and try again?', {browserify: true}]
]

// tests for adding files to existing projects use a timeout,
// because they engage in chdir shenanigans that routinely clobber each other.
// TODO: use promises or something instead I guess...
var timer = 0
var testCases = [].concat(creations.map(function (tc) {
  return [testIt, tc, 1]
})).concat(additions.map(function (tc) {
  return [testAddingIt, tc, 15000]
})).concat(denials.map(function (tc) {
  return [testDenyingIt, tc, 12500]
}))
testCases.forEach(function (tc) {
  console.log(tc)
  setTimeout(function () {
    tc[0].apply(this, tc[1])
    console.log('FIRING', tc)
  }, timer += tc[2])
})
