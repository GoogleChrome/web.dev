/**
 * @license
 * Copyright 2020 Google Inc. All rights reserved.
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

require('../../../../../../src/lib/components/LivestreamContainer/index');

describe('LivestreamContainer', function () {
  let container;

  before(async function () {
    await customElements.whenDefined('web-livestream-container');

    container = document.createElement('web-livestream-container');
    document.body.append(container);
    container.onStateChanged({activeEventDay: null, isSignedIn: false});
  });

  after(() => {
    container.remove();
  });

  it.skip('should reload on signed-in state change', async function () {
    container.onStateChanged({
      activeEventDay: {
        videoId: 'HtTyRajRuyY',
        isChatActive: false,
      },
      isSignedIn: true,
    });
    await container.updateComplete;

    container.onStateChanged({
      activeEventDay: {
        videoId: 'HtTyRajRuyY',
        isChatActive: false,
      },
      isSignedIn: false,
    });
    await container.updateComplete;
  });
});
