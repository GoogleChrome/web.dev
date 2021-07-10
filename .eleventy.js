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
const fs = require('fs');

const toc = require('eleventy-plugin-toc');
const markdown = require('./src/site/_plugins/markdown');

const ArticleNavigation = require('./src/site/_includes/components/ArticleNavigation');
const Aside = require('./src/site/_includes/components/Aside');
const Assessment = require('./src/site/_includes/components/Assessment');
const Author = require('./src/site/_includes/components/Author');
const AuthorInfo = require('./src/site/_includes/components/AuthorInfo');
const AuthorsDate = require('./src/site/_includes/components/AuthorsDate');
const Banner = require('./src/site/_includes/components/Banner');
const Blockquote = require('./src/site/_includes/components/Blockquote');
const Breadcrumbs = require('./src/site/_includes/components/Breadcrumbs');
const CodelabsCallout = require('./src/site/_includes/components/CodelabsCallout');
const Codepen = require('./src/site/_includes/components/Codepen');
const Compare = require('./src/site/_includes/components/Compare');
const CompareCaption = require('./src/site/_includes/components/CompareCaption');
const Details = require('./src/site/_includes/components/Details');
const DetailsSummary = require('./src/site/_includes/components/DetailsSummary');
const EventTable = require('./src/site/_includes/components/EventTable');
const Glitch = require('./src/site/_includes/components/Glitch');
const Hero = require('./src/site/_includes/components/Hero');
const IFrame = require('./src/site/_includes/components/IFrame');
const {Img, generateImgixSrc} = require('./src/site/_includes/components/Img');
const Instruction = require('./src/site/_includes/components/Instruction');
const Label = require('./src/site/_includes/components/Label');
const Meta = require('./src/site/_includes/components/Meta');
const PathCard = require('./src/site/_includes/components/PathCard');
const SignPosts = require('./src/site/_includes/components/SignPosts');
const StackOverflow = require('./src/site/_includes/components/StackOverflow');
const Tooltip = require('./src/site/_includes/components/Tooltip');
const {Video} = require('./src/site/_includes/components/Video');
const {YouTube} = require('webdev-infra/shortcodes/YouTube');

// Collections
const authors = require('./src/site/_collections/authors');
const blogPostsDescending = require('./src/site/_collections/blog-posts-descending');
const newsletters = require('./src/site/_collections/newsletters');
const pages = require('./src/site/_collections/pages');
const {
  postsWithLighthouse,
} = require('./src/site/_collections/posts-with-lighthouse');
const tags = require('./src/site/_collections/tags');

// Filters
const consoleDump = require('./src/site/_filters/console-dump');
const {i18n} = require('./src/site/_filters/i18n');
const {memoize, findByUrl} = require('./src/site/_filters/find-by-url');
const pathSlug = require('./src/site/_filters/path-slug');
const containsTag = require('./src/site/_filters/contains-tag');
const expandAuthors = require('./src/site/_filters/expand-authors');
const githubLink = require('./src/site/_filters/github-link');
const gitlocalizeLink = require('./src/site/_filters/gitlocalize-link');
const htmlDateString = require('./src/site/_filters/html-date-string');
const isNewContent = require('./src/site/_filters/is-new-content');
const md = require('./src/site/_filters/md');
const pagedNavigation = require('./src/site/_filters/paged-navigation');
const postsLighthouseJson = require('./src/site/_filters/posts-lighthouse-json');
const prettyDate = require('./src/site/_filters/pretty-date');
const removeDrafts = require('./src/site/_filters/remove-drafts');
const slugify = require('./src/site/_filters/slugify');
const strip = require('./src/site/_filters/strip');
const stripBlog = require('./src/site/_filters/strip-blog');
const getPaths = require('./src/site/_filters/get-paths');
const navigation = require('./src/site/_filters/navigation');
const padStart = require('./src/site/_filters/pad-start');
const {minifyJs} = require('./src/site/_filters/minify-js');
const {cspHash, getHashList} = require('./src/site/_filters/csp-hash');

const disableLazyLoad = require('./src/site/_transforms/disable-lazy-load');
const {purifyCss} = require('./src/site/_transforms/purify-css');
const {minifyHtml} = require('./src/site/_transforms/minify-html');

// Shared dependencies between web.dev and developer.chrome.com
const {updateSvgForInclude} = require('webdev-infra/filters/svg');
// TODO: We should migrate all of our ToCs over to using this filter which we
// wrote for d.c.c. Currently we're also using eleventy-plugin-toc on articles
// but this one seems to work better.
const {toc: courseToc} = require('webdev-infra/filters/toc');

// Creates a global variable for the current __dirname to make including and
// working with files in the pattern library a little easier
global.__basedir = __dirname;

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
  config.addCollection('authors', authors);
  config.addCollection('blogPosts', blogPostsDescending);
  config.addCollection('newsletters', newsletters);
  config.addCollection('pages', pages);
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
  config.addFilter('pathSlug', pathSlug);
  config.addFilter('containsTag', containsTag);
  config.addFilter('expandAuthors', expandAuthors);
  config.addFilter('githubLink', githubLink);
  config.addFilter('gitlocalizeLink', gitlocalizeLink);
  config.addFilter('htmlDateString', htmlDateString);
  config.addFilter('imgix', generateImgixSrc);
  config.addFilter('isNewContent', isNewContent);
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
  config.addNunjucksAsyncFilter('minifyJs', minifyJs);
  config.addFilter('cspHash', cspHash);

  // ----------------------------------------------------------------------------
  // SHORTCODES
  // ----------------------------------------------------------------------------
  config.addShortcode('ArticleNavigation', ArticleNavigation);
  config.addPairedShortcode('Aside', Aside);
  config.addShortcode('Assessment', Assessment);
  config.addShortcode('Author', Author);
  config.addShortcode('AuthorInfo', AuthorInfo);
  config.addShortcode('AuthorsDate', AuthorsDate);
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

  // Make CSP hashes accessible to firebase config.
  if (isProd) {
    config.on('afterBuild', () => {
      fs.writeFileSync(
        'dist/script-hash-list.json',
        JSON.stringify(getHashList()),
      );
    });
  }

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
