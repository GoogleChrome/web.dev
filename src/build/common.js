/**
 * @fileoverview Common build config and helpers for both the regular and SW builds.
 *
 * This is required as the SW build must currently run after Eleventy to precache Eleventy's output
 * (i.e., generated file hashes) as part of its generated source.
 */

const rollupPluginNodeResolve = require('rollup-plugin-node-resolve');
const rollupPluginCJS = require('rollup-plugin-commonjs');
const rollupPluginVirtual = require('rollup-plugin-virtual');
const babel = require('rollup-plugin-babel');
const buildVirtualJSON = require('./virtual-json');

const isProd = process.env.ELEVENTY_ENV === 'prod';

const site = require('../../src/site/_data/site');

/**
 * Virtual imports made available to all bundles. Used for site config and globals.
 */
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
  webdev_entrypoint: null,
};

/**
 * Builds the default set of Rollup functions. Snapshots virtual imports on
 * call, so should be used anew every run.
 *
 * @return {!Array<*>}
 */
function buildDefaultPlugins() {
  return [
    rollupPluginNodeResolve(),
    rollupPluginCJS({
      include: 'node_modules/**',
    }),
    rollupPluginVirtual(buildVirtualJSON(virtualImports)),
    babel({
      exclude: ['node_modules/**'],
      plugins: ['@babel/plugin-proposal-optional-chaining'],
    }),
  ];
}

/**
 * Passed to Rollup's config to disallow external imports. By default, Rollup
 * leaves unresolved imports in the output.
 *
 * @param {string} source
 * @param {string} importer
 * @param {boolean} isResolved
 */
function disallowExternal(source, importer, isResolved) {
  // We don't support any external imports. This most likely happens if you mistype a
  // node_modules import or the package.json has changed.
  if (isResolved && !source.match(/^\.{0,2}\//)) {
    throw new Error(
      `Unresolved external import: "${source}" (imported ` +
        `by: ${importer}), did you forget to npm install?`,
    );
  }
}

module.exports = {
  virtualImports,
  buildDefaultPlugins,
  disallowExternal,
};
