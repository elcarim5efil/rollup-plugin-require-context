const rollup = require('rollup');
const config = require('./rollup.config');

async function build() {
  const bundle = await rollup.rollup(config);
  const { output } = await bundle.generate(config.output);

  output.forEach(chunk => {
    console.log(chunk.code)
  });
}

build();