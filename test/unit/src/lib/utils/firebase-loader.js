const {assert} = require('../assert');
const loader = require('../../../../../src/lib/utils/firebase-loader');

describe('firebase-loader', function() {
  describe('loader', function() {
    it('should not add script tags on loader', function() {
      loader('app');
      const node = document.head.querySelector(
        'script[src^="//www.gstatic.com/firebasejs/"]',
      );
      assert(node === null, 'node should not be created yet');
    });

    it('should add script tags after invocation', function() {
      const helper = loader('app', 'performance', 'app');
      helper();
      const nodes = document.head.querySelectorAll(
        'script[src^="//www.gstatic.com/firebasejs/"]',
      );
      try {
        assert(nodes.length === 2, 'JS should be added for uniques');
        assert(nodes[0].src.endsWith('-app.js'));
        assert(nodes[1].src.endsWith('-performance.js'));
      } finally {
        nodes.forEach((node) => node.remove());
      }
    });
  });
});
