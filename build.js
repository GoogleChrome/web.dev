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

const fs = require('fs').promises;
const path = require('path');
const log = require('fancy-log');
const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginCJS = require('rollup-plugin-commonjs');
const rollupPluginPostCSS = require('rollup-plugin-postcss');
const rollupPluginVirtual = require('rollup-plugin-virtual');
const rollupPluginIstanbul = require('rollup-plugin-istanbul');
const rollup = require('rollup');
const buildVirtualJSON = require('./src/build/virtual-json');
const minifySource = require('./src/build/minify-js');
const {hashForFiles} = require('./src/build/hash');

process.on('unhandledRejection', (reason, p) => {
  log.error('Build had unhandled rejection', reason, p);
  throw new Error(`Build had unhandled rejection ${reason}`);
});

const {
  virtualImports,
  buildDefaultPlugins,
  disallowExternal,
} = require('./src/build/common');

/**
 * Performs main site compliation via Rollup.
 */
async function build() {
  const postcssConfig = {};
  if (isProd) {
    // nb. Only require() autoprefixer when used.
    const autoprefixer = require('autoprefixer');
    postcssConfig.plugins = [autoprefixer];

    // uses cssnano vs. our regular CSS usees sass' builtin compression
    postcssConfig.minimize = true;
  }

  // Rollup "app.js" to generate graph of source needs. This eventually uses
  // dynamic import to bring in code required for each page (see router). In
  // Rollup's nonmenclature, this is the site entrypoint. We generated it with
  // a dynamic hash, and is imported via "bootstrap.js" (which is run in all
  // browsers via regular script tag).
  const appBundle = await rollup.rollup({
    input: 'src/lib/app.js',
    external: disallowExternal,
    plugins: [rollupPluginPostCSS(postcssConfig), ...buildDefaultPlugins()],
    manualChunks: (id) => {
      // lit-html/lit-element is our biggest dependency, and is always used
      // together. Return it in its own chunk (~30kb after Terser).
      if (/\/node_modules\/lit-.*\//.exec(id)) {
        return 'lit';
      }
      // Algolia is smaller (~17kb after Terser).
      if (id.includes('/node_modules/algoliasearch/')) {
        return 'algolia';
      }
    },
  });
  const appGenerated = await appBundle.write({
    dynamicImportFunction: 'window._import',
    entryFileNames: '[name]-[hash].js',
    sourcemap: true,
    dir: 'dist',
    format: 'esm',
  });
  const outputFiles = appGenerated.output.map(({fileName}) => fileName);

  // Save the "app.js" entrypoint (which has a hashed name) for the all-browser
  // loader code.
  const entrypoints = appGenerated.output.filter(({isEntry}) => isEntry);
  if (entrypoints.length !== 1) {
    throw new Error(
      `expected single Rollup entrypoint, was: ${entrypoints.length}`,
    );
  }
  virtualImports.webdev_entrypoint = entrypoints[0].fileName;

  // Rollup basic to generate the top-level script run by all browsers (even
  // ancient ones). This runs Analytics and imports the entrypoint generated
  // above (in supported module browsers).
  const libPrefix = path.join(__dirname, '/src/lib/');
  const utilsPrefix = path.join(libPrefix, 'utils');
  const bootstrapBundle = await rollup.rollup({
    input: 'src/lib/bootstrap.js',
    plugins: buildDefaultPlugins(),
    external: disallowExternal,
    manualChunks: (id) => {
      // This overloads Rollup's manualChunks feature to catch disallowed code.
      // Bootstrap should only import:
      //   * virtual imports (config only)
      //   * itself (Rollup calls us for 'ourself')
      //   * code inside `src/lib/utils`.
      // Otherwise, we risk leaking core site code into this ES5-only, fast
      // bootstrap chunk.
      if (id in virtualImports || !path.isAbsolute(id)) {
        return; // ok
      }
      if (id === path.join(libPrefix, 'bootstrap.js')) {
        return undefined; // self, allowed
      }
      if (path.relative(utilsPrefix, id).startsWith('../')) {
        // This looks for code outside the utils folder, which is disallowed.
        throw new TypeError(
          `can't import non-utils JS code in bootstrap: ${id}`,
        );
      }
    },
  });
  const bootstrapGenerated = await bootstrapBundle.write({
    entryFileNames: '[name].js',
    sourcemap: true,
    dir: 'dist',
    format: 'iife',
  });
  if (bootstrapGenerated.output.length !== 1) {
    throw new Error(
      `bootstrap generated more than one file: ${bootstrapGenerated.output.length}`,
    );
  }
  const bootstrapPath = bootstrapGenerated.output[0].fileName;
  outputFiles.push(bootstrapPath);

  const hash = hashForFiles(path.join('dist', bootstrapPath));
  const resourceName = `${bootstrapPath}?v=${hash}`;

  // Write the bundle entrypoint to a known file for Eleventy to read.
  await fs.writeFile(
    'src/site/_data/resourceJS.json',
    JSON.stringify({path: `/${resourceName}`}),
  );

  // Compress the generated source here, as we need the final files and hashes for the Service
  // Worker manifest.
  if (isProd) {
    const ratio = await minifySource(outputFiles);
    log(`Minified site code is ${(ratio * 100).toFixed(2)}% of source`);
  }
  log(`Finished JS! (${resourceName})`);

  return outputFiles.length;
}

/**
 * Builds the test entrypoint.
 */
async function buildTest() {
  const testBundle = await rollup.rollup({
    input: 'test/unit/src/lib/index.js',
    plugins: [
      rollupPluginNodeResolve(),
      rollupPluginCJS(),
      rollupPluginVirtual(buildVirtualJSON(virtualImports)),
      rollupPluginPostCSS(),
      rollupPluginIstanbul(),
    ],
  });
  await testBundle.write({
    dir: 'dist/test',
    format: 'iife',
    name: 'test',
  });
}

(async function () {
  const generatedCount = await build();
  log(`Generated ${generatedCount} files`);
  if (!isProd) {
    await buildTest();
  }
})();
