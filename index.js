var Mustache = require('mustache')
var fs = require('fs')
var path = require('path')
var after = require('after')
var kexec = require('kexec')
var camelcase = require('camelcase')
// TODO: make a cat ascii module
var catMe = function () {
  return "                               |        |\n                               |\\      /|\n                               | \\____/ |\n                               |  /\\/\\  |\n                              .'___  ___`.\n                             /  \\|/  \\|/  \\\n            _.--------------( ____ __ _____)\n         .-' \\  -. | | | | | \\ ----\\/---- /\n       .'\\  | | / \\` | | | |  `.  -'`-  .'\n      /`  ` ` '/ / \\ | | | | \\  `------'\\\n     /-  `-------.' `-----.       -----. `---.\n    (  / | | | |  )/ | | | )/ | | | | | ) | | )\n     `._________.'_____,,,/\\_______,,,,/_,,,,/"
}

module.exports = function (name, test) {
  if (!name) {
    console.log('you must pass a project name!')
    return 'fail'
  }

  var templateData = {name: name, camelName: camelcase(name)}

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

  function compiley (filename, data) {
    return Mustache.render(fs.readFileSync(path.resolve(path.dirname()) + '/src/' + filename + '.moustache').toString(), data)
  }

  fs.mkdir(name, function (err) {
    if (err) {
      console.log(err)
    } else {
      fs.mkdir(name + '/www', function (err) {
        if (err) {
          console.log(err)
        } else {
          var files = ['.gitignore', '.npmignore', '.travis.yml', 'README.md',
                       'index.js', 'package.json', 'test.js', 'www/demo.js',
                       'www/index.html', 'www/main.css']
          files.forEach(function (filename) {
            writeFile(name + '/' + filename, compiley(filename, templateData))
          })
        }
      })
    }
  })
}
