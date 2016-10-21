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
var browserifyFiles = ['www/index.html', 'www/main.css']
var browserPackages = 'npm install browserify watchify uglifyify serve livereloadify standard tap --save-dev'
var basicPackages = 'npm install standard tap --save-dev'
module.exports = function (name, options, cb) {
  if (fs.existsSync('package.json') && !name) {
    add2proj(name || getName(), options || {}, cb || function () {})
  } else if (!name) {
    throw new ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError()
  } else {
    mkTheProj(name, options || {}, cb || function () {})
  }
}

function mkTheProj (name, options, cb) {
  var templateData = makeTemplateData(name, options)

  var selected
  var count = 7
  if (options.browserify) {
    count += 2
    selected = 'browserify'
  } else {
    selected = 'default'
  }
  var init = after(count, function () {
    console.log(name + ' project has been mk\'d with ' + selected + ' boilerplate!')
    console.log(catMe())
    console.log('W A Y    C H I L L!               =^.^=            R A D I C A L!')
    cb()
    if (!options.noFunnyBusiness) {
      kexec('cd ' + name + ' && npm init && ' + templateData.install + ' && git init && git add -A && git commit -m \'initial\'')
    } else {
      console.log('WARNING: you passed the no funny business option')
      console.log('WARNING: therefore packages will not be installed nor will a git repository be initialized and committed to')
      console.log('DANGER: be certain to run     ' + templateData.install + '  so as to install the necessary packages')
      console.log('ADVICE: and please use version control because really why not i mean it doesn\'t mean you gotta make super nice clean commits all the time and doe everything through feature branches and pull requests, gosh, just make a big commit when you have things working and that way you can easily jump back if you need to or take a look at a diff and see what went so utterly wrong')
    }
  })

  function doYourWorst (err) {
    if (err) {
      throw err
    } else {
      var files = baseFiles
      if (options.browserify) files = files.concat(browserifyFiles)
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
  console.log('todo', files.length)
  var init = after(files.length + 1, function () {
    cb()
    if (!options.noFunnyBusiness) {
      kexec(templateData.install)
    } else {
      console.log('WARNING: you passed the "noFunnyBusiness" paramater, so packages won\'t be installed!')
      console.log('DANGER: be sure to run the following command to install the required packages=:')
      console.log('    ' + templateData.install)
      console.log(catMe())
      console.log('thank you')
    }
  })
  function doYourWorst (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Generating the Browserify boilerplate for you now!!!')
      files.forEach(function (filename) {
        writeFile(filename, compiley('/src/' + filename, templateData), logCreation, init)
      })

      try {
        npmAddScript({key: 'build', value: 'browserify -g uglifyify index.js -o www/bundle.js'})
        npmAddScript({key: 'watch', value: 'watchify index.js -o www/bundle.js --debug --verbose'})
        npmAddScript({key: 'livereload', value: 'livereloadify ./www'})
        npmAddScript({key: 'serve', value: 'serve ./www'})
      } catch (e) {
        console.log('CATastrophic failure occurred while trying to shove stuff into package.json:')
        console.log(e.message)
      } finally {
        init()
      }
    }
  }
  if (options.browserify) {
    if (!fs.existsSync('./www')) {
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
  var installs = options.browserify ? browserPackages : basicPackages

  return {
    name: name,
    camelName: camelcase(name),
    browserify: options.browserify,
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
