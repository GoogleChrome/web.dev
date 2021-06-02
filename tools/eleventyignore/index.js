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
 * @file This outputs an .eleventyignore file in the root of the project.
 * This is used to tell eleventy to ignore large sections of the docs in order
 * to speed up build times. For instance, the native-client docs have around
 * 1000 pages of API reference that can safely be ignored if you're just
 * developing locally.
 *
 * To tell eleventy to ignore a section, add one of the environment variables
 * to your .env file.
 */

require('dotenv').config();
const fs = require('fs');
const chalk = require('chalk');
const warning = chalk.black.bgYellow;

// Default files that should always be ignored.
const ignores = ['node_modules', '**/README.md', '**/_drafts', '*.swp'];

const isProduction = process.env.NODE_ENV === 'production';
// This will automatically be set to true by GitHub Actions.
const isCI = process.env.CI;

// Only use ignore environment variables during dev and CI builds.
if (!isProduction || isCI) {
  // Ignore /docs/
  if (process.env.ELEVENTY_IGNORE_BLOG) {
    console.log(warning('Ignoring ALL docs.'));
    ignores.push('src/site/content/**/blog/**/*');
  }

  // // Ignore /docs/native-client/
  // if (process.env.ELEVENTY_IGNORE_NACL) {
  //   console.log(warning('Ignoring native-client docs.'));
  //   ignores.push('site/**/docs/native-client/**/*');
  // }

  // // Ignore /docs/extensions/
  // if (process.env.ELEVENTY_IGNORE_EXTENSIONS) {
  //   console.log(warning('Ignoring extensions docs.'));
  //   ignores.push('site/**/docs/extensions/**/*');
  // }
}

fs.writeFileSync('.eleventyignore', ignores.join('\n'));
