const path = require("path");

const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const helpers = require("./templateHelpers");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPassthroughCopy("css");

  eleventyConfig.addShortcode("nextGuideLink", function(page, paths) {
    const collection = helpers.getCollectionName(page);
    if (collection && paths[collection]) {
      const guides = helpers.getGuidesFromTopics(paths[collection].topics);
      const nextIndex = guides.indexOf(page.fileSlug) + 1;
      if (nextIndex && nextIndex < guides.length) {
        const nextUrl = `/${paths[collection].basePath}${guides[nextIndex]}/`;
        return nextUrl;
      }
      return '';
    }
  });

  return {
    passthroughFileCopy: true
  };
};
