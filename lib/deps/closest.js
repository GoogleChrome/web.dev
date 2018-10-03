/*
 * Copyright 2018 Google LLC
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

'use strict';

const isDir = require('./is-dir.js');
const path = require('path');

/**
 * Finds the nearest parent path that contains the candidate file, similar to HTML's `.closest`
 * method.
 *
 * @param {string} req path to search from
 * @param {string} cand candidate file to search for
 * @return {string} the found path, or just the raw candidate
 */
module.exports = function closest(req, cand) {
  // special-case first arg
  if (path.basename(req) === cand) {
    return req;
  }
  req = path.dirname(req);

  while (req && req !== '.') {
    if (isDir(path.join(req, cand)) !== undefined) {
      return req;
    }
    req = path.dirname(req);
  }

  return cand;
};
