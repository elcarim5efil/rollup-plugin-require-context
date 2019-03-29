const path = require('path');
const requireContext = require('../src/index');

function resolve(...args) {
  return path.resolve(__dirname, ...args);
}

module.exports = {
  input: resolve('src/index.js'),
  output: {
    file: resolve('dist/bundle.js'),
    format: 'iife'
  },
  plugins: [
    requireContext()
  ]
};