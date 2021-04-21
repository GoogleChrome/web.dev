/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const chalk = require('chalk');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const yaml = require('js-yaml');

const toc = require('eleventy-plugin-toc');
const markdown = require('./src/site/_plugins/markdown');

const componentsDir = 'src/site/_includes/components';
const ArticleNavigation = require(`./${componentsDir}/ArticleNavigation`);
const Aside = require(`./${componentsDir}/Aside`);
const Assessment = require(`./${componentsDir}/Assessment`);
const Author = require(`./${componentsDir}/Author`);
const AuthorCard = require(`./${componentsDir}/AuthorCard`);
const AuthorInfo = require(`./${componentsDir}/AuthorInfo`);
const Banner = require(`./${componentsDir}/Banner`);
const Blockquote = require(`./${componentsDir}/Blockquote`);
const Breadcrumbs = require(`./${componentsDir}/Breadcrumbs`);
const CodelabsCallout = require(`./${componentsDir}/CodelabsCallout`);
const Codepen = require(`./${componentsDir}/Codepen`);
const Compare = require(`./${componentsDir}/Compare`);
const CompareCaption = require(`./${componentsDir}/CompareCaption`);
const Details = require(`./${componentsDir}/Details`);
const DetailsSummary = require(`./${componentsDir}/DetailsSummary`);
const EventTable = require(`./${componentsDir}/EventTable`);
const Glitch = require(`./${componentsDir}/Glitch`);
const Hero = require(`./${componentsDir}/Hero`);
const IFrame = require(`./${componentsDir}/IFrame`);
const {Img, generateImgixSrc} = require(`./${componentsDir}/Img`);
const Instruction = require(`./${componentsDir}/Instruction`);
const Label = require(`./${componentsDir}/Label`);
const Meta = require(`./${componentsDir}/Meta`);
const PathCard = require(`./${componentsDir}/PathCard`);
const PostCard = require(`./${componentsDir}/PostCard`);
const SignPosts = require(`./${componentsDir}/SignPosts`);
const StackOverflow = require(`./${componentsDir}/StackOverflow`);
const Tooltip = require(`./${componentsDir}/Tooltip`);
const {Video} = require(`./${componentsDir}/Video`);
const YouTube = require(`./${componentsDir}/YouTube`);

// Collections
const algolia = require('./src/site/_collections/algolia');
const authors = require(`./src/site/_collections/authors`);
const blogPostsDescending = require(`./src/site/_collections/blog-posts-descending`);
const newsletters = require(`./src/site/_collections/newsletters`);
const {
  postsWithLighthouse,
} = require(`./src/site/_collections/posts-with-lighthouse`);
const tags = require(`./src/site/_collections/tags`);

// Filters
const filtersDir = 'src/site/_filters';
const consoleDump = require(`./${filtersDir}/console-dump`);
const {i18n} = require(`./${filtersDir}/i18n`);
const {memoize, findByUrl} = require(`./${filtersDir}/find-by-url`);
const pathSlug = require(`./${filtersDir}/path-slug`);
const containsTag = require(`./${filtersDir}/contains-tag`);
const expandAuthors = require(`./${filtersDir}/expand-authors`);
const findTags = require(`./${filtersDir}/find-tags`);
const githubLink = require(`./${filtersDir}/github-link`);
const gitlocalizeLink = require(`./${filtersDir}/gitlocalize-link`);
const htmlDateString = require(`./${filtersDir}/html-date-string`);
const md = require(`./${filtersDir}/md`);
const pagedNavigation = require(`./${filtersDir}/paged-navigation`);
const postsLighthouseJson = require(`./${filtersDir}/posts-lighthouse-json`);
const prettyDate = require(`./${filtersDir}/pretty-date`);
const removeDrafts = require(`./${filtersDir}/remove-drafts`);
const slugify = require(`./${filtersDir}/slugify`);
const strip = require(`./${filtersDir}/strip`);
const stripBlog = require(`./${filtersDir}/strip-blog`);
const getPaths = require(`./${filtersDir}/get-paths`);
const navigation = require(`./${filtersDir}/navigation`);
const padStart = require(`./${filtersDir}/pad-start`);

const transformsDir = 'src/site/_transforms';
const disableLazyLoad = require(`./${transformsDir}/disable-lazy-load`);
const {responsiveImages} = require(`./${transformsDir}/responsive-images`);
const {purifyCss} = require(`./${transformsDir}/purify-css`);
const {minifyHtml} = require(`./${transformsDir}/minify-html`);

// Shared dependencies between web.dev and developer.chrome.com
const {updateSvgForInclude} = require('webdev-infra/filters/svg');
// TODO: We should migrate all of our ToCs over to using this filter which we
// wrote for d.c.c. Currently we're also using eleventy-plugin-toc on articles
// but this one seems to work better.
const {toc: courseToc} = require('webdev-infra/filters/toc');

