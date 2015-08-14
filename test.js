var tap = require('tap')
var mkproj = require('./')

tap.test('does nothing without a project name', function (t) {
  t.plan(2)
  console.log = function (msg) {
    t.equal(msg, 'you must pass a project name!', 'warns if no proj name is passed')
  }
  t.equal(mkproj(), 'fail', 'process exits')
})

require('tests/default_test.js')
require('tests/cli_test.js')
require('tests/everything_test.js')
require('tests/browserify_test.js')
require('tests/twitter_test.js')