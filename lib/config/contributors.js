/*
 * Copyright 2018 Google LLC
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

'use strict';

const YAML = require('yaml').default;
const fs = require('../deps/fsp.js');
const path = require('path');

const CONTRIBUTORS_CONFIG_LOCATION = path.resolve(
  __dirname,
  '..',
  '..',
  'contributors',
  '_contributors.yaml',
);
const CONTRIBUTORS_PICTURES_LOCATION = path.resolve(
  __dirname,
  '..',
  '..',
  'content',
  'images',
  'contributors',
);

let authorsConfig;

/**
 * Load the contributor information for an author of a codelab.
 * This function will lazily parse the config, if it hadn't done so before.
 *
 * @param {string} author Author name to search for in `_contributors.yaml`
 */
async function loadContributorFromConfiguration(author) {
  // Load and parse file once if we hadn't done so already.
  if (!authorsConfig) {
    const contributorsFile = await fs.readFile(
      CONTRIBUTORS_CONFIG_LOCATION,
      'utf8',
    );
    authorsConfig = YAML.parse(contributorsFile);
  }

  const authorInformation = authorsConfig[author];

  if (!authorInformation) {
    throw new Error(`Could not find author information for ${author}!`);
  }

  const hasPictureFile = await fs.exists(
    path.resolve(CONTRIBUTORS_PICTURES_LOCATION, author + '.jpg'),
  );

  authorInformation.picture = hasPictureFile ? author : 'no-picture';

  return authorInformation;
}

module.exports = {
  loadContributorFromConfiguration,
};
