const assert = require('assert');
const path = require('path');
const dist = path.resolve(__dirname, '..', '..', 'dist');

describe('Service worker partials', function() {
  it('includes RSS urls', function() {
    const expected = '/feed.xml';
    const partialPath = path.join(dist, 'en', 'index.json');
    const partial = require(partialPath);

    assert.deepStrictEqual(partial.rss, expected);
  });

  it('includes unique RSS urls for authors', function() {
    const expected = '/authors/addyosmani/feed.xml';
    const partialPath = path.join(
      dist,
      'en',
      'authors',
      'addyosmani',
      'index.json',
    );
    const partial = require(partialPath);

    assert.deepStrictEqual(partial.rss, expected);
  });

  it('includes unique RSS urls for tags', function() {
    const expected = '/tags/progressive-web-apps/feed.xml';
    const partialPath = path.join(
      dist,
      'en',
      'tags',
      'progressive-web-apps',
      'index.json',
    );
    const partial = require(partialPath);

    assert.deepStrictEqual(partial.rss, expected);
  });
});
