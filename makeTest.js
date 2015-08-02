var camelcase = require('camelcase')

module.exports = function (name) {
  var vaar = camelcase(name)
  return 'var tap = require(\'tape\')\n' +
    'var ' + vaar + ' = require(\'./\')\n\n' +
    'tap.test(\'does the thing\', function (t) {\n  t.plan(1)\n  t.equal(' + vaar + '(\'world\'), \'hello world\', \'does it\')\n})\n'
}
