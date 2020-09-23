/* eslint-disable no-process-exit */

const util = require('util');
const path = require('path');
const glob = util.promisify(require('glob'));
const mv = require('move-file');
const fs = require('fs').promises;
const {existsSync} = require('fs');

const exileDir = '_exile';
const exilePath = `src/site/${exileDir}`;
const contentDir = 'content';
const contentPath = `src/site/${contentDir}`;
const globPattern = '**/{feed.njk,*.md}';

/**
 * Move all markdown files and RSS feeds in src/site/content to the _exile
 * directory.
 * Optionally pass in an array of globs to be ignored.
 * Items matching these globs will not be moved to _exile.
 * @param {Array<string>} ignore An array of glob patterns to be ignored.
 */
async function isolate(ignore = []) {
  // Check if the _exile directory already exists to avoid the user
  // accidentally running isolate twice.
  restored();
  // Eleventy's rssLastUpdatedDate filter will blow up if we pass it an empty
  // collection. To avoid this we also move all RSS feeds into exile.
  const matches = await glob(path.join(contentPath, globPattern), {ignore});
  for (const oldPath of matches) {
    let newPath = oldPath.split(path.sep);
    newPath.splice(2, 1, exileDir);
    newPath = newPath.join(path.sep);
    await mv(oldPath, newPath);
  }
}

/**
 * Restore files in _exile to their original location in src/site/content.
 * Removes the _exile dir when it is finished.
 */
async function integrate() {
  const matches = await glob(path.join(exilePath, globPattern));
  for (const oldPath of matches) {
    let newPath = oldPath.split(path.sep);
    newPath.splice(2, 1, contentDir);
    newPath = newPath.join(path.sep);
    await mv(oldPath, newPath);
  }
  await fs.rmdir(exilePath, {recursive: true});
}

/**
 * Verify that the _exile directory does not exist.
 * This can be used by git commit hooks to prevent folks from committing while
 * in an isolated state.
 */
function restored() {
  if (existsSync(exilePath)) {
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
