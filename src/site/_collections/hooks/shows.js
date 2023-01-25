/*
 * Copyright 2021 Google LLC
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

const {feed, index, individual} = require('./utils');

/**
 * @param {ShowsItem[]} shows
 * @return {ShowsItem[]}
 */
const showsFeed = (shows) => feed(shows);

/**
 * @param {ShowsItem[]} shows
 * @return {Paginated[]}
 */
const showsIndex = (shows) => {
  const href = '/shows/';
  const testTags = ['http-203'];

  return index(shows, href, testTags);
};

/**
 * @param {ShowsItem[]} shows
 * @param {string} [lang]
 * @return {Paginated[]}
 */
const showsIndividual = (shows, lang) => individual(shows, lang);

module.exports = {
  feed: showsFeed,
  index: showsIndex,
  individual: showsIndividual,
};
