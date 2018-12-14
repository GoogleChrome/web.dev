/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Provides server side rendering functionality using Puppeteer.
 *
 * @author Eric Bidleman <e.bidelman@>
 */

import fs from 'fs';
import url from 'url';
const URL = url.URL;
import puppeteer from 'puppeteer';

const DOMAIN = 'https://web.dev/';
const RENDER_CACHE = new Map(); // Cache of pre-rendered HTML pages.

let browser = null;

/**
 * Server-side renders a URL using headless chrome.
 * @param {string} url The url to prerender.
 * @param {string} path File path to render.
 * @param {!Object} config Optional config settings.
 *     path: Path of page to load.
 *     stagingServerOrigin: Origin of staging server.
 *     headless: Set to false to launch headlful chrome. Default is true.
 *         Note: this param will have no effect if Chrome was launched at
 *         least once with reuseChrome: true.
 * @return {!Promise<?string>} Serialized page output as an html string.
 */
export async function renderPage({path = null, stagingServerOrigin = null,
      useCache = true, headless = true} = {}) {
  const url = `${DOMAIN}${path}`;

  if (useCache && RENDER_CACHE.has(url)) {
    return RENDER_CACHE.get(url);
  }

  const tic = Date.now();

  if (!browser) {
    browser = await puppeteer.launch({
      // args: ['--disable-dev-shm-usage'],
      headless,
      // TODO: check if we need to consider defaultViewport for mobile.
      defaultViewport: null,
    });
  }

  // Get local version of page.
  const pageHTML = await getPageContent(path);
  if (!pageHTML) {
    return null;
  }

  const page = await getRemotePage(url);

  const body = await page.waitForSelector(
      '.devsite-article-body', {timeout: 2000});

  // Replace {% include %} with the actual (local) html.
  const include = replaceIncludes(pageHTML);

  await page.evaluate((body, include) => {
    // Replace page with include filled in version.
    body.innerHTML = include;

    // Map relative assets to their local version. Relative assets that do
    // not exist locally (e.g. /_static images) are pulled from the prod site.
    document.querySelectorAll('[src]').forEach(el => {
      const src = el.getAttribute('src');
      if (src.startsWith('/_static/')) {
        el.src = el.src;
      } else if (src.startsWith('./')) {
        el.src = `${location.pathname}/${el.getAttribute('src')}`;
      }
    });

    // // Lastly, inject <base> on on page so relative resources load local version
    // // when the page is loaded in the browser by the viewer.
    // // TODO: dont want to do this for relative links.
    // const base = document.createElement('base');
    // base.href = `${origin}${location.pathname}/`;
    // document.head.prepend(base); // Add to top of head, before all other resources.

  }, body, include);

  const finalHTML = await page.content(); // get page's serialized, final DOM.
  RENDER_CACHE.set(url, finalHTML); // Cache rendered page.

  console.info(`Headless rendered ${url} in: ${Date.now() - tic}ms`);

  await page.close();

  return finalHTML;
}

async function getRemotePage(url) {
  const page = await browser.newPage();

  // Add param so client-side page can know it's being rendered by headless
  // on the server.
  const urlToFetch = new URL(url);
  urlToFetch.searchParams.set('headless', '');

  let resp;
  try {
    resp = await page.goto(urlToFetch.href, {
      waitUntil: 'domcontentloaded',
      timeout: 5000,
    });
  } catch (err) {
    console.error(err.message);
    await page.close();
    throw new Error('page.goto/waitForSelector timed out.');
  }

  // If page is new (e.g. doesn't exist in production yet), need to wrap
  // it in local content in a generic header/footer. Wrap it in index page's markup.
  if (resp.status() === 404) {
    return await getRemotePage(DOMAIN);
  }

  return page;
}

async function getPageContent(path) {
  let filePath = `./build/en/${path}.html`;
  try {
    // If .html file doesn't exist, try folder's index.html file.
    if (!fs.existsSync(filePath)) {
      filePath = `./build/en/${path}/index.html`;
    }

    const html = fs.readFileSync(filePath, {encoding: 'utf-8'});
    const page = await browser.newPage();
    await page.setContent(html);
    const body = await page.evaluate('document.body.innerHTML');

    await page.close();
    return body;
  } catch (err) {
    console.warn(err);
    // noop
  }

  return null;
}

/**
 * Replaces page's {% include "file.html" %} pragmas.
 * @param {string} pageHTML
 */
function replaceIncludes(pageHTML) {
  const re = /{% include "(.*)\.html" %}/g;
  return pageHTML.replace(re, (match, filename, offset) => {
    try {
      const html = fs.readFileSync(
          `./build/en/${filename}.html`, {encoding: 'utf-8'});
      return html;
    } catch (err) {
      console.warn(err);
    }
    return '';
  });
}

export function clearCache() {
  RENDER_CACHE.clear();
}

/**
 * @param {string} url
 */
export function removCacheItem(url) {
  RENDER_CACHE.delete(url);
}
