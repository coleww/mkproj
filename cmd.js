#!/usr/bin/env node
var mkproj = require('./')
var figlet = require('figlet')
var fonts = ['Big Money-nw', 'Def Leppard', 'Alligator2']
var header = figlet.textSync('M K P R O J', { font: fonts[~~(Math.random() * fonts.length)]})
console.log(header)
var internalErrors = ['ItIsEssentialThatYouGiveThisProjectSomeSortOfNameHowAboutFluffyDestroyerError', 'YouMustGiveMeAtLeastOneThingToDoPleaseThankYouError']
var thePackage = require('./package.json')

var argv = require('yargs').alias('h', 'help')
                           .help('help')
                           .usage('generates tiny node projects')
                           .example('mkproj yr-awesome-vanilla-node-project')
                           .example('mkproj yr-cool-twitter-bot -tweet')
                           .example('mkproj make-me-a-sandwich-please -blt')
                           .example('mkproj -b # add /www and browserify to an existing project')
                           .boolean('v')
                           .alias('v', 'version')
                           .describe('v', 'reports yr mkproj version number')
                           .boolean('b')
                           .alias('b', 'browserify')
                           .alias('b', 'browser')
                           .alias('b', 'bacon')
                           .describe('b', 'installs browserify/watchify and adds /www folder')
                           .boolean('c')
                           .alias('c', 'cli')
                           .alias('c', 'cmd')
                           .alias('c', 'l') // -blt
                           .alias('c', 'lettuce')
                           .describe('c', 'installs yargs and adds cmd.js file')
                           .boolean('t')
                           .alias('t', 'twitter')
                           .alias('t', 'tweet')
                           .alias('t', 'tomato')
                           .describe('t', 'installs twit and adds config.js and bot.js files')
                           .boolean('s')
                           .alias('s', 'server')
                           .alias('s', 'http')
                           .describe('s', 'makes a server.js for yr API')
                           .boolean('w')
                           .alias('w', 'www')
                           .alias('w', 'spider')
                           .describe('w', 'makes a spider.js for gathering datas')
                           .boolean('d')
                           .alias('d', 'level')
                           .alias('d', 'db')
                           .describe('d', 'makes a level.js for storing yr datas')
                           .boolean('m')
                           .alias('m', 'music')
                           .alias('m', 'synth')
                           .alias('m', 'web audio')
                           .describe('m', 'makes a synth.js for building web audio synths')
                           .boolean('a')
                           .alias('a', 'art')
                           .alias('a', 'canvas')
                           .describe('a', 'makes a canvas.js for storing yr node-canvas functions')
                           .boolean('o')
                           .alias('o', 'test')
                           .alias('o', 'tap')
                           .describe('o', 'add a test.js to an existing project')
                           .boolean('n')
                           .alias('n', 'noPleaseDoNotInstallThanks')
                           .alias('n', 'noFunnyBusiness')
                           .describe('n', 'skip the whole "npm init/npm install/git init/initial commit" business')
                           .argv

if (argv.v) {
  console.log('MKPROJ: version', require('./package.json')['version'])
} else if (argv.b || argv.c || argv.t || argv.s || argv.w || argv.d || argv.m || argv.a || argv.o || argv._.length) {
  var projectName = argv._.join('-').replace(/\W/g, '-')
  try {
    mkproj(projectName, {
      noFunnyBusiness: argv.n,
      browserify: argv.b,
      twitter: argv.t,
      cli: argv.c,
      server: argv.s,
      spider: argv.w,
      synth: argv.m,
      canvas: argv.a,
      level: argv.d,
      test: argv.o
    })
  } catch (e) {
    if (internalErrors.indexOf(e.name) !== -1) {
      console.log('uh oh something strange happened in version', thePackage['version'], '\nthe error was', e, '\n if you report it to', thePackage['bugs']['url'], '\nthen maybe we can fix it?')
    } else {
      console.log(e.message)
    }
  }
} else {
  console.log('ERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR')
  console.log('YOU MUST PASS EITHER AN OPTION OR A PROJECT NAME!!')
  console.log('RUN   mkproj -help    FOR MORE INFORMATION!!!!!!!!')
  console.log('ERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR')
}
