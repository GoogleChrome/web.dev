const chalk = require('chalk');
const warn = chalk.black.bgYellow;

let memo;

/**
 * Memoize an eleventy collection into a hash for faster lookups.
 * Important: Memoization assumes that all post slugs are unique.
 * @param {Array<Object>} collection An eleventy collection.
 * Typically collections.all
 * @return {Array<Object>} The original collection. We return this to make
 * eleventy.addCollection happy since it expects a collection of some kind.
 */
const memoize = (collection) => {
  if (memo && Object.keys(memo).length) {
    /* eslint-disable-next-line */
    console.warn(warn(`Overwriting existing memoized collection!`));
  }

  memo = {};
  collection.forEach((item) => {
    if (memo[item.fileSlug]) {
      throw new Error(`Found duplicate post slug: '${item.fileSlug}'`);
    }

    memo[item.fileSlug] = item;
  });

  // Just return the collection back to eleventy.
  return collection;
};

/**
 * Look up a post by its slug.
 * Requires that the collection the post lives in has already been memoized.
 * @param {string} slug The post slug to look up.
 * @return {Object} An eleventy collection item.
 */
const findBySlug = (slug) => {
  if (!slug) {
    throw new Error(`slug is either null or undefined`);
  }

  if (!memo) {
    throw new Error(`No collection has been memoized yet.`);
  }

  const found = memo[slug];
  if (!found) {
    throw new Error(`Could not find post with slug: ${slug}`);
  }

  return found;
};

module.exports = {memoize, findBySlug};
