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
const isProd = process.env.ELEVENTY_ENV === "prod";

const fs = require("fs").promises;
const path = require("path");
const log = require("fancy-log");
const rollupPluginNodeResolve = require("rollup-plugin-node-resolve");
const rollupPluginCJS = require("rollup-plugin-commonjs");
const rollupPluginPostCSS = require("rollup-plugin-postcss");
const rollupPluginVirtual = require("rollup-plugin-virtual");
const rollupPluginReplace = require("rollup-plugin-replace");
const rollup = require("rollup");
const terser = isProd ? require("terser") : null;
const {getManifest} = require("workbox-build");
const site = require("./src/site/_data/site");
const buildVirtualJSON = require("./src/build/virtual-json");

process.on("unhandledRejection", (reason, p) => {
  log.error("Build had unhandled rejection", reason, p);
  process.exit(1);
});

/**
 * Virtual JSON files that are provided to all build targets. We provide small
 * chunks derived from site.js, as our build process can't tree shake large
 * JSON blobs, even if we're just using them for misc constants.
 */
const virtualImports = {
  webdev_config: {
    prod: isProd,
    env: process.env.ELEVENTY_ENV || "dev",
    version:
      "v" +
      new Date()
        .toISOString()
        .replace(/[\D]/g, "")
        .slice(0, 12),
    firebaseConfig: isProd ? site.firebase.prod : site.firebase.staging,
  },
  webdev_analytics: {
    id: site.analytics.ids.prod,
    dimensions: site.analytics.dimensions,
    version: site.analytics.version,
  },
};

const defaultPlugins = [
  rollupPluginNodeResolve(),
  rollupPluginCJS({
    include: "node_modules/**",
  }),
  rollupPluginVirtual(buildVirtualJSON(virtualImports)),
];

/**
 * Builds the cache manifest for inclusion into the Service Worker.
 *
 * TODO(samthor): This relies on both the gulp and CSS tasks occuring
 * before the Rollup build script.
 */
async function buildCacheManifest() {
  const maybeThrow = (manifest) => {
    if (manifest.warnings.length) {
      console.error(manifest.warnings.join("\n") + "\n");
      if (isProd) {
        throw new Error("unhandled manifest error in prod");
      }
    }
  };

  const toplevelManifest = await getManifest({
    globDirectory: "dist",
    globPatterns: ["images/**", "*.css", "*.js"],
  });
  maybeThrow(toplevelManifest);

  // This doesn't include any HTML, as we bundle that directly into the source
  // of the Service Worker below.
  const contentManifest = await getManifest({
    globDirectory: "dist/en",
    globPatterns: [
      "offline/index.json",
      "images/**/*.{png,svg}", // .jpg files are used for authors, skip
    ],
  });
  maybeThrow(contentManifest);

  const all = [];
  all.push(...toplevelManifest.manifestEntries);
  all.push(...contentManifest.manifestEntries);
  return all;
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

/**
 * Ensures that the passed Rollup result only contains a single chunk.
 *
 * @param {!Promise<rollup.RollupOutput>} rollupPromise
 * @return {!rollup.RollupChunk} the single output chunk
 */
async function singleOutput(rollupPromise) {
  const result = await rollupPromise;
  if (result.output.length !== 1) {
    throw new Error(`expected single output, was: ${result.output.length}`);
  }
  return result.output[0];
}

/**
 * Performs main site compilation via Rollup: first on site code, and second
 * to build the Service Worker.
 */
async function build() {
  const postcssConfig = {};
  if (isProd) {
    // nb. Only require() autoprefixer when used.
    const autoprefixer = require("autoprefixer");
    postcssConfig.plugins = [autoprefixer];

    // uses cssnano vs. our regular CSS usees sass' builtin compression
    postcssConfig.minimize = true;
  }

  // Rollup bootstrap to generate graph of source needs. This eventually uses
  // dynamic import to bring in code required for each page (see router.js).
  // Does not hash "bootstrap.js" entrypoint, but hashes all generated chunks,
  // useful for cache busting.
  const appBundle = await rollup.rollup({
    input: "src/lib/bootstrap.js",
    plugins: [rollupPluginPostCSS(postcssConfig), ...defaultPlugins],
    external: disallowExternal,
  });
  const appGenerated = await appBundle.write({
    dynamicImportFunction: "window._import",
    sourcemap: true,
    dir: "dist",
    format: "esm",
  });
  const generated = appGenerated.output.map(({fileName}) => fileName);

  // Rollup basic to generate the top-level script run by all browsers. This is just for Analytics.
  const basicBundle = await rollup.rollup({
    input: "src/lib/basic.js",
    plugins: [...defaultPlugins],
    external: disallowExternal,
  });
  const basicOutput = await singleOutput(
    basicBundle.write({
      sourcemap: true,
      dir: "dist",
      format: "iife",
    }),
  );
  generated.push(basicOutput.fileName);

  // Compress the generated source here, as we need the final files and hashes for the Service
  // Worker manifest.
  if (isProd) {
    await compressOutput(generated);
  }

  const manifest = isProd ? await buildCacheManifest() : [];
  const noticeDev = isProd ? "" : "// Not generated in dev";

  const layoutTemplate = await fs.readFile(
    path.join("dist", "sw-partial-layout.partial"),
    "utf-8",
  );

  const swBundle = await rollup.rollup({
    input: "src/lib/sw.js",
    plugins: [
      // This variable is defined by Webpack (and some other tooling), but not by Rollup. Set it to
      // "production" if we're in prod, which will hide all of Workbox's log messages.
      // Note that Terser below will actually remove the conditionals (this replace will generate
      // lots of `if ("production" !== "production")` statements).
      rollupPluginReplace({
        "process.env.NODE_ENV": JSON.stringify(isProd ? "production" : ""),
      }),
      rollupPluginVirtual({
        "cache-manifest": `export default ${JSON.stringify(
          manifest,
        )};${noticeDev}`,
        "layout-template": `export default ${JSON.stringify(layoutTemplate)}`,
      }),
      ...defaultPlugins,
    ],
    inlineDynamicImports: true, // SW does not support imports
    external: disallowExternal,
  });
  const swOutput = await singleOutput(
    swBundle.write({
      sourcemap: true,
      dir: "dist",
      format: "esm",
    }),
  );

  if (isProd) {
    await compressOutput([swOutput.fileName]);
    generated.push(swOutput.fileName);
  }
  return generated;
}

async function buildTest() {
  const testBundle = await rollup.rollup({
    input: "src/lib/test/index.js",
    plugins: [rollupPluginPostCSS(), ...defaultPlugins],
  });
  await testBundle.write({
    dir: "dist/test",
    format: "iife",
  });
}

async function compressOutput(generated) {
  let inputSize = 0;
  let outputSize = 0;

  for (const fileName of generated) {
    const target = path.join("dist", fileName);

    const raw = await fs.readFile(target, "utf8");
    inputSize += raw.length;

    const result = terser.minify(raw, {
      sourceMap: {
        content: await fs.readFile(target + ".map", "utf8"),
        url: fileName + ".map",
      },
    });

    if (result.error) {
      throw new Error(`could not minify ${fileName}: ${result.error}`);
    }

    outputSize += result.code.length;
    await fs.writeFile(target, result.code, "utf8");
    await fs.writeFile(target + ".map", result.map, "utf8");
  }

  const ratio = outputSize / inputSize;
  log(`Terser JS output is ${(ratio * 100).toFixed(2)}% of source`);
}

(async function() {
  const generated = await build();
  log(`Generated ${generated.length} files`);
  if (!isProd) {
    await buildTest();
  }
})();
