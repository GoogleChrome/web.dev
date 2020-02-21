const {findByUrl} = require("./find-by-url");

/**
 * Remove any draft posts from a learning path.
 * If a topic in a learning path contains only draft posts this will remove
 * the topic as well.
 * @param {Array} topics An array of posts inside of a learning path topic.
 * @param {string} lang Language of the page.
 * @return {Array}
 */
module.exports = function removeDrafts(topics, lang) {
  return topics.reduce((accumulator, topic) => {
    // Remove draft posts from a topic.
    const posts = topic.pathItems.filter((slug) => {
      return !findByUrl(`/${lang}/${slug}/`).data.draft;
    });
    // If all of the posts in a topic are drafts then don't add the topic
    // to the final TOC.
    if (!posts.length) {
      return accumulator;
    }
    accumulator.push(Object.assign({}, topic, {pathItems: posts}));
    return accumulator;
  }, []);
};
