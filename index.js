var fs = require('fs')
var after = require("after")
var kexec = require('kexec');

var makeHTML5Boilerplate = require('./html5')
var npmInit = require('./npmInit')

module.exports = function(name, test){

  var initialize = after(6, runTheMagic)

  function runTheMagic(){
    console.log(name + ' project created!')
    if(!test){
      kexec('cd ' + name + '&& npm init && npm install');
    }
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
      writeFile(name + '/.gitignore', '/node_modules')
      writeFile(name + '/README.md', 'AndyWarhol.js\n----------------')
      writeFile(name + '/index.js', '')
      writeFile(name + '/main.css', '')
      writeFile(name + '/index.html', makeHTML5Boilerplate(name))
      writeFile(name + '/package.json', npmInit(name))
    }
  })
}
