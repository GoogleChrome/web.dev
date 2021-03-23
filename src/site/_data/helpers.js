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

const {algolia} = require('./lib/algolia');
const {hashForProd} = require('./lib/hash');
const {sha256base64} = require('../_data/lib/hash');

var cspList = [];

/**
 * @param {string[]|undefined} urls
 * @param {string} fileSlug
 * @return {string}
 */
function generateScriptLoader(urls, fileSlug) {
  let loader = `function loadScript(url, type, async) {
    const s = document.createElement('script');
    s.async = async;
    s.src = url;
    if (type) {
      s.type = type;
    }
    document.head.appendChild(s);
  }`;
  loader += `loadScript('${hashForProd('/js/app.js')}', 'module', false);`
  if (urls && urls.length) {
    for (const url of urls) {
      loader += `loadScript('${hashForProd(url)}', 'module', false);`
    }
  } else {
    loader += `loadScript('${hashForProd('/js/default.js')}', 'module', false);`
  }
  if (process.env.ELEVENTY_ENV === 'prod') {
    loader += `loadScript('https://www.google-analytics.com/analytics.js', null, true);`
  }
  cspList.push({
    source: `**/${fileSlug}`,
    headers: [{
      key: 'Content-Security-Policy',
      value: `script-src 'sha256-${sha256base64(loader)}' 'sha256-oLlXvYrAXNpxsHIJR8GYvfGt1KpMzunKX0gK0ScuHk0=' 'strict-dynamic' 'unsafe-inline' http: https:; object-src 'none'; base-uri 'self'`,
      loader,
    }]
  })
  return loader;
}

module.exports = {
  algolia,
  hashForProd,
  generateScriptLoader,
  cspList,
};
