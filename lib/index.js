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

/**
 * @fileoverview Entry point for the web.dev build tool.
 */

'use strict';

const path = require('path');
const content = require('./deps/content.js');
const minimist = require('minimist');
const devsiteMarkdown = require('./deps/devsite-markdown.js');
const gen = require('./generators.js');
const validate = require('./validate');
const colors = require('ansi-colors');
const fsp = require('./deps/fsp.js');
const log = require('fancy-log');

if (!process.env.INIT_CWD) {
  // not available in old NPM or Yarn
  log.warn(`INIT_CWD env not available; errors might result, upgrade NPM/Yarn`);
}

const sourceDir = path.join(__dirname, '..', 'content');
const outputDir = path.join(__dirname, '..', 'build', 'en');

const opts = minimist(process.argv.slice(2), {
  boolean: ['symlink', 'recurse', 'stage'],
  default: {
    symlink: false,
    recurse: null,
    stage: false,
  },
  alias: {
    recurse: 'r',
    symlink: 'l',
  },
});
const config = require('./deps/config.js')(opts._, sourceDir);

if (!config.root || !config.target.length) {
  log.warn(`fatal; build path is not in content/ (sourceDir=${sourceDir}, _=${opts._}`);
  return process.exit(1);
}
if (opts.recurse === null) {
  opts.recurse = (config.target.length === 1 && config.target[0] === '.');
}
process.chdir(config.root);


// configure paths that are dynamically generated
const loader = new content.ContentLoader();
loader.register('_auditpaths.md', gen.AuditGuidePaths);
loader.register('path/*/_guidelist.md', gen.PathIndex);
loader.register('./*.md', gen.MarkdownBuilder);
loader.register('./*.yaml', gen.FilterYaml);
loader.register('./*.json', validate.testJSON);


async function run() {
  const all = new Map();
  const paths = [];  // list of paths that can be staged
  const stats = {
    'warning': 0,  // files with warnings
    'total': 0,    // total generated files (non-null)
    'link': 0,     // files linked/copied in-place
    'virtual': 0,  // completely virtual files
    'ignored': 0,  // hidden from output
  };

  for (const req of config.target) {
    const out = await loader.build(req, opts.recurse);
    for (const cf of out) {
      all.set(cf.path, cf);
    }
  }

  const writes = [];

  for (const cf of all.values()) {
    const built = await cf.build();
    const warnings = cf.warnings;

    if (built !== null && cf.ext === '.md') {
      // Find DevSite includes and ensure they are also built. Includes in DevSite are relative to
      // the top-level language directory:
      //   e.g., 'en/path/to/foo.md' must include 'path/to/_include.md'
      const read = await cf.read();
      const devsiteConfig = devsiteMarkdown(cf.path, read);
      for (const include of devsiteConfig.includes) {
        const found = await loader.build(include);
        for (const cf of found) {
          all.set(cf.path, cf);
        }
        if (found.size === 0) {
          // TODO(samthor): Log a warning, because this is interesting
        }
      }
    }

    const p = write(cf.path, built);
    writes.push(p);

    let colorFn = (arg) => arg;
    if (cf.empty) {
      ++stats['virtual'];
      colorFn = colors.magenta;
    } else if (built === undefined) {
      ++stats['link'];
      colorFn = colors.cyan;
    }
    if (warnings.length) {
      ++stats['warning'];
    }
    if (built === null) {
      ++stats['ignored'];
      continue;  // don't log ignored file
    }
    ++stats['total'];
    paths.push(cf.path);

    // log tick/cross for success, and cyan for link/copy in-place
    log(warnings.length ? colors.red('✗') : colors.green('✓'), colorFn(cf.path));
    for (const {message, cause} of warnings) {
      log.info(colors.red(message), cause.message);
    }
  }

  await Promise.all(writes);
  return {stats, paths};
}


async function write(fullPath, data) {
  if (data === null) {
    return null;  // nothing to do
  }

  const destFile = path.join(outputDir, fullPath);
  await fsp.mkdirp(path.dirname(destFile));

  if (data !== undefined) {
    // write geterated file
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


run().then(async ({stats, paths}) => {
  log.info(`${stats['total']} files done`);
  if (stats['warning']) {
    log.warn(colors.red(`${stats['warning']} files with warnings`));
    // TODO(samthor): Allow a force mode, or a less crashy mode for testing.
    return process.exit(2);
  }

  if (!opts.stage) {
    return;
  }
  console.info('');
  console.info('devsite2 stage...\n');

  process.chdir(__dirname);
  const {spawn} = require('child_process');
  const stage = spawn('/bin/bash', ['stage.sh', ...paths]);

  stage.stdout.on('data', (data) => process.stdout.write(data));
  stage.stderr.on('data', (data) => process.stderr.write(data));

  const status = await new Promise((resolve) => stage.on('close', resolve));
  if (status) {
    throw new Error(`stage script error: ${status}`);
  }
  console.info('');

}).catch((err) => {
  console.warn(err);
  return process.exit(1);
});
