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

require('dotenv').config();
const isProd = process.env.ELEVENTY_ENV === 'prod';

const fs = require('fs');
const path = require('path');
const log = require('fancy-log');
const compile = require('./src/build/compile-css.js');

const target = process.argv[3] || 'out.css';
const out = compile({
  input: process.argv[2],
  output: target,
  compress: isProd,
  autoprefixer: isProd,
});

fs.mkdirSync(path.dirname(target), {recursive: true});
fs.writeFileSync(target, out.css);
fs.writeFileSync(target + '.map', out.map);
log('Finished CSS!');
