/**
 * @license
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function (config) {
  // Test modes:
  // quick: single run tests in headless browser.
  // dev:   watch tests in headless browser.
  // debug: watch tests in standard brower.
  const mode = process.env.TEST_MODE || 'quick';
  // Default options are for quick mode.
  const opts = {
    browsers: ['ChromeHeadless'],
    files: ['dist/test/index.js'],
    frameworks: ['mocha'], // use the mocha test frameworkl
    reporters: ['spec'], // report results in these formats.
    singleRun: true, // set this to false to leave the browser open.
  };

  if (mode === 'dev') {
    Object.assign(opts, {
      singleRun: false,
    });
  } else if (mode === 'debug') {
    Object.assign(opts, {
      browsers: ['Chrome'],
      singleRun: false,
    });
  }

  config.set(opts);
};
