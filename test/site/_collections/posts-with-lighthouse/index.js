const assert = require('assert');
const path = require('path');
const Template = require(`../../../../node_modules/@11ty/eleventy/src/Template`);
const TemplateCollection = require(`../../../../node_modules/@11ty/eleventy/src/TemplateCollection`);
const postsWithLighthouse = require(`../../../../src/site/_collections/posts-with-lighthouse`);

const posts = [
  'test-1.md',
  'test-2.md',
  'test-3.md',
  'test-4.md',
  'test-5.md',
  'test-6.md',
  'test-7.md',
  'test-8.md',
  'test-9.md',
];

const templates = posts.map((post) => {
  return new Template(
    path.join(__dirname, 'fixtures', post),
    path.join(__dirname, 'fixtures'),
    path.join(__dirname, '.tmp'),
  );
});

const allPosts = new TemplateCollection();

async function _testAddTemplate(template) {
  const data = await template.getData();
  for (const map of await template.getTemplates(data)) {
    allPosts.add(map);
  }
}

describe('postsWithLighthouse', function() {
  before(async function() {
    // Populate the test collection.
    for (let i = 0; i < templates.length; i++) {
      await _testAddTemplate(templates[i]);
    }
  });

  it('does not include posts without a pathItem tag', async function() {
    postsWithLighthouse(allPosts).map((post) => {
      assert.ok(post.data.tags.includes('pathItem'));
    });
  });

  it('does not include posts without a web_lighthouse value', function() {
    postsWithLighthouse(allPosts).map((post) => {
      assert.ok(post.data.web_lighthouse);
    });
  });

  it('does not include posts with an "N/A" web_lighthouse value', function() {
    postsWithLighthouse(allPosts).map((post) => {
      assert.notStrictEqual(post.data.web_lighthouse, 'N/A');
    });
  });

  it('does not include posts with empty array as a web_lighthouse value', function() {
    postsWithLighthouse(allPosts).map((post) => {
      assert.notStrictEqual(post.data.web_lighthouse, []);
    });
  });

  it('does not include posts with a falsy web_lighthouse value', function() {
    postsWithLighthouse(allPosts).map((post) => {
      assert.notEqual(post.data.web_lighthouse, false);
    });
  });

  it('includes all posts with a "pathItem" tag and a valid web_lighthouse value', function() {
    const collectedPosts = postsWithLighthouse(allPosts).map((post) => {
      return post.fileSlug;
    });
    allPosts.getAll().forEach((post) => {
      if (
        post.data.tags.includes('pathItem') &&
        post.data['web_lighthouse'] &&
        (post.data['web_lighthouse'] instanceof Array &&
          post.data['web_lighthouse'].length !== 0) &&
        post.data['web_lighthouse'] !== 'N/A'
      ) {
        assert.ok(collectedPosts.includes(post.fileSlug));
      }
    });
  });
});
