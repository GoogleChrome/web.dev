/*
 * Copyright 2019 Google LLC
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

const {parallel, watch} = require('gulp');

// Pull in each task
const fonts = require('./src/gulpt-tasks/fonts');
const sass = require('./src/gulpt-tasks/sass');
const misc = require('./src/gulpt-tasks/misc');
const {siteAssets, contentAssets} = require('./src/gulpt-tasks/assets');
const nodeModules = require('./src/gulpt-tasks/node-modules');

// The default (if someone just runs `gulp`) is to run each task in parrallel
exports.default = parallel(
  sass,
  fonts,
  misc,
  siteAssets,
  contentAssets,
  nodeModules,
);

// Set each directory and contents that we want to watch and
// assign the relevant task. `ignoreInitial` set to true will
// prevent the task being run when we run `gulp watch`, but it
// will run when a file changes.
const watcher = () => {
  watch('./src/images/**/*', {ignoreInitial: true}, siteAssets);
  watch('./src/site/content/**/*', {ignoreInitial: true}, contentAssets);
  watch('./src/styles/**/*.scss', {ignoreInitial: true}, sass);
};

// This is our watcher task that instructs gulp to watch directories and
// act accordingly
exports.watch = watcher;
