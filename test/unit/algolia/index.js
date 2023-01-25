const {expect} = require('chai');

const {sizeOfJSONInBytes} = require('../../../shared/sizeOfJSONInBytes');
const {
  chunkAlgolia,
  maxChunkSizeInBytes,
  maxItemSizeInBytes,
  trimBytes,
} = require('../../../algolia');

// The trimming might not result in a string with the exact number of bytes,
// since it honors multi-byte characters. Rather than testing for an exact
// byte size, test that the trimmed object is within a small threshold.
const BYTE_THRESHOLD = 4;

/**
 * Returns the size in bytes of an UTF-8 encoded string.
 * (This differs from sizeOfJSONInBytes(), which stringifies the input first.)
 *
 * @param {string} str
 * @return {number}
 */
const sizeOfStringInBytes = (str) => {
  return Buffer.byteLength(str, 'utf8');
};

/**
 * Very simple mock of an AlgoliaItem, including some metadata, with an
 * approximate size of contentLengthInBytes, plus a 10 character title.
 *
 * @param {string} character
 * @param {number} contentLengthInBytes
 * @returns {AlgoliaItem}
 */
const createAlgoliaItem = (character, contentLengthInBytes) => {
  const characterSizeInBytes = sizeOfStringInBytes(character);

  // repeat() will automatically truncate any decimal values.
  const content = character.repeat(contentLengthInBytes / characterSizeInBytes);
  const title = character.repeat(10);

  return /** @type {AlgoliaItem} */ ({content, title});
};

describe('Algolia Unit Tests', function () {
  // a is 1 byte, é is 2 bytes, and 豊 is 3 bytes.
  // These tests confirm that trimming content using characters with various
  // underlying sizes happens within a threshold of the size of each character.
  for (const character of ['a', 'é', '豊']) {
    describe(`trimBytes for character '${character}'`, function () {
      it(`trims if the content is twice 'maxItemSizeInBytes'`, function () {
        const mockItem = createAlgoliaItem(character, maxItemSizeInBytes * 2);

        // Modify a copy of the mock item for later comparison.
        const trimmedItem = trimBytes(Object.assign({}, mockItem));
        const trimmedSizeInBytes = sizeOfJSONInBytes(trimmedItem);

        expect(
          Math.abs(trimmedSizeInBytes - maxItemSizeInBytes),
        ).to.be.lessThanOrEqual(BYTE_THRESHOLD);
        expect(trimmedItem).not.to.eql(mockItem);
      });

      it(`trims if the content is equal to 'maxItemSizeInBytes'`, function () {
        const mockItem = createAlgoliaItem(character, maxItemSizeInBytes);

        // Modify a copy of the mock item for later comparison.
        const trimmedItem = trimBytes(Object.assign({}, mockItem));
        const trimmedSizeInBytes = sizeOfJSONInBytes(trimmedItem);

        expect(
          Math.abs(trimmedSizeInBytes - maxItemSizeInBytes),
        ).to.be.lessThanOrEqual(BYTE_THRESHOLD);
        expect(trimmedItem).not.to.eql(mockItem);
      });

      it(`doesn't modify content if it's under 'maxItemSizeInBytes'`, function () {
        const mockItem = createAlgoliaItem(character, maxItemSizeInBytes / 2);

        // Modify a copy of the mock item for later comparison.
        const trimmedItem = trimBytes(Object.assign({}, mockItem));
        const trimmedSizeInBytes = sizeOfJSONInBytes(trimmedItem);

        expect(trimmedSizeInBytes).to.be.lessThanOrEqual(maxItemSizeInBytes);
        expect(trimmedItem).to.eql(mockItem);
      });
    });
  }

  describe('chunkAlgolia', function () {
    it('returns more than one array if bytes twice `maxItemSizeInBytes`', function () {
      const length = Math.ceil((maxChunkSizeInBytes * 2) / maxItemSizeInBytes);
      const mockItems = Array.from({length}, () =>
        createAlgoliaItem('a', maxItemSizeInBytes),
      );
      const chunkedmockItems = chunkAlgolia(mockItems);
      expect(chunkedmockItems.length).to.be.above(1);
    });

    it('returns one array if less than `maxItemSizeInBytes`', function () {
      const mockItems = [createAlgoliaItem('a', maxChunkSizeInBytes / 2)];
      const chunkedmockItems = chunkAlgolia(mockItems);
      expect(chunkedmockItems.length).to.be.equal(1);
    });

    it('throws error if an element is equal to `maxItemSizeInBytes`', function () {
      const mockItems = [createAlgoliaItem('a', maxChunkSizeInBytes)];
      expect(() => chunkAlgolia(mockItems)).to.throw();
    });

    it('throws error if an element is larger than `maxItemSizeInBytes`', function () {
      const mockItems = [createAlgoliaItem('a', maxChunkSizeInBytes * 2)];
      expect(() => chunkAlgolia(mockItems)).to.throw();
    });
  });
});
