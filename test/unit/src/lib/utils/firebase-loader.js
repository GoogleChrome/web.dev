const {assert} = require('../assert');
const loader = require('../../../../../src/lib/utils/firebase-loader');

describe('firebase-loader', function() {
  describe('loader', function() {
    it('should be a function which returns a Promise', async function() {
      const load = loader();
      assert(typeof load === 'function');

      const p = load();
      assert(p instanceof Promise);
      await p; // doesn't do anything, nothing requested

      const node = document.head.querySelector(
        'script[src^="//www.gstatic.com/firebasejs/"]',
      );
      assert(node === null, 'no firebase loads requested');
    });

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
        // This isn't an async test, we don't check that the scripts actually
        // load, so just remove them immediately after run.
        nodes.forEach((node) => node.remove());
      }
    });
  });
});
