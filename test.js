var tap = require('tap')
var mkproj = require('./')
var fs = require('fs')
var rimraf = require('rimraf')
var noop = function () {}

tap.test('does all the stuff', function (t) {
  t.plan(25)

  mkproj('AndyWarholjs', true)

  console.log = function (msg) {
    t.ok(msg, 'logs creation')
  }

  setTimeout(function () {
    t.ok(fs.existsSync('AndyWarholjs'), 'mks a new directory')
    t.ok(fs.readFileSync('AndyWarholjs/.gitignore', {encoding: 'utf-8'}).match('/node_modules'),
            'echoes node_modules into gitignore')
    t.equal(fs.readFileSync('AndyWarholjs/.npmignore', {encoding: 'utf-8'}),
            'www',
            'echoes dubdubdub into npmignore')
    t.ok(fs.readFileSync('AndyWarholjs/README.md', {encoding: 'utf-8'}).match('AndyWarholjs\n----------------'),
            'echoes proj name into README.md')
    t.ok(fs.existsSync('AndyWarholjs/index.js'), 'mks an index.js')
    t.ok(fs.existsSync('AndyWarholjs/www/main.css'), 'mks a main.css')
    t.ok(fs.existsSync('AndyWarholjs/www/demo.js'), 'mks a demo.js')
    t.ok(fs.readFileSync('AndyWarholjs/www/index.html', {encoding: 'utf-8'}).match('<title>AndyWarholjs</title>'),
         'mks some html5 boilerplate')
    t.ok(fs.readFileSync('AndyWarholjs/package.json', {encoding: 'utf-8'}).match('\"name\": \"AndyWarholjs\"'),
         'mks a package.json')
    t.ok(fs.existsSync('AndyWarholjs/.travis.yml'), 'mks a trav')
    t.ok(fs.existsSync('AndyWarholjs/test.js'), 'mks a test file')

    var exec = require('child_process').exec
    exec('cp -r test_modules AndyWarholjs/node_modules && cd AndyWarholjs && standard && node test.js', function (error, stdout, stderr) {
      t.ok(!error, 'generated module also works fail')
      rimraf('AndyWarholjs', noop)
    })

  }, 1000)
})

tap.test('does nothing without a project name', function (t) {
  t.plan(2)
  console.log = function (msg) {
    t.equal(msg, 'you must pass a project name!', 'warns if no proj name is passed')
  }
  t.equal(mkproj(), 'fail', 'process exits')
})
