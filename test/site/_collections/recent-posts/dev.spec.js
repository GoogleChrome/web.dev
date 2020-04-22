const assert = require('assert');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(
  __dirname,
  '..',
  '.tmp',
  path.basename(__dirname),
  'pages',
  'collection',
  'index.html'
);

describe('recent-posts', function() {
  describe('recentPosts', function() {
    it('creates recentPosts collection in dev env', async function() {
      const expected = '<p>test-5</p><p>test-4</p><p>test-3</p>';
      const actual = fs.readFileSync(outputPath, 'utf8');
      assert.equal(actual, expected);
    });
  });
});
