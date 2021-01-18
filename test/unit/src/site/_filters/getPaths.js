const assert = require('assert');
const getPaths = require('../../../../../src/site/_filters/get-paths');

describe('getPaths', function () {
  it('returns a list of path names the post belongs to', function () {
    const post = {
      fileSlug: 'what-is-accessibility',
      filePathStem: '/en/blog/what-is-accessibility',
    };
    const expected = ['accessible'];
    const actual = getPaths(post);
    assert.deepStrictEqual(actual, expected);
  });

  it('returns empty for a non-existent post', function () {
    const post = {
      fileSlug: 'non-existent-post',
      filePathStem: '/en/not-a-valid-path/non-existent-post',
    };
    const expected = [];
    const actual = getPaths(post);
    assert.deepStrictEqual(actual, expected);
  });

  it('returns a guess for a valid but not recorded post', function () {
    const post = {
      fileSlug: 'inferred-post-does-not-exist',
      filePathStem: '/en/fast/inferred-post-does-not-exist',
    };
    const expected = ['fast'];
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
