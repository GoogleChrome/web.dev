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

import yaml from 'js-yaml';
import fs from 'fs';
import escapeStringRegexp from 'escape-string-regexp';

export const baseUrlPrefix = 'https://web.dev/';

/**
 * Normalizes the passed path (not a whole URL) to ensure that it ends with a
 * simple trailing slash. Removes "index.html" if found.
 *
 * @param {string} path to normalize
 * @return {string}
 */
export function ensureTrailingSlashOnly(path) {
  if (path.endsWith('/index.html')) {
    return path.slice(0, -'index.html'.length);
  } else if (!path.endsWith('/')) {
    return `${path}/`;
  }
  return path;
}

/**
 * Builds a method which returns a URL to redirect to.
 *
 * @param {string} yamlSource to parse redirects from
 * @param {string} baseUrlPrefix domain prefix to use, e.g. "https://web.dev/"
 * @return {function(string): ?string}
 */
export function prepareHandler(yamlSource, baseUrlPrefix) {
  const doc = yaml.safeLoad(yamlSource) as TODO;
  baseUrlPrefix = ensureTrailingSlashOnly(baseUrlPrefix);

  const groupRedirect = {};
  const singleRedirect = {};

  for (const {from, to} of doc.redirects) {
    const hasExtra = from.indexOf('...') !== -1;
    if (!hasExtra) {
      singleRedirect[ensureTrailingSlashOnly(from)] = to;
      continue;
    }

    // "Group" redirects' from must end with "/...", i.e., match the last
    // whole path component.
    if (!from.endsWith('/...')) {
      throw new TypeError(`got redirect with invalid ...: ${from} => ${to}`);
    }
    groupRedirect[from.slice(0, -3)] = to;
  }

  // Build a single RegExp for group matches, for speed of matching.
  const escaped = Object.keys(groupRedirect).map(escapeStringRegexp);
  const groupMatcher = new RegExp(`^(${escaped.join('|')})`);

  return (raw) => {
    let target;

    // Split the raw URL (expected to be "/foo?bar") into path and query parts.
    const parts = raw.split('?');
    const path = parts[0];
    const query = parts[1] || '';

    const url = ensureTrailingSlashOnly(path);
    if (url in singleRedirect) {
      target = new URL(singleRedirect[url], baseUrlPrefix);
    } else {
      const m = groupMatcher.exec(url);
      if (!(m && m[1] in groupRedirect)) {
        return null;
      }
      const base = groupRedirect[m[1]];
      const rest = url.slice(m[1].length);

      if (base.endsWith('/...')) {
        target = new URL(base.slice(0, -3) + rest, baseUrlPrefix);
      } else {
        target = new URL(base, baseUrlPrefix);
      }
    }

    // Merge the original request's params into the target. We don't use
    // Express' req.query here as it expands the query too much, e.g.,
    // 'foo[bar]=123' ends up like "{foo: {bar: 123}}".
    const requestParams = new URLSearchParams(query);
    for (const [key, value] of requestParams) {
      target.searchParams.append(key, value);
    }

    // If the result URL starts with "https://web.dev/" (with trailing slash),
    // then strip it and treat as local. This allows redirects to work in dev,
    // where the domain is localhost or a staging URL.
    let s = target.toString();
    if (s.startsWith(baseUrlPrefix)) {
      s = '/' + s.substr(baseUrlPrefix.length);
    }
    return s;
  };
}

/**
 * Builds HTTP middleware that serves redirects for web.dev's _redirects.yaml
 * configuration file, originally from DevSite.
 *
 * @param {string} filename to load configuration from
 * @param {number=} code to use (DevSite uses 301)
 * @return {!Function}
 */
export function build(filename, code = 301) {
  const handler = prepareHandler(
    fs.readFileSync(filename, 'utf8'),
    baseUrlPrefix,
  );

  return (req, res, next) => {
    const target = handler(req.url);
    if (target !== null) {
      return res.redirect(code, target);
    }
    return next();
  };
}
