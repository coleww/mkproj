var fs = require('fs')

module.exports = function(name){
  fs.mkdir(name, function(err){
    if(err) {
      console.log(err)
    }
  })
}