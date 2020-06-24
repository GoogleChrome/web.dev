const assert = require('assert');
const paths = require('../../../../../src/site/_data/paths');
const postToPaths = require('../../../../../src/site/_data/postToPaths');

describe('postToPaths', function () {
  it('outputs a path name for a post included in that path', function () {
    Object.keys(paths).forEach((path) => {
      paths[path].topics &&
        paths[path].topics.forEach((topic) => {
          topic.pathItems.forEach((slug) => {
            assert.ok(postToPaths[slug].includes(path));
          });
        });
    });
  });

  it('is undefined for a non-existent post', function () {
    assert.deepStrictEqual(postToPaths['some-slug'], undefined);
  });
});
