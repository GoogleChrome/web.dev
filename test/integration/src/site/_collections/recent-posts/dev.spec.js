const assert = require('assert');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(
  __dirname,
  '..',
  '.tmp',
  path.basename(__dirname),
  'collection',
  'index.html',
);

describe('recent-posts', function() {
  describe('recentPosts collection', function() {
    it('includes 3 most recent blog posts that have a hero image or a thumbnail, ordered by date', async function() {
      const expected = '<p>test-5</p><p>test-4</p><p>test-3</p>';
      const actual = fs.readFileSync(outputPath, 'utf8');
      assert.equal(actual, expected);
    });
  });
});
