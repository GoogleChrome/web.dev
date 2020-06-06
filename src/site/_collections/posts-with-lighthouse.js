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
 * @fileoverview
 * Return posts that reference a Lighthouse audit.
 * These posts will be displayed in the user's TODO list on the /measure page.
 */

const {livePosts} = require('../_filters/live-posts');

/**
 * Filter out posts that aren't related to LH audits.
 * @param {{data: Object}} post An eleventy post object.
 * @return {boolean}
 */
function hasLighthouseAudit(post) {
  const audits = post.data.web_lighthouse;
  if (typeof audits === 'string' && audits !== 'N/A') {
    return true;
  }
  return audits instanceof Array && audits.length !== 0;
}

/**
 * Filter all eleventy posts down to a set that are used as LH audit references.
 * @param {Object} collection An eleventy collection object
 * @return {Object[]}
 */
function postsWithLighthouse(collection) {
  return collection
    .getFilteredByTag('post')
    .filter(livePosts)
    .filter(hasLighthouseAudit);
}

module.exports = {postsWithLighthouse, hasLighthouseAudit};
