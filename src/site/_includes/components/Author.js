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
const AuthorInfo = require('./AuthorInfo');
const {Img} = require('./Img');
const {i18n} = require('../../_filters/i18n');

const isDesignSystemContext = require('../../../lib/utils/is-design-system-context');

/* NOTE: This component is in a transition period to support both new design system contexts
and the existing system. Once the new design system has been *fully* rolled out, this component
can be cleaned up with the following:

1. The isDesignSystemContext conditional can be removed and code in that block should run as normal
2. Everything from the '/// DELETE THIS WHEN ROLLOUT COMPLETE' comment *downwards* can be removed
*/

function Author({id, author, locale, showSocialMedia = false, small = false}) {
  if (!author) {
    console.log(
      `Can't create Author component for "${id}" without author ` +
        `information. Please check '_data/authorsData.json' and make sure the ` +
        `author you provide is a key in this object.`,
    );
    return;
  }
  const title = i18n(author.title, locale);
  if (!title) {
    throw new Error(
      `Can't create Author "${id}" with missing title. ` +
        `Please check '_data/authorsData.json' and make sure the ` +
        `author has a title.`,
    );
  }

  const img = Img({
    src: author.image,
    alt: title,
    width: '64',
    height: '64',
    class: `w-author__image${small ? ' w-author__image--small' : ''}`,
    params: {
      fit: 'crop',
      h: '64',
      w: '64',
    },
  });

  if (isDesignSystemContext(this.page ? this.page.filePathStem : '')) {
    return html`
      <div class="author">
        <a class="avatar" href="${author.href}"> ${img} </a>
        <div class="flow">
          <cite class="author__name">
            <a href="${author.href}">${title}</a>
          </cite>
          ${showSocialMedia &&
          html` <div class="author__links cluster">
            ${author.twitter &&
            `<a href="https://twitter.com/${author.twitter}">Twitter</a>`}
            ${author.github &&
            `<a href="https://github.com/${author.github}">GitHub</a>`}
            ${author.glitch &&
            `<a href="https://glitch.com/@${author.glitch}">Glitch</a>`}
            ${author.homepage && `<a href="${author.homepage}">Homepage</a>`}
          </div>`}
        </div>
      </div>
    `;
  }

  /// DELETE BELOW THIS LINE
  return html`
    <div class="w-author">
      <a href="${author.href}">${img}</a>
      ${AuthorInfo({author, title, showSocialMedia})}
    </div>
  `;
}

module.exports = Author;
