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

  it('should remove posts with web_lighthouse set to N/A', function() {
    const posts = [
      {
        tags: ['pathItem'],
        data: {
          web_lighthouse: 'N/A',
        },
        date: new Date(),
      },
    ];
    const collection = new MockCollection(posts);
    const actual = postsWithLighthouse(collection);
    assert.strictEqual(actual.length, 0);
  });

  it('should include posts with a single web_lighthouse value', function() {
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

  it('should include posts with multiple web_lighthouse values', function() {
    const posts = [
      {
        tags: ['pathItem'],
        data: {
          web_lighthouse: ['foo', 'bar', 'baz'],
        },
        date: new Date(),
      },
    ];
    const collection = new MockCollection(posts);
    const actual = postsWithLighthouse(collection);
    assert.strictEqual(actual.length, 1);
    assert.deepEqual(actual[0].data.web_lighthouse, ['foo', 'bar', 'baz']);
  });
});
