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

const data = require('../content/en/learn/learn.11tydata.js')();

// =============================================================================
// POST HOST
//
// Returns a dictionary that reverse maps each guide (by ID) to its location
// inside a Path > Topic, based on the config inside `_data/paths/*.js`. Used
// to generate Lighthouse mapping data.
//
// =============================================================================

module.exports = function () {
  const out = {};

  const paths = data.learn.paths;
  paths.forEach((path) => {
    path.topics.forEach((topic) => {
      (topic.pathItems || []).forEach((id) => {
        if (id in out) {
          // TODO(samthor): Warn that a guide is in multiple locations?
        }
        out[id] = {
          path: path.title,
          topic: topic.title,
        };
      });
    });
  });

  return out;
};
