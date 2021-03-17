/*
 * Copyright 2021 Google LLC
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
const {Img} = require('./Img');

/**
 * @typedef {{image: string, name:{given: string, family: string}, connect: {url: string, topics: string[]}}} Author
 */

/**
 * ConnectCard used to present authors you can meet.
 * @param {Author} author
 * @return {string}
 */
module.exports = function (author) {
  function renderThumbnail(src, alt) {
    const img = Img({
      src,
      alt,
      width: '192',
      height: '192',
      class: 'w-card-author__image',
    });

    /* eslint-disable indent */
    return html`
      <figure class="w-card-base__figure w-card-author__figure">
        ${img}
      </figure>
    `;
    /* eslint-enable indent */
  }

  return html`
    <div class="w-card w-card-author" role="listitem">
      <article class="w-card-base">
        <div class="w-card-base__cover w-card-base__cover--with-image">
          ${renderThumbnail(author.image, '')}
        </div>
        <h2 class="w-card-base__headline--with-image">
          ${author.name.given + ' ' + author.name.family}
        </h2>
        <a
          class="w-button w-button--primary gap-bottom-300"
          href="${author.connect.url}"
        >
          Book a meeting
        </a>
        <div>
          <strong>Topics:</strong>
          ${author.connect.topics.join(', ')}
        </div>
      </article>
    </div>
  `;
};
