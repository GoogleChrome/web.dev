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

module.exports = ({post, author, showSocialMedia = false}) => {
  if (!post) {
    throw new Error(`Can't generate AuthorInfo without post object`);
  }

  if (!author) {
    throw new Error(`Can't generate AuthorInfo without author object`);
  }

  const fullName = `${author.name.given} ${author.name.family}`;

  function renderTwitter({twitter}) {
    return html`
      <li class="w-author__link-listitem">
        <a class="w-author__link" href="https://twitter.com/${twitter}">Twitter</a>
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
        <a class="w-author__link" href="https://glitch.com/@${glitch}">Glitch</a>
      </li>
    `;
  }

  function renderSocialMedia(author) {
    return html`
      <ul class="w-author__link-list">
        ${author.twitter && renderTwitter(author)}
        ${author.github && renderGitHub(author)}
        ${author.glitch && renderGlitch(author)}
      </ul>
    `;
  }

  /* eslint-disable max-len */
  return html`
    <div class="w-author__info" style="display: flex; flex-direction: column; justify-content: center;">
      <cite class="w-author__name">${fullName}</cite>
      ${showSocialMedia && renderSocialMedia(author)}
    </div>
  `;
  /* eslint-enable max-len */
};
