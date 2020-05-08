const assert = require('assert');
const hasAltText = require('../../../../../../.github/actions/lint-front-matter/rules/has-alt-text');
const {okStatus, failStatus} = require('../../../../../../.github/actions/lint-front-matter/utils/status');

describe('has-alt-text', function() {
  it('should pass if it has alt text', function() {
    const frontMatter = {hero: 'hero.jpg', alt: 'some alt text'};
    const actual = hasAltText.test({frontMatter});
    assert.strictEqual(actual.status, okStatus);
  });

  it('should fail if no alt text', function() {
    const frontMatter = {hero: 'hero.jpg'};
    const actual = hasAltText.test({frontMatter});
    assert.strictEqual(actual.status, failStatus);
  });

  it('should fail if alt text is empty', function() {
    const frontMatter = {hero: 'hero.jpg', alt: ''};
    const actual = hasAltText.test({frontMatter});
    assert.strictEqual(actual.status, failStatus);
  });
});