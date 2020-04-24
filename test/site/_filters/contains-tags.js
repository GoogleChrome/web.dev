const assert = require('assert');
const containsTag = require('../../../src/site/_filters/contains-tag');

describe('containsTag', function() {
  it('returns true if the posts tags contain the requested tag' , function() {
    const post = {
      data: {
        tags: ['tag-1', 'tag-2'],
      },
    };
    const tags = ['tag-1'];
    assert.strictEqual(containsTag(post, tags), true);
  });

  it('returns true if the posts has only the requested tag' , function() {
    const post = {
      data: {
        tags: 'tag-1'
      },
    };
    const tags = ['tag-1'];
    assert.strictEqual(containsTag(post, tags), true);
  });

  it('returns false if the post has no tags', function() {
    const post = {
      data: {},
    };
    const tags = ['tag-1'];
    assert.strictEqual(containsTag(post, tags), false);
  });

  it('returns false if the post has empy tags array', function() {
    const post = {
      data: {
        tags: []
      },
    };
    const tags = ['tag-1'];
    assert.strictEqual(containsTag(post, tags), false);
  });
});
