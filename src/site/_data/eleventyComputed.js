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
 * @fileoverview Generates a shared resources version that web.dev is built at.
 *
 * This is used when we generate partials to confer their version.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const isProd = process.env.ELEVENTY_ENV === 'prod';
const hashLength = 12;

/**
 * Generate the shared resources version that this version of web.dev is built at.
 *
 * This can be the empty string if we're in dev and the resources are yet to be available, which
 * causes our Service Worker to treat all assets as constantly out-of-date. This is only ever
 * temporary, as Eleventy will rebuild once the JS/CSS is actually available.
 *
 * @return {string}
 */
function generateResourcesVersion() {
  const resources = ['resourceCSS', 'resourceJS'];

  const readResource = (f) => {
    try {
      const raw = fs.readFileSync(path.join(__dirname, `${f}.json`));
      const r = JSON.parse(raw);
      if (!r['path']) {
        throw new Error(`parsed JSON had no path: ${JSON.stringify(r)}`);
      }
      return r['path'];
    } catch (e) {
      if (isProd) {
        throw e;
      }
      return null;
    }
  };

  // Include the versions of the dependent resources. If any resource is unknown then we fail
  // early and return the empty string.
  const c = crypto.createHash('sha1');
  for (const f of resources) {
    const update = readResource(f);
    if (update === null) {
      return '';
    }
    c.update(update);
  }

  // This is the unprocessed template, so it doesn't yet contain resource hashes.
  const template = fs.readFileSync(
    path.join(__dirname, '../content/sw-partial-layout.njk'),
    'utf-8',
  );
  c.update(template);

  const resourcesVersion = c.digest('hex').substr(0, hashLength);
  if (resourcesVersion.length !== hashLength) {
    throw new Error(`could not generate hash, was: ${resourcesVersion}`);
  }
  return resourcesVersion;
}

module.exports = {
  resourcesVersion: generateResourcesVersion(),
  builtAt: +new Date(),
};
