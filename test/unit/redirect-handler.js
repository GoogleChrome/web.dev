/**
 * @fileoverview Tests for the redirect-handler used by the server.
 */

const assert = require('assert');
const {
  baseUrlPrefix,
  ensureTrailingSlashOnly,
  prepareHandler,
} = require('../../redirect-handler');

const sharedYamlSource = `
redirects:
- from: /subscribe
  to: /newsletter

- from: /subscribe/all/...
  to: /newsletter

- from: /foo/...
  to: /bar/...

- from: /external/...
  to: https://google.com/...
`;

describe('redirect-handler', function () {
  it('normalizes paths', function () {
    assert.equal(ensureTrailingSlashOnly('/foo/index.html'), '/foo/');
    assert.equal(
      ensureTrailingSlashOnly('/foo/index.HTML'),
      '/foo/index.HTML/',
      'must only match lower-case index.html',
    );
    assert.strictEqual(ensureTrailingSlashOnly(''), '/');
  });

  it('handles simple redirects', function () {
    const h = prepareHandler(sharedYamlSource, 'https://web.dev');

    assert.strictEqual(h('/subscribe'), '/newsletter');
    assert.strictEqual(
      h('/subscribe/index.html'),
      '/newsletter',
      'trailing index.html is ignored',
    );
    assert.strictEqual(
      h('/subscribe/other.html'),
      null,
      'unhandled URL returns null',
    );
  });

  it('handles group redirects', function () {
    const h = prepareHandler(sharedYamlSource, 'https://web.dev');

    assert.strictEqual(
      h('/subscribe/all/foo'),
      '/newsletter',
      'group => non-group redirect',
    );
    assert.strictEqual(
      h('/foo/x'),
      '/bar/x/',
      'group redirect functions, trailing slash added',
    );
    assert.strictEqual(
      h('/foo/x/index.html'),
      '/bar/x/',
      'index.html is stripped',
    );
    assert.strictEqual(
      h('/external/hello'),
      'https://google.com/hello/',
      'external redirect is also normalized',
    );
    assert.strictEqual(h('/external/'), 'https://google.com/');
    assert.strictEqual(
      h('/external'),
      'https://google.com/',
      'matches without trailing slash',
    );
  });

  it('includes query strings', function () {
    const h = prepareHandler(sharedYamlSource, 'https://web.dev');

    assert.strictEqual(h('/subscribe/?foo'), '/newsletter?foo=');
    assert.strictEqual(h('/subscribe/?foo=1&foo=2'), '/newsletter?foo=1&foo=2');
  });

  it('has the expected baseUrl', function () {
    assert.strictEqual(baseUrlPrefix, 'https://web.dev/');
  });
});
