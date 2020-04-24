const assert = require('assert');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async function(env) {
  console.log('Running Eleventy...');
  try {
    await exec(
      `ELEVENTY_ENV=${env} npm run eleventy -- --config="${path.join(
        __dirname,
        '.eleventy.js',
      )}"`,
    );
  } catch (err) {
    assert.fail(err);
  }
};
