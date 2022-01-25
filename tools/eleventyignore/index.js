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
 * to speed up build times.
 *
 * By default this will ignore most files on the site. You can use the
 * ELEVENTY_INCLUDE=[] environement variable to pass a JSON string of
 * directories that should be included in the build.
 *
 * Example .env file:
 * ELEVENTY_IGNORE=true # ignore most of the site
 * ELEVENTY_INCLUDE=["fast", "accessible"] # build /fast and /accessible
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const warning = chalk.black.bgYellow;

const getDirectories = (source) =>
  fs
    .readdirSync(source, {withFileTypes: true})
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

// Default files that should always be ignored.
const ignores = ['node_modules'];

// Files that should be included in the build.
let includes = process.env.ELEVENTY_INCLUDE || [];
try {
  includes = JSON.parse(includes);
} catch (e) {
  // ignore
}

// List all of the directories under /en/
// Then filter out any directories that should be included in the build
// Finally, replace /en/ with /**/ so it works across languages.
const contentPath = path.join('src', 'site', 'content', 'en');
const contentDirs = getDirectories(contentPath)
  .filter((dir) => !includes.includes(dir))
  .map((dir) => path.join(contentPath, dir).replace('/en/', '/**/'));

const isProduction = process.env.NODE_ENV === 'production';
// This will automatically be set to true by GitHub Actions.
const isCI = process.env.CI;
const isPercy = process.env.PERCY;
const enDirPath = path.join('src', 'site', 'content');
const translationDirs = getDirectories(enDirPath)
  .filter((dir) => dir !== 'en')
  .map((dir) => path.join(enDirPath, dir));

if (isPercy) {
  console.log(warning(`Ignoring ALL translation docs in Percy mode`));
  ignores.push(...translationDirs);
}

// Only use ignore environment variables during dev and CI builds.
if (!isProduction || isCI) {
  if (process.env.ELEVENTY_IGNORE) {
    console.log(
      warning(
        `Ignoring ALL docs`,
        `${includes.length ? `except for ${includes}` : ''}`,
      ),
    );

    ignores.push(...contentDirs);
  }
}

fs.writeFileSync('.eleventyignore', ignores.join('\n'));
