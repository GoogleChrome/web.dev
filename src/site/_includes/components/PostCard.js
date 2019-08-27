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
const stripLanguage = require('../../_filters/strip-language');

/* eslint-disable require-jsdoc,indent,max-len */

/**
 * PostCard used to preview posts.
 * @param {Object} post An eleventy collection item with post data.
 * @return {string}
 */
module.exports = ({post}) => {
  const url = stripLanguage(post.url);
  const data = post.data;

  // If the post does not provide a thumbnail, attempt to reuse the hero image.
  // Otherwise, omit the image entirely.
  const thumbnail = data.thumbnail || data.hero || null;
  const alt = data.alt || '';

  function renderThumbnail(url, img, alt) {
    return html`
      <figure class="w-post-card__figure">
        <img class="w-post-card__image" src="${url + img}" alt="${alt}" />
      </figure>
    `;
  }

  // function renderAuthors(authors) {
  //   return html`
  //     <div class="w-authors">
  //       ${authors.map((author) => {
  //         return `${Author({
  //           post,
  //           author: contributors[author],
  //           avatar: author,
  //           small: true,
  //         })}`;
  //       })}
  //     </div>
  //   `;
  // }

  return html`
    <a href="${url}" class="w-card">
      <article class="w-post-card">
        <div
          class="w-post-card__cover ${thumbnail && `w-post-card__cover--with-image`}"
        >
          ${thumbnail && renderThumbnail(url, thumbnail, alt)}
          <h2
            class="${thumbnail
              ? `w-post-card__headline--with-image`
              : `w-post-card__headline`}"
          >
            ${data.title}
          </h2>
          
        </div>
        <div class="w-post-card__desc">
          <p class="w-post-card__subhead">
            ${data.subhead}
          </p>
        </div>
      </article>
    </a>
  `;
};
