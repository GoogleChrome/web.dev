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

const {assert} = require('../../assert');
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

  it('should render an iframe with a videoId', async function () {
    await container.updateComplete;
    assert(
      container.renderRoot.querySelector('iframe') === null,
      'no iframe should be rendered without videoId',
    );

    container.onStateChanged({
      activeEventDay: {
        videoId: 'HtTyRajRuyY',
        isChatActive: false,
      },
      isSignedIn: false,
    });
    await container.updateComplete;

    const ytIframe = container.renderRoot.querySelector('iframe');
    assert(ytIframe !== null, 'iframe should render');

    const iframes = container.renderRoot.querySelectorAll('iframe');
    assert(iframes.length === 1, 'should be single iframe');

    assert(
      ytIframe.src === 'https://www.youtube.com/embed/HtTyRajRuyY',
      'yt iframe src should be as expected',
    );

    container.onStateChanged({
      activeEventDay: {
        videoId: 'HtTyRajRuyY',
        isChatActive: true,
      },
      isSignedIn: false,
    });
    await container.updateComplete;

    const iframesWithChat = container.renderRoot.querySelectorAll('iframe');
    assert(iframesWithChat.length === 2, 'should be two iframes');
    assert(iframesWithChat[0] === ytIframe, 'YouTube iframe should not change');
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

    const ytIframe = container.renderRoot.querySelector('iframe');
    assert(ytIframe !== null, 'iframe should render');

    // nb. This works because our tests run with sandbox mode off. We can happily talk between
    // cross-origin frames and listen to their events.
    const p = new Promise((resolve) => {
      ytIframe.contentWindow.addEventListener('unload', resolve, {once: true});
    });

    container.onStateChanged({
      activeEventDay: {
        videoId: 'HtTyRajRuyY',
        isChatActive: false,
      },
      isSignedIn: false,
    });
    await container.updateComplete;

    // Mocha has a built-in timeout so this not resolving will fail.
    await p;
  });
});
