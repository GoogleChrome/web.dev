const {assert} = require('./assert');
const {normalizeUrl} = require('../../../../src/lib/urls');

describe('urls', function() {
  describe('normalizeUrl', function() {
    it('should ignore empty searches', function() {
      assert(normalizeUrl('/foo?') == '/foo/', 'search should be ignored');
    });

    it('should ignore searches if they have an index.html', function() {
      assert(
        normalizeUrl('/foo?bar/index.html') == '/foo/?bar/index.html',
        'search should be ignored if it has index.html',
      );
    });

    it('should add a trailing slash if one is missing', function() {
      assert(normalizeUrl('/foo') == '/foo/', 'requires trailing slash');
    });

    it('should remove index.html', function() {
      assert(
        normalizeUrl('/zing/test/index.html') == '/zing/test/',
        'removes index.html',
      );
    });

    it('should ignore non-index.html pages', function() {
      assert(
        normalizeUrl('/test/hello.html') == '/test/hello.html',
        'ignores non-index.html HTML pages',
      );
    });
  });
});
