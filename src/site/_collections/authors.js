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
const fs = require('fs');
const path = require('path');
const contributors = require('../_data/contributors');
const {livePosts} = require('../_filters/live-posts');
const setdefault = require('../_utils/setdefault');

/**
 * Generate map the posts by author's username/key
 *
 * @param {Array<{ data: { authors: any[] }}>} posts
 * @return {Map<string, Array<Object>>} Map of posts by author's username/key
 */
const findAuthorsPosts = (posts) => {
  const authorsMap = new Map();
  posts.forEach((post) => {
    const authors = post.data.authors || [];
    authors.forEach((author) => {
      const postsByAuthor = setdefault(authorsMap, author, []);
      postsByAuthor.push(post);
      authorsMap.set(author, postsByAuthor);
    });
  });
  return authorsMap;
};

/**
 * Finds image of author, returns path.
 *
 * @param {string} key
 * @return {string | void} Path for image.
 */
const findAuthorsImage = (key) => {
  for (const size of ['@3x', '@2x', '']) {
    const jpegPath = path.join('src/images/authors', `${key}${size}.jpg`);
    if (fs.existsSync(jpegPath)) {
      return path.join('/images/authors', `${key}${size}.jpg`);
    }
  }
};

/**
 * Returns all authors with their posts.
 *
 * @param {any} collections Eleventy collection object
 * @return {Object.<string, Author>}
 */
module.exports = (collections) => {
  // Get all posts and sort them
  const posts = collections
    .getFilteredByGlob('**/*.md')
    .filter(livePosts)
    .sort((a, b) => b.date - a.date);

  const authorsPosts = findAuthorsPosts(posts);

  /** @constant @type {Object.<string, Author>} @default */
  const authors = {};

  Object.values(contributors)
    .sort((a, b) => a.title.localeCompare(b.title))
    .forEach((author) => {
      // This updates the shared contributors object with meta information and is safe to be called multiple times.
      author.url = path.join('/en', author.href);
      author.data = {
        title: author.title,
        subhead: author.description,
      };

      author.elements = authorsPosts.has(author.key)
        ? authorsPosts.get(author.key)
        : [];

      // If the author doesn't have any posts, use their Twitter profile.
      if (author.elements.length === 0) {
        if (!author.twitter) {
          // TODO(samthor): Don't crash if there's no posts at all. This happens early as we run
          // Eleventy with no data to generate partials.
          if (posts.length) {
            throw new Error(
              `author ${
                author.title
              } has no posts and no social: ${JSON.stringify(author)}`,
            );
          }
        } else {
          author.href = `https://twitter.com/${author.twitter}`;
        }
      }

      const authorsImage = findAuthorsImage(author.key);
      if (authorsImage) {
        author.data.hero = authorsImage;
        author.data.alt = author.title;
      }

      if (process.env.PERCY) {
        author.elements = author.elements.slice(-6);
      }

      authors[author.key] = author;
    });

  return authors;
};
