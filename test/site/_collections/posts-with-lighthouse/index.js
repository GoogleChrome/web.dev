const assert = require('assert');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const runEleventy = async function(env) {
  try {
    await exec(`ELEVENTY_ENV=${env} npx @11ty/eleventy --config=eleventy.js`);
  } catch (err) {
    assert.fail(err);
  }
};

describe('posts-with-lighthouse', function() {
  describe('postsWithLighthouse', function() {
    afterEach(function() {
      fs.rmdirSync(path.join('.', '.tmp'), {recursive: true});
    });

    it('creates postsWithLighthouse collection in dev env', async function() {
      await runEleventy('dev');
      const expected = '<p>test-3</p><p>test-5</p>';
      const actual = await fs.readFileSync(
        '.tmp/collection/index.html',
        'utf8',
      );
      assert.equal(actual, expected);
    });

    it('does not include drafts in the postsWithLighthouse collection in prod', async function() {
      await runEleventy('prod');
      const expected = '<p>test-3</p>';
      const actual = await fs.readFileSync(
        '.tmp/collection/index.html',
        'utf8',
      );
      assert.equal(actual, expected);
    });
  });
});
