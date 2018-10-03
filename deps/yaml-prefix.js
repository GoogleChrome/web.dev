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

const START_DIVIDER = `---\n`;
const TAIL_DIVIDER = `\n---\n`;

/**
 * Splits files that have a YAML prefix delineated by ---'s on whole lines. Does not parse YAML,
 * instead just returns its raw string.
 *
 * @param {string} raw source
 * @return {{config: string, rest: string}} prefix YAML without dividers, and remaining source
 */
module.exports = function(s) {
  if (!s.startsWith(START_DIVIDER)) {
    return {config: null, rest: s};
  }

  const index = s.indexOf(TAIL_DIVIDER, START_DIVIDER.length);
  if (index === -1) {
    return {config: null, rest: s};
  }

  return {
    config: s.slice(START_DIVIDER.length, index),
    rest: s.slice(index + TAIL_DIVIDER.length),
  };
};
