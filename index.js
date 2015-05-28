var fs = require('fs')
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



    }


  })
}