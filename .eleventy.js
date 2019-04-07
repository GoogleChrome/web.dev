const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const helpers = require('./template-helpers');

const componentsDir = 'src/site/_includes/components';
const Aside = require(`./${componentsDir}/Aside.js`);

module.exports = function(config) {
  // Syntax highlighting for code snippets
  config.addPlugin(pluginSyntaxHighlight);

  // TODO: Add RSS plugin
  // https://github.com/11ty/eleventy-plugin-rss

  // Add shortcode components
  config.addPairedShortcode('Aside', Aside);

  // Return the three most recent blog posts.
  config.addCollection('recentPosts', function(collection) {
    return collection
      .getFilteredByTag('post')
      .reverse()
      .slice(0, 3);
  });

  config.addFilter('stripLanguage', function(url) {
    let urlParts = url.split('/');
    urlParts.splice(1, 1);
    return urlParts.join('/');
  });

  config.addShortcode('getGuidesCount', function(learningPath) {
    const count = learningPath.topics.reduce((guidesCount, topic) => {
      return guidesCount + topic.guides.length;
    }, 0);
    const label = count > 1 ? 'resources' : 'resource';
    return `${count} ${label}`;
  });

  config.addShortcode('nextGuideLink', function(page, paths) {
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

  config.addFilter('containsTag', function(article, tags) {
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
