module.exports = function(name){
  return "{\n  \"name\": \"" +
  name +
  "\",\n  \"description\": \"\",\n  \"version\": \"1.0.0\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"build\": \"browserify index.js -o bundle.js\",\n    \"watch\": \"watchify index.js -o bundle.js --debug --verbose\"\n  },\n  \"devDependencies\": {\n    \"browserify\": \"*\",\n    \"watchify\": \"*\"\n  }\n}"
}

