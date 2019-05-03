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

module.exports = ({
  post,
  author,
  avatar,
  showSocialMedia = false,
  small = false,
}) => {
  if (!author) {
    throw new Error(`
      Can't create Author component without an author argument.
      author was null or undefined. Please check _data/contributors.json
      and make sure the author you provide is a key in this object.
    `);
  }

  if (!author.name) {
    throw new Error(
      `Can't create Author with missing author.name. author object: ${author}`
    );
  }

  const fullName = `${author.name.given} ${author.name.family}`;
  return html`
    <div class="w-author">
      <img
        class="w-author__image ${small && `w-author__image--small`}"
        src="/images/authors/${avatar}.jpg"
        alt="${fullName}"
      />
      ${AuthorInfo({post, author, showSocialMedia})}
    </div>
  `;
};
