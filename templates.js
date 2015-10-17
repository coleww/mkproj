module.exports = {
  browserify: {
    files: ['www/demo.js', 'www/index.html', 'www/main.css'],
    install: 'npm install browserify watchify tape --save-dev',
    name: 'browserify'
  },
  server: {
    files: ['server.js'],
    install: 'echo "meow!"',
    name: 'server'
  },
  spider: {
    files: ['spider.js'],
    install: 'npm install cheerio request --save',
    name: 'spider'
  },
  twitter: {
    files: ['bot.js', 'config.js'],
    install: 'npm install twit --save',
    name: 'twitter'
  },
  cli: {
    files: ['cmd.js'],
    install: 'npm install yargs --save',
    name: 'cli'
  },
  level: {
    files: ['level.js'],
    install: 'npm install level --save',
    name: 'level'
  }
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
    name: 'test'
  },
  default: {
    files: ['.gitignore', '.npmignore', '.travis.yml', 'README.md', 'index.js', 'package.json', 'test.js'],
    install: 'npm install tap standard --save-dev',
    name: 'default'
  }
}

