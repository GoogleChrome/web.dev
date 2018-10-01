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

const fs = require('fs');
const path = require('path');

/**
 * @param {!Array<string>} paths to search for
 * @param {string} root to position files against
 * @return {{root: ?string, paths: !Array<string>}}
 */
module.exports = function(paths, root) {
  const cwd = process.env.INIT_CWD || process.cwd();

  if (!paths.length) {
    return {root, target: ['.']};
  }

  paths = paths.map((p) => path.resolve(cwd, p));

  const seen = {};
  const target = [];
  for (const p of paths) {
    const rel = path.relative(root, p);
    if (rel.startsWith('../') || rel === '..') {
      continue;  // path outside root
    }
    if (!seen[rel]) {
      seen[rel] = true;
      target.push(rel);
    }
  }

  target.sort((a, b) => a.length - b.length);
  return {root, target};
};