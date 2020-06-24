const assert = require('assert');
const path = require('path');
const cheerio = require('cheerio');
const site = require('../../../../../../src/site/_data/site');
const {
  responsiveImages,
} = require('../../../../../../src/site/_transforms/responsive-images');

describe('responsive-images', function () {
  describe('responsiveImages', function () {
    let $;
    let $body;
    let $expected;
    let outputPath;
    let outputDir;

    beforeEach(function () {
      $ = cheerio.load('<html><head></head><body></body></html>');
      $body = $('body');

      $expected = cheerio.load('<html><head></head><body></body></html>');
    });

    afterEach(function () {
      $ = null;
      $body = null;
      $expected = null;
      outputPath = 'dist/en/add-manifest/index.html';
      outputDir = path.dirname(outputPath).split(path.sep).pop();
    });

    it('is a noop if there is no output path', function () {
      outputPath = false;
      $body.append('<img src="./foo.jpg">');
      const actual = responsiveImages($.html(), outputPath);
      $expected('body').append('<img src="./foo.jpg">');
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('is a noop if the file is not an html file', function () {
      const actual = responsiveImages('{"foo": "bar"}', 'dist/en/foo.json');
      assert.deepStrictEqual(actual, '{"foo": "bar"}');
    });

    it('is a noop if there are no images', function () {
      const actual = responsiveImages($.html(), outputPath);
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('ignores images with a protocol', function () {
      $body.append('<img src="https://example.com/foo.jpg">');
      const actual = responsiveImages($.html(), outputPath);
      $expected('body').append('<img src="https://example.com/foo.jpg">');
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('can handle more than one image with a protocol', function () {
      $body.append(
        '<img src="https://example.com/foo.jpg"><img src="https://example.com/bar.jpg">',
      );
      const actual = responsiveImages($.html(), outputPath);
      $expected('body').append(
        '<img src="https://example.com/foo.jpg"><img src="https://example.com/bar.jpg"></img>',
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('uses the image CDN for absolute urls', function () {
      $body.append('<img src="/images/foo.jpg">');
      const actual = responsiveImages($.html(), outputPath);
      $expected('body').append(
        `<img src="${new URL('/images/foo.jpg', site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('can handle more than one image with an absolute url', function () {
      $body.append('<img src="/images/foo.jpg"><img src="/images/bar.jpg">');
      const actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected('body').append(
        `<img src="${new URL('/images/foo.jpg', site.imageCdn)}"><img src="${new URL('/images/bar.jpg', site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('uses the image CDN for relative urls', function () {
      $body.append('<img src="./foo.jpg">');
      let actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected('body').append(
        `<img src="${new URL(path.join(outputDir, 'foo.jpg'), site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());

      $body.empty();
      $expected('body').empty();

      $body.append('<img src="bar.jpg">');
      actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected('body').append(
        `<img src="${new URL(path.join(outputDir, 'bar.jpg'), site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('can handle more than one image with relative urls', function () {
      $body.append('<img src="./foo.jpg"><img src="bar.jpg">');
      const actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected('body').append(
        `<img src="${new URL(path.join(outputDir, 'foo.jpg'), site.imageCdn)}"><img src="${new URL(path.join(outputDir, 'bar.jpg'), site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('can handle nested urls', function () {
      outputPath = 'dist/en/handbook/audience/index.html';
      $body.append('<img src="./foo.jpg"><img src="bar.jpg">');
      const actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected('body').append(
        `<img src="${new URL(path.join('handbook', 'audience', 'foo.jpg'), site.imageCdn)}"><img src="${new URL(path.join('handbook', 'audience', 'bar.jpg'), site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it('uses the new src for images with preexisting srcset', function () {
      $body.append(
        '<img src="./foo.jpg" srcset="./foo.jpg?w=1024 1024w, ./foo.jpg?w=640 640w, ./foo.jpg?w=320 320w" sizes="100vw">',
      );
      const actual = responsiveImages($.html(), outputPath);
      const base = new URL(outputDir + '/', site.imageCdn);
      const src = new URL('./foo.jpg', base);
      const large = new URL('./foo.jpg', base);
      const medium = new URL('./foo.jpg', base);
      const small = new URL('./foo.jpg', base);
      $expected('body').append(
        `<img src="${src}" srcset="${large}?w=1024 1024w, ${medium}?w=640 640w, ${small}?w=320 320w" sizes="100vw">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });
  });

  describe('helpers', function () {
    require('./helpers');
  });
});
