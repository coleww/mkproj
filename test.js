var testUtils = require('./tests/test_utils')
var testMkingAProject = testUtils.testMkingAProject
var testAddingToAnExistingProject = testUtils.testAddingToAnExistingProject
var testHandlingFileCollissionsWhileAdding = testUtils.testHandlingFileCollissionsWhileAdding
var tap = require('tap')
var mkproj = require('./')

// DO EVERYTHING from inside the /tests directory, so u got a clean state.
process.chdir('./tests')

tap.test('throws an error if not passed a project name', function (t) {
  t.plan(1)
  try {
    mkproj(null, {noFunnyBusiness: true})
  } catch (e) {
    t.ok(e)
  }
})

var testCases = [
  {kind: 'create'},
  {kind: 'create', cli: true},
  {kind: 'create', browserify: true},
  {kind: 'create', twitter: true},
  {kind: 'create', twitter: true, browserify: true},
  {kind: 'create', browserify: true, cli: true},
  {kind: 'create', twitter: true, cli: true},
  {kind: 'create', twitter: true, browserify: true, cli: true},
  {kind: 'add', browserify: true},
  {kind: 'add', cli: true},
  {kind: 'add', twitter: true},
  {kind: 'deny', twitter: true, expected: 'BORKED: tweet.js already exists! Maybe delete it and try again?'},
  {kind: 'deny', twitter: true, expected: 'BORKED: bot.js already exists! Maybe delete it and try again?'},
  {kind: 'deny', twitter: true, expected: 'CATastrophic failure occurred while trying to shove stuff into package.json:'},
  {kind: 'deny', cli: true, expected: 'BORKED: cmd.js already exists! Maybe delete it and try again?'},
  {kind: 'deny', cli: true, expected: 'WEEEOOOO looks like you already have a bin entry in yr package.json?'},
  {kind: 'deny', browserify: true, expected: 'CATastrophic failure occurred while trying to shove stuff into package.json:'},
  {kind: 'deny', browserify: true, expected: 'BORKED: www/index.html already exists! Maybe delete it and try again?'},
  {kind: 'deny', browserify: true, expected: 'BORKED: www/demo.js already exists! Maybe delete it and try again?'},
  {kind: 'deny', browserify: true, expected: 'BORKED: www/main.css already exists! Maybe delete it and try again?'}
]

var after = require('after')
var counter = after(testCases.length, function () {
  console.log('CALLED THEM ALL!! ALL OF THEM!!! (but did they all pass? (that is a question for my friend Travis. (he would know!)))')
})

function doThatDance () {
  var tc = testCases.pop()
  console.log('Running one now!!! Ok so like ' + testCases.length + ' tests left!!!')
  if (tc) {
    switch (tc.kind) {
      case 'create':
        testMkingAProject(tc, doThatDance)
        break
      case 'add':
        testAddingToAnExistingProject(tc, doThatDance)
        break
      case 'deny':
        testHandlingFileCollissionsWhileAdding(tc, doThatDance)
        break
    }
    counter()
  } else {
    console.log('finished!')
  }
}

doThatDance()
// so elegant
