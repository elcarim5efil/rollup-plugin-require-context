const { extname } = require('path');
const { createFilter } = require('@rollup/pluginutils');
const generateSourceMap = require('generate-source-map');
const hasRequireContext = require('./helper/has-require-context');
const gernerateRequireContextCode = require('./helper/generate-require-context-code');

module.exports = function plugin(options = {}) {
  const extensions = options.extensions || ['.js'];
  const filter = createFilter(options.include, options.exclude);
  return {
    name: 'require_content',
    async transform(code, id) {
      const extName = extname(id);
      if (!filter(id) || !extensions.includes(extName) || !hasRequireContext(code)) {
        return;
      }
      code = await gernerateRequireContextCode(id, code);

      const sourcemap = generateSourceMap({
        source: code,
        sourceFile: 'rollup-plugin-require-context.js'
      }).toString();

      return {
        code,
        map: sourcemap
      };
    }
  };
};
