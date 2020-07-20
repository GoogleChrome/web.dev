/**
 * @fileoverview Task for updating `updated` YAML field.
 * Run this command while you have dirty files and it will update their
 * `updated` YAML field.
 *
 * Example: npm run updated && git commit -am 'Updated some blog posts'
 *
 * @author Matt Gaunt & Rob Dodson 💕
 */

// This task only runs against files in this directory.
const contentDir = 'src/site/content';

const chalk = require('chalk');
const fs = require('fs').promises;
const moment = require('moment');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const RE_UPDATED = /^updated:\s?(.*?)\n/m;
const MSG_UPDATE = `Updated ${chalk.bold('updated')} in`;

/**
 * Gets the list of modified and renamed files that have been staged.
 * This will ignore files that were added or deleted.
 * @return {Promise<Array<string>>} Returns array of changed files.
 */
async function getChangedFiles() {
  const cmd = 'git diff --cached --name-only --diff-filter=MR';
  const {stdout} = await exec(cmd, '.');
  return stdout.split('\n');
}

const run = async () => {
  // List of all files that have changed
  const changedFiles = await getChangedFiles();

  for (const changedFile of changedFiles) {
    if (!changedFile.startsWith(contentDir)) {
      // File isn't a content file, skip it.
      continue;
    }

    if (!changedFile.endsWith('.md')) {
      // File isn't a Markdown file, skip it.
      continue;
    }

    const fileContents = await fs.readFile(changedFile, 'utf-8');
    const matched = RE_UPDATED.exec(fileContents);
    if (!matched) {
      // Updated YAML property is not in the file - nothing to do.
      console.log(
        `${chalk.black.bgYellow(
          'Warning:',
        )} Could not find updated field in ${changedFile}.`,
      );
      continue;
    }

    const originalUpdated = matched[0];
    const originalTimestamp = matched[1];
    const momentNow = moment();

    if (momentNow.isSameOrBefore(originalTimestamp)) {
      // Updated date is today or in the future.
      continue;
    }

    const newUpdated = originalUpdated.replace(
      originalTimestamp,
      momentNow.format('YYYY-MM-DD'),
    );
    const newContents = fileContents.replace(originalUpdated, newUpdated);
    await fs.writeFile(changedFile, newContents);
    // Add the file to the current commit.
    await exec(`git add ${changedFile}`);
    console.log(`${MSG_UPDATE} ${chalk.cyan(changedFile)}`);
  }
};

run();
