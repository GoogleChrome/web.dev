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
const removeDrafts = require('../../_filters/remove-drafts');

/* eslint-disable max-len */

/**
 * Count the number of posts in a learning path.
 * @param {*} learningPath A learning path data object.
 * @param {string} lang Language of the page.
 * @return {string}
 */
function getPostCount(learningPath, lang) {
  // TODO (robdodson): It's annoying to have to removeDrafts both here and
  // in path.njk. Ideally we should do this in the learningPath .11ty.js files
  // but eleventy hasn't parsed all of the collections when those files get
  // initialized so we can't look up posts by slug.

  // Merge subtopic pathItems
  const flattenedTopics = learningPath.topics.map((topic) => {
    const subPathItems = (topic.subtopics || []).reduce(
      (accumulator, subtopic) => {
        return [...accumulator, ...subtopic.pathItems];
      },
      [],
    );
    return {
      ...topic,
      pathItems: [...(topic.pathItems || []), ...subPathItems],
    };
  });

  const topics = removeDrafts(flattenedTopics, lang);
  const count = topics.reduce((pathItemsCount, topic) => {
    return pathItemsCount + topic.pathItems.length;
  }, 0);
  const label = count > 1 ? 'resources' : 'resource';
  return `${count} ${label}`;
}

/**
 * PathCard used to preview learning paths.
 * @param {Object} path A learning path data object.
 * @param {string} lang Language of the page.
 * @return {string}
 */
module.exports = (path, lang) => {
  return html`
    <a href="/${path.slug}" class="w-card" role="listitem">
      <div class="w-path-card">
        <div class="w-path-card__info">
          <ul class="w-path-card__info-list">
            <li
              class="w-path-card__info-listitem w-path-card__info-listitem--category"
            >
              Collection
            </li>
            <li
              class="w-path-card__info-listitem w-path-card__info-listitem--more-info"
            >
              ${getPostCount(path, lang)}
            </li>
            <li
              class="w-path-card__info-listitem w-path-card__info-listitem--updated"
            >
              Updated <time>${path.date}</time>
            </li>
          </ul>
        </div>
        <div class="w-path-card__cover">
          <img
            class="w-path-card__cover-image"
            src="${path.cover}"
            alt=""
            loading="lazy"
            width="100%"
            height="240"
          />
        </div>
        <div class="w-path-card__desc">
          <h2 class="w-path-card__headline">${path.title}</h2>
          <p class="w-path-card__subhead">
            ${path.description}
          </p>
        </div>
      </div>
    </a>
  `;
};
