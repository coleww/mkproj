var tap = require('tap')
var mkproj = require('./')
var fs = require('fs')
var rimraf = require('rimraf')
var noop = function(){}


tap.test('does all the stuff', function(t){
  t.plan(14)

  mkproj('AndyWarhol.js', true)

  console.log = function(msg) {
    t.ok(msg, 'logs creation')
  };

  setTimeout(function(){
    t.ok(fs.existsSync('AndyWarhol.js'), 'mks a new directory')
    t.equal(fs.readFileSync('AndyWarhol.js/.gitignore', {encoding: 'utf-8'}),
            '/node_modules',
            'echoes node_modules into gitignore')
    t.equal(fs.readFileSync('AndyWarhol.js/README.md', {encoding: 'utf-8'}),
            'AndyWarhol.js\n----------------',
            'echoes proj name into README.md')
    t.ok(fs.existsSync('AndyWarhol.js/index.js'), 'mks an index.js')
    t.ok(fs.existsSync('AndyWarhol.js/main.css'), 'mks a main.css')
    t.ok(fs.readFileSync('AndyWarhol.js/index.html', {encoding: 'utf-8'}).match("<title>AndyWarhol.js</title>"),
         'mks some html5 boilerplate')
    t.ok(fs.readFileSync('AndyWarhol.js/package.json', {encoding: 'utf-8'}).match("\"name\": \"AndyWarhol.js\""),
         'mks a package.json')
    rimraf('AndyWarhol.js', noop)
  }, 500)
})
