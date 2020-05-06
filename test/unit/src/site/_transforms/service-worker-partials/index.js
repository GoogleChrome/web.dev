const assert = require('assert');
const path = require('path');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const {
  serviceWorkerPartials,
  getPartial,
  writePartial,
} = require('../../../../../../src/site/_transforms/service-worker-partials');

describe('service-worker-partials', function() {
  let $;

  beforeEach(function() {
    const fixture = `<html lang="en"><head><title>Test title</title><meta name="description" content="test description"><meta itemprop="image" content="https://example.com/image.png"><link rel="alternate" href="/feed.xml" type="application/atom+xml" data-title="web.dev feed"><link rel="canonical" href="https://web.dev/canonical-url/"></head><body><div id="content"><div class="guide-landing-page"><div>Hello</div></div><div>Bonus sibling</div</div></body></html>`;
    $ = cheerio.load(fixture);
  });

  afterEach(async function() {
    $ = null;
    await fs.rmdir(path.join('.', '.tmp'), {recursive: true});
  });

  describe('serviceWorkerPartials', function() {
    it('converts a string of html to a partial and writes it to disk', async function() {
      const expected = {
        description: $('meta[name="description"]').attr('content'),
        imageSrc: $('meta[itemprop="image"]').attr('content'),
        lang: $('html').attr('lang'),
        offline: false,
        raw: $('#content').html(),
        rss: $('link[type="application/atom+xml"]').attr('href'),
        title: $('title').text(),
        url: $('link[rel="canonical"]').attr('href'),
      };

      const hash = Math.random().toString(36);
      const outputPath = path.join('.', '.tmp', hash, 'index.html');
      await serviceWorkerPartials($.html(), outputPath);
      const actual = JSON.parse(
        await fs.readFile(outputPath.replace('.html', '.json'), 'utf-8'),
      );
      assert.deepStrictEqual(actual, expected);
    });

    it('is a noop if outputPath does not end in index.html', async function() {
      const actual = await serviceWorkerPartials($.html(), '/foo/bar/baz.njk');
      assert.deepStrictEqual(actual, $.html());
    });

    it("is a noop if outputPath is false because page doesn't have a permalink", async function() {
      const actual = await serviceWorkerPartials($.html(), false);
      assert.deepStrictEqual(actual, $.html());
    });
  });

  describe('getPartial', function() {
    it('returns a partial for index.html pages', function() {
      const actual = getPartial($.html());
      const expected = {
        description: $('meta[name="description"]').attr('content'),
        imageSrc: $('meta[itemprop="image"]').attr('content'),
        lang: $('html').attr('lang'),
        offline: false,
        raw: $('#content').html(),
        rss: $('link[type="application/atom+xml"]').attr('href'),
        title: $('title').text(),
        url: $('link[rel="canonical"]').attr('href'),
      };
      assert.deepStrictEqual(actual, expected);
    });

    it('sets offline to true when processing the offline page', function() {
      $('head').append(`<meta name="offline" content="true">`);
      const actual = getPartial($.html());
      const expected = {
        description: $('meta[name="description"]').attr('content'),
        imageSrc: $('meta[itemprop="image"]').attr('content'),
        lang: $('html').attr('lang'),
        offline: true,
        raw: $('#content').html(),
        rss: $('link[type="application/atom+xml"]').attr('href'),
        title: $('title').text(),
        url: $('link[rel="canonical"]').attr('href'),
      };
      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('writePartial', function() {
    it('writes a partial to disk', async function() {
      const expected = {
        description: $('meta[name="description"]').attr('content'),
        imageSrc: $('meta[itemprop="image"]').attr('content'),
        lang: $('html').attr('lang'),
        offline: false,
        raw: $('#content').html(),
        rss: $('link[type="application/atom+xml"]').attr('href'),
        title: $('title').text(),
        url: $('link[rel="canonical"]').attr('href'),
      };

      const hash = Math.random().toString(36);
      const outputPath = path.join('.', '.tmp', hash, 'index.json');
      await writePartial(outputPath, expected);
      const actual = JSON.parse(await fs.readFile(outputPath, 'utf-8'));
      assert.deepStrictEqual(actual, expected);
    });
  });
});
