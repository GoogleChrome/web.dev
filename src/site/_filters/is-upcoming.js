/*
 * Copyright 2022 Google LLC
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
 * @fileoverview Returns true if a post has a date specified in the future.
 */

/**
 * @param {object} post An eleventy post object.
 * @param {string} dateFieldName Name of the field containing the date.
 * @return {boolean} Whether the posts date is set in the future.
 */
function isUpcoming(post, dateFieldName) {
  const date = dateFieldName === 'date' ? post.date : post.data[dateFieldName];
  if (!post.data[dateFieldName]) {
    throw new Error(`${post.inputPath} did not specify a ${dateFieldName}.`);
  }
  const now = new Date();
  const postDate = new Date(date);
  return postDate.getTime() > now.getTime();
}

/**
 * @param {EleventyCollectionObject} posts An eleventy posts object.
 * @param {string} dateFieldName Name of the field containing the date.
 * @return {EleventyCollectionObject} Posts filtered by date.
 */
function filterInUpcoming(posts, dateFieldName) {
  return posts.filter((post) => isUpcoming(post, dateFieldName));
}

/**
 * @param {EleventyCollectionObject} posts An eleventy posts object.
 * @param {string} dateFieldName Name of the field containing the date.
 * @return {EleventyCollectionObject} Posts filtered by date.
 */
function filterOutUpcoming(posts, dateFieldName) {
  return posts.filter((post) => isUpcoming(post, dateFieldName));
}

module.exports = {isUpcoming, filterInUpcoming, filterOutUpcoming};
