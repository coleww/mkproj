var tap = require('tap')
var mkproj = require('./')
var fs = require('fs')
var rimraf = require('rimraf')
var noop = function(){}

tap.test('does all the stuff', function(t){
  t.plan(3)

  mkproj('AndyWarhol.js')

  setTimeout(function(){
    t.ok(fs.existsSync('AndyWarhol.js'), 'mks a new directory')
    t.equal(fs.readFileSync('AndyWarhol.js/.gitignore', {encoding: 'utf-8'}),
            '/node_modules',
            'echoes node_modules into gitignore')
    t.equal(fs.readFileSync('AndyWarhol.js/README.md', {encoding: 'utf-8'}),
            'AndyWarhol.js\n----------------',
            'echoes proj name into README.md')

    rimraf('AndyWarhol.js', noop)
  }, 500)
})
