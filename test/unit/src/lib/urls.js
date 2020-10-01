const {assert} = require('./assert');
const {normalizeUrl} = require('../../../../src/lib/urls');

describe('urls', function () {
  describe('normalizeUrl', function () {
    it('should ignore empty searches', function () {
      assert(normalizeUrl('/foo?') === '/foo/', 'search should be ignored');
    });

    it('should ignore searches if they have an index.html', function () {
      assert(
        normalizeUrl('/foo?bar/index.html') === '/foo/?bar/index.html',
        'search should be ignored if it has index.html',
      );
    });

    it('should add a trailing slash if one is missing', function () {
      assert(normalizeUrl('/foo') === '/foo/', 'requires trailing slash');
    });

    it('should remove index.html', function () {
      assert(
        normalizeUrl('/zing/test/index.html') === '/zing/test/',
        'removes index.html',
      );
    });

    it('should ignore non-index.html pages', function () {
      assert(
        normalizeUrl('/test/hello.html') === '/test/hello.html',
        'ignores non-index.html HTML pages',
      );
    });

    it('should remove extra slashes', function () {
      assert(normalizeUrl('///foo') === '/foo/', 'removes extra slashes');
      assert(
        normalizeUrl('/foo///bar//') === '/foo/bar/',
        'removes extra slashes',
      );
    });

    it('should do nothing to valid URLs', function () {
      assert(
        normalizeUrl('/foo/?query=123&other') === '/foo/?query=123&other',
        'retains query string',
      );
      assert(normalizeUrl('/foo/') === '/foo/', 'does nothing');
      assert(
        normalizeUrl('/foo/page.html') === '/foo/page.html',
        'does nothing to non-index.html',
      );
      assert(normalizeUrl('/') === '/', 'does nothing');
      assert(
        normalizeUrl('/foo/bar/hello/') === '/foo/bar/hello/',
        'does nothing to long path',
      );
    });
  });
});
