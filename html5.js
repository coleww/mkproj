module.exports = function (title) {
  return '<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>' +
    title +
    '</title>\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"www/main.css\">\n</head>\n<body>\n' +
    '    <h1>' + title + '</h1>\n' +
    '    INPUT: <textarea id="input"></textarea><br/><br/>\n' +
    '    OUTPUT :<span id="output"></span><br/><br/>\n' +
    '    <hr/>\n    <a href="https://github.com/YR_GH_NAME/' + title + '">FORK THIS</a>\n<br/><br/>' +
    '    <a href="http://YR_WEBSITE_HERE.com">by YR_NAME</a>\n' +
    '    <script src=\"www/bundle.js\"></script>\n</body>\n</html>'
}
