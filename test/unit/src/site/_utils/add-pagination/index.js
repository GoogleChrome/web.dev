const assert = require('assert');
const addPagination = require('../../../../../../src/site/_utils/add-pagination');

describe('add-pagination', function () {
  describe('addPagination', function () {
    function generateArray(n) {
      return [...Array(n)].map((_, index) => ({index}));
    }

    it('does not throw error for a valid `elements` argument', function () {
      const toPaginate = generateArray(1);
      assert.doesNotThrow(() => addPagination(toPaginate));
    });

    it('throws error for invalid `elements` arguments', function () {
      const invalidElements = [() => {}, {}, 1, 'string', null, undefined];

      invalidElements.forEach((arg) => assert.throws(() => addPagination(arg)));
    });

    it('does not throw error for a valid `additionalData` argument', function () {
      const toPaginate = generateArray(1);
      assert.doesNotThrow(() => addPagination(toPaginate, {}));
    });

    it('throws error for invalid `additionalData` arguments', function () {
      const toPaginate = generateArray(1);
      const invalidAdditionalData = [() => {}, 1, 'string'];

      invalidAdditionalData.forEach((arg) =>
        assert.throws(() => addPagination(toPaginate, arg)),
      );
    });

    it('returns 3 pages when given 68 elements', function () {
      const toPaginate = generateArray(68);
      const paginated = addPagination(toPaginate);
      assert.strictEqual(paginated.length, 3);
    });

    it('returns 4 pages when given 96 elements', function () {
      const toPaginate = generateArray(96);
      const paginated = addPagination(toPaginate);
      assert.strictEqual(paginated.length, 4);
    });

    it('returns pages with `additionalData` when `additionalData` passed in', function () {
      const toPaginate = generateArray(96);
      const href = '/blog/';
      const paginated = addPagination(toPaginate, {href});
      paginated.forEach((page) => {
        assert.strictEqual(page.href, href);
      });
    });
  });
});
