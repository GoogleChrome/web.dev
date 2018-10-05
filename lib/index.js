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
const build = require('./deps/build.js');
const content = require('./deps/content.js');
const gen = require('./generators.js');
const colors = require('ansi-colors');

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


// configure paths that are post-processed
const builder = new build.ContentBuilder(loader);
builder.post('*.md', gen.MarkdownBuilder);
builder.post('*.yaml', gen.FilterMarkdown);


const buildOpts = {
  recurse: argv.r || (config.target.length === 1 && config.target[0] === '.'),
  symlink: argv.l || argv.symlink,
};


builder.build(outputDir, config.target, buildOpts).then((out) => {
  for (const p of out) {
    console.debug(colors.cyan(p));
  }
  console.info('success, written', out.length, 'files to', outputDir);
}).catch((err) => {
  console.error(err);
  return process.exit(1);
});
