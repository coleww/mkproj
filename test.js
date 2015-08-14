var tap = require('tap')
var mkproj = require('./')
var fs = require('fs')
var rimraf = require('rimraf')
var noop = function () {}
var exec = require('child_process').exec

tap.test('does nothing without a project name', function (t) {
  t.plan(2)
  console.log = function (msg) {
    t.equal(msg, 'you must pass a project name!', 'warns if no proj name is passed')
  }
  t.equal(mkproj(), 'fail', 'process exits')
})
