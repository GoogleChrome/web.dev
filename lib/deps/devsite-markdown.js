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

const path = require('path');

// matches: {% include "from/rootpath/foo.md" %}
const djanoIncludeRe = new RegExp(/\{%\s+include\s+"(.*?)"\s+%\}/g);

// matches: <<path/foo/md>>
const markdownIncludeRe = new RegExp(/<<(.*?)>>/g);

/**
 * Parses DevSite markdown for interesting conditions, such as template includes that occur at
 * DevSite stage/deploy time.
 *
 * @param {string} target location
 * @param {string} source
 * @return {{includes: !Array<string>}}
 */
module.exports = function(target, source) {
  const dirname = path.dirname(target);
  const out = {
    includes: [],
  };

  for (;;) {
    // relative to current path
    const m = markdownIncludeRe.exec(source);
    if (!m) {
      break;
    }
    const fullPath = path.join(dirname, m[1]);
    out.includes.push(fullPath);
  }

  for (;;) {
    // not relative to current path
    const m = djanoIncludeRe.exec(source);
    if (!m) {
      break;
    }
    out.includes.push(m[1]);
  }

  return out;
};
