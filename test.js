var testIt = require('./tests/test_utils')

testIt('defaulty', {twitter: false, browserify: false, cli: false})
testIt('cli', {twitter: false, browserify: false, cli: true})
testIt('browsy', {twitter: false, browserify: true, cli: false})
testIt('tweety', {twitter: true, browserify: false, cli: false})
testIt('browsatweet', {twitter: true, browserify: true, cli: false})
testIt('clibro', {twitter: false, browserify: true, cli: true})
testIt('tweecli', {twitter: true, browserify: false, cli: true})
testIt('everything', {twitter: true, browserify: true, cli: true})

// um where to put this lol
// tap.test('does nothing without a project name', function (t) {
//   t.plan(2)
//   console.log = function (msg) {
//     t.equal(msg, 'you must pass a project name!', 'warns if no proj name is passed')
//   }
//   t.equal(mkproj(), 'fail', 'process exits')
// })
