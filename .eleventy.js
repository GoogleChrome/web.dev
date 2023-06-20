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
const path = require('path');
const fse = require('fs-extra');
const fetch = require('node-fetch');
const patterns = require('./src/lib/patterns').patterns();

const markdown = require('./src/site/_plugins/markdown');

// Shortcodes used in prose
const Aside = require('./src/site/_includes/components/Aside');
const {Blockquote} = require('webdev-infra/shortcodes/Blockquote');
const {BrowserCompat} = require('webdev-infra/shortcodes/BrowserCompat');
const {Codepen} = require('webdev-infra/shortcodes/Codepen');
const Compare = require('./src/site/_includes/components/Compare');
const CompareCaption = require('./src/site/_includes/components/CompareCaption');
const {Details} = require('webdev-infra/shortcodes/Details');
const {DetailsSummary} = require('webdev-infra/shortcodes/DetailsSummary');
const Glitch = require('./src/site/_includes/components/Glitch');
const IFrame = require('./src/site/_includes/components/IFrame');
const {Img, generateImgixSrc} = require('./src/site/_includes/components/Img');
const Instruction = require('./src/site/_includes/components/Instruction');
const Label = require('./src/site/_includes/components/Label');
const {Video} = require('./src/site/_includes/components/Video');
const {YouTube} = require('webdev-infra/shortcodes/YouTube');
const CodePattern = require('./src/site/_includes/components/CodePattern');
const Widget = require('./src/site/_includes/components/Widget');

// Other shortcodes
const Assessment = require('./src/site/_includes/components/Assessment');
const Author = require('./src/site/_includes/components/Author');
const AuthorsDate = require('./src/site/_includes/components/AuthorsDate');
const Banner = require('./src/site/_includes/components/Banner');
const CodelabsCallout = require('./src/site/_includes/components/CodelabsCallout');
const includeRaw = require('./src/site/_includes/components/includeRaw');
const Meta = require('./src/site/_includes/components/Meta');
const StackOverflow = require('./src/site/_includes/components/StackOverflow');
const YouTubePlaylist = require('./src/site/_includes/components/YouTubePlaylist');

// Collections
const authors = require('./src/site/_collections/authors');
const blogPostsDescending = require('./src/site/_collections/blog-posts-descending');
const newsletters = require('./src/site/_collections/newsletters');
const shows = require('./src/site/_collections/shows');
const tags = require('./src/site/_collections/tags');

// Filters
const {i18n} = require('./src/site/_filters/i18n');
const {getDefaultUrl, getRelativePath} = require('./src/site/_filters/urls');
const {memoize, findByUrl} = require('./src/site/_filters/find-by-url');
const {supportedLanguages} = require('./src/site/_filters/language-list');
const pathSlug = require('./src/site/_filters/path-slug');
const algoliaIndexable = require('./src/site/_filters/algolia-indexable');
const {algoliaItem} = require('./src/site/_filters/algolia-item');
const containsTag = require('./src/site/_filters/contains-tag');
const expandAuthors = require('./src/site/_filters/expand-authors');
const githubLink = require('./src/site/_filters/github-link');
const gitlocalizeLink = require('./src/site/_filters/gitlocalize-link');
const htmlDateString = require('./src/site/_filters/html-date-string');
const isNewContent = require('./src/site/_filters/is-new-content');
const livePosts = require('./src/site/_filters/live-posts');
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
const {minifyJs} = require('./src/site/_filters/minify-js');
const {minifyJSON} = require('./src/site/_filters/minify-json');
const {cspHash, getHashList} = require('./src/site/_filters/csp-hash');
const {siteRender} = require('./src/site/_filters/site-render');
const {
  isUpcoming,
  filterInUpcoming,
  filterOutUpcoming,
} = require('./src/site/_filters/is-upcoming');
const {latestPostByTags} = require('./src/site/_filters/latest-post-by-tags');
const {calendarLink} = require('./src/site/_filters/calendar-link');

const disableLazyLoad = require('./src/site/_transforms/disable-lazy-load');
const {minifyHtml} = require('./src/site/_transforms/minify-html');

// Shared dependencies between web.dev and developer.chrome.com
const {updateSvgForInclude} = require('webdev-infra/filters/svg');
const {toc} = require('webdev-infra/filters/toc');

