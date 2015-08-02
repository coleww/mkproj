var fs = require('fs')
var after = require('after')
var kexec = require('kexec')
var makeHTML5Boilerplate = require('./html5')
var npmInit = require('./npmInit')
var makeReadme = require('./makeReadme')
var makeTest = require('./makeTest')
var catMe = require('./catMe')

module.exports = function (name, test) {
  if (!name) {
    console.log('you must pass a project name!')
    return 'fail'
  }

  var initialize = after(10, runTheMagic)

  function runTheMagic () {
    console.log(name + ' project created!')
    console.log(catMe())
    console.log('W A Y    C H I L L!               =^.^=            R A D I C A L!')
    if (!test) kexec('cd ' + name + ' && npm init && npm install && git init && git add -A && git commit -m \'initial\'')
  }

  function logCreation (filename) {
    return function (err) {
      if (err) {
        throw err
      } else {
        console.log('CREATED: ' + filename)
        initialize()
      }
    }
  }

  function writeFile (filename, data) {
    fs.writeFile(filename, data, logCreation(filename))
  }

  fs.mkdir(name, function (err) {
    if (err) {
      console.log(err)
    } else {
      fs.mkdir(name + '/www', function (err) {
        if (err) {
          console.log(err)
        } else {
          writeFile(name + '/www/demo.js', '')
          writeFile(name + '/www/main.css', '')
        }
      })
      writeFile(name + '/.travis.yml', 'language: node_js\nnode_js:\n  - "0.12"')
      writeFile(name + '/.gitignore', '/node_modules')
      writeFile(name + '/.npmignore', 'www')
      writeFile(name + '/README.md', makeReadme(name))
      writeFile(name + '/index.js', 'module.exports = function (str) {\n  return \'hello \' + str\n}\n')
      writeFile(name + '/test.js', makeTest(name))
      writeFile(name + '/index.html', makeHTML5Boilerplate(name))
      writeFile(name + '/package.json', npmInit(name))
    }
  })
}
