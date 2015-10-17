var after = require('after')
var camelcase = require('camelcase')
var catMe = require('cat-me')
var fs = require('fs')
var jsonfile = require('jsonfile')
var kexec = require('kexec')
var mustache = require('mustache')
var npmAddScript = require('npm-add-script')
var merge = require('merge')
var osenv = require('osenv')

var baseFiles = ['.gitignore', '.npmignore', '.travis.yml', 'README.md',
                   'index.js', 'package.json', 'test.js']
var browserifyFiles = ['www/demo.js', 'www/index.html', 'www/main.css']
var browserPackages = 'npm install browserify watchify tape --save-dev'
var cliFiles = ['cmd.js']
var cliPackages = 'npm install yargs --save'
var twitterFiles = ['bot.js', 'config.js']
var twitterPackages = 'npm install twit --save'
var serverFiles = ['server.js']
var spiderFiles = ['spider.js']
var spiderPackages = 'npm install cheerio request --save'
var synthFiles = ['synth.js']
var levelFiles = ['level.js']
var levelPackages = 'npm install level --save'
var canvasFiles = ['canvas.js']
var canvasPackages = 'npm install canvas --save'
var testFiles = ['test.js']
var testPackages = 'npm install tap standard --save-dev'

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
  if (options.twitter && options.browserify && options.cli && options.level && options.synth && options.canvas && options.spider) console.log('GENERATING A WHOPPER, ONE blt, COMING RIGHT UP')
  var templateData = makeTemplateData(name, options)

  var selected = []
  var files = baseFiles
  var count = 7
  if (options.browserify) {
    count += browserifyFiles.length
    selected.push('browserify')
    files = files.concat(browserifyFiles)
  }
  if (options.cli) {
    count += cliFiles.length
    selected.push('CLI')
    files = files.concat(cliFiles)
  }
  if (options.twitter) {
    count += twitterFiles.length
    selected.push('twitter')
    files = files.concat(twitterFiles)
  }
  if (options.server) {
    count += serverFiles.length
    selected.push('server')
    files = files.concat(serverFiles)
  }
  if (options.spider) {
    count += spiderFiles.length
    selected.push('spider')
    files = files.concat(spiderFiles)
  }
  if (options.canvas) {
    count += canvasFiles.length
    selected.push('canvas')
    files = files.concat(canvasFiles)
  }
  if (options.level) {
    count += levelFiles.length
    selected.push('level')
    files = files.concat(levelFiles)
  }
  if (options.synth) {
    count += synthFiles.length
    selected.push('synth')
    files = files.concat(synthFiles)
  }
  if (!options.twitter && !options.browserify && !options.cli && !options.server && !options.spider && !options.canvas && !options.level && !options.synth) selected.push('default')
  var init = after(count, function () {
    console.log(name + ' project has been mk\'d with ' + selected.join(' and ') + ' boilerplate!')
    console.log(catMe())
    console.log('W A Y    C H I L L!               =^.^=            R A D I C A L!')
    cb()
    if (!options.noFunnyBusiness) {
      kexec('cd ' + name + ' && npm init && ' + templateData.install.join(' && ') + ' && git init && git add -A && git commit -m \'initial\'')
    } else {
        console.log('WARNING: you passed the "noFunnyBusiness" paramater, so packages won\'t be installed nor will the package.json be updated!')
        console.log('DANGER: be sure to run the following command to install the required packages and update the package.json:')
        console.log('    ' + templateData.install.join(' && '))
        console.log(catMe())
        console.log('thank you')
      }
  })

  function doYourWorst (err) {
    if (err) {
      throw err
    } else {
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
  if (options.server) {
    files = files.concat(serverFiles)
    selected.push('server')
  }
  if (options.spider) {
    files = files.concat(spiderFiles)
    selected.push('spider')
  }
  if (options.synth) {
    files = files.concat(synthFiles)
    selected.push('server')
  }
  if (options.level) {
    files = files.concat(levelFiles)
    selected.push('level')
  }
  if (options.canvas) {
    files = files.concat(canvasFiles)
    selected.push('canvas')
  }
  if (options.test) {
    files = files.concat(testFiles)
    selected.push('test')
  }
  console.log('todo:', files.length)
  var init = after(files.length + 1, function () {
    cb()
    if (!options.noFunnyBusiness) {
      kexec(templateData.install.join(' && '))
    } else {
      console.log('WARNING: you passed the "noFunnyBusiness" paramater, so packages won\'t be installed nor will the package.json be updated!')
      console.log('DANGER: be sure to run the following command to install the required packages and update the package.json:')
      console.log('    ' + templateData.install.join(' && '))
      console.log(catMe())
      console.log('thank you')
    }
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
  if (options.browserify || options.cli || options.twitter || options.server || options.spider || options.level || options.synth || options.canvas || options.test) {
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

function getConfig () {
  try {
    return jsonfile.readFileSync(osenv.home() + '/.mkproj.json')
  } catch (e) {
    return {configError: e}
  }
}

function makeTemplateData (name, options) {
  // uh what does this do again?
  var installs = [
    options.browserify ? browserPackages : 'echo "=^.^= coool =^.^="',
    options.cli ? cliPackages : 'echo "=^.^= raaadical =^.^="',
    options.twitter ? twitterPackages : 'echo "=^.^= aaawwwesome =^.^="'
  ]

  var config = merge({githubUserName: 'yrGithubUsername', travisUserName: 'yrTravisUsername', website: 'yrWebsite'}, getConfig())

  return {
    name: name,
    camelName: camelcase(name),
    browserify: options.browserify,
    cli: options.cli,
    server: options.server,
    spider: options.spider,
    canvas: options.canvas,
    level: options.level,
    test: options.test,
    install: installs,
    githubUserName: config.githubUserName,
    website: config.website,
    travisUserName: config.travisUserName
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
    jsonfile.writeFileSync('package.json', packaged, {spaces: 2})
  }
  if (data.twitter) {
    npmAddScript({key: 'tweet', value: 'node bot.js'})
  }
  if (data.server) {
    npmAddScript({key: 'start', value: 'node server.js'})
  }
  if (data.spider) {
    npmAddScript({key: 'spider', value: 'node spider.js'})
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
