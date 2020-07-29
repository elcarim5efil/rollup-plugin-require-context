const rollup = require('rollup');
const virtual = require('./virtual');
const path = require('path');
const requireContext = require('../../src/index');

function resolve(...args) {
  return path.resolve(__dirname, ...args);
}

async function build(content) {
  const entry = resolve('src/index.js');
  const inputOptions = {
    plugins: [
      virtual({
        [entry]: content,
      }),
      requireContext()
    ],
    input: entry
  };
  const outputOptions = {
    format: 'iife',
    output: 'bundle.js'
  };
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  return output[0];
}

module.exports = build;