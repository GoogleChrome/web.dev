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
  getPostParentUrl,
} = require('../../../../../src/site/_filters/get-post-parent-url');

/**
 * @param path
 * @returns {EleventyCollectionItem}
 */
function createMockPost(path) {
  return /** @type {EleventyCollectionItem} */ ({
    data: {
      page: {
        filePathStem: `${path}index`,
      },
    },
  });
}

describe('get-post-parent-url', function () {
  describe('getPostParentUrl', function () {
    it('returns /tags/ from /tags/privacy/', async function () {
      expect(getPostParentUrl(createMockPost('/tags/privacy/'))).to.equal(
        '/tags/',
      );
    });

    it('returns / from /introducing-learn-privacy/', async function () {
      expect(
        getPostParentUrl(createMockPost('/introducing-learn-privacy/')),
      ).to.equal('/');
    });
  });
});
