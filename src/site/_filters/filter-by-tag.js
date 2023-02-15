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

/**
 * @param {object} post An eleventy post object.
 * @param {array} tags Array of tag name.
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
 * @return {EleventyCollectionObject} Posts filtered by tags.
 */
function filterByTag(posts, tags) {
  // @ts-ignore
  const recentPosts = posts.sort((postA, postB) => {
    if (!postB.date || !postA.date) return 0;

    // @ts-ignore
    return new Date(postB.date) - new Date(postA.date); 
  });

  return recentPosts.filter((post) => isContainsTag(post, tags));
}

module.exports = {isContainsTag, filterByTag};
