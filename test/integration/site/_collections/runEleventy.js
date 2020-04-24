const assert = require('assert');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async function(env) {
  console.log('Running Eleventy...');
  try {
    // I'm not in love with using npx here because it means we'd run the latest
    // version of eleventy, which might be different from what our project is
    // using. However, using `npm run eleventy -- --config=...` didn't seem to
    // be working so I switched to adding the cwd option and running eleventy
    // from this directory instead. We should fix this but it's ok for this
    // demo.
    await exec(
      `ELEVENTY_ENV=${env} npx @11ty/eleventy --config=eleventy.collections.config.js`,
      {cwd: __dirname},
    );
  } catch (err) {
    assert.fail(err);
  }
};
