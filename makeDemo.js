module.exports = function (name) {
  return 'var ' + name + ' = require(\'../\')\n\n' +
    'document.getElementById(\'input\').addEventListener(\'keyup\', function (e) {\n' +
    '  document.getElementById(\'output\').textContent = ' + name + '(document.getElementById(\'input\').value)\n' +
    '})\n'
}
