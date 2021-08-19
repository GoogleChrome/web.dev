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
const bcd = require('@mdn/browser-compat-data');
const {AssetCache} = require('@11ty/eleventy-cache-assets');

// Flatten a tree of data into a flat object (prep for lookup by key).
function walk(obj, prefix) {
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

module.exports = async function () {
  const asset = new AssetCache('bcd_data');
  if (asset.isCacheValid('1d')) {
    return asset.getCachedValue();
  }
  delete bcd.browsers;
  const data = walk(bcd, '');
  await asset.save(data, 'json');
  return asset.getCachedValue();
};
