const util = require('util');
const path = require('path');
const glob = util.promisify(require('node-glob'));
const mv = require('move-file');

async function run() {
  const matches = await glob('src/site/content/**/*.md');
  matches.forEach(async (oldPath) => {
    let newPath = oldPath.split(path.sep);
    newPath.splice(2, 1, '_exile');
    newPath = newPath.join(path.sep);
    await mv(oldPath, newPath);
  });
}

run();
