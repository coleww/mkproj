var fs = require('fs')

module.exports = function(name){
  fs.mkdir(name, function(err){
    if(err) {
      console.log(err)
    } else {
      fs.writeFile(name + '/.gitignore', '/node_modules', function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    }


  })
}