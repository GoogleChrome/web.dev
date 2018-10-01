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

'use strict';

const fs = require('fs');
const path = require('path');
const isDir = require('./is-dir.js');
const isGlob = require('is-glob');
const util = require('util');
const micromatch = require('micromatch');

const fsp = {
  readdir: util.promisify(fs.readdir),
  readFile: util.promisify(fs.readFile),
};

class ContentLoader {
  constructor() {
    this._gen = [];
  }

  /**
   * Registers a virtual path and a matching generator.
   *
   * If the specified name is a glob, then this will only create virtual files when explicitly
   * specified or included as a dependency.
   *   e.g. 'example','_config-*.yaml' will not match for 'example/*', but will for an explicit
   *        path such as 'path/to/_config-foo.yaml'.
   *
   * @param {string} dir glob-style directory to match
   * @param {string} name glob-style filename to match
   * @param {*} gen generator for file
   */
  register(dir, name, gen) {
    this._gen.push({dir, name, gen});
  }

  _virtual(candidateDir, candidateName='*') {
    // TODO(samthor): we recompile/rework the micromatch calls every run, slow.
    const out = this._gen.map(({dir, name, gen}) => {
      // match non-glob candidate against glob stored dir
      // e.g. 'path/foo' against 'path/*'
      if (!micromatch.isMatch(candidateDir, dir)) {
        return null;  // not the right dir
      }

      // match non-glob candidate (specific file request) against glob stored name
      // e.g. '_gen-filename.md' against '_gen-*.md'
      if (micromatch.isMatch(candidateName, name)) {
        return {name: candidateName, gen};
      }

      // match glob candidate (broad request, normal) against non-glob stored name
      // e.g. '*' against anything, or '*.md' against 'foo.md'
      if (!isGlob(name)) {
        if (candidateName === '*' || micromatch.isMatch(name, candidateName)) {
          return {name, gen};
        }
      }

      return null;  // no match
    }).filter((x) => x !== null);

    return out;
  }

  /**
   * @param {string} req glob-style path request
   * @param {boolean=} recurse search further dirs
   * @return {!Array<{path: string, gen: *}>}
   */
  async contents(req, recurse=false) {
    if (isDir(req)) {
      return this._contents(req, '*', recurse);
    }

    const dir = path.dirname(req);
    if (isGlob(dir)) {
      throw new Error('glob parts unsupported in directory, use shell');
    }
    const name = path.basename(req);

    return this._contents(dir, name, recurse);
  }

  async _contents(rootDir, globName, recurse) {
    if (!isDir(rootDir)) {
      return [];  // dir does not exist
    }

    const pendingDir = [rootDir];
    const out = [];

    while (pendingDir.length) {
      const currentDir = pendingDir.shift();
      const dirContent = await fsp.readdir(currentDir);

      const matchedFiles = micromatch.match(dirContent, globName);
      for (const raw of matchedFiles) {
        const fullPath = path.join(currentDir, raw);
        if (isDir(fullPath)) {
          recurse && pendingDir.push(fullPath);
        } else {
          out.push({path: fullPath, gen: null});
        }
      };

      const virtualFiles = this._virtual(currentDir, globName);
      for (const {name: raw, gen} of virtualFiles) {
        const fullPath = path.join(currentDir, raw);
        out.push({path: fullPath, gen});
      }
    }

    return out.filter((x) => x !== null);
  }

}

module.exports = {ContentLoader};
