var fs = require('fs')

var makeHTML5Boilerplate = require('./html5')
var npmInit = require('./npmInit')

function toErr(err){
  if (err) throw err;
}

module.exports = function(name){
  fs.mkdir(name, function(err){
    if(err) {
      console.log(err)
    } else {
      fs.writeFile(name + '/.gitignore', '/node_modules', toErr);
      fs.writeFile(name + '/README.md', 'AndyWarhol.js\n----------------', toErr);
      fs.writeFile(name + '/index.js', '', toErr);
      fs.writeFile(name + '/main.css', '', toErr);
      fs.writeFile(name + '/index.html', makeHTML5Boilerplate(name), toErr)
      fs.writeFile(name + '/package.json', npmInit(name), toErr)
    }
  })
}