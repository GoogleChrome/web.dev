/**
 * Returns the parent URL of a post. For example:
 * /en/blog/example-post -> /en/blog/
 *
 * @param {EleventyCollectionItem} post
 * @returns {string}
 */
function getPostParentUrl(post) {
  return `${post.data.page.filePathStem.split('/').slice(0, -2).join('/')}/`;
}

module.exports = {getPostParentUrl};
