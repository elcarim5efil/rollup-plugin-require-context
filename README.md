# rollup-plugin-require-context

rollup plugin for resolving webpack require-context.

## Usage

```javascript
import requireContext from 'rollup-plugin-require-context';

export default {
  input: 'main.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [
    requireContext()
  ]
};
```
## Options

### `exclude`

Type: `string | string[]`<br>
Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should _ignore_.

### `include`

Type: `string | string[]`<br>
Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of patterns, which specifies the files in the build the plugin should operate on.

### `extensions`

Type: `string[]`<br>
Default: `['.js']`

Search for extensions other than .js in the order specified.
