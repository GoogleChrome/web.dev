const assert = require('assert');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const dist = path.resolve(__dirname, '..', '..', 'dist');

describe('Service worker partials', function () {
  it('includes correct fields for home page', function () {
    const partial = require(path.join(dist, 'en', 'index.json'));

    const htmlPath = path.join(dist, 'en', 'index.html');
    const $ = cheerio.load(fs.readFileSync(htmlPath));
    const partialFromHtml = {
      raw: $('#content').html(),
      lang: $('html').attr('lang'),
      title: $('title').text(),
      rss: $('link[type="application/atom+xml"]').attr('href'),
      offline: Boolean($('meta[name="offline"]').attr('content')) || false,
    };

    // These are computed and not relevant to most tests.
    delete partial.builtAt;
    delete partial.resourcesVersion;

    assert.deepStrictEqual(partial, partialFromHtml);
  });

  it('includes RSS urls', function () {
    const expected = '/feed.xml';
    const partialPath = path.join(dist, 'en');
    const partial = require(path.join(partialPath, 'index.json'));

    assert.deepStrictEqual(partial.rss, expected);
    assert.ok(
      fs.existsSync(path.join(partialPath, 'feed.xml')),
      `Could not find feed.xml in ${partialPath}`,
    );
  });

  it('includes unique RSS urls for authors', function () {
    const expected = '/authors/addyosmani/feed.xml';
    const partialPath = path.join(dist, 'en', 'authors', 'addyosmani');
    const partial = require(path.join(partialPath, 'index.json'));

    assert.deepStrictEqual(partial.rss, expected);
    assert.ok(
      fs.existsSync(path.join(partialPath, 'feed.xml')),
      `Could not find feed.xml in ${partialPath}`,
    );
  });

  it('includes unique RSS urls for tags', function () {
    const expected = '/tags/progressive-web-apps/feed.xml';
    const partialPath = path.join(dist, 'en', 'tags', 'progressive-web-apps');
    const partial = require(path.join(partialPath, 'index.json'));

    assert.deepStrictEqual(partial.rss, expected);
    assert.ok(
      fs.existsSync(path.join(partialPath, 'feed.xml')),
      `Could not find feed.xml in ${partialPath}`,
    );
  });
});
