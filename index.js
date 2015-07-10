var fs = require('fs')
var after = require("after")
var kexec = require('kexec');

var makeHTML5Boilerplate = require('./html5')
var npmInit = require('./npmInit')

module.exports = function(name, test){
  if(!name) {
    console.log('you must pass a project name!')
    return 'fail'
  }

  var initialize = after(9, runTheMagic)

  function runTheMagic(){
    console.log(name + ' project created!')
    if(!test) kexec('cd ' + name + ' && npm init && npm install && git init && git add -A && git commit -m "initial"')
  }

  function logCreation(filename){
    return function (err){
      if (err){
        throw err
      } else {
        console.log("CREATED: " + filename)
        initialize()
      }
    }
  }

  function writeFile(filename, data){
    fs.writeFile(filename, data, logCreation(filename))
  }

  fs.mkdir(name, function(err){
    if(err) {
      console.log(err)
    } else {
      fs.mkdir(name + '/www', function(err){
        if(err) {
          console.log(err)
        } else {
          writeFile(name + '/www/demo.js', '')
          writeFile(name + '/www/main.css', '')
        }
      })
      writeFile(name + '/.travis.yml', 'language: node_js\nnode_js:\n  - "0.12"\n  - "0.10"')
      writeFile(name + '/.gitignore', '/node_modules')
      writeFile(name + '/README.md', name+'\n----------------')
      writeFile(name + '/index.js', '')
      writeFile(name + '/test.js', "var tap = require('tape')\ntap.test('',function(t){\n\n})")
      writeFile(name + '/index.html', makeHTML5Boilerplate(name))
      writeFile(name + '/package.json', npmInit(name))
    }
  })
}
