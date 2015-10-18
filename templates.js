module.exports = {
  browserify: {
    files: ['www/demo.js', 'www/index.html', 'www/main.css'],
    install: 'npm install browserify watchify tape gh-pages-deploy --save-dev',
    scripts: ['build', 'deploy', 'watch'],
    keys: ['gh-pages-deploy'],
    name: 'browserify'
  },
  server: {
    files: ['server.js'],
    install: 'echo "meow!"',
    scripts: ['start'],
    name: 'server'
  },
  spider: {
    files: ['spider.js'],
    install: 'npm install cheerio request --save',
    scripts: ['spider'],
    name: 'spider'
  },
  twitter: {
    files: ['bot.js', 'config.js'],
    install: 'npm install twit --save',
    scripts: ['tweet'],
    name: 'twitter'
  },
  cli: {
    files: ['cmd.js'],
    install: 'npm install yargs --save',
    keys: ['bin'],
    name: 'cli'
  },
  level: {
    files: ['level.js'],
    install: 'npm install level --save',
    name: 'level'
  },
  canvas: {
    files: ['canvas.js'],
    install: 'npm install canvas --save',
    name: 'canvas'
  },
  synth: {
    files: ['synth.js'],
    install: 'echo "purr!"',
    name: 'synth'
  },
  test: {
    files: ['test.js'],
    install: 'npm install tap standard --save-dev',
    scripts: ['test'],
    name: 'test'
  },
  default: {
    files: ['.gitignore', '.npmignore', '.travis.yml', 'README.md', 'index.js', 'package.json'],
    install: 'npm install tap standard --save-dev',
    name: 'default'
  }
}

