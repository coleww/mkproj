module.exports = function (name) {
  return 'var tap = require(\'tape\')\n' +
    'var ' + name + ' = require(\'./\')\n\n' +
    'tap.test(\'does the thing\', function (t) {\n  t.plan(1)\n  t.equal(' + name + '(\'world\'), \'hello world\', \'does it\')\n})\n'
}
