const fs = require("fs");
const path = require("path");
const yamlFont = require("yaml-front-matter");

const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPassthroughCopy("css");

  eleventyConfig.addShortcode("getTitleBySlug", function(inputPath, slug) {
    // TODO(robdodson): This may be expensive and slow. See if there's a way
    // to do this without hitting the disk, or at least do it async.
    // Maybe this should be a macro
    const file = fs.readFileSync(
      path.join(__dirname, path.dirname(inputPath), slug, "index.md"),
      "utf8"
    );
    return yamlFont.loadFront(file).title;
  });

  return {
    passthroughFileCopy: true
  };
};
