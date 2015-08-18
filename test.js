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
  ['tweetfile', {expected: 'BORKED: tweet.js already exists! Maybe delete it and try again?', twitter: true}],
  ['botfile', {expected: 'BORKED: bot.js already exists! Maybe delete it and try again?', twitter: true}],
  ['tweetscript', {expected: 'CATastrophic failure occurred while trying to shove stuff into package.json:', twitter: true}],

  ['cmdfile', {expected: 'BORKED: cmd.js already exists! Maybe delete it and try again?', cli: true}],
  ['clibin', {expected: 'WEEEOOOO looks like you already have a bin entry in yr package.json?', cli: true}],

  ['browsyscripts', {expected: 'CATastrophic failure occurred while trying to shove stuff into package.json:', browserify: true}],
  ['browsyindex', {expected: 'BORKED: www/index.html already exists! Maybe delete it and try again?', browserify: true}],
  ['browsydemo', {expected: 'BORKED: www/demo.js already exists! Maybe delete it and try again?', browserify: true}],
  ['browsymain', {expected: 'BORKED: www/main.css already exists! Maybe delete it and try again?', browserify: true}]
]

// probably a better way to make this data structure...
var testCases = [].concat(creations.map(function (tc) {
  return [testIt, tc]
})).concat(additions.map(function (tc) {
  return [testAddingIt, tc]
})).concat(denials.map(function (tc) {
  return [testDenyingIt, tc]
}))

function doThatDance () {
  var tc = testCases.pop()
  if (tc) {
    var args = tc[1]
    args.push(doThatDance)
    tc[0].apply(this, args)
  }
}

doThatDance()
