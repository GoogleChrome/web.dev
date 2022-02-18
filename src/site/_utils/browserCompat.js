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

const {AssetCache} = require('@11ty/eleventy-cache-assets');

// TODO: can we import the whole /types node in JS?
/** @typedef {import('@mdn/browser-compat-data/types').CompatStatement} CompatStatement */
/** @typedef {import('@mdn/browser-compat-data/types').PrimaryIdentifier} PrimaryIdentifier */

/**
 * Flatten a tree of data into a flat object (prep for lookup by key).
 *
 * @param {PrimaryIdentifier} obj
 * @param {string} prefix
 * @return {{[id: string]: CompatStatement}}
 */
function walk(obj, prefix = '') {
  /** @type {{[id: string]: CompatStatement}} */
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      const prefix_ = prefix + (prefix ? '.' : '') + key;
      if (value.__compat) {
        result[prefix_] = value.__compat;
        delete value.__compat;
      }
      Object.assign(result, walk(value, prefix_));
    }
  }
  return result;
}

/** @type {{[id: string]: CompatStatement}|undefined} */
let cachedBcd;

module.exports = function () {
  // nb. Parsing this file every time takes ~150ms on an i9 (and results in ~9mb of JSON). So using
  // the cache is a speedup but perhaps less than you think...

  if (!cachedBcd) {
    const asset = new AssetCache('bcd_data');
    if (asset.isCacheValid('1d')) {
      // eleventy-cache-assets exposes the raw path.
      // Internally it's doing require() too, but it's wrapped in a Promise,
      // so do this synchronously.
      cachedBcd = require(asset.getCachedContentsPath('json'));
    } else {
      const bcd = require('@mdn/browser-compat-data');
      cachedBcd = walk(bcd);

      // Don't wait for the save, since we're trying to be sync.
      // The plugin does this with "fs.promises", so we can't block.
      asset.save(cachedBcd, 'json').catch((err) => {
        console.warn('failed to update cached bcd', err);
      });
    }
  }

  return cachedBcd;
};
