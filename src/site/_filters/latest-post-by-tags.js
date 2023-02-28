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
 * @fileoverview Return the latest post by specific tags.
 */

const {findByUrl} = require('./find-by-url');

/**
 * @param {EleventyCollectionObject} _ An eleventy posts object.
 * @param {string[]} tags Array of tag name.
 * @return {EleventyCollectionItem} Latest post filter by tag.
 */

function latestPostByTags(_, tags) {
  let latestPost = null;
  for (const tag of tags) {
    // @ts-ignore
    const tagPosts = this.ctx.collections[tag];
    if (!tagPosts.length) continue;

    const candidatePost = tagPosts[tagPosts.length - 1];
    if (!latestPost) {
      latestPost = candidatePost;
      continue;
    }

    if (new Date(candidatePost.date) > new Date(latestPost.date)) {
      latestPost = candidatePost;
    }
  }

  if (!latestPost) {
    // @ts-ignore
    const blogPosts = this.ctx.collections.all;
    latestPost = blogPosts[blogPosts.length - 1];
  }

  return findByUrl(latestPost.url);
}

module.exports = {latestPostByTags};
