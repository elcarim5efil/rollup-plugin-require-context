const requireContext = require('./require_context');
const Path = require('path');

function getArgs(line, dirname) {
  const startIndex = line.indexOf('(');
  const endIndex = line.lastIndexOf(')');
  const args = line.substring(startIndex + 1, endIndex)
  .split(',')
  .map(str => (str.trim()));

  return {
    dirname: Path.join(dirname, args[0].substring(1, args[0].length - 1)),
    recursive: JSON.parse(args[1] || 'false'),
    regexp: new RegExp(args[2].substring(1, args[2].length-1))
  };
}

function makeImportCode(name, path) {
  return `import ${name} from './${path}';\n`;
}

function makePropsCode(key, value) {
  return `'${key}': ${value},\n`;
}

let uid = 0;

function getUID() {
  return uid++;
}

module.exports = function gernerateRequireContextCode(code, id, line) {
  const currentCodeDirname = Path.dirname(id);
  const uid = getUID();

  let importCode = '';
  let moduleProps = '';

  const args = getArgs(line, currentCodeDirname);
  const baseDirname = args.dirname;
  const matched = requireContext(baseDirname, args.recursive, args.regexp);
  matched.forEach((file, index) => {
    const moduleName = `$${uid}_${index}`;

    const modulePath = Path.relative(currentCodeDirname, file).replace(/\\/g, '/');
    importCode += makeImportCode(moduleName, modulePath);

    const propsKey = `./${Path.relative(baseDirname, file).replace(/\\/g, '/')}`;
    moduleProps += makePropsCode(propsKey, moduleName);
  });

  const reqFunc = `
  (function() {
    var map = {
      ${moduleProps}
    };
    var req = function req(key) {
      return map[key] || (function() { throw new Error("Cannot find module '" + key + "'.") }());
    }
    req.keys = function() {
      return Object.keys(map);
    }
    return req;
  })();
  `;
  const requireCode = line.replace(/require\.context\s*\(.*\);*/, reqFunc);
  return code.replace(line, [importCode, requireCode].join('\n'));
};
