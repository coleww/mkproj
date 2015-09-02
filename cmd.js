#!/usr/bin/env node
var mkproj = require('./')
var figlet = require('figlet')
var fonts = ['Big Money-nw', 'Def Leppard', 'Alligator2']
var header = figlet.textSync('M K P R O J', { font: fonts[~~(Math.random() * fonts.length)]})
console.log(header)

var argv = require('yargs')
                          .alias('h', 'help')
                          .help('help')
                          .usage('generates tiny node projects')
                          .example('mkproj yr-awesome-vanilla-node-project')
                          .example('mkproj yr-cool-twitter-bot -tweet')
                          .example('mkproj make-me-a-sandwich-please -blt')
                          .example('mkproj -b # add /www and browserify to an existing project')
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
                          .describe('t', 'installs twit and adds tweet.js file')
                          .boolean('n')
                          .alias('n', 'noPleaseDoNotInstallThanks')
                          .alias('n', 'noFunnyBusiness')
                          .describe('n', 'skip the whole "npm init/npm install/git init/initial commit" business')
                          .argv

if (argv.b || argv.c || argv.t || argv._.length) {
  var projectName = argv._.join('-').replace(/\W/g, '-')
  mkproj(projectName, {noFunnyBusiness: argv.n, browserify: argv.b, twitter: argv.t, cli: argv.c})
} else {
  console.log('ERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR')
  console.log('YOU MUST PASS EITHER AN OPTION OR A PROJECT NAME!!')
  console.log('RUN   mkproj -help    FOR MORE INFORMATION!!!!!!!!')
  console.log('ERRORERRORERRORERRORERRORERRORERRORERRORERRORERROR')
}
