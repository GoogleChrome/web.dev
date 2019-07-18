const now = new Date();

/**
 * Filter scheduled posts and draft posts out from a collection.
 * This function does produce a side-effect where it adds a draft flag to a
 * post if it's not scheduled to go live. This is so the page template can
 * add a meta noindex tag to the post.
 * @param {object} post An eleventy post object.
 * @return {boolean} Whether or not the post should go live.
 */
module.exports = function livePosts(post) {
  if (post.date > now) {
    post.data.draft = true;
  }

  return !post.data.draft;
};
