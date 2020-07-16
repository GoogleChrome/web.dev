/**
 * Filters-in posts that have the same lang attribute as requested.
 * @param {Array} posts An array of posts.
 * @param {string} lang Target language.
 */
module.exports = function filterByLang(posts, lang) {
  if (!lang) {
    return posts;
  }
  return posts.filter((post) => lang === (post.data && post.data.lang));
};
