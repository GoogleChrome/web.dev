const assert = require('assert');
const {
  hasLighthouseAudit,
} = require('../../../../../src/site/_collections/posts-with-lighthouse');

describe('posts-with-lighthouse', function () {
  describe('hasLighthouseAudit', function () {
    it('should reject posts without web_lighthouse', function () {
      const post = {
        tags: [],
        data: {},
        date: new Date(),
      };
      const actual = hasLighthouseAudit(post);
      assert.strictEqual(actual, false);
    });

    it('should reject posts with web_lighthouse set to N/A', function () {
      const post = {
        tags: [],
        data: {
          web_lighthouse: 'N/A',
        },
        date: new Date(),
      };
      const actual = hasLighthouseAudit(post);
      assert.strictEqual(actual, false);
    });

    it('should allow posts with a single web_lighthouse value', function () {
      const post = {
        tags: [],
        data: {
          web_lighthouse: 'foo',
        },
        date: new Date(),
      };
      const actual = hasLighthouseAudit(post);
      assert.strictEqual(actual, true);
    });

    it('should allow posts with multiple web_lighthouse values', function () {
      const post = {
        tags: [],
        data: {
          web_lighthouse: ['foo', 'bar', 'baz'],
        },
        date: new Date(),
      };
      const actual = hasLighthouseAudit(post);
      assert.strictEqual(actual, true);
    });
  });
});
