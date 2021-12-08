const byteof = require('byteof');
const {expect} = require('chai');

const {
  chunkAlgolia,
  maxChunkSizeInBytes,
  maxItemSizeInBytes,
  trimBytes,
} = require('../../../algolia');

/**
 * Very simple to mock dummy object, only accepts even byte sizes.
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
      const dummyItemSize = maxItemSizeInBytes * 2;
      const dummyItem = createAlgoliaItem(dummyItemSize);
      expect(byteof(dummyItem)).to.equal(dummyItemSize);

      const trimmedItem = trimBytes(dummyItem);
      expect(byteof(trimmedItem)).to.equal(maxItemSizeInBytes);
    });

    it('trims content if bytes equal to `maxItemSizeInBytes`', function () {
      const dummyItem = createAlgoliaItem(maxItemSizeInBytes);
      expect(byteof(dummyItem)).to.equal(maxItemSizeInBytes);

      const trimmedItem = trimBytes(dummyItem);
      expect(byteof(trimmedItem)).to.equal(maxItemSizeInBytes);
    });

    it("doesn't modify content if bytes under `maxItemSizeInBytes`", function () {
      const dummyItemSize = maxItemSizeInBytes - 2;
      const dummyItem = createAlgoliaItem(dummyItemSize);
      expect(byteof(dummyItem)).to.equal(dummyItemSize);

      const trimmedItem = trimBytes(dummyItem);
      expect(byteof(trimmedItem)).to.equal(dummyItemSize);
      expect(trimmedItem).to.equal(dummyItem);
    });
  });

  describe('chunkAlgolia', function () {
    it('returns more than one array if bytes twice `maxItemSizeInBytes`', function () {
      const length = Math.ceil((maxChunkSizeInBytes * 2) / maxItemSizeInBytes);
      const dummyItems = Array.from({length}, () =>
        createAlgoliaItem(maxItemSizeInBytes),
      );
      const chunkedDummyItems = chunkAlgolia(dummyItems);
      expect(chunkedDummyItems.length).to.be.above(1);
    });

    it('returns one array if less than `maxItemSizeInBytes`', function () {
      const dummyItems = [createAlgoliaItem(maxChunkSizeInBytes - 2)];
      const chunkedDummyItems = chunkAlgolia(dummyItems);
      expect(chunkedDummyItems.length).to.be.equal(1);
    });

    it('throws error if an element is equal to `maxItemSizeInBytes`', function () {
      const dummyItems = [createAlgoliaItem(maxChunkSizeInBytes)];
      expect(() => chunkAlgolia(dummyItems)).to.throw();
    });

    it('throws error if an element is larger than `maxItemSizeInBytes`', function () {
      const dummyItems = [createAlgoliaItem(maxChunkSizeInBytes * 2)];
      expect(() => chunkAlgolia(dummyItems)).to.throw();
    });
  });
});
