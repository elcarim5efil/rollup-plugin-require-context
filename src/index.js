
const _ = require('rollup-pluginutils');
const gernerateRequireContextCode = require('./generate_require_context_code');
const createFilter = _.createFilter;

function hasRequireContext(code) {
    return /require\.context/g.test(code);
}

module.exports = function plugin(options = {}) {
  const filter = createFilter(options.include || ['**/*.js'], options.exclude || 'node_modules/**');
  return {
    name: 'require_content',
    transform(code, id) {
      if (!filter(id) || !hasRequireContext(code)) {
        return;
      }
      const requireContextReg = /[var|const|let].*=.*require\.context\s*\(.*\);*/g;
      const arr = code.match(requireContextReg);

      arr.map((line) => {
        code = gernerateRequireContextCode(code, id, line);
      });
      return code;
    }
  };
};
