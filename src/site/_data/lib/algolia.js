/*
 * Copyright 2020 Google LLC
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

const removeMarkdown = require('remove-markdown');
const {livePosts} = require('../../_filters/live-posts');
const {feed: authorsFeed} = require('../../_collections/hooks/authors');
const {feed: tagsFeed} = require('../../_collections/hooks/tags');

/**
 * Shrink the size of the given fulltext to fit within a certain limit, at the
 * nearest found newline character.
 *
 * @param {string} fulltext
 * @param {number=} limit
 * @return {string}
 */
function limitText(fulltext, limit = 7500) {
  if (fulltext.length <= limit) {
    return fulltext;
  }

  // Find the nearest prior newline to the 10k limit.
  let newlineIndex = fulltext.lastIndexOf('\n', limit);
  if (newlineIndex === -1) {
    newlineIndex = limit;
  }
  return fulltext.slice(0, newlineIndex);
}

const algolia = (collections) => {
  if (process.env.ELEVENTY_ENV !== 'prod') {
    return [];
  }
  // For now, hard-code language to English.
  const lang = 'en';
  /** @type EleventyCollectionItem[] */
  const eleventyPosts = collections.post.filter((item) => {
    return item.data.title && item.data.page.url && livePosts(item);
  });
  /** @type Authors */
  const authorsCollection = collections.authors;
  /** @type Newsletters */
  const newslettersCollection = collections.newsletters;
  /** @type Tags */
  const tagsCollection = collections.tags;

  // Convert 11ty-posts to a flat, indexable format.
  const posts = eleventyPosts.map(({data, template}) => {
    const fulltext = removeMarkdown(template.frontMatter.content);

    // Algolia has a limit of ~10k JSON on its records. For now, just trim fulltext to the nearest
    // line break below ~7500 characters (allowing buffer).
    // As of September 2019, this effects about 20 articles.
    // https://www.algolia.com/doc/guides/sending-and-managing-data/prepare-your-data/in-depth/index-and-records-size-and-usage-limitations/#record-size
    const limited = limitText(fulltext);

    const authors = (data.authors || []).map(
      (author) => authorsCollection[author].title,
    );

    return {
      objectID: data.page.url,
      lang: data.lang,
      title: data.title,
      url: data.canonicalUrl,
      description: data.description,
      fulltext: limited,
      authors: authors,
      _tags: data.tags,
    };
  });

  const authors = authorsFeed(Object.values(authorsCollection)).map(
    (author) => {
      return {
        objectID: author.href,
        lang,
        title: author.title,
        url: author.data.canonicalUrl,
        description: author.description,
        fulltext: limitText(author.description),
      };
    },
  );

  const newsletters = newslettersCollection.map(({data, template}) => {
    const fulltext = removeMarkdown(template.frontMatter.content);
    const limited = limitText(fulltext);

    return {
      objectID: data.page.url,
      lang,
      title: data.title,
      url: data.canonicalUrl,
      description: data.description,
      fulltext: limited,
    };
  });

  const tags = tagsFeed(Object.values(tagsCollection)).map((tag) => {
    return {
      objectID: tag.href,
      lang,
      title: tag.title,
      url: tag.data.canonicalUrl,
      description: tag.description,
      fulltext: limitText(tag.description),
    };
  });

  return [...posts, ...authors, ...newsletters, ...tags];
};

module.exports = {
  algolia,
};
