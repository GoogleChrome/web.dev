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
const {hashForContent} = require('./src/build/hash');

// CSS tools expect a target filename, but we don't use it and it doesn't appear
// anywhere in our output.
const ignoredCSSName = '__ignored__.css';

const sassEngine = (function () {
  /* eslint-disable node/no-missing-require */
  try {
    // node-sass is faster, but regularly fails to install correctly (native bindings)
    return require('node-sass');
  } catch (e) {
    // fallback to the official transpiled version
    return require('sass');
  }
  /* eslint-enable node/no-missing-require */
})();

/**
 * @param {string} input filename to read for input
 * @return {{css: !Buffer, map: !Buffer}}
 */
function compileCSS(input) {
  // #1: Compile CSS with either engine.
  const compiledOptions = {
    file: input,
    outFile: ignoredCSSName,
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
    from: ignoredCSSName,
    to: ignoredCSSName,
    map: {
      prev: JSON.parse(compiledResult.map.toString()),
      annotation: true,
    },
  };
  log('Running postcss (autoprefixer)...');
  const postcssResult = postcss([autoprefixer]).process(
    compiledResult.css.toString(),
    postcssOptions,
  );
  postcssResult.warnings().forEach((warn) => {
    console.warn(warn.toString());
  });

  const {css, map: candidateMap} = postcssResult;

  // nb. With the transpiled "sass", this is returned as a SourceMapGenerator, so convert it to
  // a real string. This is a no-op for the native version.
  const map = candidateMap.toString();
  return {map, css};
}

const out = compileCSS('src/styles/all.scss');

const hash = hashForContent(out.css);
const base = `app-${hash}.css`;
const fileName = `dist/${base}`;

fs.mkdirSync(path.dirname(fileName), {recursive: true});
fs.writeFileSync(fileName, out.css);
fs.writeFileSync(fileName + '.map', out.map);

// Also write to the name of the old CSS file, to work around #3363. Eventually, we can remove this,
// but clients that installed before 2020-06-16 will see a flash of unstyled... page.
// TODO(samthor): Remove this when we're confident.
fs.writeFileSync('dist/app.css', out.css);

// Write the CSS entrypoint to a known file for Eleventy to read.
fs.writeFileSync(
  'src/site/_data/resourceCSS.json',
  JSON.stringify({path: '/' + base}),
);

log(`Finished CSS! (${base})`);
