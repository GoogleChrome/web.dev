const {assert} = require('../assert');
const loadFirebase = require('../../../../../src/lib/utils/firebase-loader');

describe('firebase-loader', function() {
  describe('loader', function() {
    it('should return a Promise', async function() {
      const p = loadFirebase();
      assert(p instanceof Promise);
      await p; // doesn't do anything, nothing requested

      const node = document.head.querySelector(
        'script[src^="//www.gstatic.com/firebasejs/"]',
      );
      assert(node === null, 'no firebase loads requested');
    });

    it('should not add multiple nodes', async function() {
      loadFirebase('app');
      let nodes = [];

      try {
        nodes = document.head.querySelector(
          'script[src^="//www.gstatic.com/firebasejs/"]',
        );
        assert(nodes.length === 1);

        loadFirebase('app', 'performance');
        nodes = document.head.querySelector(
          'script[src^="//www.gstatic.com/firebasejs/"]',
        );
        assert(nodes.length === 2, 'nodes should only contain one additional');
      } finally {
        // This isn't an async test, we don't check that the scripts actually
        // load, so just remove them immediately after run.
        nodes.forEach((node) => node.remove());
      }
    });

    it('should add script tags after invocation', function() {
      loadFirebase('app', 'performance', 'app');
      const nodes = document.head.querySelectorAll(
        'script[src^="//www.gstatic.com/firebasejs/"]',
      );
      try {
        assert(nodes.length === 2, 'JS should be added for uniques');
        assert(nodes[0].src.endsWith('-app.js'));
        assert(!nodes[0].async);
        assert(nodes[1].src.endsWith('-performance.js'));
        assert(!nodes[1].async);
      } finally {
        // This isn't an async test, we don't check that the scripts actually
        // load, so just remove them immediately after run.
        nodes.forEach((node) => node.remove());
      }
    });
  });
});
