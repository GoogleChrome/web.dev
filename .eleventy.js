const path = require("path");

const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const helpers = require("./templateHelpers");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPassthroughCopy("css");

  eleventyConfig.addShortcode("getTitleBySlug", function(inputPath, slug) {
    return helpers.getTitleBySlug(
      path.join(__dirname, path.dirname(inputPath), slug, "index.md"),
      slug)
  });

  eleventyConfig.addShortcode("nextGuideLink", function(page, paths) {
    const collection = helpers.getCollectionName(page);
    if (collection && paths[collection]) {
      const guides = helpers.getGuidesFromTopics(paths[collection].topics);
      const nextIndex = guides.indexOf(page.fileSlug) + 1;
      const nextSlug = (nextIndex && nextIndex < guides.length) ? guides[nextIndex] : '';
      const nextTitle = helpers.getTitleBySlug(
        path.join(paths[collection].basePath, nextSlug, "index.md"),
        nextSlug);
      const header = nextSlug !== '' ? `<div class="cta-next-guide__heading">Next guide</div>` : '';
      return `${header}
        <a class="cta-next-guide__link gc-analytics-event"
          data-category="web.dev"
          data-label="guide, next guide"
          data-action="click"
          href="/${paths[collection].basePath}/${nextSlug}">
          ${nextTitle}
        </a>`;
    }
    return '';
  });

  return {
    passthroughFileCopy: true
  };
};
