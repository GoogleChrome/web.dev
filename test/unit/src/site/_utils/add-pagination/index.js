const assert = require('assert');
const addPagination = require('../../../../../../src/site/_utils/add-pagination');

describe('add-pagination', function() {
  describe('addPagination', function() {
    function generateArray(n) {
      return [...Array(n)].map((_, index) => ({index}));
    }

    it('does not throw error for a valid argument', function() {
      const toPaginate = generateArray(1);
      assert.doesNotThrow(() => addPagination(toPaginate));
    });

    it('throws error for invalid arguments', function() {
      const invalidArguments = [{}, 1, 'string', null, undefined];

      invalidArguments.forEach((invalidArgument) =>
        assert.throws(() => addPagination(invalidArgument)),
      );
    });

    it('returns 3 pages when given 68 elements', function() {
      const toPaginate = generateArray(68);
      const paginated = addPagination(toPaginate);
      assert.strictEqual(paginated.length, 3);
    });

    it('returns 4 pages when given 96 elements', function() {
      const toPaginate = generateArray(96);
      const paginated = addPagination(toPaginate);
      assert.strictEqual(paginated.length, 4);
    });
  });
});
