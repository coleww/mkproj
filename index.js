var after = require('after')
var camelcase = require('camelcase')
var catMe = require('cat-me')
var fs = require('fs')
var jsonfile = require('jsonfile')
var kexec = require('kexec')
var mustache = require('mustache')
var npmAddScript = require('npm-add-script')

var baseFiles = ['.gitignore', '.npmignore', '.travis.yml', 'README.md',
                   'index.js', 'package.json', 'test.js']
var browserifyFiles = ['www/demo.js', 'www/index.html', 'www/main.css']
var browserPackages = 'npm install browserify watchify tape --save-dev'
var cliFiles = ['cmd.js']
var cliPackages = 'npm install yargs --save'
var twitterFiles = ['bot.js', 'tweet.js']
var twitterPackages = 'npm install twit --save'

module.exports = function (name, options, cb) {
  if (fs.existsSync('package.json')) {
    add2proj(name || getName(), options || {}, cb || function () {})
  } else if (!name) {
    throw new ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError()
  } else {
    mkTheProj(name, options || {}, cb || function () {})
  }
}

function mkTheProj (name, options, cb) {
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
  if (!options.twitter && !options.browserify && !options.cli) selected.push('default')
  var init = after(count, function () {
    console.log(name + ' project has been mk\'d with ' + selected.join(' and ') + ' boilerplate!')
    console.log(catMe())
    console.log('W A Y    C H I L L!               =^.^=            R A D I C A L!')
    cb()
    if (!options.noFunnyBusiness) kexec('cd ' + name + ' && npm init && npm install && git init && git add -A && git commit -m \'initial\'')
  })

  function doYourWorst (err) {
    if (err) {
      throw err
    } else {
      var files = baseFiles
      if (options.browserify) files = files.concat(browserifyFiles)
      if (options.twitter) files = files.concat(twitterFiles)
      if (options.cli) files = files.concat(cliFiles)
      files.forEach(function (filename) {
        writeFile(name + '/' + filename, compiley('/src/' + filename, templateData), logCreation, init)
      })
    }
  }

  fs.mkdir(name, function (err) {
    if (err) {
      throw err
    } else {
      if (options.browserify) {
        fs.mkdir(name + '/www', doYourWorst)
      } else {
        doYourWorst()
      }
    }
  })
}

function add2proj (name, options, cb) {
  var templateData = makeTemplateData(name, options)
  var files = []
  var selected = []
  if (options.browserify) {
    files = files.concat(browserifyFiles)
    selected.push('browserify')
  }
  if (options.twitter) {
    files = files.concat(twitterFiles)
    selected.push('twitter')
  }
  if (options.cli) {
    files = files.concat(cliFiles)
    selected.push('CLI')
  }
  console.log('todo', files.length)
  var init = after(files.length + 1, function () {
    cb()
    if (!options.noFunnyBusiness) kexec(templateData.install.join(' && '))
  })
  function doYourWorst (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Generating the ' + selected.join(' and ') + ' boilerplate for you now!!!')
      files.forEach(function (filename) {
        writeFile(filename, compiley('/src/' + filename, templateData), logCreation, init)
      })

      try {
        addScripts(templateData)
      } catch (e) {
        console.log('CATastrophic failure occurred while trying to shove stuff into package.json:')
        console.log(e.message)
      } finally {
        init()
      }
    }
  }
  if (options.browserify || options.cli || options.twitter) {
    if (options.browserify && !fs.existsSync('./www')) {
      fs.mkdir('www', doYourWorst)
    } else {
      doYourWorst()
    }
  } else {
    throw new YouMustGiveMeAtLeastOneThingToDoPleaseThankYouError()
  }
}

function getName () {
  return jsonfile.readFileSync('package.json').name
}

function makeTemplateData (name, options) {
  var both = options.cli && options.twitter ? ',' : ''
  var either = options.cli || options.twitter
  var installs = [
    options.browserify ? browserPackages : 'echo "=^.^= coool =^.^="',
    options.cli ? cliPackages : 'echo "=^.^= raaadical =^.^="',
    options.twitter ? twitterPackages : 'echo "=^.^= aaawwwesome =^.^="'
  ]

  return {
    name: name,
    camelName: camelcase(name),
    browserify: options.browserify,
    cli: options.cli,
    twitter: options.twitter,
    both: both,
    either: either,
    install: installs
  }
}

function compiley (filename, data) {
  return mustache.render(fs.readFileSync(__dirname + filename + '.moustache').toString(), data)
}

function writeFile (filename, data, logy, cb) {
  if (fs.existsSync(filename)) {
    console.log('BORKED: ' + filename + ' already exists! Maybe delete it and try again?')
    cb()
  } else {
    fs.writeFile(filename, data, logy(filename, cb))
  }
}

function logCreation (filename, cb) {
  return function (err) {
    if (err) {
      throw err
    } else {
      console.log('CREATED: ' + filename)
      if (cb) cb()
    }
  }
}

function addScripts (data) {
  if (data.browserify) {
    npmAddScript({key: 'build', value: 'browserify www/demo.js -o www/bundle.js'})
    npmAddScript({key: 'deploy', value: 'git push origin master && gh-pages-deploy'})
    npmAddScript({key: 'watch', value: 'watchify www/demo.js -o www/bundle.js --debug --verbose'})
  }
  if (data.cli) {
    var packaged = jsonfile.readFileSync('package.json')
    if (packaged.bin) console.log('WEEEOOOO looks like you already have a bin entry in yr package.json?')
    var bin = {}
    bin[data.camelName] = 'cmd.js'
    packaged.bin = bin
    jsonfile.writeFileSync('package.json', packaged)
  }
  if (data.twitter) {
    npmAddScript({key: 'tweet', value: 'node bot.js'})
  }
}

function ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError () {
  this.name = 'ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError'
  this.message = 'Please retry the command again, this time passing a name for this thing that you would like for me to make for you here and now in this present directory.'
}

ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError.prototype = new Error()
ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError.prototype.constructor = ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError

function YouMustGiveMeAtLeastOneThingToDoPleaseThankYouError () {
  this.name = 'YouMustGiveMeAtLeastOneThingToDoPleaseThankYouError'
  this.message = 'Please retry the command again, this time passing a command, perhaps -h for help?'
}

YouMustGiveMeAtLeastOneThingToDoPleaseThankYouError.prototype = new Error()
YouMustGiveMeAtLeastOneThingToDoPleaseThankYouError.prototype.constructor = YouMustGiveMeAtLeastOneThingToDoPleaseThankYouError
