const _ = require('rollup-pluginutils');
const hasRequireContext = require('./helper/has-require-context');
const gernerateRequireContextCode = require('./helper/generate-require-context-code');


module.exports = function plugin(options = {}) {
  const filter = _.createFilter(options.include || ['**/*.js'], options.exclude || 'node_modules/**');
  return {
    name: 'require_content',
    transform(code, id) {
      if (!filter(id) || !hasRequireContext(code)) {
        return;
      }
      const requireContextReg = /require\.context\s*\(.*\)/g;
      const arr = code.match(requireContextReg) || [];

      arr.map((line) => {
        code = gernerateRequireContextCode(code, id, line);
      });
      return code;
    }
  };
};
