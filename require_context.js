const fs = require('fs');
const Path = require('path');

function readDirR(dir, recursive) {
  return fs.statSync(dir).isDirectory() && recursive
    ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(Path.join(dir, f), recursive)))
    : dir;
}

module.exports = function(dirname = './', recursive = false, regexp = /.*/) {
  let files = readDirR(dirname, recursive);
  if (!Array.isArray(files)) {
    files = [files];
  }
  return files.filter(file => regexp.test(file.replace(/\\/g, '/')));
};
