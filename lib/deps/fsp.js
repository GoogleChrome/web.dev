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

const fs = require('fs');
const util = require('util');
const mkdirp = require('mkdirp');

/**
 * Promisifed versions of Node's filesystem methods.
 */
module.exports = {
  copyFile: util.promisify(fs.copyFile),
  readFile: util.promisify(fs.readFile),
  readdir: util.promisify(fs.readdir),
  symlink: util.promisify(fs.symlink),
  writeFile: util.promisify(fs.writeFile),
  unlink: util.promisify(fs.unlink),
  mkdirp: util.promisify(mkdirp), // and mkdirp
  exists: util.promisify(fs.exists),
};
