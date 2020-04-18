const {env} = require('../_data/site');

/**
 * Filter scheduled and draft posts out from a collection.
 * @param {object} post An eleventy post object.
 * @return {boolean} Whether or not the post should go live.
 */
module.exports = function livePosts(post) {
  if (!post.date) {
    throw new Error(`${post.inputPath} did not specificy a date.`);
  }

  if (!post.data) {
    throw new Error(
      `${post.inputPath} does not have a data object. Are you sure it's a post?`,
    );
  }

  // If we're in dev mode, force all posts to show up.
  if (env === 'dev') {
    return true;
  }

  // Scheduled posts.
  // If a post has a future date it will automatically be set to `draft: true`.
  // When the date arrives, our daily GitHub Action that publishes the site
  // should pickup the new post and publish it.
  // This action runs at around 7am PST.
  const now = new Date();
  if (post.date && post.date > now) {
    post.data.draft = true;
  }

  // Draft posts.
  // If a post has the `draft: true` flag set then it *will* generate a file
  // but it won't be crawlable or show up as part of the site.
  return !post.data.draft;
};
