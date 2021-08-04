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
 * @param {string} code
 */
async function minifyJs(code, callback) {
  if (process.env.ELEVENTY_ENV !== 'prod') {
    callback(null, code);
    return;
  }

  try {
    const minified = await minify(code);
    callback(null, minified.code);
    return;
  } catch (err) {
    console.error('Terser error: ', err);
    // Fail gracefully.
    callback(null, code);
    return;
  }
}

module.exports = {minifyJs};
