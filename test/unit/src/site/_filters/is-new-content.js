const assert = require('assert');
const isNewContent = require('../../../../../src/site/_filters/is-new-content');

describe('isNewContent', function () {
  it('isNewContent marks date 20-07-2020 as false', function () {
    const inputDate = new Date('July 20, 2020 00:20:18 GMT+00:00');
    const actual = isNewContent(inputDate);
    assert.strictEqual(actual, false);
  });

  it('isNewContent marks date older than 30 days as false', function () {
    const inputDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 31);
    const actual = isNewContent(inputDate);
    assert.strictEqual(actual, false);
  });

  it('isNewContent marks date newer than 30 days as true', function () {
    const inputDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 29);
    const actual = isNewContent(inputDate);
    assert.strictEqual(actual, true);
  });
});
