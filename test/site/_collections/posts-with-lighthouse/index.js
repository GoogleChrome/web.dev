const assert = require('assert');
const fs = require('fs');
const path = require('path');
const runEleventy = require('../runEleventy');

// Eleventy config must be relative to runEleventy script.
const configPath = path.join('.', path.basename(__dirname), 'eleventy.js');
const outputPath = path.join(__dirname, '.tmp', 'collection', 'index.html');

describe('posts-with-lighthouse', function() {
  describe('postsWithLighthouse', function() {
    afterEach(function() {
      fs.rmdirSync(path.join('.', '.tmp'), {recursive: true});
    });

    it('creates postsWithLighthouse collection in dev env', async function() {
      await runEleventy('dev', configPath);
      const expected = '<p>test-3</p><p>test-5</p>';
      const actual = await fs.readFileSync(
        outputPath,
        'utf8',
      );
      assert.equal(actual, expected);
    });

    it('does not include drafts in the postsWithLighthouse collection in prod', async function() {
      await runEleventy('prod', configPath);
      const expected = '<p>test-3</p>';
      const actual = await fs.readFileSync(
        outputPath,
        'utf8',
      );
      assert.equal(actual, expected);
    });
  });
});
