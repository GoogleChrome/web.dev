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

const path = require('path');
const fs = require('fs');

// The path to the _includes folder inside web.dev.
const includesPath = path.join(__dirname, '../');

/**
 * @param {string} arg
 * @return {string}
 */
module.exports = (arg) => {
  const p = path.join(includesPath, arg);
  return fs.readFileSync(p, 'utf-8');
};
