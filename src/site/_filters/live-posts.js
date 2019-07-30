/**
 * Filter draft posts out from a collection.
 * @param {object} post An eleventy post object.
 * @return {boolean} Whether or not the post should go live.
 */
module.exports = function livePosts(post) {
  // If we ever wanted to enable featured posts we could uncomment these lines.
  // See https://github.com/GoogleChrome/web.dev/pull/1222#issuecomment-516621561
  // for an explanation on why this feature is currently disabled.
  // const now = new Date();
  // if (post.date > now) {
  //   post.data.draft = true;
  // }

  return !post.data.draft;
};
