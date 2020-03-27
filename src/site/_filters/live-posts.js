const {env} = require('../_data/site');

/**
 * Filter draft posts out from a collection.
 * @param {object} post An eleventy post object.
 * @return {boolean} Whether or not the post should go live.
 */
module.exports = function livePosts(post) {
  const today = new Date();
  today.setUTCHours(12, 0, 0, 0);
  if (post.date && post.date > today) {
    post.data.draft = true;
  }

  // If we're in dev mode, force draft posts to show up.
  if (env === 'dev') {
    return true;
  }

  return !post.data.draft;
};
