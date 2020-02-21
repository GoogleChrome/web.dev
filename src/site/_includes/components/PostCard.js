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
const constants = require("../../_utils/constants");
const getImagePath = require("../../_utils/get-image-path");
const getSrcsetRange = require("../../_utils/get-srcset-range");
const postTags = require("../../_data/postTags");

/* eslint-disable require-jsdoc,indent,max-len */

/**
 * PostCard used to preview posts.
 * @param {Object} post An eleventy collection item with post data.
 * @return {string}
 */
module.exports = ({post, featured = false}) => {
  const url = stripLanguage(post.url);
  const data = post.data;
  const displayedTags = [];

  for (const tag of data.tags) {
    const foundTag = postTags[tag.toLowerCase()];
    if (foundTag) {
      displayedTags.push(foundTag);
    }
    if (displayedTags.length === constants.POST_CARD_CHIP_COUNT) {
      break;
    }
  }

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
                <a href="${author.href}">
                  <img
                    class="w-author__image w-author__image--small"
                    src="/images/authors/${authorId}.jpg"
                    alt="${fullName}"
                  />
                </a>
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
              <a class="w-author__name-link" href="/authors/${authorId}"
                >${fullName}</a
              >
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

  function renderChips() {
    if (!displayedTags.length) {
      return;
    }
    return html`
      <div class="w-card__chips w-chips">
        ${displayedTags.map((displayedTag) => {
          return html`
            <a class="w-chip" href="${displayedTag.href}"
              >${displayedTag.title}</a
            >
          `;
        })}
      </div>
    `;
  }

  return html`
    <div class="w-card">
      <article class="w-post-card ${featured ? "w-post-card--featured" : ""}">
        <div
          class="w-post-card__cover ${thumbnail &&
            `w-post-card__cover--with-image`}"
        >
          <a class="w-post-card__link" tabindex="-1" href="${url}">
            ${thumbnail && renderThumbnail(url, thumbnail, alt)}
          </a>
        </div>
        <div class="w-post-card__blurb">
          <a class="w-post-card__link" href="${url}">
            <h2
              class="${thumbnail
                ? `w-post-card__headline--with-image`
                : `w-post-card__headline`}"
            >
              ${md(data.title)}
            </h2>
          </a>
          ${renderAuthorsAndDate(post)}
          <div class="w-post-card__desc">
            <a class="w-post-card__link" tabindex="-1" href="${url}">
              <p class="w-post-card__subhead">
                ${md(data.subhead)}
              </p>
            </a>
            ${renderChips()}
          </div>
        </div>
      </article>
    </div>
  `;
};
