#!/usr/bin/env node

var figlet = require('figlet')
var header = figlet.textSync('M K P R O J', { font: 'Big Money-nw'})

console.log(header)

var argv = require('yargs')
  .alias('h', 'help')
  .help('help')
  .demand(1, figlet.textSync('E R R O R :', { font: 'Fire Font-k'}) + figlet.textSync('You must pass', { font: 'Fire Font-k'}) + figlet.textSync('a project name', { font: 'Fire Font-s'}))
  .usage('generates tiny node projects')
  .example('mkproj yr-awesome-node-project -b')
  .alias('b', 'browserify')
  .describe('b', 'adds browserify/watchify and /www folder')
  .alias('t', 'twitter')
  .describe('t', 'adds twit and tweet.js file')
  .alias('c', 'CLI')
  .describe('c', 'adds yargs and cmd.js file')
  .argv

var projectName = argv._.join('-').replace(/\W/, '-')
