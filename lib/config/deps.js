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
 * @param {!RegExp} re
 * @param {string} source
 * @return {!Iterator<!RegExpResult>}
 */
function* matchAll(re, source) {
  for (;;) {
    const m = re.exec(source);
    if (!m) {
      break;
    }
    yield m;
  }
}

/**
 * @param {!content.ContentFile} cf
 * @param {function(string): void} cb callback to include other relative files
 * @return {!Array<string>}
 */
async function DevsiteRelativeIncludes(cf, cb) {
  // Find DevSite includes and ensure they are also built. Includes in DevSite are relative to
  // the top-level language directory:
  //   e.g., 'en/path/to/foo.md' must include 'path/to/_include.md'
  const source = await cf.read();
  if (source === null) {
    return;  // not a real file
  }
  const includes = [];

  if (cf.ext === '.md') {
    for (const m of matchAll(markdownIncludeRe, source)) {
      // relative to current path
      includes.push(m[1]);
    }
  }

  let generatedSourceChange = false;
  const generatedSource = source.replace(djanoIncludeRe, (part) => {
    const m = djanoIncludeRe.exec(part);  // same RegExp, will always pass
    const cand = m[1];

    // This is a "relative" path, rewrite it to be absolute (as DevSite requires).
    if (cand.startsWith('../') || cand.startsWith('./')) {
      includes.push(cand);
      generatedSourceChange = true;
      return `{% include "${path.join(cf.dir, cand)}" %}`;
    }

    // This is already in the format DevSite requires (although the import must be relative).
    includes.push(path.relative(cf.dir, cand));
    return undefined;
  });

  includes.forEach(cb);
  return generatedSourceChange ? generatedSource : undefined;
}

module.exports = {
  DevsiteRelativeIncludes,
};
