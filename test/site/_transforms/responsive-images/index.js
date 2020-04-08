const assert = require("assert");
const path = require("path");
const cheerio = require("cheerio");
const site = require("../../../../src/site/_data/site");
const {
  responsiveImages,
} = require("../../../../src/site/_transforms/responsive-images/index");

describe("responsive-images", function() {
  describe("responsiveImages", function() {
    let $;
    let $body;
    let $expected;
    let outputPath = "dist/en/add-manifest/index.html";
    const outputDir = path
      .dirname(outputPath)
      .split(path.sep)
      .pop();

    beforeEach(function() {
      $ = cheerio.load(`<html><head></head><body></body></html>`);
      $body = $("body");

      $expected = cheerio.load(`<html><head></head><body></body></html>`);
    });

    afterEach(function() {
      $ = null;
      $body = null;
      $expected = null;
    });

    it("is a noop if there are no images", function() {
      const actual = responsiveImages($.html(), outputPath);
      assert.deepStrictEqual(actual, $expected.html());
    });

    it("ignores images with a protocol", function() {
      $body.append(`<img src="https://example.com/foo.jpg">`);
      const actual = responsiveImages($.html(), outputPath);
      $expected("body").append('<img src="https://example.com/foo.jpg">');
      assert.deepStrictEqual(actual, $expected.html());
    });

    it("can handle more than one image with a protocol", function() {
      $body.append(
        `<img src="https://example.com/foo.jpg"><img src="https://example.com/bar.jpg">`,
      );
      const actual = responsiveImages($.html(), outputPath);
      $expected("body").append(
        `<img src="https://example.com/foo.jpg"><img src="https://example.com/bar.jpg"></img>`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it("uses the image CDN for absolute urls", function() {
      $body.append(`<img src="/images/foo.jpg">`);
      const actual = responsiveImages($.html(), outputPath);
      $expected("body").append(
        `<img src="${new URL("/images/foo.jpg", site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it("can handle more than one image with an absolute url", function() {
      $body.append(`<img src="/images/foo.jpg"><img src="/images/bar.jpg">`);
      const actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected("body").append(
        `<img src="${new URL("/images/foo.jpg", site.imageCdn)}"><img src="${new URL("/images/bar.jpg", site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it("uses the image CDN for relative urls", function() {
      $body.append(`<img src="./foo.jpg">`);
      let actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected("body").append(
        `<img src="${new URL(path.join(outputDir, "foo.jpg"), site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());

      $body.empty();
      $expected("body").empty();

      $body.append(`<img src="bar.jpg">`);
      actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected("body").append(
        `<img src="${new URL(path.join(outputDir, "bar.jpg"), site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it("can handle more than one image with relative urls", function() {
      $body.append(`<img src="./foo.jpg"><img src="bar.jpg">`);
      const actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected("body").append(
        `<img src="${new URL(path.join(outputDir, "foo.jpg"), site.imageCdn)}"><img src="${new URL(path.join(outputDir, "bar.jpg"), site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it("can handle handbook urls", function() {
      outputPath = "dist/en/handbook/audience/index.html";
      $body.append(`<img src="./foo.jpg"><img src="bar.jpg">`);
      const actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected("body").append(
        `<img src="${new URL(path.join("handbook", "audience", "foo.jpg"), site.imageCdn)}"><img src="${new URL(path.join("handbook", "audience", "bar.jpg"), site.imageCdn)}">`,
      );
      assert.deepStrictEqual(actual, $expected.html());
    });

    it("can handle pages with permalink: false", function() {
      outputPath = false;
      $body.append(`<img src="./foo.jpg">`);
      const actual = responsiveImages($.html(), outputPath);
      // prettier-ignore
      $expected("body").append(`<img src="./foo.jpg">`);
      assert.deepStrictEqual(actual, $expected.html());
    });
  });

  describe("helpers", function() {
    require("./helpers");
  });
});
