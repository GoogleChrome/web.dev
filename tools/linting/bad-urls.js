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

// Based on this Stack Overflow answer: https://bit.ly/3ELKYq3
const locale = /^\/[a-z]{2,3}-[a-z0-9]{2,4}(-[a-z]{2})?/i;

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

    // If the URL hostname is web.dev, yell about it, because those links should
    // be relative, not absolute.
    if (parsed.hostname === 'web.dev') {
      const reason = 'Internal links to web.dev should be relative.';
      file.message(reason, node);
    }

    // If the URL is to MDN and contains localization info (e.g., en-US), warn
    // to remove the localization part of the URL.
    if (
      parsed.hostname === 'developer.mozilla.org' &&
      locale.test(parsed.pathname) === true
    ) {
      const [matchedLocale] = parsed.pathname.match(locale);
      const reason = `An MDN link contains a locale (${matchedLocale}). Please remove the locale from the link.`;

      file.message(reason, node);
    }
  }
}
