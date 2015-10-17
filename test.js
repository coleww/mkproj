var testThatCase = require('./tests/test_utils')
var tap = require('tap')
var shuffle = require('shuffle-array')
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

var testCases = shuffle([
                        // oh jeez, generate these programmatically i guess? wow.
                        // {kind: 'create', twitter: true, browserify: true},
                        // {kind: 'create', browserify: true, cli: true},
                        // {kind: 'create', twitter: true, cli: true},
                        // {kind: 'create', twitter: true, browserify: true, cli: true},
  {kind: 'create'}
  // {kind: 'create', cli: true},
  // {kind: 'create', browserify: true},
  // {kind: 'create', twitter: true},
  // {kind: 'create', server: true},
  // {kind: 'create', spider: true},
  // {kind: 'create', level: true},
  // {kind: 'create', canvas: true},
  // {kind: 'create', synth: true},
  // {kind: 'create', twitter: true, browserify: true, cli: true, synth: true, canvas: true, level: true, spider: true},

  // {kind: 'add', browserify: true},
  // {kind: 'add', cli: true},
  // {kind: 'add', twitter: true},
  // {kind: 'add', server: true},
  // {kind: 'add', spider: true},
  // {kind: 'add', level: true},
  // {kind: 'add', canvas: true},
  // {kind: 'add', synth: true},
  // {kind: 'add', test: true},

  // {kind: 'deny', twitter: true, expectations: ['BORKED: config.js already exists! Maybe delete it and try again?',
  //                                              'BORKED: bot.js already exists! Maybe delete it and try again?',
  //                                              'CATastrophic failure occurred while trying to shove stuff into package.json:']},
  // {kind: 'deny', cli: true, expectations: ['BORKED: cmd.js already exists! Maybe delete it and try again?',
  //                                          'WEEEOOOO looks like you already have a bin entry in yr package.json?']},
  // {kind: 'deny', browserify: true, expectations: ['CATastrophic failure occurred while trying to shove stuff into package.json:',
  //                                                 'BORKED: www/index.html already exists! Maybe delete it and try again?',
  //                                                 'BORKED: www/demo.js already exists! Maybe delete it and try again?',
  //                                                 'BORKED: www/main.css already exists! Maybe delete it and try again?']},
  // {kind: 'deny', spider: true, expectations: ['BORKED: spider.js already exists! Maybe delete it and try again?',
  //                                          'WEEEOOOO looks like you already have a spider entry in yr package.json?']},
  // {kind: 'deny', server: true, expectations: ['BORKED: server.js already exists! Maybe delete it and try again?',
  //                                          'WEEEOOOO looks like you already have a start entry in yr package.json?']},
  // {kind: 'deny', level: true, expectations: ['BORKED: level.js already exists! Maybe delete it and try again?']},
  // {kind: 'deny', synth: true, expectations: ['BORKED: synth.js already exists! Maybe delete it and try again?']},
  // {kind: 'deny', canvas: true, expectations: ['BORKED: canvas.js already exists! Maybe delete it and try again?']}

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
    testThatCase(tc, doThatDance)
    counter()
  } else {
    console.log('finished!')
  }
}

doThatDance()
setTimeout(function () {
  console.log('whoops something horrible happened')
  process.exit(1)
}, 1000 * 60 * 9.95) // pretty sure that CI would fail after 10 minutes of chilling anyways
