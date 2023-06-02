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
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

/** @type AuthorsData */
const authorsData = require('../_data/authorsData.json');
const authorsYaml = yaml.safeLoad(
  fs.readFileSync(
    path.join(__dirname, '..', '_data', 'i18n', 'authors.yml'),
    'utf-8',
  ),
);
const {isLive} = require('../_filters/is-live');
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

  Object.keys(authorsYaml).forEach((key) => {
    const authorData = authorsData[key] || {};
    const href = `/authors/${key}/`;
    let elements = [];
    let date, updated;
    const image = authorData.image || PLACEHOLDER_IMG;

    // Get posts
    if (collections) {
      elements = collections
        .getFilteredByGlob('**/*.md')
        .filter(
          (item) =>
            isLive(item) &&
            !item.data.excludeFromAuthors &&
            (item.data.authors || []).includes(key),
        )
        .sort(sortByUpdated);
    }

    // Limit posts for percy
    if (process.env.PERCY) {
      elements = elements.slice(-6);
    }

    // Set created on date and updated date to be used for indexing to detect updates
    if (elements.length > 0) {
      date = elements.slice(-1).pop().data.date;
      const tempUpdated = elements.slice(0, 1).pop().data.date;
      if (tempUpdated && date !== tempUpdated) {
        updated = tempUpdated;
      }
    }

    /** @type AuthorsItem */
    const author = {
      ...authorData,
      data: {
        date,
        hero: image,
        updated,
      },
      description: `i18n.authors.${key}.description`,
      elements,
      href,
      image,
      key,
      bio: `i18n.authors.${key}.bio`,
      title: `i18n.authors.${key}.title`,
      url: href,
    };

    // If author has no posts, point to their Twitter
    if (author.elements.length === 0) {
      if (author.twitter) {
        author.href = `https://twitter.com/${author.twitter}`;
      } else if (author.homepage) {
        author.href = author.homepage;
      }
    }

    if (
      author.elements.length > 0 ||
      !collections ||
      author.twitter ||
      author.homepage
    ) {
      authors[author.key] = author;
    }
  });

  if (collections) {
    processedCollection = authors;
  }

  return authors;
};
