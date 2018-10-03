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

const closest = require('./deps/closest.js');

/**
 * Generates output Markdown from content within web.dev.
 */
module.exports = function(path, config, source) {
  let header = '';

  // Simple demo that adds some extra markup based on the optional config.
  // TODO(samthor): Perform alternative tasks on e.g. `page_type`, and use a Markdown parser to
  // parse the _content_ if changes are required.

  if (config.mdn_features) {
    const features = config.mdn_features.join(' ');
    header += `<web-mdn-features features="${features}"></web-mdn-features>\n\n`;
  }

  if (config.title) {
    header += `# ${config.title}\n\n`;
  }

  source = header + source;

  // insert standard DevSite Markdown preamble
  const projectPath = closest(path, '_project.yaml');
  const bookPath = closest(path, '_book.yaml');
  return `project_path: ${projectPath}\nbook_path: ${bookPath}\n\n${source}`;
};
