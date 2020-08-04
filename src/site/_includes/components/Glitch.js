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
const {escape, stringify} = require('querystring');
const iframe = require('./IFrame');

/**
 *
 * @param {string | { id: string; path?: string; previewSize?: number; style?: string; }} param
 * @return string
 */
module.exports = (param) => {
  const allow =
    'camera; clipboard; clipboard-read; clipboard-write; geolocation; encrypted-media; microphone; midi; vr;';
  let glitchProps = {
    id: null,
    path: '',
    previewSize: null,
    height: 420,
  };

  if (typeof param === 'string') {
    glitchProps.id = param;
  } else if (param.constructor === {}.constructor) {
    glitchProps = {...glitchProps, ...param};
  }

  const {id, path, previewSize, height} = glitchProps;

  if (!id) {
    return;
  }
  const url = 'https://glitch.com/embed/#!/embed/' + escape(id);
  const queryParams = {
    attributionHidden: 'true',
    sidebarCollapsed: 'true',
  };

  if (path) {
    queryParams.path = path;
  }
  if (typeof previewSize === 'number') {
    queryParams.previewSize = previewSize;
  }

  const src = `${url}?${stringify(queryParams)}`;

  return html`
    <div class="glitch-embed-wrap" style="height: ${height}px; width: 100%;">
      ${iframe({src, title: `${escape(id)} on Glitch`, allow})}
    </div>
  `;
};
