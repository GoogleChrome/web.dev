#!/usr/bin/env node
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

/* eslint-disable require-jsdoc, valid-jsdoc */

/**
 * @fileoverview Entry point for the web.dev build tool.
 */

'use strict';

const del = require('del');
const path = require('path');
const minimist = require('minimist');
const colors = require('ansi-colors');
const fsp = require('./deps/fsp.js');
const log = require('fancy-log');

if (!process.env.INIT_CWD) {
  // not available in old NPM or Yarn
  log.warn(`INIT_CWD env not available; errors might result, upgrade NPM/Yarn`);
}

const moduleDir = path.join(__dirname, '..');
const sourceDir = path.join(moduleDir, 'content');
const outputDir = path.join(moduleDir, 'build', 'en');

// Move to the top-level moduleDir for setup work.
process.chdir(moduleDir);

const opts = minimist(process.argv.slice(2), {
  boolean: ['symlink', 'recurse', 'deploy'],
  default: {
    symlink: false,
    recurse: null,
    clear: null,
    deploy: false,
  },
  alias: {
    recurse: 'r',
    symlink: 'l',
  },
});
const config = require('./deps/config.js')(opts._, sourceDir);

if (!config.root || !config.target.length) {
  log.warn(
      `fatal; build path is not in content/ ` +
      `(sourceDir=${sourceDir}, _=${opts._}`
  );
  return process.exit(1);
}

// Both --recurse and --clear are implied if we're building the entire repo.
const buildAll = config.target.length === 1 && config.target[0] === '.';
if (opts.recurse === null) {
  opts.recurse = buildAll;
}
if (opts.clear === null) {
  opts.clear = buildAll;
}

async function run() {
  if (opts.clear) {
    const displayOutputDir = path.relative(moduleDir, outputDir);
    log(`Clearing ${colors.red(displayOutputDir)}...`);
    await del(outputDir);
  }

  // Move to content/ directory for build process.
  process.chdir(config.root);

  const all = new Map();
  const paths = []; // list of paths that can be staged
  const stats = {
    warning: 0, // files with warnings
    total: 0, // total generated files (non-null)
    link: 0, // files linked/copied in-place
    virtual: 0, // completely virtual files
    ignored: 0, // hidden from output
  };

  // Import the web.dev builder loader config.
  const otherHandler = (cf) => all.set(cf.path, cf);
  const loader = require('./config/loader.js')(otherHandler);

  for (const req of config.target) {
    const out = await loader.build(req, opts.recurse);
    for (const cf of out) {
      all.set(cf.path, cf);
    }
  }

  const writes = [];
  for (const cf of all.values()) {
    const built = await cf.build(otherHandler);
    writes.push(write(cf.path, built));

    let colorFn = (arg) => arg;
    if (cf.empty) {
      ++stats['virtual'];
      colorFn = colors.magenta;
    } else if (built === undefined) {
      ++stats['link'];
      colorFn = colors.cyan;
    }
    if (cf.warnings.length) {
      ++stats['warning'];
    }
    if (built === null) {
      ++stats['ignored'];
      colorFn = colors.dim;
    }

    if (built !== null) {
      ++stats['total'];
      paths.push(cf.path);

      // log tick/cross for success, and cyan for link/copy in-place
      log(
        cf.warnings.length ? colors.red('✗') : colors.green('✓'),
        colorFn(cf.path)
      );
    } else if (cf.warnings.length) {
      // file not generated but still had an error
      log('-', colorFn(cf.path));
    }
    for (const {message, cause} of cf.warnings) {
      log.info(colors.red(message), (cause && cause.message) || cause || '');
    }
  }

  await Promise.all(writes);
  return {stats, paths};
}

async function write(fullPath, data) {
  if (data === null) {
    return null; // nothing to do
  }

  const destFile = path.join(outputDir, fullPath);
  await fsp.mkdirp(path.dirname(destFile));

  if (data !== undefined) {
    // write generated file
    return fsp.writeFile(destFile, data);
  } else if (opts.symlink) {
    // symlink unchanged files
    // TODO(samthor): Why does the first component need to be chopped?
    const relativePath = path.relative(destFile, fullPath).substr(3);
    const safeUnlink = fsp.unlink(destFile).catch(() => null);
    return safeUnlink.then(() => fsp.symlink(relativePath, destFile));
  } else {
    // ... finally, fall back to copying into place
    return fsp.copyFile(fullPath, destFile);
  }
}

/**
 * Log total stats and optionally deploy changes.
 *
 * @param {{stats: !Object<string, number>, paths: !Array<string>}}
 */
async function reportAndDeploy({stats, paths}) {
  log.info(`${stats['total']} files done`);
  if (stats['warning']) {
    log.warn(colors.red(`${stats['warning']} files with warnings`));
    // TODO(samthor): Allow a force mode, or a less crashy mode for testing.
    return process.exit(2);
  }
  if (!opts.deploy) {
    return;
  }

  // pretend all content is inside 'en' for now
  const buildDir = path.join(moduleDir, 'build');
  const pathsWithLang = paths.map((c) => path.join('en', c));

  const devsite = await requireInternalDeployScript();
  await devsite(buildDir, buildAll ? null : pathsWithLang);
}

/**
 * Finds the internal deploy script.
 *
 * @return {!function(string, ?Array<string>): !Promise<void>}
 */
async function requireInternalDeployScript() {
  try {
    return require('./devsite.js');
  } catch (e) {
    log.warn(
        `Couldn't require internal deploy script. ` +
        `This is for use only by Google folks.`
    );
    process.exit(3);
  }
}

run()
    .then(reportAndDeploy)
    .catch((err) => {
      console.warn(err); // eslint-disable-line no-console
      return process.exit(1);
    });
