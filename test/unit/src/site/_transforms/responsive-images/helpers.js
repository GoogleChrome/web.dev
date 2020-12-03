const assert = require('assert');
const site = require('../../../../../../src/site/_data/site');
const {
  determineImagePath,
} = require('../../../../../../src/site/_transforms/responsive-images/helpers');

describe('determineImagePath', function () {
  it('returns the original src if src contains a protocol', function () {
    let src = 'https://example.com/foo.jpg';
    let outputPath = 'dist/en/add-manifest/index.html';
    let actual = determineImagePath(src, outputPath);
    assert.deepStrictEqual(actual, {src, isLocal: false});

    src = 'http://example.com/foo.jpg';
    outputPath = 'dist/en/add-manifest/index.html';
    actual = determineImagePath(src, outputPath);
    assert.deepStrictEqual(actual, {src, isLocal: false});
  });

  it('returns an image CDN src if src is absolute', function () {
    const src = '/images/foo.jpg';
    const outputPath = 'dist/en/add-manifest/index.html';
    const actual = determineImagePath(src, outputPath);
    const url = new URL(src, site.imageCdn).href;
    assert.deepStrictEqual(actual, {
      src: url,
      isLocal: true,
    });
  });

  it('returns an image CDN src if src is relative', function () {
    let src = './foo.jpg';
    let outputPath = 'dist/en/add-manifest/index.html';
    let actual = determineImagePath(src, outputPath);
    let url = new URL('add-manifest/foo.jpg', site.imageCdn).href;
    assert.deepStrictEqual(actual, {
      src: url,
      isLocal: true,
    });

    src = 'foo.jpg';
    outputPath = 'dist/en/add-manifest/index.html';
    actual = determineImagePath(src, outputPath);
    url = new URL('add-manifest/foo.jpg', site.imageCdn);
    assert.deepStrictEqual(actual, {
      src: url.href,
      isLocal: true,
    });
  });

  it('returns the correct src for nested urls', function () {
    // The handbook section of the site is the only place where we nest urls.
    // e.g. web.dev/handbook/audience.
    const src = './foo.jpg';
    const outputPath = 'dist/en/handbook/audience/index.html';
    const actual = determineImagePath(src, outputPath);
    const url = new URL('handbook/audience/foo.jpg', site.imageCdn).href;
    assert.deepStrictEqual(actual, {
      src: url,
      isLocal: true,
    });
  });

  it('returns the correct src for pages without an outputPath', function () {
    // If a page has permalink: false, then it will not have an outputPath
    // but will still run through the transform and could throw if we don't
    // handle it correctly.
    const src = './foo.jpg';
    const outputPath = false;
    const actual = determineImagePath(src, outputPath);
    assert.deepStrictEqual(actual, {
      src: './foo.jpg',
      isLocal: true,
    });
  });
});
