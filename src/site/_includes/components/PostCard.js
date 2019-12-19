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

const {html} = require("common-tags");
const prettyDate = require("../../_filters/pretty-date");
const stripLanguage = require("../../_filters/strip-language");
const md = require("../../_filters/md");
const getImagePath = require("../../_utils/get-image-path");
const getSrcsetRange = require("../../_utils/get-srcset-range");

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
  const alt = data.alt || "";

  function renderThumbnail(url, img, alt) {
    const imagePath = getImagePath(img, url);
    const srcsetRange = getSrcsetRange(240, 768);

    return html`
      <figure class="w-post-card__figure">
        <img
          class="w-post-card__image"
          sizes="365px"
          srcset="${srcsetRange.map(
            (width) => html`
              ${imagePath}?auto=format&fit=max&w=${width} ${width}w,
            `,
          )}"
          src="${imagePath}"
          alt="${alt}"
          width="100%"
          height="240"
          loading="lazy"
        />
      </figure>
    `;
  }

  function renderAuthorImages(authors) {
    if (!Array.isArray(authors) || authors.length > 2) return;

    return html`
      <div class="w-author__image--row">
        ${authors
          .map((authorId) => {
            const author = data.contributors[authorId];
            const fullName = `${author.name.given} ${author.name.family}`;
            return html`
              <div class="w-author__image--row-item">
                <img
                  class="w-author__image w-author__image--small"
                  src="/images/authors/${authorId}.jpg"
                  alt="${fullName}"
                />
              </div>
            `;
          })
          .reverse()}
      </div>
    `;
  }

  function renderAuthorNames(authors) {
    if (!Array.isArray(authors)) return;

    return html`
      <span class="w-author__name">
        ${authors
          .map((authorId) => {
            const author = data.contributors[authorId];
            const fullName = `${author.name.given} ${author.name.family}`;
            return html`
              ${fullName}
            `;
          })
          .join(", ")}
      </span>
    `;
  }

  function renderAuthorsAndDate(post) {
    const authors = post.data.authors;

    return html`
      <div class="w-authors__card">
        ${renderAuthorImages(authors)}
        <div>
          ${renderAuthorNames(authors)}
          <div class="w-author__published">
            <time>${prettyDate(post.date)}</time>
          </div>
        </div>
      </div>
    `;
  }

  return html`
    <a href="${url}" class="w-card">
      <article class="w-post-card">
        <div
          class="w-post-card__cover ${thumbnail &&
            `w-post-card__cover--with-image`}"
        >
          ${thumbnail && renderThumbnail(url, thumbnail, alt)}
          <h2
            class="${thumbnail
              ? `w-post-card__headline--with-image`
              : `w-post-card__headline`}"
          >
            ${md(data.title)}
          </h2>
        </div>
        ${renderAuthorsAndDate(post)}
        <div class="w-post-card__desc">
          <p class="w-post-card__subhead">
            ${md(data.subhead)}
          </p>
        </div>
      </article>
    </a>
  `;
};
