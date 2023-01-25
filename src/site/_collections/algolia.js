/*
 * Copyright 2021 Google LLC
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

const {createHash} = require('crypto');
const striptags = require('striptags');
const stripcomments = require('strip-comments');
const removeMarkdown = require('remove-markdown');

const AuthorsCollection = require('./authors');
const TagsCollection = require('./tags');
const {defaultLocale} = require('../_data/site');
const {livePosts} = require('../_filters/live-posts');
const {getDefaultUrl} = require('../_filters/urls');
const {generateImgixSrc} = require('../_includes/components/Img');
const {supportedLocales} = require('../../../shared/locale');

/**
 * Cleans text and shrink the size of the given fulltext to fit within a certain limit,
 * at the nearest found newline character.
 *
 * @param {string} content
 * @param {number} [limit]
 * @return {string}
 */
function limitText(content, limit = 7500) {
  // Remove all comments
  content = stripcomments(content);
  // Remove all html
  content = striptags(content);
  // Remove all markdown
  content = removeMarkdown(content);
  // Remove extra spaces
  content = content.replace(/\s+/g, ' ');

  if (content.length <= limit) {
    return content;
  }

  // Find the nearest prior newline to the 10k limit.
  let newlineIndex = content.lastIndexOf('\n', limit);
  if (newlineIndex === -1) {
    newlineIndex = limit;
  }
  return content.slice(0, newlineIndex);
}

/**
 * @param {EleventyCollectionObject} collections
 * @returns {AlgoliaCollection}
 */
module.exports = (collections) => {
  /** @type {AlgoliaCollection} */
  const algoliaCollection = [];
  /** @type {{
    [url: string]: {
      [locale: string]: AlgoliaCollectionItem;
    };
  }} */
  const algoliaCollectionProcessing = {};

  if (process.env.ELEVENTY_ENV !== 'prod') {
    return algoliaCollection;
  }

  /**
   * This just adds an `AlgoliaCollectionItem` to the `algoliaCollectionProcessing`.
   * It checks to see if the URL exists on the object, if not it'll add it then add the
   * `AlgoliaCollectionItem` to the `algoliaCollectionProcessing`.
   *
   * @param {AlgoliaCollectionItem} algoliaCollectionItem
   */
  const addToCollection = (algoliaCollectionItem) => {
    if (!algoliaCollectionProcessing[algoliaCollectionItem.url]) {
      algoliaCollectionProcessing[algoliaCollectionItem.url] = {};
    }

    algoliaCollectionProcessing[algoliaCollectionItem.url][
      algoliaCollectionItem.locales[0]
    ] = algoliaCollectionItem;
  };

  // All Author and Tag items
  /** @type Array<AuthorsItem|TagsItem> */
  const virtualCollections = [
    ...Object.values(AuthorsCollection(collections)),
    ...Object.values(TagsCollection(collections)),
  ];
  // All posts
  const allSorted = collections.getAllSorted().filter((item) => {
    return item.data.title && item.data.page.url && livePosts(item);
  });

  for (const item of allSorted) {
    if (item.data.disable_algolia || item.data.noindex) {
      continue;
    }

    const defaultUrl = getDefaultUrl(item.url);

    /** @type {AlgoliaCollectionItem} */
    const algoliaCollectionItem = {
      title: item.data.title,
      description: item.data.description,
      content: limitText(item.template.frontMatter.content),
      url: defaultUrl,
      tags: item.data.tags || [],
      locales: [item.data.lang],
      image:
        'hero' in item.data &&
        generateImgixSrc(item.data.hero, {w: 100, auto: 'format'}),
      objectID: createHash('md5').update(item.url).digest('hex'),
    };

    addToCollection(algoliaCollectionItem);
  }

  for (const item of virtualCollections) {
    const defaultUrl = getDefaultUrl(item.url);

    /** @type {AlgoliaCollectionItem} */
    const algoliaCollectionItem = {
      title: item.data.title,
      description: item.data.subhead,
      content: limitText(item.data.subhead),
      url: defaultUrl,
      tags: 'tags' in item.data ? item.data.tags : [],
      locales: [defaultLocale],
      image:
        'hero' in item.data &&
        generateImgixSrc(item.data.hero, {w: 100, auto: 'format'}),
      objectID: createHash('md5').update(item.url).digest('hex'),
    };

    addToCollection(algoliaCollectionItem);
  }

  /**
   * Fix up stuff for multiple languages
   * ie: add default text to non default locale so that you can search in default locale while lang set to different locale
   * For example you can search in english if you're lang is set to polish.
   * ```
   * fr: {
   *   title: 'Bonjour',
   *   default_title: 'Hello',
   *   locales: ['fr'],
   * }
   * ```
   *
   * ie: add all other locales that dont exist to default's locales
   * For example if there isn't a version of the page in french then the english version will show up.
   * ```
   * en: {
   *   title: 'Hello',
   *   locales: ['en', 'fr'],
   * }
   * ```
   */
  for (const url in algoliaCollectionProcessing) {
    const urlItem = algoliaCollectionProcessing[url];
    const defaultLocaleItem = urlItem[defaultLocale];

    // Get all languages used for url
    const languagesForUrl = Object.keys(urlItem);
    // Finds supported languages that dont have a page
    const noPostInLanguages = supportedLocales.filter(
      (lang) => !languagesForUrl.includes(lang),
    );
    // Add default locale, as `noPostInLanguages` will be assigned to it
    noPostInLanguages.unshift(defaultLocale);

    for (const locale in urlItem) {
      const localItem = urlItem[locale];

      // If the item is the default locale one, add the non existant languages
      if (locale === defaultLocale) {
        localItem.locales = noPostInLanguages;
        // Otherwise add the default locales content to the none default locale element
      } else {
        localItem.default_title = defaultLocaleItem.title;

        if (defaultLocaleItem.description) {
          localItem.default_description = defaultLocaleItem.description;
        }

        if (defaultLocaleItem.content) {
          localItem.default_content = defaultLocaleItem.content;
        }
      }

      algoliaCollection.push(localItem);
    }
  }

  return algoliaCollection;
};
