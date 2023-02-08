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

/**
 * Do a simple minify JSON using stringify to strip whitespaces
 *
 * @param {string} code
 * @param {(err: Error, ret: string) => void} callback
 */
function minifyJSON(code) {
  if (process.env.ELEVENTY_ENV !== 'prod') {
    return code;
  }

  try {
    return JSON.stringify(JSON.parse(code));
  } catch (err) {
    console.error('JSON error: ', err);
    // Fail gracefully.
    return code;
  }
}

module.exports = {minifyJSON};
