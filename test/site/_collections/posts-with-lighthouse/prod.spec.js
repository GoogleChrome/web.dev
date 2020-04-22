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
  'index.html',
);

describe('posts-with-lighthouse', function() {
  describe('postsWithLighthouse', function() {
    it('does not include drafts in the postsWithLighthouse collection in prod', async function() {
      const expected = '<p>test-3</p>';
      const actual = fs.readFileSync(outputPath, 'utf8');
      assert.equal(actual, expected);
    });
  });
});
