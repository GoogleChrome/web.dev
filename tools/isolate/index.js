/* eslint-disable no-process-exit */

const util = require('util');
const path = require('path');
const glob = util.promisify(require('glob'));
const mv = require('move-file');
const fs = require('fs').promises;
const {existsSync} = require('fs');

/**
 * Move all markdown files in src/site/content to the _exile directory.
 * Optionally pass in an array of globs to be ignored. Items matching these
 * globs will not be moved to _exile.
 * @param {Array<string>} ignore An array of glob patterns to be ignored.
 */
async function isolate(ignore = []) {
  const matches = await glob('src/site/content/**/*.md', {ignore});
  for (const oldPath of matches) {
    let newPath = oldPath.split(path.sep);
    newPath.splice(2, 1, '_exile');
    newPath = newPath.join(path.sep);
    await mv(oldPath, newPath);
  }
}

/**
 * Restore files in _exile to their original location in src/site/content.
 * Removes the _exile dir when it is finished.
 */
async function integrate() {
  const matches = await glob('src/site/_exile/**/*.md');
  for (const oldPath of matches) {
    let newPath = oldPath.split(path.sep);
    newPath.splice(2, 1, 'content');
    newPath = newPath.join(path.sep);
    await mv(oldPath, newPath);
  }
  await fs.rmdir('src/site/_exile', {recursive: true});
}

/**
 * Verify that the _exile directory does not exist.
 * This can be used by git commit hooks to prevent folks from committing while
 * in an isolated state.
 */
function restored() {
  if (existsSync('src/site/_exile')) {
    throw new Error(
      'Found _exile directory. You need to run: npm run integrate.',
    );
  }
}

const allowedCommands = ['isolate', 'integrate', 'restored'];
const command = process.argv[2];
if (allowedCommands.indexOf(command) === -1) {
  throw new Error(
    // prettier-ignore
    `Invalid command: ${command}. Command must be one of the following: ${allowedCommands.join(', ')}.`,
  );
}
const ignore = process.argv.slice(3);
switch (command) {
  case 'isolate':
    return isolate(ignore);
  case 'integrate':
    return integrate();
  case 'restored':
    return restored();
}
