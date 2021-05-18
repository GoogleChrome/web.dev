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
/** @type AuthorsData */
const authorsData = require('../_data/authorsData.json');
const {livePosts} = require('../_filters/live-posts');
const {sortByUpdated} = require('../_utils/sort-by-updated');

/** @type Authors */
let processedCollection;
const PLACEHOLDER_IMG = 'image/admin/1v5F1SOBl46ZghbHQMle.svg';

/**
 * Returns all authors with their posts.
 *
 * @param {EleventyCollectionObject} [collections] Eleventy collection object
 * @return {Authors}
 */
module.exports = (collections) => {
  if (processedCollection) {
    return processedCollection;
  }

  /** @type Authors */
  const authors = {};

  Object.keys(authorsData).forEach((key) => {
    const authorData = authorsData[key];
    const title = [authorData.name.given, authorData.name.family]
      .filter((s) => s && s.length)
      .join(' ');
    const description =
      authorData.descriptions && authorData.descriptions.en
        ? authorData.descriptions.en
        : `Our latest news, updates, and stories by ${title}.`;
    const href = `/authors/${key}/`;
    const image = authorData.image || PLACEHOLDER_IMG;

    /** @type AuthorsItem */
    const author = {
      ...authorData,
      data: {
        alt: title,
        hero: image,
        subhead: description,
        title,
      },
      description,
      elements: [],
      href,
      image,
      key,
      title,
      url: href,
    };

    // Get posts
    if (collections) {
      author.elements = collections
        .getFilteredByGlob('**/*.md')
        .filter(
          (item) =>
            livePosts(item) &&
            !item.data.excludeFromAuthors &&
            (item.data.authors || []).includes(key),
        )
        .sort(sortByUpdated);
    }

    // Limit posts for percy
    if (process.env.PERCY) {
      author.elements = author.elements.slice(-6);
    }

    // If author has no posts, point to their Twitter
    if (author.elements.length === 0 && author.twitter) {
      author.href = `https://twitter.com/${author.twitter}`;
    }

    // Set created on date and updated date
    if (author.elements.length > 0) {
      author.data.date = author.elements.slice(-1).pop().data.date;
      const updated = author.elements.slice(0, 1).pop().data.date;
      if (author.data.date !== updated) {
        author.data.updated = updated;
      }
    }

    if (author.elements.length > 0 || !collections || author.twitter) {
      authors[author.key] = author;
    }
  });

  if (collections) {
    processedCollection = authors;
  }

  return authors;
};
