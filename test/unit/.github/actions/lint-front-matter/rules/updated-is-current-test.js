const assert = require('assert');
const updatedIsCurrent = require('../../../../../../.github/actions/lint-front-matter/rules/updated-is-current');
const {okStatus, warnStatus} = require('../../../../../../.github/actions/lint-front-matter/utils/status');

describe('updated-is-current', function() {
  it('should pass if updated matches today', function() {
    const today = new Date();
    today.setUTCHours(12, 0, 0, 0);
    const updated = today.toISOString().split('T')[0]; // => 2020-03-28
    const yaml = {updated};
    const actual = updatedIsCurrent.test(yaml);
    assert.strictEqual(actual.status, okStatus);
  });

  // updated property is optional in some settings, like when a new file has
  // been added and it only has a date property.
  it('should pass if it does not have optional updated property', function() {
    const yaml = {};
    const actual = updatedIsCurrent.test(yaml);
    assert.strictEqual(actual.status, okStatus);
  });

  it('should warn if updated does not match today', function() {
    const yaml = {updated: '2020-03-01'};
    const actual = updatedIsCurrent.test(yaml);
    assert.strictEqual(actual.status, warnStatus);
  });
});