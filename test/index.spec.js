
const build = require('./code/build');

describe('collect left data', () => {
  it('default', async () => {
    const output = await build(`
      import './normal/index.js';
      require.context('./imports');
    `);
    expect(output.code).toContain('normal.index');
    expect(output.code).toContain('imports.a');
    expect(output.code).toContain('imports.b');
    expect(output.code).not.toContain('sub');
  });

  it('resursive', async () => {
    const output = await build(`
      import './normal/index.js';
      require.context('./imports', true);
    `);
    expect(output.code).toContain('normal.index');
    expect(output.code).toContain('imports.a');
    expect(output.code).toContain('imports.b');
    expect(output.code).toContain('imports.sub.index');
    expect(output.code).toContain('imports.sub.c');
  });

  it('resursive with exp /.\/[^a]/', async () => {
    const output = await build(`
      import './normal/index.js';
      require.context('./imports', true, /.\\/[^a]/);
    `);
    expect(output.code).toContain('normal.index');
    expect(output.code).not.toContain('imports.a');
    expect(output.code).toContain('imports.b');
    expect(output.code).toContain('imports.sub.index');
    expect(output.code).toContain('imports.sub.c');
  });

  it('resursive with exp /sub/', async () => {
    const output = await build(`
      import './normal/index.js';
      require.context('./imports', true, /sub/);
    `);
    expect(output.code).toContain('normal.index');
    expect(output.code).not.toContain('imports.a');
    expect(output.code).not.toContain('imports.b');
    expect(output.code).toContain('imports.sub.index');
    expect(output.code).toContain('imports.sub.c');
  });

  it('work with comment', async () => {
    const output = await build(`
      import './normal/index.js';
      // require.context('./imports');
    `);
    expect(output.code).toContain('normal.index');
    expect(output.code).not.toContain('imports.a');
    expect(output.code).not.toContain('imports.b');
    expect(output.code).not.toContain('imports.sub.index');
    expect(output.code).not.toContain('imports.sub.c');
  });

  it('should work with other function', async () => {
    const output = await build(`
      import './normal/index.js';
      function importAll(r) {r.keys()}
      importAll(require.context('./imports'));
    `);
    expect(output.code).toContain('normal.index');
    expect(output.code).toContain('require_context_module');
    expect(output.code).toContain('imports.a');
    expect(output.code).toContain('imports.b');
    expect(output.code).not.toContain('imports.sub.index');
    expect(output.code).not.toContain('imports.sub.c');
  });
});