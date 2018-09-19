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

const argv = require('minimist')(process.argv.slice(2), {boolean: true});
const config = require('./deps/config.js')(argv._, `${__dirname}/content`);
const fs = require('fs');

if (!config.root) {
  return process.exit(1);
}
process.chdir(config.root);

async function run() {
  console.info(config);
}

run().catch((err) => {
  console.error(err);
  return process.exit(2);
});
