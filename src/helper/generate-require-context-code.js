const Path = require('path');
const extractArgs = require('./extract-args');
const resolveRequireModules = require('./resolve-reqquire-modules');
const resolveRequireCode = require('./resolve-require-code');

module.exports = function gernerateRequireContextCode(code, id, line) {
  const currentCodeDirname = Path.dirname(id);
  const { dirname, recursive, regexp } = extractArgs(line, currentCodeDirname);
  const modules = resolveRequireModules(dirname, recursive, regexp);
  const requireCode = line.replace(/require\.context\s*\(.*\);*/, resolveRequireCode(dirname, modules));
  return code.replace(line, requireCode);
};