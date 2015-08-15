#!/usr/bin/env node
var mkproj = require('./')
var figlet = require('figlet')
var header = figlet.textSync('M K P R O J')//, { font: 'Big Money-nw'}) // make list of good ones
console.log(header)

var argv = require('yargs')
  .alias('h', 'help')
  .help('help')
  .demand(1, figlet.textSync('E R R O R :', { font: 'Fire Font-k'}) + figlet.textSync('You must pass', { font: 'Fire Font-s'}) + figlet.textSync('a project name', { font: 'Fire Font-s'}))
  .usage('generates tiny node projects')
  .example('mkproj yr-awesome-vanilla-node-project')
  .example('mkproj yr-cool-twitter-bpt -tweet')
  .example('mkproj make-me-a-sandwich-please -blt')
  .alias('b', 'browserify')
  .alias('b', 'browser')
  .alias('b', 'bacon')
  .describe('b', 'installs browserify/watchify and adds /www folder')
  .alias('c', 'cli')
  .alias('c', 'cmd')
  .alias('c', 'l') // -blt
  .alias('c', 'lettuce')
  .describe('c', 'installs yargs and adds cmd.js file')
  .alias('t', 'twitter')
  .alias('t', 'tweet')
  .alias('t', 'tomato')
  .describe('t', 'installs twit and adds tweet.js file')
  .alias('n', 'noPleaseDoNotInstallThanks')
  .describe('n', 'skip the whole "npm init/npm install/git init/initial commit" business')
  .argv

var projectName = argv._.join('-').replace(/\W/g, '-')

mproj(projectName, {noFunnyBusiness: argv.n, browserify: argv.b, twitter: argv.t, cli: argv.c})

