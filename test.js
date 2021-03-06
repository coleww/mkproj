var testUtils = require('./tests/test_utils')
var testMkingAProject = testUtils.testMkingAProject
var testAddingToAnExistingProject = testUtils.testAddingToAnExistingProject
var testHandlingFileCollissionsWhileAdding = testUtils.testHandlingFileCollissionsWhileAdding
var tap = require('tap')
var shuffle = require('shuffle-array')
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

var testCases = shuffle([
  {kind: 'create'},
  {kind: 'create', browserify: true},
  {kind: 'add', browserify: true},
  {kind: 'deny', browserify: true, expectations: ['CATastrophic failure occurred while trying to shove stuff into package.json:',
                                                  'BORKED: www/index.html already exists! Maybe delete it and try again?',
                                                  'BORKED: www/main.css already exists! Maybe delete it and try again?']}
])

var after = require('after')
var counter = after(testCases.length, function () {
  console.log('CALLED THEM ALL!! ALL OF THEM!!! (but did they all pass? (that is a question for my friend Travis. (he would know!)))')
  setTimeout(function () {
    process.exit(0)
  }, 15000)
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

setTimeout(function () {
  console.log('whoops something horrible happened')
  process.exit(1)
}, 1000 * 60 * 9.5)
