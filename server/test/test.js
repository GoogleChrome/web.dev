/* eslint-env node, mocha */

/**
 * Copyright 2019 Google Inc. All rights reserved.
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
 * @fileoverview Tests for preview server.
 *
 * @author Eric Bidleman <e.bidelman@>
 */

const assert = require('assert').strict;
const puppeteer = require('puppeteer');

const SERVER = 'http://localhost:8080';
let browser;

before(async function launchChrome() {
  if (!browser) {
    browser = await puppeteer.launch({
      // headless: false,
      // defaultViewport: null,
    });
  }
});

after(async function closeChrome() {
  await browser.close();
});

// describe('Constructs pages', () => {
//   let page;

//   beforeEach(async function() {
//     page = await browser.newPage();
//   });

//   afterEach(async () => {
//     await page.close();
//   });

//   it('fetches remote page', async function() {

//   });
// });

describe('Image tests', () => {
  let page;

  beforeEach(async function() {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  /**
   * @param {string} url
   * @reutrn {!Promise<undefined>}
   */
  async function verifyImagesLoad(url) {
    const requests = [];

    page.on('request', (req) => requests.push(req));
    await page.goto(url, {waitUntil: 'networkidle2'});

    for (const req of requests) {
      const resp = req.response();
      if (req.resourceType() === 'image' && resp.status() === 404) {
        assert.ok(false, `${resp.url()} was missing.`);
      }
    }

    assert.ok(true);
  }

  it('renders local images on /', async function() {
    await verifyImagesLoad(`${SERVER}/`);
  }).timeout(10 * 10000);

  it('renders local images on /measure', async function() {
    await verifyImagesLoad(`${SERVER}/measure`);
  }).timeout(10 * 10000);

  it('renders local images on page 1', async function() {
    await verifyImagesLoad(`${SERVER}/installable/add-manifest`);
  }).timeout(10 * 10000);

  it('renders local images on page 2', async function() {
    await verifyImagesLoad(
      `${SERVER}/fast/discover-performance-opportunities-with-lighthouse`);
  }).timeout(10 * 10000);

  it('renders local images on page 3', async function() {
    await verifyImagesLoad(`${SERVER}/fast/use-imagemin-to-compress-images`);
  }).timeout(10 * 10000);

  it('renders local images on page 4', async function() {
    await verifyImagesLoad(`${SERVER}/reliable/runtime-caching-with-workbox`);
  }).timeout(10 * 10000);
});

