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

const fs = require('fs');
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

/**
 * @param {string} input filename to read for input
 * @param {string} output filename to use for output (but does not write)
 * @return {{css: !Buffer, map: !Buffer}}
 */
function compileCSS(input, output) {
  // #1: Compile CSS with either engine.
  const compiledOptions = {
    file: input,
    outFile: output,
    sourceMap: true,
    omitSourceMapUrl: true, // since we just read it from the result object
  };
  if (isProd) {
    compiledOptions.outputStyle = 'compressed';
  }
  log('Compiling', input);
  const compiledResult = sassEngine.renderSync(compiledOptions);

  if (!isProd) {
    return compiledResult;
  }

  // nb. Only require() dependencies for autoprefixer when used.
  const autoprefixer = require('autoprefixer');
  const postcss = require('postcss');

  // #2: Run postcss for autoprefixer.
  const postcssOptions = {
    from: output,
    to: output,
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

  return postcssResult;
}

const target = process.argv[3] || 'out.css';
const out = compileCSS(process.argv[2], target);

fs.writeFileSync(target, out.css);
fs.writeFileSync(target + '.map', out.map);
log('Finished CSS!');
