module.exports = function (name) {
  return '{\n  \"name\": \"' +
  name +
  '\",\n  \"description\": \"Put A Description Here!\",\n  \"version\": \"1.0.0\",\n' +
  '    \"main\": \"index.js\",\n  \"scripts\": {\n    \"build\": \"browserify www/demo.js -o www/bundle.js\",\n' +
  '    \"deploy\": \"git checkout gh-pages && cp www/index.html index.html && sed -i .bak \'s|www\/bundle|bundle|\' index.html && rm index.html.bak && browserify www/demo.js -o bundle.js && git add -A && git commit -m \'deploy\' && git push origin gh-pages\",\n' +
  '    \"test\": \"standard && node test.js\",\n    \"watch\": \"watchify www/demo.js -o www/bundle.js --debug --verbose\"\n  },' +
  '\n  \"devDependencies\": {\n    \"browserify\": \"*\",\n    \"standard\": \"4.5.4\",\n    \"tape\": \"4.0.1\",\n    ' +
  '\"watchify\": \"*\"\n  },\n  \"license\": \"MIT\"\n}'
}
