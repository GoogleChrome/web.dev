const assert = require('assert');
const capitalize = require('../../../../../src/site/_filters/capitalize');

describe('capitalize', function () {
  it('capitalizes the first letter of a string', function () {
    const inputStr = 'test';
    const expected = 'Test';
    const actual = capitalize(inputStr);
    assert.deepStrictEqual(actual, expected);
  });

  it('handles whitespace gracefully', function () {
    const inputStr = ' test';
    const expected = ' test';
    const actual = capitalize(inputStr);
    assert.deepStrictEqual(actual, expected);
  });

  it('handles empty string gracefully', function () {
    const inputStr = '';
    const expected = '';
    const actual = capitalize(inputStr);
    assert.deepStrictEqual(actual, expected);
  });
});
