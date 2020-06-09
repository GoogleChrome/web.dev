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
const setdefault = require('../_utils/setdefault');
const paths = require('../_data/paths');
const postToPaths = require('../_data/postToPaths.js');

/**
 * Since a post can appear in more than one collection, this creates a quick way to look up which collection a post is in.
 *
 * @param {any} collections Eleventy collection object
 * @return { Object.<string, Array<{ title: string, slug: string, href: string }>> } An object where each key has an array with details of the pathItems it belongs to.
 */
module.exports = (collections) => {
  const postToCollections = {};
  Object.keys(postToPaths).forEach((slug) => {
    postToPaths[slug].forEach((pathName) => {
      const path = paths[pathName];
      const entry = postToCollections[slug] || new Map();
      const details = {
        title: path.title,
        slug: path.slug,
        href: `/${path.slug}/`,
      };
      setdefault(entry, path.slug, details);
      postToCollections[slug] = entry;
    });
  });

  /**
   * Since postToCollections uses Maps in order to prevent duplicate collection enteries,
   * we rip the values out of each slugs Map and turn it into an Array in order to display.
   */
  Object.keys(postToCollections).forEach((postSlug) => {
    postToCollections[postSlug] = Array.from(
      postToCollections[postSlug].values(),
    );
  });

  return postToCollections;
};
