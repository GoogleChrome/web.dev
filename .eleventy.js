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
      const nextSlug = (nextIndex && nextIndex < guides.length) ? `${guides[nextIndex]}/` : '';
      const nextUrl = `/${paths[collection].basePath}${nextSlug}`;
      return nextUrl;
    }
    return '';
  });

  return {
    passthroughFileCopy: true
  };
};
