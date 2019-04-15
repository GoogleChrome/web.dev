/**
 * Strip the 'blog' part from input paths.
 * This is used to create permalinks for blog posts that live in /blog/*.
 * @param {string} inputPath The inputPath to filter.
 * @return {string}
 */
module.exports = (inputPath) => {
  // inputPath from eleventy will look like this:
  // "./src/site/content/en/blog/test-post/index.md"

  // Find the content dir.
  const parts = inputPath.split('/');
  const startIdx = parts.indexOf('content');

  // Chop off the content dir.
  // Filter out the blog dir and post markdown file.
  // This should leave en/<post-slug>.
  return parts
    .slice(startIdx + 1)
    .filter((part) => part !== 'blog' && part !== 'index.md')
    .join('/');
};
