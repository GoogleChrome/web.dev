const path = require('path');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const helpers = require('./templateHelpers');

module.exports = function(eleventyConfig) {
  // Syntax highlighting for code snippets
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // TODO: Add RSS plugin
  // https://github.com/11ty/eleventy-plugin-rss

  // Return the three most recent blog posts.
  eleventyConfig.addCollection('recentPosts', function(collection) {
    return collection
      .getFilteredByTag('post')
      .reverse()
      .slice(0, 3);
  });

  eleventyConfig.addFilter('stripLanguage', function(url) {
    let urlParts = url.split('/');
    urlParts.splice(1, 1);
    return urlParts.join('/');
  });

  eleventyConfig.addShortcode('getGuidesCount', function(learningPath) {
    const count = learningPath.topics.reduce((guidesCount, topic) => {
      return guidesCount + topic.guides.length;
    }, 0);
    const label = count > 1 ? 'resources' : 'resource';
    return `${count} ${label}`;
  });

  eleventyConfig.addShortcode('nextGuideLink', function(page, paths) {
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

  eleventyConfig.addFilter('containsTag', function(article, tags) {
    return article.data.tags && tags.filter(tag => article.data.tags.indexOf(tag) > -1).length > 0;
  });

  // https://www.11ty.io/docs/config/#configuration-options
  return {
    dir: {
      input: 'src/site/content',
      output: 'dist',
      data: '../_data',
      includes: '../_includes',
    },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    // Because eleventy's passthroughFileCopy does not work with permalinks
    // we need to manually copy assets ourselves using gulp.
    // https://github.com/11ty/eleventy/issues/379
    passthroughFileCopy: false,
  };
};
