#!/usr/bin/env node
var mkproj = require('./')
var figlet = require('figlet')
var fonts = ['Big Money-nw', 'Def Leppard', 'Alligator2']
var header = figlet.textSync('M K P R O J', { font: fonts[~~(Math.random() * fonts.length)]})
console.log(header)

var argv = require('yargs')
                          .alias('h', 'help')
                          .help('help')
                          .usage('generates tiny node projects or big browserify apps!')
                          .example('mkproj yr-awesome-vanilla-node-project')
                          .example('mkproj yr-cool-browserify-project -b')
                          .example('mkproj -b # add /www and browserify to an existing node project')
                          .boolean('b')
                          .alias('b', 'browserify')
                          .alias('b', 'browser')
                          .alias('b', 'bacon')
                          .describe('b', 'installs browserify/watchify and adds /www folder')
                          .boolean('n')
                          .alias('n', 'noPleaseDoNotInstallThanks')
                          .alias('n', 'noFunnyBusiness')
                          .describe('n', 'skip the whole "npm init/npm install/git init/initial commit" business')
                          .argv

if (argv.b || argv._.length) {
  var projectName = argv._.join('-').replace(/\W/g, '-')
  try {
    mkproj(projectName, {noFunnyBusiness: argv.n, browserify: argv.b, twitter: argv.t, cli: argv.c})
  } catch (e) {
    console.log(e.message)
  }
} else {
  console.log('ERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR')
  console.log('YOU MUST PASS EITHER AN OPTION OR A PROJECT NAME!!')
  console.log('RUN   mkproj -help    FOR MORE INFORMATION!!!!!!!!')
  console.log('ERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR')
}
