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

/**
 * @fileoverview Provides a transform that builds partials, as well as finding
 * the build info and file manifest for web.dev's Service Worker.
 *
 * Operates in three parts:
 *   1. a reset method, which must be called from within Eleventy's "beforeBuild" event
 *   2. a transform which waits until "dist/sw-payload" is processed
 *   3. all other transforms (to generate partials) block until that payload is parsed
 *
 * The payload is generated inside the peer 'sw-payload-build.js' file. It
 * requires all the normal top-level dependencies and converts them into a
 * resourcesVersion both the top-level payload, and every partial, includes.
 *
 * This is needed so our SPA routing and Service Worker can fetch partials in order to hydrate the
 * main web.dev template, cutting down on bytes needed to render further pages.
 */

const fs = require('fs').promises;
const path = require('path');
const cheerio = require('cheerio');
const generatePayload = require('./sw-payload-build');

let pendingBuildInfo = new Error('no recent build');
let resolveBuildInfo = () => {};

const resetPartialsBuild = () => {
  pendingBuildInfo = new Promise((r) => (resolveBuildInfo = r));
};

const writePartial = async (to, raw) => {
  await fs.mkdir(path.dirname(to), {recursive: true});
  await fs.writeFile(to, JSON.stringify(raw));
};

const getPartial = (content, recentBuild) => {
  const $ = cheerio.load(content);
  const partial = {
    raw: $('#content').html(),
    lang: $('html').attr('lang'),
    title: $('title').text(),
    rss: $('link[type="application/atom+xml"]').attr('href'),
    offline: Boolean($('meta[name="offline"]').attr('content')) || false,
    ...recentBuild,
  };
  return {$, partial};
};

const serviceWorkerPartials = async (content, outputPath) => {
  // If we're generating the SW payload, then this will resolve payloadPromise and allow all other
  // builds to complete.
  if (outputPath === 'dist/sw-payload') {
    const buildInfo = await generatePayload(content);
    resolveBuildInfo({
      resourcesVersion: buildInfo.resourcesVersion,
      builtAt: buildInfo.builtAt,
    });
    console.info(
      'Generated web.dev resourcesVersion:',
      buildInfo.resourcesVersion,
    );
    return JSON.stringify(buildInfo);
  }

  // Page has permalink set to false and will not be rendered.
  if (!outputPath) {
    return content;
  }

  // Unexpected output format.
  if (!outputPath.endsWith('/index.html')) {
    return content;
  }

  // Skip the web.dev/LIVE page to force online-only.
  if (outputPath === 'dist/en/live/index.html') {
    return content;
  }

  const buildInfo = await pendingBuildInfo;

  const {$, partial} = getPartial(content, buildInfo);
  const suffixLength = 'index.html'.length;
  const partialOutputPath =
    outputPath.substr(0, outputPath.length - suffixLength) + 'index.json';
  await writePartial(partialOutputPath, partial);

  // Don't modify the offline partial's HTML; this avoids a circular loop in dev. We use the
  // offline HTML's contents to feed into the hash to build resourcesVersion, so every build, the
  // previous resourcesVersion feeds into updated resourcesVersion, ... so we stop here.
  // In practice, users don't load the offline page directly, so this doesn't matter.
  if (partial.offline) {
    return content;
  }

  // Mark the output HTML with the built resources version, matching the partial.
  $('body').attr('data-resources-version', buildInfo.resourcesVersion);
  return $.html();
};

module.exports = {
  serviceWorkerPartials,
  getPartial,
  writePartial,
  resetPartialsBuild,
};
