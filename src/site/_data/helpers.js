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

const hashList = new Set();

/**
 * @param {string[]|undefined} urls
 * @return {string}
 */
function generateScriptLoader(urls) {
  let loader = `function loadScript(url, type, async) {
    const s = document.createElement('script');
    s.async = async;
    s.src = url;
    if (type) {
      s.type = type;
    }
    document.head.appendChild(s);
  }`;
  loader += `loadScript('${hashForProd('/js/app.js')}', 'module', false);`;
  if (urls && urls.length) {
    for (const url of urls) {
      loader += `loadScript('${hashForProd(url)}', 'module', false);`;
    }
  } else {
    loader += `loadScript('${hashForProd(
      '/js/default.js',
    )}', 'module', false);`;
  }
  if (process.env.ELEVENTY_ENV === 'prod') {
    loader += `loadScript('https://www.google-analytics.com/analytics.js', null, true);`;
  }
  hashList.add(`'sha256-${sha256base64(loader)}'`);
  return loader;
}

function generateAnalyticsScript(prod, trackingVersion, version) {
  const script = `
    window.ga =
      window.ga ||
      function () {
        (ga.q = ga.q || []).push(arguments);
      };
    ga.l = +new Date();
    ga('create', '${prod}');
    ga('set', 'transport', 'beacon');
    ga('set', 'page', window.location.pathname);
    ga('set', '${trackingVersion}', '${version}');
    ga('send', 'pageview');
  `;
  hashList.add(`'sha256-${sha256base64(script)}'`);
  return script;
}

module.exports = {
  algolia,
  hashForProd,
  generateScriptLoader,
  generateAnalyticsScript,
  hashList,
};
