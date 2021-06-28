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

/* eslint-disable require-jsdoc */

module.exports = ({author, id, showSocialMedia = false}) => {
  if (!author) {
    throw new Error('Can not generate AuthorInfo without author object');
  }

  function renderTwitter({twitter}) {
    return html`
      <li class="w-author__link-listitem">
        <a class="w-author__link" href="https://twitter.com/${twitter}"
          >Twitter</a
        >
      </li>
    `;
  }

  function renderGitHub({github}) {
    return html`
      <li class="w-author__link-listitem">
        <a class="w-author__link" href="https://github.com/${github}">GitHub</a>
      </li>
    `;
  }

  function renderGlitch({glitch}) {
    return html`
      <li class="w-author__link-listitem">
        <a class="w-author__link" href="https://glitch.com/@${glitch}"
          >Glitch</a
        >
      </li>
    `;
  }

  function renderHomepage({homepage}) {
    return html`
      <li class="w-author__link-listitem">
        <a class="w-author__link" href="${homepage}">Blog</a>
      </li>
    `;
  }

  function renderSocialMedia(author) {
    // Check to see if the author has any social info. If they don't then we
    // should skip rendering the list, otherwise a screen reader will announce
    // "list with 0 items".
    // It'd be nice if we had put all of these social accounts into a social
    // object, but changing that now might be really annoying.
    if (author.twitter || author.github || author.glitch || author.homepage) {
      return html`
        <ul class="w-author__link-list">
          ${author.twitter && renderTwitter(author)}
          ${author.github && renderGitHub(author)}
          ${author.glitch && renderGlitch(author)}
          ${author.homepage && renderHomepage(author)}
        </ul>
      `;
    } else {
      return html``;
    }
  }

  /* eslint-disable max-len */
  return html`
    <div
      class="w-author__info"
      style="display: flex; flex-direction: column; justify-content: center;"
    >
      <cite class="w-author__name">
        <a class="w-author__name-link" href="/authors/${id}">${author.title}</a>
      </cite>
      ${showSocialMedia && renderSocialMedia(author)}
    </div>
  `;
  /* eslint-enable max-len */
};
