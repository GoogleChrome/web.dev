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
const path = require('path');
const authorsData = require('../_data/authorsData');
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
 * @param {!Author} author to update
 * @param {!Array<*>} allAuthorPosts posts including drafts
 * @return {boolean} whether this author is allowed here
 */
const maybeUpdateAuthorHref = (author, allAuthorPosts) => {
  if (author.elements.length !== 0) {
    return true;
  }

  if (author.twitter) {
    author.href = `https://twitter.com/${author.twitter}`;
    return true;
  }

  // If the author has scheduled or draft posts, don't complain.
  if (allAuthorPosts.length !== 0) {
    return true;
  }

  return false;
};

/**
 * Returns all authors with their posts.
 *
 * @param {any} [collections] Eleventy collection object
 * @return {Object.<string, Author>}
 */
module.exports = (collections) => {
  let allPosts = [];

  if (collections) {
    // Find all posts, sort and key by author. Don't yet filter to live posts.
    allPosts = collections
      .getFilteredByGlob('**/*.md')
      .sort((a, b) => b.date - a.date);
  }

  const authorsPosts = findAuthorsPosts(allPosts);

  /** @constant @type {Object.<string, Author>} @default */
  const authors = {};

  /** @type {!Array<string>} */
  const invalidAuthors = [];

  Object.keys(authorsData).forEach((key) => {
    const author = {...authorsData[key]};
    author.key = key;

    // Generate the author's name out of valid given/family parts. This
    // allows our authors to just have a single name.
    const parts = [author.name.given, author.name.family].filter(
      (s) => s && s.length,
    );
    author.title = parts.join(' ');
    author.href = `/authors/${key}/`;
    author.description =
      author.description && author.description.en
        ? author.description.en
        : `Our latest news, updates, and stories by ${author.title}.`;
    author.data = {
      title: author.title,
      subhead: author.description,
      canonicalUrl: author.href,
    };

    // Get all authors but filter later.
    const allAuthorPosts = authorsPosts.get(key) || [];
    author.elements = allAuthorPosts.filter(livePosts);

    // Update the author's href to be their Twitter profile, if they have no
    // live posts on the site.
    if (!maybeUpdateAuthorHref(author, allAuthorPosts)) {
      // If they have no Twitter profile or posts (even draft ones), the
      // author probably shouldn't be here.
      invalidAuthors.push(key);
    }

    const authorsImage = path.join('/images', 'authors', `${key}@2x.jpg`);
    author.data.hero = authorsImage;
    author.data.alt = author.title;

    if (process.env.PERCY) {
      author.elements = author.elements.slice(-6);
    }

    authors[key] = author;
  });

  // Only complain that authors are invalid if we've got any posts *at all*
  // (we can do weird Eleventy builds with no posts, don't complain here).
  const isRegularBuild = Boolean(allPosts.length);
  if (isRegularBuild && invalidAuthors.length) {
    const s = invalidAuthors.join(',');
    throw new Error(`authors [${s}] have no posts and/or Twitter information`);
  }

  return authors;
};
