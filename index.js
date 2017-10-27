const requireContext = require('./require_context');
const _ = require('rollup-pluginutils');
const Path = require('path');
const createFilter = _.createFilter;

const reqFunc = `
function makeReqFunc(map) {
    var req = function req(key) {
        return map[key];
    }
    req.keys = function() {
        return Object.keys(map);
    }
    return req;
}
`;

function hasRequireContext(code) {
    return /require\.context/g.test(code);
}

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

let uid = 0;

function getUID() {
    return uid++;
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
                const args = getArgs(line, Path.dirname(id));
                const baseDirname = args.dirname;
                const matched = requireContext(baseDirname, args.recursive, args.regexp);

                const uid = getUID();

                let importCode = '';
                let moduleProps = '';
                matched.forEach((file, index) => {
                    const filePathToBaseDir = Path.relative(Path.dirname(id), file).replace(/\\/g, '/');
                    const filePath = Path.relative(baseDirname, file).replace(/\\/g, '/');
                    const moduleKey = `$${uid}_${index}`;
                    importCode += `import ${moduleKey} from './${filePathToBaseDir}';\n`;
                    moduleProps += `'./${filePath}': ${moduleKey},\n`;
                });

                const importKey = `
                    const module${uid} = {
                        ${moduleProps}
                    };
                    var r = makeReqFunc(module${uid});
                `;
                const s = code.replace(line, [reqFunc, importCode, importKey].join('\n'));
                code = s;
            });
            return code;
        }
    };
};
