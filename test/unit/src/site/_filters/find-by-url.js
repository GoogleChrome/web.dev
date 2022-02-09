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
const {
  memoize,
  findByUrl,
} = require('../../../../../src/site/_filters/find-by-url');

const collectionAll = /** @type {EleventyCollectionItem[]} */ ([
  {url: '/en/foo/bar/', data: {title: 'foobar'}},
  {url: '/en/foo-bar/', data: {title: 'foobar'}},
  {url: '/en/foobar/', data: {title: 'foobar'}},
  {url: '/es/fizzbuzz/', data: {title: 'fizzbuzz'}},
]);

describe('find-by-url', function () {
  describe('memoize', function () {
    it('creates memo when there are no duplicates', async function () {
      expect(() => memoize(collectionAll)).not.to.throw();
    });

    it('throws error when duplicate URLs provided', async function () {
      const duplicates = [...collectionAll, ...collectionAll];
      expect(() => memoize(duplicates)).to.throw();
    });

    it("throws error when an array isn't passed in", async function () {
      ['foobar', 2, true, {}, Date].forEach((i) => {
        //@ts-ignore
        expect(() => memoize(i)).to.throw();
      });
    });
  });

  describe('findByUrl', function () {
    it('returns url in memo', async function () {
      memoize(collectionAll);
      expect(findByUrl(collectionAll[0].url)).to.deep.equal(collectionAll[0]);
    });

    it('throws error when no URL provided', async function () {
      //@ts-ignore
      expect(() => findByUrl()).to.throw();
    });

    it('returns `undefined` when url not found', async function () {
      expect(findByUrl('pop/foo-bar')).to.deep.equal(undefined);
    });
  });
});
