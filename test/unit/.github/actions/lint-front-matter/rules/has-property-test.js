const assert = require('assert');
const hasProperty = require('../../../../../../.github/actions/lint-front-matter/rules/has-property');
const {okStatus, failStatus} = require('../../../../../../.github/actions/lint-front-matter/utils/status');

describe('has-property', function() {
  it('should pass if it has the property', function() {
    const yaml = {foo: 'bar'};
    const actual = hasProperty.test(yaml, 'foo');
    assert.strictEqual(actual.status, okStatus);
  });

  it('should fail if it does not have the property', function() {
    const yaml = {};
    const actual = hasProperty.test(yaml, 'foo');
    assert.strictEqual(actual.status, failStatus);
  });

  it('should fail if the property is blank', function() {
    const yaml = {foo: ''};
    const actual = hasProperty.test(yaml, 'foo');
    assert.strictEqual(actual.status, failStatus);
  });
});