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


/**
 * @param {string} dir to search
 * @param {string} glob within directory to match
 * @param {boolean=} whether to only return further directories
 * @return {!Array<string>}
 */
async function globDirContents(dir, glob, dirOnly=false) {
  // nb. we catch err (likely ENOENT) and just return []
  const dirContents = await fsp.readdir(dir).catch((err) => []);
  let out = (glob === '*' ? dirContents : micromatch.match(dirContents, glob));

  // remove dotfiles
  out = out.filter((cand) => cand[0] !== '.');

  // only include further dirs
  if (dirOnly) {
    out = out.filter((cand) => isDir(path.join(dir, cand)));
  }

  return out;
}


/**
 * @param {string} path to split
 * @return {!Array<string>} parts of path
 */
function splitPath(req) {
  const parts = [];
  while (req && req !== '.') {
    parts.unshift(path.basename(req));
    req = path.dirname(req);
  }
  return parts;
}


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

    /** @public {string} */
    this.name = parsed.name;

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
        // also leave source intact
        this._config = read;
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
    // re-parse YAML every call
    return this._config.then((x) => x !== null ? YAML.parse(x) : {});
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
    const state = {
      loader: this._loader,
      cf: this,
    }
    this._reading = true;
    try {
      return await this._gen(state);
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

    // this is a real dir, just find its contents
    if (isDir(req)) {
      return this._dirContents(req, '*', recurse);
    }

    const dir = path.dirname(req);
    if (!isGlob(dir)) {
      // fast-path, no glob part in directory matcher
      return this._dirContents(dir, path.basename(req), recurse);
    }

    // this is a directory glob, like "foo/*/bar", split into parts: walk from left and expand
    // glob parts by recursively calling .contents()
    const parts = splitPath(req);
    const left = [];
    while (parts.length) {
      const next = parts.shift();
      if (!isGlob(next)) {
        left.push(next);
        continue;
      }

      // TODO(samthor): If we are gen-ing a file in a virtual dir, it should match here too:
      // currently this limits to real on-disk dirs.
      const currentDir = path.join(...left);
      const dirContents = await globDirContents(currentDir, next, true);

      // merge recursive searches for all glob options
      const all = await Promise.all(dirContents.map((opt) => {
        const sreq = path.join(currentDir, opt, ...parts);
        return this.contents(sreq, recurse);
      }));
      return all.reduce((a, b) => a.concat(b), []);
    }

    throw new TypeError('Should not get here');
  }

  async _dirContents(rootDir, globName, recurse) {
    const pendingDir = [rootDir];
    const out = [];
    const seen = new Set();

    while (pendingDir.length) {
      const currentDir = pendingDir.shift();

      // generate virtual files first
      const virtualFiles = this._virtual(currentDir, globName);
      for (const {name: raw, gen} of virtualFiles) {
        seen.add(raw);

        const fullPath = path.join(currentDir, raw);
        out.push(await this._outputFor(fullPath, gen));
      }

      const matchedFiles = await globDirContents(currentDir, globName);
      for (const raw of matchedFiles) {
        if (seen.has(raw)) {
          continue;
        }

        const fullPath = path.join(currentDir, raw);
        if (isDir(fullPath)) {
          recurse && pendingDir.push(fullPath);
        } else {
          out.push(await this._outputFor(fullPath));
        }
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
