var tap = require('tap')
var mkproj = require('../')
var fs = require('fs')
var rimraf = require('rimraf')
var noop = function () {}
var exec = require('child_process').exec


tap.test('makes a cli thing', function (t) {
  t.plan(20)

  mkproj('tweety', {testing: true, twitter: true})

  console.log = (function () {
    // var log = console.log
    return function (msg) {
      t.ok(msg, 'logs creation')
      // log.call(console, msg)
    }
  })()

  setTimeout(function () {
    t.ok(fs.existsSync('tweety'), 'mks a new directory')
    t.ok(fs.readFileSync('tweety/README.md', {encoding: 'utf-8'}).toString().match('tweety\n----------------'),
            'echoes proj name into README.md')
    t.ok(fs.existsSync('tweety/index.js'), 'mks an index.js')
    t.ok(fs.readFileSync('tweety/tweet.js').toString().match('twit'), 'mks a twitter boilerplate file')
    t.ok(fs.readFileSync('tweety/bot.js').toString().match('tweet'), 'mks a botfile')
    t.ok(fs.readFileSync('tweety/package.json').toString().match('twit'),
         'mks a package.json containing twit cuz it is tooting time')
    t.ok(fs.existsSync('tweety/.travis.yml'), 'mks a trav')
    t.ok(fs.existsSync('tweety/test.js'), 'mks a test file')
    exec('cp -r tap_modules tweety/node_modules && cd tweety && standard && node test.js', function (error, stdout, stderr) {
      t.ok(!error, 'generated module also works fail')
      rimraf('tweety', noop)
    })

  }, 1000)
})