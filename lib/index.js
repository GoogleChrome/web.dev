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
 * Grab the devsite build script and attempt to deploy the site.
 */
async function run() {
  const devsite = await requireInternalDeployScript();
  await devsite('dist', null);
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
    // eslint-disable-next-line
    console.warn(
      `Couldn't require internal deploy script. ` +
        `This is for use only by Google folks.`
    );
    process.exit(3);
  }
}

run()
  .catch((err) => {
    console.warn(err); // eslint-disable-line no-console
    return process.exit(1);
  });
