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

const fsp = require('./fsp.js');
const isDir = require('./is-dir.js');
const isGlob = require('is-glob');
const micromatch = require('micromatch');
const path = require('path');
const YAML = require('yaml').default;
const yamlPrefix = require('./yaml-prefix.js');


class ContentFile {

  /**
   * @param {string} fullPath
   * @param {!ContentLoader} loader
   */
  constructor(fullPath, loader) {
    this.path = fullPath;
    this._loader = loader;
    const parsed = path.parse(fullPath);

    /** @public {string} */
    this.ext = parsed.ext;

    /** @public {string} */
    this.dir = parsed.dir;

    /** @public {string} */
    this.base = parsed.base;

    /** @private {?Promise<string>} */
    this._content = null;

    /** @private {?Promise<?Object<string, *>>} */
    this._config = null;
  }

  get generated() {
    return this instanceof VirtualContentFile;
  }

  /**
   * @return {string}
   * @private
   */
  async read() {
    return await fsp.readFile(this.path, 'utf-8');
  }

  _prepareRead() {
    if (this._content !== null) {
      return;  // done
    }
    const read = this.read();

    switch (this.ext) {
      case '.md': {
        // read markdown content and remove YAML prefix
        const p = read.then(yamlPrefix);
        this._content = p.then((out) => out.rest);
        this._config = p.then((out) => out.config);
        break;
      }
      case '.yaml': {
        // parse YAML but leave source intact
        this._config = read.then(YAML.parse);
        break;
      }
    }

    this._content = this._content || read;
    this._config = this._config || Promise.resolve(null);
  }

  /**
   * @return {!Promise<string>}
   */
  get content() {
    this._prepareRead();
    return this._content;
  }

  /**
   * @return {?Promise<?Object<string, *>>}
   */
  get config() {
    this._prepareRead();
    return this._config;
  }
}


class VirtualContentFile extends ContentFile {
  constructor(fullPath, loader, gen) {
    super(fullPath, loader);
    this._gen = gen;
    this._reading = false;
  }

  /**
   * @param {!ContentLoader} loader
   * @return {string}
   * @override
   */
  async read() {
    if (this._reading) {
      throw new Error(`recursive read of path: ${this.path}`);
    }
    this._reading = true;
    try {
      return await this._gen(this._loader, this);
    } finally {
      this._reading = false;
    }
  }
}


class ContentLoader {

  /**
   * @param {string} dir root dir to process from, used for lang
   */
  constructor(dir) {
    this._dir = dir;

    /**
     * @private {!Array<{dir: string, name: string, gen: *}>}
     */
    this._gen = [];

    /**
     * @private {!Object<string, !ContentFile>}
     */
    this._cache = {};
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
   * @param {string} req specific non-gen path request
   * @return {?ContentFile}
   */
  async get(req) {
    if (isGlob(req)) {
      throw new Error('can\'t glob read()');
    }

    const out = await this.contents(req);
    if (out.length > 1) {
      throw new Error('somehow matched more than one file');
    } else if (out.length === 0) {
      return null;
    }
    return out[0];
  }

  /**
   * @param {string} req glob-style path request
   * @param {boolean=} recurse search further dirs
   * @return {!Array<!ContentFile>}
   */
  async contents(req, recurse=false) {
    req = path.normalize(req);

    if (isDir(req)) {
      return this._contents(req, '*', recurse);
    }

    const dir = path.dirname(req);
    if (isGlob(dir)) {
      throw new Error('glob parts unsupported in directory, use shell');
    }
    return this._contents(dir, path.basename(req), recurse);
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

      const matchedFiles =
          globName === '*' ? dirContent : micromatch.match(dirContent, globName);
      for (const raw of matchedFiles) {
        if (raw.startsWith('.')) {
          continue;  // never match .-files
        }
        const fullPath = path.join(currentDir, raw);
        if (isDir(fullPath)) {
          recurse && pendingDir.push(fullPath);
        } else {
          out.push(await this._outputFor(fullPath));
        }
      };

      const virtualFiles = this._virtual(currentDir, globName);
      for (const {name: raw, gen} of virtualFiles) {
        const fullPath = path.join(currentDir, raw);
        out.push(await this._outputFor(fullPath, gen));
      }

      // if this recurses into subdirs, reset glob
      globName = '*';
    }

    return out.filter((x) => x !== null);
  }

  async _outputFor(fullPath, gen=undefined) {
    let cf = this._cache[fullPath];
    if (cf === undefined) {
      if (gen !== undefined) {
        // generated files can't be read
        cf = new VirtualContentFile(fullPath, this, gen);
      } else {
        // read real file
        cf = new ContentFile(fullPath, this);
      }

      this._cache[fullPath] = cf;
    }
    return cf;
  }
}

module.exports = {ContentLoader};
