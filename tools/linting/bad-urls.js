/*
 * Copyright 2020 Google LLC
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

const rule = require('unified-lint-rule');
const {URL} = require('url');
const visit = require('unist-util-visit');
const siteData = require('../../src/site/_data/site');

module.exports = rule('remark-lint:bad-urls', checkURL);

/**
 * Walk the AST for the markdown file and find any bad URLs.
 * @param {*} tree An AST of the markdown file.
 * @param {*} file The markdown file.
 */
function checkURL(tree, file) {
  visit(tree, 'link', visitor);

  /* eslint-disable require-jsdoc */
  function visitor(node) {
    const nodeUrl = node.url;
    if (!nodeUrl) {
      return;
    }
    const parsed = new URL(nodeUrl, siteData.url);

    // If URL hostname is "wiki.developer.mozilla.org", warn to change to
    // "developer.mozilla.org".
    if (parsed.hostname === 'wiki.developer.mozilla.org') {
      const reason = 'Change URL hostname to "developer.mozilla.org".';
      file.message(reason, node);
    }
  }
}
