var tap = require('tap')
var mkproj = require('./')
var fs = require('fs')
var rimraf = require('rimraf')
var noop = function(){}

tap.test('makes new dir with project name', function(t){
  t.plan(1)
  mkproj('foobar')
  t.ok(fs.existsSync('foobar'), 'mks dir')
  rimraf('foobar', noop)
})
