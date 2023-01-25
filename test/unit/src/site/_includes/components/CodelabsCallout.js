/**
 * @license
 * Copyright 2021 Google Inc. All rights reserved.
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

const {expect} = require('chai');
const cheerio = require('cheerio');

const {defaultLanguage} = require('../../../../../../src/lib/utils/language');
const {memoize} = require('../../../../../../src/site/_filters/find-by-url');
const CodelabsCallout = require('../../../../../../src/site/_includes/components/CodelabsCallout');

const collectionAll = /** @type {EleventyCollectionItem[]} */ ([
  {url: '/en/foo/bar/', data: {title: 'foobar'}},
  {url: '/en/foo-bar/', data: {title: 'foobar'}},
  {url: '/en/foobar/', data: {title: 'foobar'}},
  {url: '/es/fizzbuzz/', data: {title: 'fizzbuzz'}},
]);

describe('CodelabsCallout', function () {
  describe('CodelabsCallout', function () {
    it('returns call out with correct links', async function () {
      memoize(collectionAll);
      const html = CodelabsCallout(
        collectionAll.map((i) =>
          i.url.replace(/^\/([a-z]{2})\//, '').replace(/\/$/, ''),
        ),
        'en',
      );
      const $ = cheerio.load(html);
      const li = $('li');
      expect(li.length).to.equal(3);
    });

    it('returns an empty string if URLs not found', async function () {
      const html = CodelabsCallout(
        collectionAll.map((i) => i.url + '/pop'),
        'en',
      );
      expect(html).to.equal('');
    });

    it('returns the default-language codelab as a fallback', async function () {
      const html = CodelabsCallout('foobar', 'zz');
      const $ = cheerio.load(html);
      expect($('a').attr('href')).to.equal(`/${defaultLanguage}/foobar/`);
      expect($('span').text()).to.equal('foobar');
    });
  });

  describe('CodelabsCallout.renderCodelab', function () {
    it('creates links for codelabs', async function () {
      collectionAll.forEach((item) => {
        const html = CodelabsCallout.renderCodelab(item);
        const $ = cheerio.load(html);
        expect($('a').attr('href')).to.equal(item.url);
        expect($('span').text()).to.equal(item.data.title);
      });
    });
  });
});
