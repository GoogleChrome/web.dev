const assert = require('assert');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(
  __dirname,
  '..',
  '.tmp',
  path.basename(__dirname),
  'index.html',
);

describe('posts-with-lighthouse', function() {
  it('includes posts with a pathItem tag and a web_lighthouse property, including drafts', function() {
    const expected = '<p>test-3</p><p>test-4</p>';
    const actual = fs.readFileSync(outputPath, 'utf-8');
    assert.equal(actual, expected);
  });
});
