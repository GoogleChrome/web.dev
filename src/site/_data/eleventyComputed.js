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
 * @fileoverview Provides hashes of static assets referenced inside Eleventy's
 * templates.
 */

const crypto = require('crypto');
const fs = require('fs');

const hashLength = 8;

function randomHash() {
  // Randomly pick a number in [1,2] and multiply by 'length' hex digits to
  // generate a fake hash. Just used to enforce cache busting in JS.
  return Math.floor((1 + Math.random()) * Math.pow(16, hashLength))
    .toString(16)
    .substr(0, hashLength);
}

/**
 * Hashes the passed path. If the file doesn't exist, return a random hash. If
 * we're in prod, then crash.
 *
 * @param {string} files to hash
 * @return {string}
 */
function hashFor(...files) {
  if (!files.length) {
    throw new Error(`must hash at least one file`);
  }

  const c = crypto.createHash('sha1');
  for (const f of files) {
    try {
      const contents = fs.readFileSync(f);
      c.update(contents);
    } catch (e) {
      if (process.env.ELEVENTY_ENV === 'prod') {
        throw new Error(`could not hash: ${f}`);
      }

      // If we can't load this file in dev, just return a random hash. This just
      // gives us cache-busting behavior every build.
      return randomHash();
    }
  }

  const hash = c.digest('hex').substr(0, hashLength);
  if (hash.length !== hashLength) {
    throw new TypeError(`could not hash: ${files.join(',')}`);
  }
  return hash;
}

const cssVersion = hashFor('dist/app.css');
const jsVersion = hashFor('dist/bootstrap.js');

module.exports = {
  cssVersion,
  jsVersion,
};
