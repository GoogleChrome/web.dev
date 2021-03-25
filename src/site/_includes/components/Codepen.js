/*
 * Copyright 2021 Google LLC
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

const {escape, stringify} = require('querystring');
const iframe = require('./IFrame');

/**
 * @this {EleventyPage}
 * @param {CodepenParam} param
 * @return string
 */
function Codepen(param) {
  const {
    id,
    user,
    tab = 'result',
    theme = 'light',
    height = 500,
    width = '100%',
    allow = [],
  } = param;
  if (!id || !user) {
    throw new Error(`${this.page.inputPath} has a Codepen with missing
      arguments. id: ${id}, user: ${user}`);
  }

  const defaultAllow = [
    'camera',
    'clipboard-read',
    'clipboard-write',
    'encrypted-media',
    'geolocation',
    'microphone',
    'midi',
  ];

  const frameAllow =
    Array.from(new Set([...defaultAllow, ...allow])).join('; ') + ';';

  const frameWidth = typeof width === 'number' ? width + 'px' : width;

  const title = param.title || `Pen ${id} by ${user} on Codepen`;
  const url = `https://codepen.io/${escape(user)}/embed/${escape(id)}`;
  const queryParams = {
    height: height,
    'theme-id': theme,
    'default-tab': tab,
  };

  const src = `${url}?${stringify(queryParams)}`;

  return `<div style="height: ${height}px; width: ${frameWidth}">
${iframe({src, title, allow: frameAllow})}</div>`;
}

module.exports = Codepen;
