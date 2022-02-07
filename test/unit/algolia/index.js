const byteof = require('byteof');
const {expect} = require('chai');

const {
  chunkAlgolia,
  maxChunkSizeInBytes,
  maxItemSizeInBytes,
  trimBytes,
} = require('../../../algolia');

/**
 * Very simple to mock an object, only accepts even byte sizes.
 * @param {number} length
 * @returns {AlgoliaItem}
 */
const createAlgoliaItem = (length) => {
  if (length % 2 !== 0) {
    throw new Error('Please only input even numbers into this function');
  }
  length = length / 2;
  const content = Array.from({length}, () => 'a').join('');
  return /** @type {AlgoliaItem} */ ({content});
};

describe('algolia', function () {
  describe('trimBytes', function () {
    it('trims content if bytes twice `maxItemSizeInBytes`', function () {
      const mockItemSize = maxItemSizeInBytes * 2;
      const mockItem = createAlgoliaItem(mockItemSize);
      expect(byteof(mockItem)).to.equal(mockItemSize);

      const trimmedItem = trimBytes(mockItem);
      expect(byteof(trimmedItem)).to.equal(maxItemSizeInBytes);
    });

    it('trims content if bytes equal to `maxItemSizeInBytes`', function () {
      const mockItem = createAlgoliaItem(maxItemSizeInBytes);
      expect(byteof(mockItem)).to.equal(maxItemSizeInBytes);

      const trimmedItem = trimBytes(mockItem);
      expect(byteof(trimmedItem)).to.equal(maxItemSizeInBytes);
    });

    it("doesn't modify content if bytes under `maxItemSizeInBytes`", function () {
      const mockItemSize = maxItemSizeInBytes - 2;
      const mockItem = createAlgoliaItem(mockItemSize);
      expect(byteof(mockItem)).to.equal(mockItemSize);

      const trimmedItem = trimBytes(mockItem);
      expect(byteof(trimmedItem)).to.equal(mockItemSize);
      expect(trimmedItem).to.equal(mockItem);
    });
  });

  describe('chunkAlgolia', function () {
    it('returns more than one array if bytes twice `maxItemSizeInBytes`', function () {
      const length = Math.ceil((maxChunkSizeInBytes * 2) / maxItemSizeInBytes);
      const mockItems = Array.from({length}, () =>
        createAlgoliaItem(maxItemSizeInBytes),
      );
      const chunkedmockItems = chunkAlgolia(mockItems);
      expect(chunkedmockItems.length).to.be.above(1);
    });

    it('returns one array if less than `maxItemSizeInBytes`', function () {
      const mockItems = [createAlgoliaItem(maxChunkSizeInBytes - 2)];
      const chunkedmockItems = chunkAlgolia(mockItems);
      expect(chunkedmockItems.length).to.be.equal(1);
    });

    it('throws error if an element is equal to `maxItemSizeInBytes`', function () {
      const mockItems = [createAlgoliaItem(maxChunkSizeInBytes)];
      expect(() => chunkAlgolia(mockItems)).to.throw();
    });

    it('throws error if an element is larger than `maxItemSizeInBytes`', function () {
      const mockItems = [createAlgoliaItem(maxChunkSizeInBytes * 2)];
      expect(() => chunkAlgolia(mockItems)).to.throw();
    });
  });
});
