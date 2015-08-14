var Mustache = require('mustache')
var fs = require('fs')
var after = require('after')
var kexec = require('kexec')
var camelcase = require('camelcase')
// TODO: make a cat ascii module
var catMe = function () {
  return "                               |        |\n                               |\\      /|\n                               | \\____/ |\n                               |  /\\/\\  |\n                              .'___  ___`.\n                             /  \\|/  \\|/  \\\n            _.--------------( ____ __ _____)\n         .-' \\  -. | | | | | \\ ----\\/---- /\n       .'\\  | | / \\` | | | |  `.  -'`-  .'\n      /`  ` ` '/ / \\ | | | | \\  `------'\\\n     /-  `-------.' `-----.       -----. `---.\n    (  / | | | |  )/ | | | )/ | | | | | ) | | )\n     `._________.'_____,,,/\\_______,,,,/_,,,,/"
}

module.exports = function (name, options) {
  if (!name) {
    console.log('you must pass a project name!')
    return 'fail'
  }

  var both = (options.cli && options.twitter) ? ',' : ''

  var templateData = {
    name: name,
    camelName: camelcase(name),
    browserify: options.browserify,
    cli: options.cli,
    twitter: options.twitter,
    both: both
  }

  var selected = []
  var count = 7
  if (options.browserify) {
    count += 3
    selected.push('browserify')
  }
  if (options.cli) {
    count++
    selected.push('CLI')
  }
  if (options.twitter) {
    count += 2
    selected.push('twitterbot')
  }
  var initialize = after(count, runTheMagic)

  function runTheMagic () {
    console.log(name + ' project has been mk\'d with ' + selected.join(' and ') + ' boilerplate!')
    console.log(catMe())
    console.log('W A Y    C H I L L!               =^.^=            R A D I C A L!')
    if (!options.testing) kexec('cd ' + name + ' && npm init && npm install && git init && git add -A && git commit -m \'initial\'')
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
    return Mustache.render(fs.readFileSync(__dirname + '/src/' + filename + '.moustache').toString(), data)
  }

  function doYourWorst (err) {
    if (err) {
      console.log(err)
    } else {
      var files = ['.gitignore', '.npmignore', '.travis.yml', 'README.md',
                   'index.js', 'package.json', 'test.js']
      if (options.browserify) files = files.concat(['www/demo.js', 'www/index.html', 'www/main.css'])
      if (options.twitter) files = files.concat(['bot.js', 'tweet.js'])
      if (options.cli) files = files.concat('cmd.js')
      files.forEach(function (filename) {
        writeFile(name + '/' + filename, compiley(filename, templateData))
      })
    }
  }

  fs.mkdir(name, function (err) {
    if (err) {
      console.log(err)
    } else {
      if (options.browserify) {
        fs.mkdir(name + '/www', doYourWorst)
      } else {
        doYourWorst()
      }
    }
  })
}
