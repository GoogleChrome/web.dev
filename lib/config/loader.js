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

const content = require('../deps/content.js');
const deps = require('./deps.js');
const filters = require('./filters.js');
const generators = require('./generators.js');
const validate = require('./validate.js');

module.exports = (callback) => {
  const loader = new content.ContentLoader(callback);

  // Build author-provided content pages from their corresponding Markdown files. The regex below
  // means that this matches Markdown files that are under at least one subfolder.
  loader.register('*/**/*.md', (cf, cb) => {
    cb(cf.swapExt('.html'));  // build HTML instead
    return null;              // don't build this file
  });
  loader.register('*/**/*.html', generators.ContentPageBuilder);

  // Generate 'path' pages, which contains structured data about all guides. The HTML file for a
  // path is only built if we find a matching YAML file, e.g. `foo.html` needs `foo/guides.yaml`.
  loader.register('*/guides.yaml', (cf, cb) => {
    cb(`${cf.dir}.html`);  // build the HTML file corresponding to this dir
  });
  loader.register('*.html', generators.PathPageBuilder);

  // Generate top-level HTML files. _-prefixed files are hidden on DevSite, and can only be used
  // as includes for others.
  loader.register('_root-cards.html', generators.RootCardsHTML);
  loader.register('_guides-json.html', generators.AllGuidesJSON);

  // filter files which aren't relevant to DevSite
  loader.register('./*.yaml', filters.FilterYaml);

  // include dependent files in build
  loader.register('./*.{md,html}', deps.DevsiteIncludes);

  // validators for various common mistakes
  loader.register('./*.json', validate.testJSON);

  return loader;
};
