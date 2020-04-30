const assert = require('assert');
const urlMatchesTitle = require('../../../../../../.github/actions/lint-front-matter/rules/url-matches-title');
const {okStatus, failStatus} = require('../../../../../../.github/actions/lint-front-matter/utils/status');

describe('url-matches-title', function() {
  it('should pass if url matches title', function() {
    const file = 'path/to/my-post/index.md';
    const yaml = {title: 'My post'};
    const actual = urlMatchesTitle.test(file, yaml);
    assert.strictEqual(actual.status, okStatus);
  });

  it('should fail if url does not match title', function() {
    const file = 'path/to/my-post/index.md';
    const yaml = {title: 'Zerp'};
    const actual = urlMatchesTitle.test(file, yaml);
    assert.strictEqual(actual.status, failStatus);
  });
});