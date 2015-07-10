module.exports = function(name){
  return "{\n  \"name\": \"" +
  name +
  "\",\n  \"description\": \"Put A Description Here!\",\n  \"version\": \"1.0.0\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"build\": \"browserify www/demo.js -o www/bundle.js\",\n    \"test\": \"node test.js -o www/bundle.js\",\n    \"watch\": \"watchify www/demo.js -o www/bundle.js --debug --verbose\"\n  },\n  \"devDependencies\": {\n    \"browserify\": \"*\",\n    \"tape\": \"*\",\n    \"watchify\": \"*\"\n  }\n}"
}
