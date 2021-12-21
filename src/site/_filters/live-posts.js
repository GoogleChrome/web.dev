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

/**
 * @fileoverview Filters out 11ty post objects that are not live.
 */

const {isLive} = require('./is-live');

/**
 * Filters out 11ty post objects that are not live.
 *
 * @param {object[]} posts An array of 11ty post objects.
 * @return {object[]} An array of 11ty post objects that are live.
 */
const livePosts = (posts) => posts.filter(isLive);

module.exports = livePosts;
