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
  boolean: [true, 'r'],
  default: {lang: 'en', r: undefined},
};
const argv = require('minimist')(process.argv.slice(2), opts);
const config = require('./deps/config.js')(argv._, `${__dirname}/content`);
const fs = require('fs');
const path = require('path');
const isDir = require('./deps/is-dir.js');
const gen = require('./generators.js');
const content = require('./deps/content.js');

if (!config.root) {
  return process.exit(1);
}
process.chdir(config.root);


const loader = new content.ContentLoader();
loader.register('en', '_auditpaths.md', gen.AuditGuidePaths);
loader.register('en/path', '_path-*.md', null);
loader.register('en/path/*', '_guidelist.md', gen.PathIndex);


async function run() {
  const all = new Map();

  for (const req of config.target) {
    const recurse = (argv.r !== undefined ? argv.r : req === '.');
    const out = await loader.contents(req, recurse);

    for (const {path, gen} of out) {
      all.set(path, gen);
    }
  }
  if (!all.size) {
    console.warn('no files matched');
    return process.exit(1);
  }
  console.debug('building', all.size, 'files');

  for (const [target, gen] of all) {
    const ext = path.extname(target);
    console.info(target, ext);
  }
}

run().catch((err) => {
  console.error(err);
  return process.exit(2);
});
