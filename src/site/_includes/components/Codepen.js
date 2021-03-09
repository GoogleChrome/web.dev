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

/** @type {string} */
const THEME_ID = '38982';

/** @type {string} */
const DEFAULT_TAB = 'result';

/**
 *
 * @param {string | CodepenParam} param
 * @return string
 */
module.exports = (param) => {
  const {id, user} = param;
  if (!id || !user) {
    return;
  }

  const allow = [
    'camera',
    'clipboard-read',
    'clipboard-write',
    'encrypted-media',
    'geolocation',
    'microphone',
    'midi',
  ];

  const title = param.title || `Pen ${id} by ${user} on Codepen`;
  const url = `https://codepen.io/${escape(user)}/embed/${escape(id)}`;
  const queryParams = {
    height: 500,
    'theme-id': THEME_ID,
    'default-tab': DEFAULT_TAB,
  };
  const src = `${url}?${stringify(queryParams)}`;

  return html`
    <div style="height: ${queryParams.height}px; width: 100%;">
      ${iframe({src, title: `${title}`, allow})}
    </div>
  `;
};