// Creates a global variable for the current __dirname to make including and
// working with files in the component library a little easier
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
  config.addCollection('shows', shows);
  config.addCollection('tags', tags);
  // Turn collection.all into a lookup table so we can use findBySlug
  // to quickly find collection items without looping.
  config.addCollection('memoized', (collection) => {
    return memoize(collection.getAll());
  });

  // ----------------------------------------------------------------------------
  // FILTERS
  // ----------------------------------------------------------------------------
  config.addFilter('i18n', i18n);
  config.addFilter('findByUrl', findByUrl);
  config.addFilter('supportedLanguages', supportedLanguages);
  config.addFilter('getDefaultUrl', getDefaultUrl);
  config.addFilter('getRelativePath', getRelativePath);
  config.addFilter('pathSlug', pathSlug);
  config.addFilter('algoliaIndexable', algoliaIndexable);
  config.addFilter('algoliaItem', algoliaItem);
  config.addFilter('containsTag', containsTag);
  config.addFilter('expandAuthors', expandAuthors);
  config.addFilter('githubLink', githubLink);
  config.addFilter('gitlocalizeLink', gitlocalizeLink);
  config.addFilter('htmlDateString', htmlDateString);
  config.addFilter('imgix', generateImgixSrc);
  config.addFilter('isNewContent', isNewContent);
  config.addFilter('livePosts', livePosts);
  config.addFilter('md', md);
  config.addFilter('navigation', navigation);
  config.addNunjucksAsyncFilter('siteRender', siteRender);
  config.addFilter('pagedNavigation', pagedNavigation);
  config.addFilter('postsLighthouseJson', postsLighthouseJson);
  config.addFilter('prettyDate', prettyDate);
  config.addFilter('removeDrafts', removeDrafts);
  config.addFilter('slugify', slugify);
  config.addFilter('stripBlog', stripBlog);
  config.addFilter('getPaths', getPaths);
  config.addFilter('strip', strip);
  config.addFilter('toc', toc);
  config.addFilter('updateSvgForInclude', updateSvgForInclude);
  config.addNunjucksAsyncFilter('minifyJs', minifyJs);
  config.addFilter('minifyJSON', minifyJSON);
  config.addFilter('cspHash', cspHash);
  config.addFilter('isUpcoming', isUpcoming);
  config.addFilter('filterInUpcoming', filterInUpcoming);
  config.addFilter('filterOutUpcoming', filterOutUpcoming);
  config.addFilter('latestPostByTags', latestPostByTags);
  config.addFilter('calendarLink', calendarLink);

  // ----------------------------------------------------------------------------
  // SHORTCODES
  // ----------------------------------------------------------------------------
  config.addPairedShortcode('Aside', Aside);
  config.addShortcode('Assessment', Assessment);
  config.addShortcode('Author', Author);
  config.addShortcode('AuthorsDate', AuthorsDate);
  config.addPairedShortcode('Banner', Banner);
  config.addPairedShortcode('Blockquote', Blockquote);
  config.addShortcode('BrowserCompat', BrowserCompat);
  config.addShortcode('CodelabsCallout', CodelabsCallout);
  config.addShortcode('Codepen', Codepen);
  config.addShortcode('CodePattern', CodePattern);
  config.addPairedShortcode('Compare', Compare);
  config.addPairedShortcode('CompareCaption', CompareCaption);
  config.addPairedShortcode('Details', Details);
  config.addPairedShortcode('DetailsSummary', DetailsSummary);
  config.addShortcode('Glitch', Glitch);
  config.addShortcode('IFrame', IFrame);
  config.addShortcode('Img', Img);
  config.addShortcode('Instruction', Instruction);
  config.addPairedShortcode('Label', Label);
  config.addShortcode('Meta', Meta);
  config.addShortcode('StackOverflow', StackOverflow);
  config.addShortcode('Widget', Widget);
  config.addShortcode('Video', Video);
  config.addShortcode('YouTube', YouTube);
  config.addShortcode('YouTubePlaylist', YouTubePlaylist);
  config.addShortcode('includeRaw', includeRaw);

  // ----------------------------------------------------------------------------
  // TRANSFORMS
  // ----------------------------------------------------------------------------
  if (process.env.PERCY) {
    config.addTransform('disable-lazy-load', disableLazyLoad);
  }

  if (isProd || isStaging) {
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

  // Because eleventy's passthroughFileCopy does not work with permalinks
  // we need to manually copy general assets ourselves using gulp.
  // https://github.com/11ty/eleventy/issues/379
  // We make exception for CodePattern files used as standalone scripts in demos.
  for (const patternId in patterns) {
    const pattern = patterns[patternId];
    if (pattern.static?.length) {
      const src = path.join(
        'src',
        'site',
        'content',
        'en',
        'patterns',
        pattern.id,
      );
      const rewrite = {};
      pattern.static.forEach((staticFile) => {
        rewrite[path.join(src, staticFile)] = path.join(
          'patterns',
          pattern.id,
          staticFile,
        );
      });
      config.addPassthroughCopy(rewrite);
    }
  }

  // Third party scripts and assets
  config.addPassthroughCopy({
    'src/site/content/en/third_party/': 'third_party',
  });

  // ----------------------------------------------------------------------------
  // ALTERNATIVE BUILD FOR EXPORT
  // ----------------------------------------------------------------------------
  // Temporary
  if (process.env.ALT_BUILD) {
    const downloadImage = async (src, outputPath) => {
      let image = await fetch(generateImgixSrc(src));
      image = await image.buffer();
      await fse.outputFile(outputPath, image);
      console.log('Downloaded ', outputPath);
    };

    config.addCollection('hero', (collection) => {
      collection.getAll().forEach((el) => {
        if (el.data.hero) {
          const ext = el.data.hero.split('.').pop();
          const outputPath = el.data.page.outputPath.replace(
            'index.html',
            'hero.' + ext,
          );
          downloadImage(el.data.hero, outputPath);
        }
      });
      return [];
    });
  }

  return {
    dir: {
      input: 'src/site/content/', // we use a string path with the forward slash since windows doesn't like the paths generated from path.join
      output: 'dist',
      data: '../_data',
      includes: '../_includes',
    },
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
