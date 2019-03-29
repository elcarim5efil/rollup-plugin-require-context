const Path = require('path');

function stripHeadAndTailChar(str) {
  return str.substring(1, str.length-1);
}

module.exports = function extractArgs(line = '', baseDirname) {
  const startIndex = line.indexOf('(');
  const endIndex = line.lastIndexOf(')');
  const [
    rawDirname = '',
    rawRecursive,
    rawRegexp
  ] = (
    line
      .substring(startIndex + 1, endIndex)
      .split(',')
      .map(str => (str.trim()))
  );

  const dirname = Path.join(baseDirname, stripHeadAndTailChar(rawDirname));
  const recursive = rawRecursive && rawRecursive === 'true';
  const regexp = rawRegexp && new RegExp(stripHeadAndTailChar(rawRegexp));

  return {
    dirname,
    recursive,
    regexp
  };
}