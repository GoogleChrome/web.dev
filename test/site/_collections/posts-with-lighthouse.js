const assert = require('assert');
const MockCollection = require('./mocks/collection');
const postsWithLighthouse = require('../../../src/site/_collections/posts-with-lighthouse');

describe('posts-with-lighthouse', function() {
  it('should remove posts without web_lighthouse', function() {
    const posts = [
      {
        tags: ['pathItem'],
        data: {},
        date: new Date(),
      },
    ];
    const collection = new MockCollection(posts);
    const actual = postsWithLighthouse(collection);
    assert.strictEqual(actual.length, 0);
  });

  it('should include posts without web_lighthouse', function() {
    const posts = [
      {
        tags: ['pathItem'],
        data: {
          web_lighthouse: 'foo',
        },
        date: new Date(),
      },
    ];
    const collection = new MockCollection(posts);
    const actual = postsWithLighthouse(collection);
    assert.strictEqual(actual.length, 1);
    assert.strictEqual(actual[0].data.web_lighthouse, 'foo');
  });
});
