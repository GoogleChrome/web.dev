const assert = require('assert');
const hasProperty = require('../../../../../../.github/actions/lint-front-matter/rules/has-property');
const {okStatus, failStatus} = require('../../../../../../.github/actions/lint-front-matter/utils/status');

describe('has-property', function() {
  it('should pass if it has the property', function() {
    const frontMatter = {foo: 'bar'};
    const actual = hasProperty.test({frontMatter, args: ['foo']});
    assert.strictEqual(actual.status, okStatus);
  });

  it('should fail if it does not have the property', function() {
    const frontMatter = {};
    const actual = hasProperty.test({frontMatter, args: ['foo']});
    assert.strictEqual(actual.status, failStatus);
  });

  it('should fail if the property is blank', function() {
    const frontMatter = {foo: ''};
    const actual = hasProperty.test({frontMatter, args: ['foo']});
    assert.strictEqual(actual.status, failStatus);
  });
});