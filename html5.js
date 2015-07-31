module.exports = function (title) {
  return '<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <title>' +
    title +
    '</title>\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"www/main.css\">\n</head>\n<body>\n  <script src=\"www/bundle.js\"></script>\n</body>\n</html>'
}
