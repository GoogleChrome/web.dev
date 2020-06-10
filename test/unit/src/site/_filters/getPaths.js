const assert = require('assert');
const getPaths = require('../../../../../src/site/_filters/get-paths');

describe('getPaths', function () {
  it('returns a list of path names the post belongs to', function () {
    const post = {
      fileSlug: 'what-is-accessibility',
    };
    const expected = ['accessible'];
    const actual = getPaths(post);
    assert.deepStrictEqual(actual, expected);
  });

  it('returns undefined for a non-existent post', function () {
    const post = {
      fileSlug: 'non-existent-post',
    };
    const expected = undefined;
    const actual = getPaths(post);
    assert.deepStrictEqual(actual, expected);
  });

  it('returns all path names the post belongs to if more than 1', function () {
    const post = {
      fileSlug: 'is-on-https',
    };
    const expected = ['lighthouse-best-practices', 'lighthouse-pwa'];
    const actual = getPaths(post);
    assert.deepStrictEqual(actual, expected);
  });
});
