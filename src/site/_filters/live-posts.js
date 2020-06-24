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
 * If a post has a future date it will automatically be set to `draft: true`.
 * When the date arrives, our daily GitHub Action that publishes the site
 * should pickup the new post and publish it.
 * This action runs at around 7am PST / 15:00 UTC.
 * Because Eleventy sets the post.date to midnight, UTC time, we offset it
 * to be at 15:00.
 * If we did not do this, then deploying the site at 4pm PST / 00:00 UTC
 * would launch posts intended for the next day.
 * @param {*} post An eleventy post object.
 * @param {!Date=} now A Date object representing the current time. You
 * shouldn't ever need to pass a date into this function. We make it an argument
 * so we can write tests against it.
 * @return {boolean}
 */
function isScheduledForTheFuture(post, now = new Date()) {
  if (!(now instanceof Date)) {
    throw new Error('now argument must by a Date object.');
  }

  const postDate = new Date(post.date);
  postDate.setUTCHours(15, 0, 0, 0);
  return postDate.getTime() > now.getTime();
}

/**
 * @param {object} post An eleventy post object.
 * @return {boolean} Whether or not the post should go live.
 */
function livePosts(post) {
  if (!post.date) {
    throw new Error(`${post.inputPath} did not specify a date.`);
  }

  if (!post.data) {
    throw new Error(
      `${post.inputPath} does not have a data object. Are you sure it's a post?`,
    );
  }

  // Scheduled posts.
  // Check to see if the post is schedule to go live some date in the future.
  // If it is, set its draft flag so it will behave like other draft posts
  // on the site and be excluded from collections in production.
  if (post.data.scheduled && isScheduledForTheFuture(post)) {
    post.data.draft = true;
  }

  // If we're in dev mode, force all posts to show up.
  // We do this after checking for scheduled posts so scheduled posts will get
  // their draft flag set and show the `draft` visual indicator.
  if (env === 'dev') {
    return true;
  }

  // Draft posts.
  // Draft posts should be excluded from collections in the prod environment.
  // nb. If a post has the `draft: true` flag set then it *will* still
  // generate a file but it will not be search crawlable.
  // However, if you know the URL you can view it in prod.
  // We may want to change this behavior someday.
  return !post.data.draft;
}

module.exports = {livePosts, isScheduledForTheFuture};
