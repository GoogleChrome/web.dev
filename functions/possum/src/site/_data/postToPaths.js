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

const paths = require('./paths');

const postToPathsMap = {};
Object.keys(paths).forEach((path) => {
  (paths[path].topics || []).forEach((topic) => {
    const subPathItems = (topic.subtopics || []).reduce(
      (accumulator, subtopic) => [...accumulator, ...subtopic.pathItems],
      [],
    );
    const pathItems = [...topic.pathItems, ...subPathItems];
    (pathItems || []).forEach((slug) => {
      postToPathsMap[slug] = postToPathsMap[slug] || [];
      postToPathsMap[slug].push(paths[path].slug);
    });
  });
});

module.exports = postToPathsMap;
