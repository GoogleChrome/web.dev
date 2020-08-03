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
const iframe = require('./IFrame');

/**
 *
 * @param {string | { id: string; path?: string; previewSize?: number; style?: string; }} param
 * @return string
 */
module.exports = (param) => {
  const allow = 'geolocation; microphone; camera; midi; encrypted-media';
  let glitchProps = {
    id: null,
    path: '',
    previewSize: 0,
    style: 'height: 420px; width: 100%;',
  };

  if (typeof param === 'string') {
    glitchProps.id = param;
  } else if (param.constructor === {}.constructor) {
    glitchProps = {...glitchProps, ...param};
  }

  const {id, path, previewSize, style} = glitchProps;

  if (!id) {
    return;
  }

  let src = `https://glitch.com/embed/#!/embed/${id}?`;
  if (path) {
    src += `path=${path}&`;
  }
  if (previewSize) {
    src += `previewSize=${previewSize}&`;
  }

  return html`
    <div class="glitch-embed-wrap" style="${style}">
      ${iframe({src, title: `${id} on Glitch`, allow})}
    </div>
  `;
};
