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
 * @fileoverview Wrappers around `child_process.spawn()`. Used by the internal
 * DevSite scripts.
 */

'use strict';

const {spawn} = require('child_process');

/**
 * Simple wrapper for `child_process.spawn()` which wraps in a Promise. This
 * merges together stderr and stdout, and rejects (with status only) if the
 * child process returns non-zero.
 *
 * Arguments are as `child_process.spawn()`.
 *
 * @return {!Promise<string>}
 */
function spawnPromise(command, args, options) {
  const childProcess = spawn(command, args, options);

  return new Promise((resolve, reject) => {
    let out = '';

    const handleData = (data) => {
      out += data;
    };
    childProcess.stdout && childProcess.stdout.on('data', handleData);
    childProcess.stderr && childProcess.stderr.on('data', handleData);

    childProcess.on('error', (err) => reject(err));
    childProcess.on('close', (status) => {
      if (status) {
        console.warn(out); // eslint-disable-line no-console
      }
      status ? reject(status) : resolve(out);
    });
  });
}

module.exports = spawnPromise;

/**
 * Promise wrapper for `child_process.spawn()`, where the resolved result
 * is the status code (even non-zero) of executing the command.
 */
module.exports.status = (command, args, options) => {
  const childProcess = spawn(command, args, options);

  return new Promise((resolve, reject) => {
    childProcess.on('error', (err) => reject(err));
    childProcess.on('close', resolve);
  });
};

/**
 * Promise wrapper for `child_process.spawn()`, where the resolved result
 * just contains stdout (not stderr).
 */
module.exports.stdio = (command, args, options) => {
  options = options || {};
  options.stdio = ['pipe', 'pipe', 'ignore'];
  return spawnPromise(command, args, options);
};
