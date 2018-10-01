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
  default: {r: undefined, stage: false},
};
const argv = require('minimist')(process.argv.slice(2), opts);
const config = require('./deps/config.js')(argv._, sourceDir);
const closest = require('./deps/closest.js');
const path = require('path');
const gen = require('./generators.js');
const devsiteMarkdown = require('./deps/devsite-markdown.js');
const content = require('./deps/content.js');
const fsp = require('./deps/fsp.js');


if (!config.root) {
  return process.exit(1);
}
process.chdir(config.root);


const loader = new content.ContentLoader();
loader.register(`${lang}`, '_auditpaths.md', gen.AuditGuidePaths);
loader.register(`${lang}/path/*`, '_guidelist.md', gen.PathIndex);
// loader.register(`${lang}/path`, '_*-guides.md', gen.PathGuides);


async function run() {
  const all = new Map();

  for (const req of config.target) {
    const recurse = (argv.r !== undefined ? argv.r : req === '.');
    const out = await loader.contents(req, recurse);

    for (const config of out) {
      all.set(config.path, config);
    }
  }
  if (!all.size) {
    console.warn('no files matched');
    return process.exit(1);
  }

  const writes = [];

  for (const config of all.values()) {
    const destDir = path.join(outputDir, config.cf.dir);
    const destFile = path.join(outputDir, config.path);
    await fsp.mkdirp(destDir);

    const generated = config.gen ? config.gen(loader, config.cf) : null;

    if (config.cf.ext === '.md') {
      const source = await (generated !== null ? generated : config.cf.read());

      // Find DevSite includes and ensure they are also built. Includes in DevSite are relative to
      // the top-level language directory:
      //   e.g., 'en/path/to/foo.md' must include 'path/to/_include.md'
      const devsiteRoot = `${lang}`;
      const devsiteConfig = devsiteMarkdown(source);

      for (const include of devsiteConfig.includes) {
        const depPath = path.join(devsiteRoot, include);
        const dep = await loader.get(depPath);
        if (!dep) {
          console.warn('couldn\'t match DevSite include', depPath);
        } else if (!all.has(dep.path)) {
          all.set(dep.path, dep);
        }
      }

      // TODO(samthor): Render Markdown files based on their YAML prefix config, rather than just
      // blitting to the output path.

      // insert standard DevSite Markdown preamble
      const projectPath = closest(config.path, '_project.yaml');
      const bookPath = closest(config.path, '_book.yaml');
      const out = `project_path: ${projectPath}\nbook_path: ${bookPath}\n\n${source}`;

      // write Markdown generated file
      writes.push(fsp.writeFile(destFile, out));
    } else if (generated !== null) {
      // write general generated file (non-Markdown)
      writes.push(fsp.writeFile(destFile, out));
    } else if (argv.l) {
      // symlink unchanged files with -l
      // TODO(samthor): Why does the first component need to be chopped?
      const relativePath = path.relative(destFile, config.path).substr(3);
      const safeUnlink = fsp.unlink(destFile).catch(() => null);
      const link = safeUnlink.then(() => fsp.symlink(relativePath, destFile));
      writes.push(link);
    } else {
      // ... finally, fall back to copying into place
      writes.push(fsp.copyFile(config.path, destFile));
    }
  }

  await Promise.all(writes);

  const keys = [...all.keys()];
  keys.sort();

  for (const fullPath of keys) {
    console.info(fullPath);
  }

  console.log('success, written', all.size, 'files to', outputDir);
}

run().catch((err) => {
  console.error(err);
  return process.exit(2);
});
