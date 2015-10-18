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
var templates = require('./templates')

module.exports = function (name, options, cb) {
  var isAProject = fs.existsSync('package.json')
  if (!isAProject && !name) {
    throw new ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError()
  } else {
    options = options || {}
    options.add = isAProject
    if (!isAProject) options.test = true
    addToOrMkTheProj(name || getName(), options, cb || function () {})
  }
}

function addToOrMkTheProj (name, options, cb) {
  console.log(name, options)
  if (options.twitter && options.browserify && options.cli && options.level && options.synth && options.canvas && options.spider) console.log('GENERATING A WHOPPER, ONE blt, COMING RIGHT UP')
  var templateData = makeTemplateData(name, options)
  var selected = Object.keys(templates).filter(function (k) {
    return options[k] || (!options.add && k === 'default') || (!options.add && k === 'test')
  }).map(function (k) {
    return templates[k]
  })
  var files = selected.map(function (t) {
    return t.files
  }).reduce(function (a, b) {
    return a.concat(b)
  })
  var count = selected.reduce(function (a, b) {
    return a + b.files.length
  }, 0)
  var init = after(count, function () {
    console.log('generated ' + selected.map(function (t) {return t.name}).join(' and ') + ' boilerplate in ' + name + ' project')
    console.log(catMe())
    console.log('W A Y    C H I L L!               =^.^=            R A D I C A L!')
    cb()
    if (!options.add) {
      try {
        process.chdir('./' + name)
        addScripts(templateData)
      } catch (e) {
        console.log('CATastrophic failure occurred while trying to shove stuff into package.json:')
        console.log(e.message)
      }
    }
    if (!options.noFunnyBusiness) {
      kexec('cd ' + name + ' && npm init && ' + templateData.install.join(' && ') + ' && git init && git add -A && git commit -m \'initial\'')
    } else {
      console.log('WARNING: you passed the "noFunnyBusiness" paramater, so packages won\'t be installed nor will the package.json be updated!')
      console.log('DANGER: be sure to run the following command to install the required packages and update the package.json:')
      console.log('    ' + templateData.install.join(' && '))
      console.log('  =^.^= thank you =^.^=')
    }
  })

  function doYourWorst (err) {
    if (err) {
      throw err
    } else {
      console.log('Generating the ' + selected.map(function (t) {return t.name}).join(' and ') + ' boilerplate for you now!!!')
      files.forEach(function (filename) {
        writeFile(((options.add) ? '' : name + '/') + filename, compiley('/src/' + filename, templateData), logCreation, init)
      })
    }
  }

  fs.mkdir(name, function (err) {
    if (err) {
      throw err
    } else {
      if (options.browserify || options.cli || options.twitter || options.server || options.spider || options.level || options.synth || options.canvas || options.test || !options.add) {
        if (options.browserify) {
          fs.mkdir(name + '/www', doYourWorst)
        } else {
          doYourWorst()
        }
      } else {
        throw new YouMustGiveMeAtLeastOneThingToDoPleaseThankYouError()
      }
    }
  })
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
  var config = merge({githubUserName: 'yrGithubUsername', travisUserName: 'yrTravisUsername', website: 'yrWebsite'}, getConfig())
  var opts = Object.keys(options).reduce(function (a, b) {
    if (options[b]) a[b] = true
    return a
  }, config)
  return merge(opts, {
    name: name,
    camelName: camelcase(name),
    install: Object.keys(options).filter(function (t) {
      return templates[t]
    }).map(function (t) {
      return templates[t].install
    })
  })
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

function addScripts (opts) {
  var packaged
  if (opts.browserify || opts.cli) packaged = jsonfile.readFileSync('package.json')
  if (opts.browserify) {
    npmAddScript({key: 'build', value: 'browserify www/demo.js -o www/bundle.js'})
    npmAddScript({key: 'deploy', value: 'git push origin master && gh-pages-deploy'})
    npmAddScript({key: 'watch', value: 'watchify www/demo.js -o www/bundle.js --debug --verbose'})
    if (packaged['gh-pages-deploy']) {
      console.log('WEEEOOOO looks like you already have a gh-pages-deploy entry in yr package.json?')
    } else {
      packaged['gh-pages-deploy'] = {
        'staticpath': 'www',
        'prep': [
          'test',
          'build'
        ],
        'noprompt': false
      }
      jsonfile.writeFileSync('package.json', packaged, {spaces: 2})
    }
  }
  if (opts.cli) {
    if (packaged.bin) {
      console.log('WEEEOOOO looks like you already have a bin entry in yr package.json?')
    } else {
      var bin = {}
      bin[opts.camelName] = 'cmd.js'
      packaged.bin = bin
      jsonfile.writeFileSync('package.json', packaged, {spaces: 2})
    }
  }
  if (opts.twitter) {
    npmAddScript({key: 'tweet', value: 'node bot.js'})
  }
  if (opts.server) {
    npmAddScript({key: 'start', value: 'node server.js'})
  }
  if (opts.spider) {
    npmAddScript({key: 'spider', value: 'node spider.js'})
  }
  if (opts.test) {
    npmAddScript({key: 'test', value: 'standard && node test.js'})
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
