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

const {minify} = require('terser');

/**
 * Minify JS using terser.
 * Nunjucks supports async filters (yay!) but they have to use ugly callback
 * syntax (boo...).
 * https://www.11ty.dev/docs/quicktips/inline-js/
 *
 * This never errors, it just logs an error in production if we can't minify.
 *
 * @param {string} code
 * @param {(err: Error, ret: string) => void} callback
 */
function minifyJs(code, callback) {
  if (process.env.ELEVENTY_ENV !== 'prod') {
    callback(null, code);
    return;
  }

  minify(code)
    .then((result) => {
      callback(null, result.code);
    })
    .catch((err) => {
      console.error('Terser error: ', err);
      // Fail gracefully.
      callback(null, code);
    });
}

module.exports = {minifyJs};
