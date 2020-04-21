/*
 * Copyright 2019 Google LLC
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
 * @fileoverview Filter scheduled and draft posts out from a collection.
 */

const {env} = require('../_data/site');

/**
 * @param {object} post An eleventy post object.
 * @return {boolean} Whether or not the post should go live.
 */
module.exports = function livePosts(post) {
  if (!post.date) {
    throw new Error(`${post.inputPath} did not specificy a date.`);
  }

  if (!post.data) {
    throw new Error(
      `${post.inputPath} does not have a data object. Are you sure it's a post?`,
    );
  }

  // Scheduled posts.
  // If a post has a future date it will automatically be set to `draft: true`.
  // When the date arrives, our daily GitHub Action that publishes the site
  // should pickup the new post and publish it.
  // This action runs at around 7am PST / 15:00 UTC.
  // Because Eleventy sets the post.date to midnight, UTC time, we offset it
  // to be at 15:00.
  // If we did not do this, then deploying the site at 4pm PST / 00:00 UTC
  // would seemingly launch posts intended for the next day.
  const now = new Date();
  const postDate = new Date(post.date).setUTCHours(15, 0, 0, 0);
  if (postDate >= now) {
    post.data.draft = true;
  }

  // If we're in dev mode, force all posts to show up.
  // We do this after the scheduled posts snippet above so we can ensure that
  // `draft` is set to true. We rely on that flag to show a visual indicator
  // that this post will not go live.
  if (env === 'dev') {
    return true;
  }

  // Draft posts.
  // If a post has the `draft: true` flag set then it *will* generate a file
  // but it won't be crawlable or show up on the site in production.
  return !post.data.draft;
};
