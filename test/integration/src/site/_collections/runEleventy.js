const assert = require('assert');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async function (env) {
  console.log('Running Eleventy...');
  try {
    await exec(`ELEVENTY_ENV=${env} npx @11ty/eleventy --config=eleventy.js`, {
      cwd: __dirname,
    });
  } catch (err) {
    assert.fail(err);
  }
};
