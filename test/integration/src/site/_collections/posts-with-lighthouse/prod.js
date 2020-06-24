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

describe('posts-with-lighthouse', function () {
  it('does not include drafts', async function () {
    const expected = '<p>test-4</p>';
    const actual = fs.readFileSync(outputPath, 'utf8');
    assert.equal(actual, expected);
  });
});