module.exports = function (config) {
  console.log(chalk.black.bgGreen('Eleventy is building, please wait…'));
  const isProd = process.env.ELEVENTY_ENV === 'prod';
  const isStaging = process.env.ELEVENTY_ENV === 'staging';

  // ----------------------------------------------------------------------------
  // PLUGINS
  // ----------------------------------------------------------------------------
  // Syntax highlighting for code snippets
  config.addPlugin(pluginSyntaxHighlight);
  // RSS feeds
  config.addPlugin(pluginRss);
  config.addPlugin(toc, {
    tags: ['h2', 'h3'],
    wrapper: 'div',
    wrapperClass: 'w-toc__list',
    ul: true,
    flat: true,
  });

  // ----------------------------------------------------------------------------
  // MARKDOWN
  // ----------------------------------------------------------------------------
  config.setLibrary('md', markdown);

  // ----------------------------------------------------------------------------
  // NON-11TY FILES TO WATCH
  // ----------------------------------------------------------------------------
  config.addWatchTarget('./src/site/content/en/**/*.yml');

  // ----------------------------------------------------------------------------
  // COLLECTIONS
  // ----------------------------------------------------------------------------
  config.addCollection('algolia', algolia);
  config.addCollection('authors', authors);
  config.addCollection('blogPosts', blogPostsDescending);
  config.addCollection('newsletters', newsletters);
  config.addCollection('postsWithLighthouse', postsWithLighthouse);
  config.addCollection('tags', tags);
  // Turn collection.all into a lookup table so we can use findBySlug
  // to quickly find collection items without looping.
  config.addCollection('memoized', (collection) => {
    return memoize(collection.getAll());
  });

  // ----------------------------------------------------------------------------
  // FILTERS
  // ----------------------------------------------------------------------------
  config.addFilter('consoleDump', consoleDump);
  config.addFilter('i18n', i18n);
  config.addFilter('findByUrl', findByUrl);
  config.addFilter('findTags', findTags);
  config.addFilter('pathSlug', pathSlug);
  config.addFilter('containsTag', containsTag);
  config.addFilter('expandAuthors', expandAuthors);
  config.addFilter('githubLink', githubLink);
  config.addFilter('gitlocalizeLink', gitlocalizeLink);
  config.addFilter('htmlDateString', htmlDateString);
  config.addFilter('imgix', generateImgixSrc);
  config.addFilter('md', md);
  config.addFilter('navigation', navigation);
  config.addFilter('pagedNavigation', pagedNavigation);
  config.addFilter('postsLighthouseJson', postsLighthouseJson);
  config.addFilter('prettyDate', prettyDate);
  config.addFilter('removeDrafts', removeDrafts);
  config.addFilter('slugify', slugify);
  config.addFilter('stripBlog', stripBlog);
  config.addFilter('getPaths', getPaths);
  config.addFilter('strip', strip);
  config.addFilter('courseToc', courseToc);
  config.addFilter('updateSvgForInclude', updateSvgForInclude);
  config.addFilter('padStart', padStart);

  // ----------------------------------------------------------------------------
  // SHORTCODES
  // ----------------------------------------------------------------------------
  config.addShortcode('ArticleNavigation', ArticleNavigation);
  config.addPairedShortcode('Aside', Aside);
  config.addShortcode('Assessment', Assessment);
  config.addShortcode('Author', Author);
  config.addShortcode('AuthorCard', AuthorCard);
  config.addShortcode('AuthorInfo', AuthorInfo);
  config.addPairedShortcode('Banner', Banner);
  config.addPairedShortcode('Blockquote', Blockquote);
  config.addShortcode('Breadcrumbs', Breadcrumbs);
  config.addShortcode('CodelabsCallout', CodelabsCallout);
  config.addShortcode('Codepen', Codepen);
  config.addPairedShortcode('Compare', Compare);
  config.addPairedShortcode('CompareCaption', CompareCaption);
  config.addPairedShortcode('Details', Details);
  config.addPairedShortcode('DetailsSummary', DetailsSummary);
  config.addShortcode('Glitch', Glitch);
  config.addShortcode('Hero', Hero);
  config.addShortcode('IFrame', IFrame);
  config.addShortcode('Img', Img);
  config.addShortcode('Instruction', Instruction);
  config.addPairedShortcode('Label', Label);
  config.addShortcode('Meta', Meta);
  config.addShortcode('PathCard', PathCard);
  config.addShortcode('PostCard', PostCard);
  config.addShortcode('SignPosts', SignPosts);
  config.addShortcode('StackOverflow', StackOverflow);
  config.addShortcode('Tooltip', Tooltip);
  config.addShortcode('Video', Video);
  config.addShortcode('YouTube', YouTube);

  // This table is used for the web.dev/LIVE event, and should be taken down
  // when the event is over or we no longer use it.
  config.addShortcode('EventTable', EventTable);

  // ----------------------------------------------------------------------------
  // TRANSFORMS
  // ----------------------------------------------------------------------------
  if (process.env.PERCY) {
    config.addTransform('disable-lazy-load', disableLazyLoad);
  }

  if (isProd || isStaging) {
    config.addTransform('responsive-images', responsiveImages);
    config.addTransform('purifyCss', purifyCss);
    config.addTransform('minifyHtml', minifyHtml);
  }

  // ----------------------------------------------------------------------------
  // ELEVENTY OPTIONS
  // ----------------------------------------------------------------------------
  // https://www.11ty.io/docs/config/#data-deep-merge
  config.setDataDeepMerge(true);
  config.setUseGitIgnore(false);

  // Make .yml files work in the _data directory.
  config.addDataExtension('yml', (contents) => yaml.safeLoad(contents));

  return {
    dir: {
      input: 'src/site/content/', // we use a string path with the forward slash since windows doesn't like the paths generated from path.join
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
