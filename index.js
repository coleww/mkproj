var fs = require('fs')

var makeHTML5Boilerplate = require('./html5')
var npmInit = require('./npmInit')

function logCreation(filename){
  return function (err){
    if (err){
      throw err
    } else {
      console.log("CREATED: " + filename)
    }
  }
}

module.exports = function(name){
  fs.mkdir(name, function(err){
    if(err) {
      console.log(err)
    } else {
      fs.writeFile(name + '/.gitignore', '/node_modules', logCreation(name + '.gitignore'))
      fs.writeFile(name + '/README.md', 'AndyWarhol.js\n----------------', logCreation(name + 'README.md'))
      fs.writeFile(name + '/index.js', '', logCreation(name + 'index.js'))
      fs.writeFile(name + '/main.css', '', logCreation(name + 'main.css'))
      fs.writeFile(name + '/index.html', makeHTML5Boilerplate(name), logCreation(name + 'index.html'))
      fs.writeFile(name + '/package.json', npmInit(name), logCreation(name + 'package.json'))
    }
  })
}