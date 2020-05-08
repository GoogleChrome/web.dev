const assert = require('assert');
const urlLength = require('../../../../../../.github/actions/lint-front-matter/rules/url-length');
const {okStatus, failStatus} = require('../../../../../../.github/actions/lint-front-matter/utils/status');

describe('url-length', function() {
  it('should pass if url has at least two segments', function() {
    const file = 'path/to/my-post/index.md';
    const actual = urlLength.test({file});
    assert.strictEqual(actual.status, okStatus);
  });

  it('should fail if url has only one segment', function() {
    const file = 'path/to/post/index.md';
    const actual = urlLength.test({file});
    assert.strictEqual(actual.status, failStatus);
  });
});