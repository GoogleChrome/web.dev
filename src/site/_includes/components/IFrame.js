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

const {html} = require('common-tags');

module.exports = (param) => {
  let src;
  let iframeProps = {
    allow: '',
    style: 'height: 100%; width: 100%; border: 0;',
    title: 'IFrame content',
  };

  if (typeof param === 'string') {
    src = param;
  } else if (param.constructor === {}.constructor) {
    iframeProps = {...iframeProps, ...param};
    src = param.src;
  }

  if (!src) {
    return;
  }

  return html`
    <iframe
      allow="${iframeProps.allow}"
      loading="lazy"
      src="${src}"
      style="${iframeProps.style}"
      title="${iframeProps.title}"
    ></iframe>
  `;
};
