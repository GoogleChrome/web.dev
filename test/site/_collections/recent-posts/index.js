const assert = require('assert');
const fs = require('fs');
const path = require('path');
const runEleventy = require('../runEleventy');

// Eleventy config must be relative to runEleventy script.
const configPath = path.join('.', path.basename(__dirname), 'eleventy.js');
const outputPath = path.join(__dirname, '.tmp', 'collection', 'index.html');

describe('recent-posts', function() {
  describe('recentPosts', function() {
    afterEach(function() {
      fs.rmdirSync(path.join('.', '.tmp'), {recursive: true});
    });

    it('creates recentPosts collection in dev env', async function() {
      await runEleventy('dev', configPath);
      const expected = '<p>test-5</p><p>test-4</p><p>test-3</p>';
      const actual = fs.readFileSync(outputPath, 'utf8');
      assert.equal(actual, expected);
    });

    it('excludes drafts in the recentPosts collection in prod', async function() {
      await runEleventy('prod', configPath);
      const expected = '<p>test-5</p><p>test-4</p><p>test-2</p>';
      const actual = fs.readFileSync(outputPath, 'utf8');
      assert.equal(actual, expected);
    });
  });
});
