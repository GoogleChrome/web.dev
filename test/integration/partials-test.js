const assert = require('assert');
const path = require('path');
const dist = path.resolve(__dirname, '..', '..', 'dist');

describe('Partials test', function() {
  it('Partials include RSS urls', async function() {
    const expected = '/feed.xml';
    const partialPath = path.join(dist, 'en', 'index.json');
    const partial = require(partialPath);

    assert.ok(
      partial.rss === expected,
      `Partial "${partialPath}" did not have an RSS of "${expected}"`,
    );
  });

  it('Authors have unique RSS urls', async function() {
    const expected = '/authors/addyosmani/feed.xml';
    const partialPath = path.join(
      dist,
      'en',
      'authors',
      'addyosmani',
      'index.json',
    );
    const partial = require(partialPath);

    assert.ok(
      partial.rss === expected,
      `Partial "${partialPath}" did not have an RSS of "${expected}"`,
    );
  });

  it('Tags have unique RSS urls', async function() {
    const expected = '/tags/progressive-web-apps/feed.xml';
    const partialPath = path.join(
      dist,
      'en',
      'tags',
      'progressive-web-apps',
      'index.json',
    );
    const partial = require(partialPath);

    assert.ok(
      partial.rss === expected,
      `Partial "${partialPath}" did not have an RSS of "${expected}"`,
    );
  });
});
