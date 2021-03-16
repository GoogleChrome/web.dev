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
 * Validates allow sources are an array and lower case.
 * If allow sources are a string, it will be split by the `;` character.
 *
 * @param {string|string[]} s
 * @returns {string[]}
 */
function expandAllowSource(s) {
  if (typeof s === 'string') {
    s = s.split(/;\s*/g);
  }
  return s.map((a) => a.toLowerCase());
}

/**
 *
 * @param {string | GlitchParam } param
 * @return string
 */
module.exports = (param) => {
  const defaultAllow = [
    'camera',
    'clipboard-read',
    'clipboard-write',
    'encrypted-media',
    'geolocation',
    'microphone',
    'midi',
  ];

  /** @type GlitchParam */
  let glitchProps = {
    allow: [],
    height: 420,
    id: null,
    path: '',
    highlights: '',
    previewSize: 100,
  };

  if (typeof param === 'string') {
    glitchProps.id = param;
  } else if (param.constructor === {}.constructor) {
    glitchProps = {...glitchProps, ...param};
  }

  const {
    allow: userAllow,
    id,
    path,
    highlights,
    previewSize,
    height,
  } = glitchProps;

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
  if (highlights) {
    queryParams.highlights = highlights;
  }
  if (typeof previewSize === 'number') {
    queryParams.previewSize = previewSize;
  }

  const allow = Array.from(
    new Set([...defaultAllow, ...expandAllowSource(userAllow)]),
  ).join('; ');

  const src = `${url}?${stringify(queryParams)}`;

  return html`
    <div class="glitch-embed-wrap" style="height: ${height}px; width: 100%;">
      ${iframe({src, title: `${escape(id)} on Glitch`, allow})}
    </div>
  `;
};
