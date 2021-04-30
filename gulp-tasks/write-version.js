const {execSync} = require('child_process');

const isProd = process.env.ELEVENTY_ENV === 'prod';

/**
 * Write the HEAD SHA to the `dist` on prod builds.
 * This is used for cloud build to compare the currently
 * deployed version of the site against the latest commit.
 *
 * @returns {Promise<void>}
 */
const writeVersion = async () => {
  if (isProd) {
    const version = execSync('git rev-parse HEAD').toString().trim();
    require('fs').writeFileSync('./dist/version', version);
  }
};

module.exports = writeVersion;
