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
  it('excludes drafts in the recentPosts collection in prod', async function() {
    const expected = '<p>test-5</p><p>test-4</p><p>test-2</p>';
    const actual = fs.readFileSync(outputPath, 'utf8');
    assert.equal(actual, expected);
  });
});
