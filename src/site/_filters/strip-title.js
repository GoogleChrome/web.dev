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
 * Removes any characters that should not exist in a title in the `<head>`.
 *
 * @param {(string|number)} [title] Title of page, is a number for `404`
 * @return {string} A string of the pages title without any forbidden characters.
 */
module.exports = (title) => {
  let cleaned = String(title || "");
  const forbidden = [/\`/g];

  forbidden.forEach((rule) => {
    cleaned = cleaned.replace(rule, "");
  });

  return cleaned;
};
