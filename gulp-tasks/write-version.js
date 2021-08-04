/**
 * Write the HEAD SHA to the `dist` on prod builds.
 * This is used for cloud build to compare the currently
 * deployed version of the site against the latest commit.
 *
 * @returns {Promise<void>}
 */
const fs = require('fs');
const writeVersion = async () => {
  if (process.env.ELEVENTY_ENV === 'prod') {
    // Verify dist directory exists
    fs.mkdirSync('./dist', {recursive: true});
    fs.writeFileSync('./dist/version', process.env.GITHUB_SHA || '');
  }
};

module.exports = writeVersion;
