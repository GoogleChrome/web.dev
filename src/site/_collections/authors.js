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
const setdefault = require('../_utils/setdefault');
const {sortByUpdated} = require('../_utils/sort-by-updated');

/** @type Authors */
let processedCollection;
const PLACEHOLDER_IMG = 'image/admin/1v5F1SOBl46ZghbHQMle.svg';

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
 * @param {AuthorsItem} author to update
 * @param {any[]} allAuthorPosts posts including drafts
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
 * @param {EleventyCollectionObject} [collections] Eleventy collection object
 * @return {Authors}
 */
module.exports = (collections) => {
  if (processedCollection) {
    return processedCollection;
  }

  let allPosts = [];

  if (collections) {
    // Find all posts, sort and key by author. Don't yet filter to live posts.
    allPosts = collections.getFilteredByGlob('**/*.md').sort(sortByUpdated);
  }

  const authorsPosts = findAuthorsPosts(allPosts);

  /** @type Authors */
  const authors = {};

  /** @type {!Array<string>} */
  const invalidAuthors = [];

  Object.keys(authorsData).forEach((key) => {
    const authorData = authorsData[key];
    // Get all authors but filter later.
    const allAuthorPosts = authorsPosts.get(key) || [];
    const href = `/authors/${key}/`;
    // Generate the author's name out of valid given/family parts. This
    // allows our authors to just have a single name.
    const title = [authorData.name.given, authorData.name.family]
      .filter((s) => s && s.length)
      .join(' ');
    const description =
      authorData.descriptions && authorData.descriptions.en
        ? authorData.descriptions.en
        : `Our latest news, updates, and stories by ${title}.`;
    /** @type AuthorsItem */
    const author = {
      ...authorData,
      data: {
        subhead: description,
        title,
      },
      description,
      elements: allAuthorPosts.filter(livePosts),
      href,
      key,
      title,
      url: href,
    };

    // Update the author's href to be their Twitter profile, if they have no
    // live posts on the site.
    if (!maybeUpdateAuthorHref(author, allAuthorPosts)) {
      // If they have no Twitter profile or posts (even draft ones), the
      // author probably shouldn't be here.
      invalidAuthors.push(key);
    }

    if (!author.image) {
      author.image = PLACEHOLDER_IMG;
    }
    author.data.hero = author.image;
    author.data.alt = author.title;

    if (process.env.PERCY) {
      author.elements = author.elements.slice(-6);
    }

    authors[key] = author;
  });

  if (collections) {
    processedCollection = authors;
  }

  return authors;
};
