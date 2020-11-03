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
 * @return {{css: !Buffer, map: !SourceMap}}
 */
function compileCSS(input) {
  // #1: Compile CSS with either engine.
  const compiledOptions = {
    file: input,
    outFile: 'app.css',
    sourceMap: true,
    omitSourceMapUrl: true, // since we just read it from the result object
  };
  if (isProd) {
    compiledOptions.outputStyle = 'compressed';
  }
  log('Compiling', input);
  const compiledResult = sassEngine.renderSync(compiledOptions);
  const compiledMap = JSON.parse(compiledResult.map.toString('utf-8'));

  // nb. We get back absolute source paths here that look like
  // "file:///Users/blah/Desktop/web.dev/src/...", so make them relative to here.
  compiledMap['sources'] = compiledMap['sources'].map((source) => {
    if (source.startsWith('file://')) {
      source = source.substr('file://'.length);
    }
    if (path.isAbsolute(source)) {
      source = path.relative(__dirname, source);
    }
    return source;
  });

  if (!isProd) {
    return {map: compiledMap, css: compiledResult.css};
  }

  // nb. Only require() dependencies for autoprefixer when used.
  const autoprefixer = require('autoprefixer');
  const postcss = require('postcss');

  // #2: Run postcss for autoprefixer.
  const postcssOptions = {
    from: 'app.css',
    to: 'app.css',
    map: {
      prev: compiledMap,
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
  // a real string and then back to JSON.
  const map = JSON.parse(candidateMap.toString('utf-8'));
  return {map, css};
}

/**
 * @param {{css: !Buffer, map: !SourceMap}} result to render
 * @param {string} fileName to render to, with optional map in dev
 */
function renderTo(result, fileName) {
  fs.mkdirSync(path.dirname(fileName), {recursive: true});
  const base = path.basename(fileName);

  let out = result.css.toString('utf-8');
  if (!isProd) {
    result.map['file'] = base;

    out += `\n/*# sourceMappingURL=${base}.map */`;
    fs.writeFileSync(fileName + '.map', JSON.stringify(result.map));
  }

  fs.writeFileSync(fileName, out);
}

const out = compileCSS('src/styles/all.scss');
const hash = hashForContent(out.css);

// We write an unhashed CSS file due to unfortunate real-world caching problems with a hash inside
// the CSS name (we see our old HTML cached longer than the assets are available).
renderTo(out, `dist/app.css`);

// Write the CSS entrypoint to a known file, with a query hash, for Eleventy to read.
const resourceName = `app.css?v=${hash}`;
fs.writeFileSync(
  'src/site/_data/resourceCSS.json',
  JSON.stringify({path: `/${resourceName}`}),
);

log(`Finished CSS! (${resourceName})`);
