/*
 * Copyright 2018 Google LLC
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

'use strict';

const YAML = require('yaml').default;
const START_DIVIDER = `---\n`;
const TAIL_DIVIDER = `\n---\n`;

/**
 * @param {string} raw source
 * @return {{config: *, rest: string}} parsed prefix YAML separated by ---'s, and remaining source
 */
module.exports = function(s) {
  if (!s.startsWith(START_DIVIDER)) {
    return {config: {}, rest: s};
  }

  const index = s.indexOf(TAIL_DIVIDER, START_DIVIDER.length);
  if (index === -1) {
    return {config: {}, rest: s};
  }

  return {
    config: YAML.parse(s.slice(START_DIVIDER.length, index)),
    rest: s.slice(index + TAIL_DIVIDER.length),
  };
};
