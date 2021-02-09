const fs = require('fs');
const {join} = require('path');

// A Rollup plugin which locates modules using the Node resolution algorithm,
// for using third party modules in node_modules
const {nodeResolve} = require('@rollup/plugin-node-resolve');

// A Rollup plugin to convert CommonJS modules to ES6, so they can be included
// in a Rollup bundle
const commonjs = require('@rollup/plugin-commonjs');

// A Rollup plugin to minify generated ES bundles. Uses terser under the hood.
const {terser} = require('rollup-plugin-terser');

// A Rollup plugin to import CSS and inject it into the <head>
const postcss = require('rollup-plugin-postcss');

// A Rollup plugin to mark modules for Istanbul code coverage.
const istanbul = require('rollup-plugin-istanbul');

// A Rollup plugin which loads virtual modules from memory.
const virtual = require('@rollup/plugin-virtual');

/**
 * Virtual imports made available to all bundles. Used for site config and globals.
 */
const site = require('./src/site/_data/site');
const isProd = process.env.ELEVENTY_ENV === 'prod';
const buildVirtualJSON = require('./src/build/virtual-json');
const virtualImports = {
  webdev_analytics: {
    id: isProd ? site.analytics.ids.prod : site.analytics.ids.staging,
    dimensions: site.analytics.dimensions,
    version: site.analytics.version,
  },
  webdev_config: {
    isProd,
    env: process.env.ELEVENTY_ENV || 'dev',
    version: 'v' + new Date().toISOString().replace(/[\D]/g, '').slice(0, 12),
    firebaseConfig: isProd ? site.firebase.prod : site.firebase.staging,
  },
};

// Each page type has an entrypoint js file which imports all of the custom
// elements for that page.
// Most pages use the default.js entrypoint, but some special pages like
// /measure, /newsletter, etc. are special and require additional elements.
const pagesDir = './src/lib/pages/';
const pages = fs.readdirSync(pagesDir, 'utf-8').map((p) => join(pagesDir, p));

const devConfig = {
  input: ['./src/lib/app.js', ...pages],
  output: {
    dir: 'dist/js',
    format: 'esm',
  },
  watch: {
    // By default rollup clears the console on every build. This disables that.
    clearScreen: false,
  },
  plugins: [
    virtual(buildVirtualJSON(virtualImports)),
    nodeResolve(),
    commonjs(),
    postcss(),
  ],
};

const productionConfig = {
  input: ['./src/lib/app.js', ...pages],
  output: {
    dir: 'dist/js',
    format: 'esm',
  },
  plugins: [
    virtual(buildVirtualJSON(virtualImports)),
    nodeResolve(),
    commonjs(),
    postcss({
      minimize: true,
    }),
    terser({
      format: {
        // Remove all comments, including @license comments,
        // otherwise LHCI complains at us.
        comments: false,
      },
    }),
  ],
};

const testConfig = {
  input: 'test/unit/src/lib/index.js',
  output: {
    dir: 'dist/test',
    format: 'iife',
    name: 'test',
  },
  plugins: [
    virtual(buildVirtualJSON(virtualImports)),
    nodeResolve(),
    commonjs(),
    postcss(),
    istanbul(),
  ],
};

/**
 * Determine which rollup config to return based on the environment.
 *
 * Note: You can also pass custom command line arguments to rollup if they're
 * prefixed with `config*`.
 *
 * Example: rollup -c --configFoo  # sets commandLineArgs.configFoo to true
 *
 * The commandLineArgs argument gets passed to this function, but we're omitting
 * it here because we don't use it.
 * Learn more @ https://rollupjs.org/guide/en/
 */
export default () => {
  if (process.env.NODE_ENV === 'production') {
    return productionConfig;
  } else if (process.env.NODE_ENV === 'test') {
    return testConfig;
  }
  return devConfig;
};
