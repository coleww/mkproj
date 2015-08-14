var exec = require('child_process').exec
var rimraf = require('rimraf')
var noop = function () {}
var fs = require('fs')

var checkBasics = function (path, t) {
  t.ok(fs.existsSync(path), 'mks a new directory')
  t.ok(fs.readFileSync(path + '/.gitignore', {encoding: 'utf-8'}).toString().match('/node_modules'),
          'echoes node_modules into gitignore')
  t.equal(fs.readFileSync(path + '/.npmignore', {encoding: 'utf-8'}),
          'www',
          'echoes dubdubdub into npmignore')
  t.ok(fs.readFileSync(path + '/README.md', {encoding: 'utf-8'}).toString().match(path + '\n----------------'),
          'echoes proj name into README.md')
  t.ok(fs.existsSync(path + '/index.js'), 'mks an index.js')
  t.ok(fs.existsSync(path + '/.travis.yml'), 'mks a trav')
}

var checkAbsence = function (path, t, paths) {
  paths.forEach(function (pathe) {
    t.ok(!fs.existsSync(path + '/' + pathe), 'does not make a ' + pathe)
  })
}

var cleanUpAndRun = function (test_name, cb) {
  if (fs.existsSync(test_name)) {
    rimraf(test_name, function () {
      cb()
    })
  } else {
    cb()
  }
}

var checkGeneratedApp = function (test_name, t, type) {
  exec('cp -r ' + type + '_modules ' + test_name + '/node_modules && cd ' + test_name + ' && standard && node test.js', function (error, stdout, stderr) {
    t.ok(!error, 'generated module also works')
    rimraf(test_name, noop)
  })
}

module.exports = {
  checkBasics: checkBasics,
  checkAbsence: checkAbsence,
  cleanUpAndRun: cleanUpAndRun,
  checkGeneratedApp: checkGeneratedApp

}