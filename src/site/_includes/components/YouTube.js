/*
 * Copyright 2019 Google LLC
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

const {html} = require('common-tags');

/* eslint-disable max-len */

/**
 * A YouTube video embed.
 * @param {string} id The id of the YouTube video
 * @param {string} startTime A start time for the video
 * @return {string}
 */
module.exports = (id, startTime) => {
  if (!id) {
    throw new Error('Cannot create YouTube component if id is undefined');
  }

  // Don't load YT iframe in our test environment. This specifically affects
  // screenshot testing where the iframe can be slow or flaky to load and fail
  // because YouTube is always fiddling with their UI.
  // Load a placeholder to fill the space instead.
  if (process.env.PERCY) {
    return html`
      <div class="w-youtube" style="background: aquamarine;">
        YouTube iframe placeholder
      </div>
    `;
  }

  let src = `https://www.youtube.com/embed/${id}`;
  if (startTime) {
    src += `?start=${startTime}`;
  }

  return html`
    <div class="w-youtube">
      <iframe
        class="w-youtube__embed"
        src="${src}"
        title="youtube embed"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
      ></iframe>
    </div>
  `;
};
