/*
 * Copyright 2023 Google LLC
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

const MULTI_LINE_CODE_PATTERN = /```.*?```/gms;
const INLINE_CODE_PATTERN = /`[^`]*`/g;

const MULTI_LINE_CODE_PLACEHOLDER = 'MULTI_LINE_CODE_PLACEHOLDER';
const INLINE_CODE_PLACEHOLDER = 'INLINE_CODE_PLACEHOLDER';

function pluck(matches = [], pattern, placeholder, content) {
  let index = 0;
  content = content.replace(pattern, (match) => {
    matches.push(match);
    return `${placeholder}_${index++}`;
  });

  return content;
}

function insert(stack, placeholder, content) {
  return content.replace(
    new RegExp(`${placeholder}_(\\d+)`, 'g'),
    (match, index) => {
      return stack[index];
    },
  );
}

module.exports = {
  MULTI_LINE_CODE_PATTERN,
  INLINE_CODE_PATTERN,
  MULTI_LINE_CODE_PLACEHOLDER,
  INLINE_CODE_PLACEHOLDER,
  pluck,
  insert,
};
