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
 * Iframe embed of a Youtube playlist
 * @param {string} id Id of the playlist from Youtube
 * @param {{src?: string; allow?: string; style?: string; title?: string;}} options
 * @return string
 */
module.exports = (id, options) => {
  if (!id) {
    return;
  }
  const iframeStyle = [
    'height: 100%;',
    'left: 50%;',
    'position: absolute;',
    'top: 50%;',
    'transform: translate(-50%, -50%);',
    'border: 0;',
    'width: 100%',
  ];
  let iframeProps = {
    allow:
      'accelerometer; autoplay; clipboard-write; ' +
      'encrypted-media; gyroscope; picture-in-picture',
    src: `https://www.youtube.com/embed/videoseries?list=${id}`,
    style: iframeStyle.join(''),
    title: 'Youtube Playlist',
  };
  iframeProps = {...iframeProps, ...options};
  const {allow, src, style, title} = iframeProps;
  return `
    <div class="youtube">
      <iframe
        allow="${allow}"
        loading="lazy"
        src="${src}"
        style="${style}"
        title="${title}"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  `;
};
