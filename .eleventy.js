const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const helpers = require('./template-helpers');

const componentsDir = 'src/site/_includes/components';
const Aside = require(`./${componentsDir}/Aside`);
const Breadcrumbs = require(`./${componentsDir}/Breadcrumbs`);
const Collection = require(`./${componentsDir}/Collection`);

const collectionsDir = 'src/site/_collections';
const postsWithLighthouse = require(`./${collectionsDir}/posts-with-lighthouse`);
const recentPosts = require(`./${collectionsDir}/recent-posts`);

const filtersDir = 'src/site/_filters';
const collectionSlug = require(`./${filtersDir}/collection-slug`);
const containsTag = require(`./${filtersDir}/contains-tag`);
const postsLighthouseJson = require(`./${filtersDir}/posts-lighthouse-json`);
const stripLanguage = require(`./${filtersDir}/strip-language`);

module.exports = function(config) {
  // Allow data to merge down the cascade.
  // For example, if you create a directory .json that contains
  // tags: ["posts"] then every file in the directory will inherit this
  // property and it will be *combined with* any tags the individual posts
  // define. So a post defining its own tags: ["foo"] would end up with
  // tags: ["posts", "foo"].
  // https://www.11ty.io/docs/config/#data-deep-merge
  config.setDataDeepMerge(true);
  
  // Syntax highlighting for code snippets
  config.addPlugin(pluginSyntaxHighlight);

  // TODO: Add RSS plugin
  // https://github.com/11ty/eleventy-plugin-rss

  //----------------------------------------------------------------------------
  // COLLECTIONS
  //----------------------------------------------------------------------------
  config.addCollection('postsWithLighthouse', postsWithLighthouse);
  config.addCollection('recentPosts', recentPosts);

  //----------------------------------------------------------------------------
  // FILTERS
  //----------------------------------------------------------------------------
  config.addFilter('collectionSlug', collectionSlug);
  config.addFilter('containsTag', containsTag);
  config.addFilter('postsLighthouseJson', postsLighthouseJson);
  config.addFilter('stripLanguage', stripLanguage);

  //----------------------------------------------------------------------------
  // SHORTCODES
  //----------------------------------------------------------------------------
  config.addPairedShortcode('Aside', Aside);
  config.addShortcode('Breadcrumbs', Breadcrumbs);
  config.addShortcode('Collection', Collection);

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
