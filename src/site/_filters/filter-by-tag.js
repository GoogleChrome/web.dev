/*
 * Copyright 2023 Google LLC
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

/**
 * @fileoverview Returns posts filtering by specific tags.
 */

const {findByUrl} = require('./find-by-url');

/**
 * @param {EleventyCollectionItem} post An eleventy post object.
 * @param {string[]} tags Array of tag name.
 * @return {boolean} Whether the posts are in the specific tags.
 */
function isContainsTag(post, tags) {
  return (
    !!post.data.tags &&
    tags.filter((tag) => post.data.tags.indexOf(tag) > -1).length > 0
  );
}

/**
 * @param {EleventyCollectionObject} posts An eleventy posts object.
 * @param {array} tags Array of tag name.
 * @return {EleventyCollectionItem} Latest post filter by tag.
 */
function filterByTag(posts, tags) {
  // @ts-ignore
  const filteredPosts = posts.filter((post) => isContainsTag(post, tags));
  const latestPost = filteredPosts.pop();
  return findByUrl(latestPost.url);
}

module.exports = {isContainsTag, filterByTag};
