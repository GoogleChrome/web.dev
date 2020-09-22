const util = require('util');
const path = require('path');
const glob = util.promisify(require('glob'));
const mv = require('move-file');

async function isolate(ignore = []) {
  const matches = await glob('src/site/content/**/*.md', {ignore});
  matches.forEach(async (oldPath) => {
    let newPath = oldPath.split(path.sep);
    newPath.splice(2, 1, '_exile');
    newPath = newPath.join(path.sep);
    await mv(oldPath, newPath);
  });
}

async function integrate() {
  const matches = await glob('src/site/_exile/**/*.md');
  matches.forEach(async (oldPath) => {
    let newPath = oldPath.split(path.sep);
    newPath.splice(2, 1, 'content');
    newPath = newPath.join(path.sep);
    await mv(oldPath, newPath);
  });
}

const command = process.argv[2];
if (command !== 'isolate' && command !== 'integrate') {
  throw new Error(
    `Invalid command: ${command}. Command must be 'isolate' or 'integrate'.`,
  );
}
const ignore = process.argv.slice(3);
if (command === 'isolate') {
  return isolate(ignore);
} else if (command === 'integrate') {
  return integrate();
}
