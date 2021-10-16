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

/**
 * Removes selected characters that should not be presented in a string.
 *
 * @param {(string|number)} [text] Text to clean
 * @param {Array<{ searchValue: (string|RegExp), replaceValue: string}>} [additionallyForbidden] Additional replacement rules.
 * @return {string} A string of the pages title without any forbidden characters.
 */
module.exports = (text, additionallyForbidden) => {
  let cleaned = String(text || '');

  const forbidden = [{searchValue: /`/g, replaceValue: ''}];

  [...forbidden, ...(additionallyForbidden || [])].forEach((rule) => {
    cleaned = cleaned.replace(rule.searchValue, rule.replaceValue);
  });

  return cleaned;
};
