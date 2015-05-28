var tap = require('tap')
var mkproj = require('./')
var fs = require('fs')
var rimraf = require('rimraf')
var noop = function(){}

tap.test('does all the stuff', function(t){
  t.plan(2)

  mkproj('AndyWarhol.js')

  setTimeout(function(){
    t.ok(fs.existsSync('AndyWarhol.js'), 'mks a new directory')
    t.equal(fs.readFileSync('AndyWarhol.js/.gitignore', {encoding: 'utf-8'}), '/node_modules')

    rimraf('AndyWarhol.js', noop)
  }, 500)
})
