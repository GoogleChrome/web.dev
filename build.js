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

const lang = 'en';
const sourceDir = `${__dirname}/content`;
const outputDir = `${__dirname}/build`;

const opts = {
  boolean: [true, 'r', 'stage', 'l'],
  default: {r: false, stage: false},
};
const argv = require('minimist')(process.argv.slice(2), opts);
const config = require('./deps/config.js')(argv._, sourceDir);
const content = require('./deps/content.js');
const devsiteMarkdown = require('./deps/devsite-markdown.js');
const fsp = require('./deps/fsp.js');
const gen = require('./generators.js');
const markdown = require('./markdown.js');
const path = require('path');


if (!config.root) {
  return process.exit(1);
}
process.chdir(config.root);


const loader = new content.ContentLoader();
loader.register(`${lang}`, '_auditpaths.md', gen.AuditGuidePaths);
loader.register(`${lang}/path/*`, '_guidelist.md', gen.PathIndex);
// loader.register(`${lang}/path`, '_*-guides.md', gen.PathGuides);


async function run() {
  const all = new Set();

  for (const req of config.target) {
    const recurse = (argv.r || req === '.');
    const out = await loader.contents(req, recurse);

    for (const config of out) {
      all.add(config);
    }
  }
  if (!all.size) {
    console.warn('no files matched');
    return process.exit(1);
  }

  const writes = [];

  for (const cf of all) {
    const destDir = path.join(outputDir, cf.dir);
    const destFile = path.join(outputDir, cf.path);
    await fsp.mkdirp(destDir);

    if (cf.ext === '.md') {
      // generate final Markdown based on YAML prefix config
      const content = await cf.content;
      const out = markdown(cf.path, await cf.config, content);

      // Find DevSite includes and ensure they are also built. Includes in DevSite are relative to
      // the top-level language directory:
      //   e.g., 'en/path/to/foo.md' must include 'path/to/_include.md'
      const devsiteRoot = `${lang}`;
      const devsiteConfig = devsiteMarkdown(out);

      for (const include of devsiteConfig.includes) {
        const depPath = path.join(devsiteRoot, include);
        const dep = await loader.get(depPath);
        if (dep) {
          all.add(dep);
        } else {
          console.warn('couldn\'t match DevSite include', depPath);
        }
      }

      // write Markdown generated file
      writes.push(fsp.writeFile(destFile, out));
    } else if (cf.generated) {
      // write general generated file (non-Markdown)
      writes.push(fsp.writeFile(destFile, out));
    } else if (argv.l) {
      // symlink unchanged files with -l
      // TODO(samthor): Why does the first component need to be chopped?
      const relativePath = path.relative(destFile, cf.path).substr(3);
      const safeUnlink = fsp.unlink(destFile).catch(() => null);
      const link = safeUnlink.then(() => fsp.symlink(relativePath, destFile));
      writes.push(link);
    } else {
      // ... finally, fall back to copying into place
      writes.push(fsp.copyFile(cf.path, destFile));
    }
  }

  await Promise.all(writes);

  const keys = [...all.keys()];
  keys.sort();
  for (const dep of keys) {
    console.debug(dep.path);
  }

  console.info('success, written', all.size, 'files to', outputDir);
}

run().catch((err) => {
  console.error(err);
  return process.exit(2);
});
