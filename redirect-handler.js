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

const yaml = require('js-yaml');
const fs = require('fs');
const escapeStringRegexp = require('escape-string-regexp');

/**
 * Normalizes the passed URL to ensure that it ends with a simple trailing
 * slash. Removes "index.html" if found.
 *
 * @param {string} url to normalize
 * @return {string}
 */
function ensureTrailingSlashOnly(url) {
  if (url.endsWith('/index.html')) {
    return url.slice(0, -'index.html'.length);
  } else if (!url.endsWith('/')) {
    return `${url}/`;
  }
  return url;
}

/**
 * Builds HTTP middleware that serves redirects for web.dev's _redirects.yaml
 * configuration file, originally from DevSite.
 *
 * @param {string} filename to load configuration from
 * @param {number=} code to use (DevSite uses 301)
 * @return {!Function}
 */
module.exports = function buildRedirectHandler(filename, code = 301) {
  const doc = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));

  const groupRedirect = {};
  const singleRedirect = {};

  for (const {from, to} of doc.redirects) {
    const hasExtra = from.indexOf('...') !== -1;
    if (!hasExtra) {
      singleRedirect[ensureTrailingSlashOnly(from)] = to;
      continue;
    }

    // "Group" redirects' from and to must end with "/...", i.e., match the last
    // whole path component.
    if (!from.endsWith('/...') || !to.endsWith('/...')) {
      throw new TypeError(`got redirect with invalid ...: ${from} => ${to}`);
    }
    groupRedirect[from.slice(0, -3)] = to.slice(0, -3); // but only slice "..."
  }

  // Build a single RegExp for group matches, for speed of matching.
  const escaped = Object.keys(groupRedirect).map(escapeStringRegexp);
  groupMatcher = new RegExp(`^(${escaped.join('|')})`);

  return (req, res, next) => {
    const url = ensureTrailingSlashOnly(req.url);
    if (url in singleRedirect) {
      return res.redirect(code, singleRedirect[url]);
    }

    const m = groupMatcher.exec(url);
    if (m && m[1] in groupRedirect) {
      const base = groupRedirect[m[1]];
      const rest = url.slice(m[1].length);
      return res.redirect(code, base + rest);
    }

    next();
  };
};
