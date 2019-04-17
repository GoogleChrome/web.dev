const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const slugify = require('slugify');

const componentsDir = 'src/site/_includes/components';
const {
  Actions,
  ShareAction,
  SubscribeAction,
} = require(`./${componentsDir}/Actions`);
const Article = require(`./${componentsDir}/Article`);
const ArticleNavigation = require(`./${componentsDir}/ArticleNavigation`);
const ArticleSmall = require(`./${componentsDir}/ArticleSmall`);
const Aside = require(`./${componentsDir}/Aside`);
const Author = require(`./${componentsDir}/Author`);
const AuthorInfo = require(`./${componentsDir}/AuthorInfo`);
const Breadcrumbs = require(`./${componentsDir}/Breadcrumbs`);
const Collection = require(`./${componentsDir}/Collection`);
const Compare = require(`./${componentsDir}/Compare`);

const collectionsDir = 'src/site/_collections';
const postDescending = require(`./${collectionsDir}/post-descending`);
const postsWithLighthouse = require(`./${collectionsDir}/posts-with-lighthouse`);
const recentPosts = require(`./${collectionsDir}/recent-posts`);

const filtersDir = 'src/site/_filters';
const pathSlug = require(`./${filtersDir}/path-slug`);
const containsTag = require(`./${filtersDir}/contains-tag`);
const githubLink = require(`./${filtersDir}/github-link`);
const postsLighthouseJson = require(`./${filtersDir}/posts-lighthouse-json`);
const prettyDate = require(`./${filtersDir}/pretty-date`);
const stripBlog = require(`./${filtersDir}/strip-blog`);
const stripLanguage = require(`./${filtersDir}/strip-language`);

module.exports = function(config) {
  //----------------------------------------------------------------------------
  // PLUGINS
  //----------------------------------------------------------------------------
  // Syntax highlighting for code snippets
  config.addPlugin(pluginSyntaxHighlight);
  // RSS feeds
  config.addPlugin(pluginRss);

  //----------------------------------------------------------------------------
  // MARKDOWN
  //----------------------------------------------------------------------------
  let markdownItOptions = {
    html: true,
  };
  let markdownItAnchorOptions = {
    level: 2,
    permalink: true,
    permalinkClass: 'w-headline-link',
    permalinkSymbol: '#',
    slugify: function(str) {
      return slugify(str, {
        replacement: '-',
        lower: true,
      });
    },
  };
  config.setLibrary(
    'md',
    markdownIt(markdownItOptions).use(markdownItAnchor, markdownItAnchorOptions)
  );

  //----------------------------------------------------------------------------
  // COLLECTIONS
  //----------------------------------------------------------------------------
  config.addCollection('postDescending', postDescending);
  config.addCollection('postsWithLighthouse', postsWithLighthouse);
  config.addCollection('recentPosts', recentPosts);

  //----------------------------------------------------------------------------
  // FILTERS
  //----------------------------------------------------------------------------
  config.addFilter('pathSlug', pathSlug);
  config.addFilter('containsTag', containsTag);
  config.addFilter('githubLink', githubLink);
  config.addFilter('postsLighthouseJson', postsLighthouseJson);
  config.addFilter('prettyDate', prettyDate);
  config.addFilter('stripBlog', stripBlog);
  config.addFilter('stripLanguage', stripLanguage);

  //----------------------------------------------------------------------------
  // SHORTCODES
  //----------------------------------------------------------------------------
  config.addPairedShortcode('Actions', Actions);
  config.addShortcode('Article', Article);
  config.addShortcode('ArticleNavigation', ArticleNavigation);
  config.addShortcode('ArticleSmall', ArticleSmall);
  config.addPairedShortcode('Aside', Aside);
  config.addShortcode('Author', Author);
  config.addShortcode('AuthorInfo', AuthorInfo);
  config.addShortcode('Breadcrumbs', Breadcrumbs);
  config.addShortcode('Collection', Collection);
  config.addPairedShortcode('Compare', Compare);
  config.addShortcode('ShareAction', ShareAction);
  config.addShortcode('SubscribeAction', SubscribeAction);

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
