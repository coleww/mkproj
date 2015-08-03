var fs = require('fs')
var after = require('after')
var kexec = require('kexec')
var camelcase = require('camelcase')
var makeHTML5Boilerplate = require('./src/html5')
var npmInit = require('./src/npmInit')
var makeReadme = require('./src/makeReadme')
var makeTest = require('./src/makeTest')
var makeDemo = require('./src/makeDemo')
var catMe = require('./src/catMe')

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
          writeFile(name + '/www/demo.js', makeDemo(name))
          writeFile(name + '/www/main.css', '.hidden {\n  display: none;\n}\n')
          writeFile(name + '/www/index.html', makeHTML5Boilerplate(name))
        }
      })
      writeFile(name + '/.travis.yml', 'language: node_js\nnode_js:\n  - "0.12"')
      writeFile(name + '/.gitignore', '/node_modules\n.DS_Store')
      writeFile(name + '/.npmignore', 'www')
      writeFile(name + '/README.md', makeReadme(name))
      writeFile(name + '/index.js', 'module.exports = function (str) {\n  return \'hello \' + str\n}\n')
      writeFile(name + '/test.js', makeTest(camelcase(name)))

      writeFile(name + '/package.json', npmInit(name))
    }
  })
}
