var Mustache = require('mustache')
var fs = require('fs')
var after = require('after')
var kexec = require('kexec')
var camelcase = require('camelcase')
var npmAddScript = require('npm-add-script')
var catMe = require('cat-me')

var baseFiles = ['.gitignore', '.npmignore', '.travis.yml', 'README.md',
                   'index.js', 'package.json', 'test.js']
var browserifyFiles = ['www/demo.js', 'www/index.html', 'www/main.css']
var browserPackages = 'browserify watchify tape --save-dev'
var cliFiles = ['cmd.js']
var cliPackages = 'yargs --save'
var twitterFiles = ['bot.js', 'tweet.js']
var twitterPackages = 'twit --save'

module.exports = function (name, options) {
  if (fs.existsSync('.git')) {
    // we are in a project folder already.
    // interpret the options as:
       // "please make these files and add these modules for me please, thanks".
    add2proj(options)
  } else if (!name) {
    console.log('you must pass a project name!')
    return 'fail' // probably should throw an error here I suppose.
  } else {

  }
  var templateData = makeTemplateData(name, options)

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
    if (!options.noFunnyBusiness) kexec('cd ' + name + ' && npm init && npm install && git init && git add -A && git commit -m \'initial\'')
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

  function doYourWorst (err) {
    if (err) {
      console.log(err)
    } else {
      var files = baseFiles
      if (options.browserify) files = files.concat(browserifyFiles)
      if (options.twitter) files = files.concat(twitterFiles)
      if (options.cli) files = files.concat(cliFiles)
      files.forEach(function (filename) {
        writeFile(name + '/' + filename, compiley(filename, templateData), logCreation)
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

function add2proj (name, options) {
  // if not at least one of the things: FAIL
  // get list of what is needed to do.
  // check that those things do not already exist
  // copy them, passing along datas.
  // if not testing thing, run the npm install.

  // var templateData = {
  //   name: name,
  //   camelName: camelcase(name),
  //   browserify: options.browserify,
  //   cli: options.cli,
  //   twitter: options.twitter
  // }

  // files.forEach(function (filename) {
  //   writeFile(name + '/' + filename, compiley(filename, templateData), logCreation)
  // })

// if (!options.noFunnyBusiness) kexec('npm install ' + templateData.install + ' --save')

}

function makeTemplateData (name, options) {
  var both = options.cli && options.twitter ? ',' : ''
  var either = options.cli || options.twitter

  return {
    name: name,
    camelName: camelcase(name),
    browserify: options.browserify,
    cli: options.cli,
    twitter: options.twitter,
    both: both,
    either: either,
    install: options.browserify ? browserPackages : options.cli ? cliPackages : options.twitter ? twitterPackages : ''
  }
}

function compiley (filename, data) {
  return Mustache.render(fs.readFileSync(__dirname + '/src/' + filename + '.moustache').toString(), data)
}

function writeFile (filename, data, logy) {
  fs.writeFile(filename, data, logy(filename))
}


