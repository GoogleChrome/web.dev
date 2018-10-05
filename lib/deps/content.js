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

  get empty() {
    return false;
  }

  /**
   * Returns what should be written to disk: a string, undefined (the real file), or null (delete).
   *
   * @return {?string|undefined}
   */
  async build() {
    return undefined;
  }

  /**
   * Reads the contents of this file.
   *
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
    let config;

    switch (this.ext) {
      case '.md': {
        // read markdown content and remove YAML prefix
        const p = read.then(yamlPrefix);
        this._content = p.then((out) => out.rest);
        config = p.then((out) => out.config);
        break;
      }
      case '.yaml': {
        // also leave source intact
        config = read;
        break;
      }
    }

    this._config = config || Promise.resolve(null);
    this._content = this._content || read;
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


class EmptyContentFile extends ContentFile {

  get empty() {
    return true;
  }

  /**
   * @return {?string|undefined}
   * @override
   */
  async build() {
    return null;
  }

  /**
   * @return {?string}
   * @override
   */
  async read() {
    return null;
  }

}


class VirtualContentFile extends ContentFile {
  constructor(fullPath, loader, cf, gen) {
    super(fullPath, loader);
    this._cf = cf;
    this._gen = gen;
    this._reading = false;

    /**
     * @type {?Promise<?string|undefined>}
     */
    this._build = null;
  }

  get empty() {
    return this._cf.empty;
  }

  /**
   * @return {?string|undefined}
   * @override
   */
  async build() {
    if (this._build !== null) {
      return this._build;
    }

    this._reading = true;
    try {
      // Run our generator code...
      const gen = this._gen(this._loader, this._cf);
      this._build = gen.then((out) => {
        // ... but if returns undefined, this means defer to the parent build step
        if (out === undefined) {
          return this._cf.build();
        }
        // ... otherwise return its value (null or a string to write)
        return out;
      });
    } finally {
      this._reading = false;
    }

    return this._build;
  }

  /**
   * @return {?string}
   * @override
   */
  async read() {
    const out = await this._build;
    return out === undefined ? this._cf.read() : out;
  }
}


class ContentLoader {

  /**
   * @param {string} dir root dir to process from, used for lang
   */
  constructor(dir) {
    this._dir = dir;

    /**
     * @private {!Array<{glob: string, gen: *, post: boolean}>}
     */
    this._gen = [];

    /**
     * @private {!Object<string, !ContentFile>}
     */
    this._cache = {};
  }

  /**
   * Registers a virtual path.
   *
   * If the specified name is a glob, then this will only create virtual files when explicitly
   * specified or included as a dependency.
   *   e.g. 'example/_config-*.yaml' will not match for 'example/*', but will for an explicit
   *        path such as 'path/to/_config-foo.yaml'.
   *
   * @param {string} cand glob-style path to match
   * @param {*} gen generator for file
   * @param {{post: true|undefined}=} opts
   */
  register(glob, gen, opts={}) {
    if (glob.endsWith('/') || glob === '.' || !glob) {
      throw new Error(`cannot match whole dir: ${cand}`);
    }
    this._gen.push({glob, gen, post: Boolean(opts.post)});
  }

  _genForDir(candidateDir) {
    // filter generate matches to those which are valid for this directory
    return this._gen.filter(({glob}) =>
        glob.startsWith('./') || micromatch.isMatch(candidateDir, path.dirname(glob)));
  }

  /**
   * @param {string} req specific non-gen path request
   * @return {?ContentFile}
   */
  async get(req) {
    if (isGlob(req)) {
      throw new Error('can\'t glob get(): ' + req);
    }

    const out = await this._singleDirContents(path.dirname(req), path.basename(req));
    let found = null;
    for (const ret of out.contents) {
      if (found !== null) {
        throw new Error('somehow matched more than one file');
      }
      found = ret;
    }
    return found;
  }

  async build(req, recurse=true) {
    return this.contents(req, {recurse, post: true});
  }

  /**
   * @param {string} req glob-style path request
   * @param {{recurse: boolean|undefined, post: boolean|undefined}=} opts
   * @param {boolean=} recurse search further dirs
   * @return {!Array<!ContentFile>}
   */
  async contents(req, opts={}) {
    req = path.normalize(req);

    // this is a real dir, just find its contents
    if (isDir(req)) {
      return this._dirContents(req, '*', opts);
    }

    const dir = path.dirname(req);
    if (!isGlob(dir)) {
      // fast-path, no glob part in directory matcher
      return this._dirContents(dir, path.basename(req), opts);
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
        return this.contents(sreq, opts);
      }));
      return all.reduce((a, b) => a.concat(b), []);
    }

    throw new TypeError('Should not get here');
  }

  _match(request, glob) {
    const globIsGlob = isGlob(glob);
    const requestIsGlob = isGlob(request);

    if (globIsGlob === requestIsGlob) {
      if (globIsGlob) {
        return null;  // don't match glob to glob (e.g. "*.md" => "*.md")
      }
      return request === glob ? request : null;
    }

    // match non-glob candidate (specific file request) against glob stored name
    // e.g. '_gen-filename.md' against '_gen-*.md'
    if (micromatch.isMatch(request, glob)) {
      return request;
    }

    // match glob candidate against non-glob stored "glob" ("reverse" mode)
    // e.g. '*' against anything, or '*.md' against 'foo.md'
    if (!globIsGlob && (request === '*' || micromatch.isMatch(glob, request))) {
      return glob;
    }

    return null;
  }

  async _dirContents(rootDir, request, opts) {
    const pendingDir = [rootDir];
    const all = [];

    while (pendingDir.length) {
      const currentDir = pendingDir.shift();
      const out = await this._singleDirContents(currentDir, request, opts.post)

      all.push(...out.contents);
      if (opts.recurse) {
        const fullPaths = out.subdir.map((part) => path.join(currentDir, part));
        pendingDir.push(...fullPaths);
      }

      // if this recurses into subdirs, reset glob
      request = '*';
    }

    return all;
  }

  async _singleDirContents(currentDir, request, post) {
    const subdir = [];
    const all = new Map();

    // match real files first
    const matchedFiles = await globDirContents(currentDir, request);
    for (const raw of matchedFiles) {
      const fullPath = path.join(currentDir, raw);
      if (isDir(fullPath)) {
        subdir.push(raw);
        continue;
      }
      all.set(raw, this._concreteFile(fullPath));
    }

    // grab potential virtual file matches
    const generators = this._genForDir(currentDir);
    for (const {glob, gen, post: genIsPost} of generators) {
      if (genIsPost && !post) {
        continue;
      }
      const baseGlob = path.basename(glob);

      let matches;
      const generatedMatch = this._match(request, baseGlob);
      if (generatedMatch !== null) {
        matches = [generatedMatch];
      } else {
        matches = [...all.keys()].map((raw) => this._match(raw, baseGlob));
      }
      for (const match of matches.filter(Boolean)) {
        const fullPath = path.join(currentDir, match);
        const prev = all.get(match) || new EmptyContentFile(fullPath, this);
        all.set(match, new VirtualContentFile(fullPath, this, prev, gen));
      }
    }

    return {contents: [...all.values()], subdir};
  }

  _concreteFile(fullPath) {
    let cf = this._cache[fullPath];
    if (cf === undefined) {
      cf = new ContentFile(fullPath, this);
      this._cache[fullPath] = cf;
    }
    return cf;
  }
}

module.exports = {ContentLoader};
