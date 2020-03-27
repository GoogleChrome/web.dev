const {env} = require('../_data/site');

/**
 * Filter draft posts out from a collection.
 * @param {object} post An eleventy post object.
 * @return {boolean} Whether or not the post should go live.
 */
module.exports = function livePosts(post) {
  const now = new Date();
  if (post.date > now) {
    post.data.draft = true;
  }

  // If we're in dev mode, force draft posts to show up.
  if (env === 'dev') {
    return true;
  }

  return !post.data.draft;
};
