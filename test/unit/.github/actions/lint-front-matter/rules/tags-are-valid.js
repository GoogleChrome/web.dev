const assert = require('assert');
const tagsAreValid = require('../../../../../../.github/actions/lint-front-matter/rules/tags-are-valid');
const {okStatus, failStatus} = require('../../../../../../.github/actions/lint-front-matter/utils/status');

describe('has-alt-text', function() {
  it('should pass if tags are valid', function() {
    const frontMatter = {tags: ['performance', 'capabilities']};
    const actual = tagsAreValid.test({frontMatter});
    assert.strictEqual(actual.status, okStatus);
  });

  it('should fail if no tags are present', function() {
    const frontMatter = {};
    const actual = tagsAreValid.test({frontMatter});
    assert.strictEqual(actual.status, failStatus);
  });

  it('should fail if tags are invalid', function() {
    const frontMatter = {tags: ['foo', 'performance']};
    const actual = tagsAreValid.test({frontMatter});
    assert.strictEqual(actual.status, failStatus);
  });
});