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



const opts = {
  boolean: [true, 'r', 'stage', 'l', 'symlink'],
  default: {r: false, stage: false},
};
const path = require('path');
const content = require('./deps/content.js');
const devsiteMarkdown = require('./deps/devsite-markdown.js');
const gen = require('./generators.js');
const colors = require('ansi-colors');
const fsp = require('./deps/fsp.js');

const lang = 'en';
const sourceDir = path.join(__dirname, '..', 'content');
const outputDir = path.join(__dirname, '..', 'build');

const argv = require('minimist')(process.argv.slice(2), opts);
const config = require('./deps/config.js')(argv._, sourceDir);

if (!config.root) {
  return process.exit(1);
}
process.chdir(config.root);


// configure paths that are dynamically generated
const loader = new content.ContentLoader();
loader.register(`${lang}/_auditpaths.md`, gen.AuditGuidePaths);
loader.register(`${lang}/path/*/_guidelist.md`, gen.PathIndex);
loader.register('./*.md', gen.MarkdownBuilder);
loader.register('./*.yaml', gen.FilterYaml);



async function run() {
  const all = new Map();

  const buildOpts = {
    recurse: argv.r || (config.target.length === 1 && config.target[0] === '.'),
    symlink: argv.l || argv.symlink,
  };

  for (const req of config.target) {
    const out = await loader.contents(req, buildOpts.recurse);
    for (const cf of out) {
      all.set(cf.path, cf);
    }
  }

  const writes = [];
  const paths = new Map();

  for (const cf of all.values()) {
    const built = await cf.build();
    if (built === null) {
      // do nothing, don't write this file
      if (!cf.empty) {
        paths.set(cf.path, 'ignored');
      }
      continue;
    }

    if (cf.ext === '.md') {
      // Find DevSite includes and ensure they are also built. Includes in DevSite are relative to
      // the top-level language directory:
      //   e.g., 'en/path/to/foo.md' must include 'path/to/_include.md'
      const read = await cf.read();
      const devsiteRoot = `${lang}/`;
      const devsiteConfig = devsiteMarkdown(read);
      for (const include of devsiteConfig.includes) {
        const cf = await loader.get(path.join(devsiteRoot, include));
        if (cf) {
          all.set(cf.path, cf);
        }
      }
    }

    const destDir = path.join(outputDir, cf.dir);
    const destFile = path.join(outputDir, cf.path);
    await fsp.mkdirp(destDir);

    if (built !== undefined) {
      // write generated file
      writes.push(fsp.writeFile(destFile, built));
      paths.set(cf.path, cf.empty ? 'virtual' : 'derived');
    } else if (buildOpts.symlink) {
      // symlink unchanged files with -l
      // TODO(samthor): Why does the first component need to be chopped?
      const relativePath = path.relative(destFile, cf.path).substr(3);
      const safeUnlink = fsp.unlink(destFile).catch(() => null);
      const link = safeUnlink.then(() => fsp.symlink(relativePath, destFile));
      writes.push(link);
      paths.set(cf.path, 'unchanged');
    } else {
      // ... finally, fall back to copying into place
      writes.push(fsp.copyFile(cf.path, destFile));
      paths.set(cf.path, 'unchanged');
    }
  }

  await Promise.all(writes);
  return paths;
}


run().then((out) => {
  const styleMap = {
    'virtual': colors.magenta,
    'derived': colors.green,
    'ignored': colors.red,
    'unchanged': colors.cyan,
  };

  function styleApproach(approach, text) {
    const fn = styleMap[approach] || colors.white;
    return fn(text);
  }

  const stats = {
    'ignored': 0,    // not included in output
    'total': 0,
    'virtual': 0,    // completely virtual generated files
    'derived': 0,    // derived from a file
    'unchanged': 0,  // copied in-place
  };
  out.forEach((approach, p) => {
    ++stats[approach];
    if (approach !== 'ignored') {
      ++stats['total'];
    }
    console.debug(styleApproach(approach, p));
  });
  console.info('');

  for (const key in stats) {
    console.info(styleApproach(key, `${stats[key]} ${key}`))
  }
}, (err) => {
  console.warn(err);
  return process.exit(1);
});


// //process.exit(0);
//
// // configure paths that are post-processed
// // FIXME: remove?
// const builder = new build.ContentBuilder(loader);
//
//
// const buildOpts = {
//   recurse: argv.r || (config.target.length === 1 && config.target[0] === '.'),
//   symlink: argv.l || argv.symlink,
// };
//
//
// builder.build(outputDir, config.target, buildOpts).then((out) => {
//   for (const p of out) {
//     console.debug(colors.cyan(p));
//   }
//   console.info('success, written', out.length, 'files to', outputDir);
// }).catch((err) => {
//   console.error(err);
//   return process.exit(1);
// });
