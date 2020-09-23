const assert = require('assert');
const recentBlogPosts = require('../../../../../../src/site/_collections/hooks/recent-blog-posts');

const formatData = (lang, posts) => {
  return {
    lang,
    collections: {
      blogPosts: posts,
    },
  };
};

describe('recent-blog-posts', function () {
  it('should contain 3 posts', function () {
    const post = {
      data: {
        lang: 'en',
        thumbnail: 'some/thumbnail.jpg',
      },
    };
    const data = formatData('en', [post, post, post, post]);
    const actual = recentBlogPosts(data);
    assert.deepStrictEqual(actual.length, 3);
  });

  it('should contain only posts with thumbnail or hero prop', function () {
    const posts = [
      {
        data: {
          lang: 'en',
        },
      },
      {
        data: {
          lang: 'en',
          thumbnail: 'some/thumbnail.jpg',
        },
      },
      {
        data: {
          lang: 'en',
          hero: 'some/thumbnail.jpg',
        },
      },
    ];
    const data = formatData('en', posts);
    const actual = recentBlogPosts(data);
    for (const post of actual) {
      assert.ok(post.data.hero || post.data.thumbnail);
    }
    assert.deepStrictEqual(actual.length, 2);
  });

  it('should reject posts without thumbnail nor hero', function () {
    const post = {
      data: {
        lang: 'en',
      },
    };
    const data = formatData('en', [post]);
    const actual = recentBlogPosts(data);
    assert.deepStrictEqual(actual.length, 0);
  });

  it('should reject posts with lang different than current lang', function () {
    const post = {
      data: {
        lang: 'pl',
      },
    };
    const data = formatData('en', [post]);
    const actual = recentBlogPosts(data);
    assert.deepStrictEqual(actual.length, 0);
  });
});
