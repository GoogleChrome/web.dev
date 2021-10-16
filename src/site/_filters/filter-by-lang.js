const {defaultLocale} = require('../_data/site');
const {getDefaultUrl} = require('../_filters/urls');
/**
 * Filters-in posts that have the same lang attribute as requested.
 * @param {EleventyCollectionItem[]} posts An array of posts.
 * @param {string} [lang] Target language.
 * @return {EleventyCollectionItem[]}
 */
module.exports = function filterByLang(posts, lang = defaultLocale) {
  /** @type Map<string, EleventyCollectionItem> */
  const filteredPosts = new Map();
  for (const post of posts) {
    if (post.data && [lang, defaultLocale].includes(post.data.lang)) {
      const defaultUrl = getDefaultUrl(post.url);
      if (filteredPosts.has(defaultUrl) && post.data.lang === lang) {
        filteredPosts.set(defaultUrl, post);
      } else if (!filteredPosts.has(defaultUrl)) {
        filteredPosts.set(defaultUrl, post);
      }
    }
  }
  return Array.from(filteredPosts.values()).sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
};
