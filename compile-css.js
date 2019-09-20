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

require("dotenv").config();

const autoprefixer = require('autoprefixer');
const fs = require('fs');
const postcss = require('postcss');
const log = require('fancy-log');

const isProd = process.env.ELEVENTY_ENV === 'prod';

const sassEngine = (function() {
  try {
    // node-sass is faster, but regularly fails to install correctly (native bindings)
    return require('node-sass');
  } catch (e) {
    // fallback to the official transpiled version
    return require('sass');
  }
})();

const target = process.argv[3] || 'out.css';

// #1: Compile CSS with either engine.
const compiledOptions = {
  file: process.argv[2],
  outFile: target,
  sourceMap: true,
  omitSourceMapUrl: true, // since we just read it from the result object
};
if (isProd) {
  compiledOptions.outputStyle = 'compressed';
}
log('Compiling', process.argv[2]);
const compiledResult = sassEngine.renderSync(compiledOptions);

// #2: Run postcss for autoprefixer.
// TODO(samthor): This could also be disabled not in prod.
const postcssOptions = {
  from: target,
  to: target,
  map: {
    prev: JSON.parse(compiledResult.map.toString()),
    annotation: true,
  },
};
log('Running postcss (autoprefixer)...');
const postcssResult = postcss([autoprefixer]).process(compiledResult.css.toString(), postcssOptions);
postcssResult.warnings().forEach((warn) => {
  console.warn(warn.toString());
});

fs.writeFileSync(target, postcssResult.css);
fs.writeFileSync(target + '.map', postcssResult.map);
log('Finished CSS!');
