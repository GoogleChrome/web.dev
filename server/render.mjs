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

const SITE_ORIGIN = 'https://web.dev';

let browser = null;

/**
 * Constructs a page by fetching it from web.dev, then merging it with the
 * the local version on disk.
 * @param {string} path File path to render.
 * @param {!Object} options Optional config settings.
 *     stagingServerOrigin: Origin of staging server.
 *     headless: False launches headful chrome instead of headless.
 * @return {!Promise<?string>} Serialized page output as an html string or null
 *     if the local page file does not exist.
 */
export async function constructPage(path, {
  stagingServerOrigin = null,
  headless = true,
} = {}) {
  path = path.slice(1); // strip leading '/'.
  const url = `${SITE_ORIGIN}/${path}`;

  if (!browser) {
    browser = await puppeteer.launch({
      headless,
      // TODO: check if we need to consider defaultViewport for mobile.
      defaultViewport: null,
    });
  }

  // Read local version of the page. Replace {% include %} with their content.
  const localPageHTML = replaceIncludes(await readLocalPageContent(path));
  if (!localPageHTML) {
    return null;
  }

  const page = await fetchRemotePage(url);

  // Replace main body of the remote page with the local copy.
  await page.evaluate((path, localPageHTML, stagingServerOrigin) => {
    const mainContentArea = document.querySelector('.devsite-article-body');
    // Replace page with include filled in version.
    mainContentArea.innerHTML = localPageHTML;

    // Map relative assets to their local version. Relative assets that do
    // not exist locally (e.g. /_static images) are pulled from the prod site.
    document.querySelectorAll('[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (src.startsWith('/_static/')) {
        // eslint-disable-next-line
        el.src = el.src; // rewrite src attr to be browser's resolved url.
      }
    });

    // Lastly, inject <base> on on page so relative resources load local version
    // when the page is loaded in the browser by the viewer.
    const base = document.createElement('base');
    base.href = `${stagingServerOrigin}/${path}/`;
    document.head.prepend(base); // Add to top of head, before other resources.
  }, path, localPageHTML, stagingServerOrigin);

  const finalHTML = await page.content(); // serialized HTML of assembled page.

  await page.close();

  return finalHTML;
}

/**
 * @param {string} url Page to fetch.
 * @return {!Promise<!Page>}
 */
async function fetchRemotePage(url) {
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
    // eslint-disable-next-line
    console.error(err.message);
    await page.close();
    throw new Error('page.goto/waitForSelector timed out.');
  }

  // If page is new (e.g. doesn't exist in production yet), need to wrap it in
  // local content in a generic header/footer. Wrap it in index page's markup.
  if (resp.status() === 404) {
    return await fetchRemotePage(SITE_ORIGIN);
  }

  return page;
}

/**
 * Read local file content from disk.
 * @param {string} path
 * @return {!Promise<?string>}
 */
async function readLocalPageContent(path) {
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
    // eslint-disable-next-line
    console.warn(err);
    // noop
  }

  return null;
}

/**
 * Replaces page's {% include "file.html" %} pragmas.
 * @param {?string} html
 * @return {?string}
 */
function replaceIncludes(html) {
  if (!html) {
    return null;
  }

  const re = /{% include "(.*)\.html" %}/g;
  return html.replace(re, (match, filename, offset) => {
    try {
      const html = fs.readFileSync(`./build/en/${filename}.html`, {
        encoding: 'utf-8',
      });
      return html;
    } catch (err) {
      // eslint-disable-next-line
      console.warn(err);
    }
    return '';
  });
}
