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
 * @typedef {function(!ContentFile, function(string): void): (string|undefined|null)}
 */
var ContentGeneratorFunction;


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


/**
 * @param {string} request to match against glob (may also be a glob)
 * @param {string} glob that was registered on this loader (may actually be fixed)
 * @return {?string} a non-glob string that was matched
 */
function requestMatchGlob(request, glob) {
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


/**
 * ContentFile is a buildable node in the build system, mapping directly to one file, which may
 * be a completely generated file.
 *
 * It has several subclasses:
 *   + ContentFile itself represents a real file on-disk
 *   + EmptyContentFile represents a 'lack' of an on-disk file
 *   + VirtualContentFile represents a generation step that internally points to any other type
 *     of step (including another instance of itself).
 */
class ContentFile {

  /**
   * @param {string} fullPath of this ContentFile
   * @param {!ContentLoader} loader that this was generated from
   */
  constructor(fullPath, loader) {
    this.path = fullPath;
    this.loader = loader;
    const parsed = path.parse(fullPath);

    /** @private {!ContentFile} */
    this._parent = null;

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

    /** @private {!Array<{message: string, cause: ?Error>}} */
    this._warn = [];
  }

  /**
   * @return {!ContentFile} the root of this heirarchy
   */
  get root() {
    return this;
  }

  /**
   * @return {boolean} whether this file was imagined and does not actually appear on-disk
   */
  get empty() {
    return false;
  }

  /**
   * @return {?Array<{message: string, cause: ?Error}}
   */
  get warnings() {
    return this.root._warn.slice();
  }

  /**
   * @return {string} the actual path DevSite will serve this file under, accounting for 'index'
   */
  get devsitePath() {
    if (!(this.ext === '.md' || this.ext === '.html')) {
      // non-HTML or Markdown is always served at its actual path
      return this.path;
    }
    if (this.name !== 'index') {
      // non-index pages are served at their actual path without ext
      return path.join(this.dir, this.name);
    }
    // otherwise, it's served from the directory name without a slash ¯\_(ツ)_/¯
    return this.dir;
  }

  /**
   * @return {string} the absolute path DevSite will serve this file under
   */
  devsiteAbsolute() {
    return path.join('/', this.devsitePath);
  }

  /**
   * Indicates a warning about this file.
   *
   * @param {string} message
   * @param {?Error} cause
   */
  warn(message, cause=null) {
    this.root._warn.push({message, cause});
  }

  /**
   * @param {string} other part to join with the path to this ContentFile
   * @return {string} path to relative file
   */
  rel(other) {
    return path.join(this.dir, other);
  }

  /**
   * @param {string} ext alternate extension to apply
   * @return {string} path to file with a new extension
   */
  swapExt(ext) {
    if (ext.indexOf('/') !== -1 || !ext) {
      throw new TypeError('bad ext');
    }
    if (ext[0] !== '.') {
      ext = '.' + ext;
    }
    return path.join(this.dir, this.name + ext);
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
   * Reads this file as a string.
   *
   * @return {string}
   * @private
   */
  async read() {
    return await fsp.readFile(this.path, 'utf-8');
  }

  _prepareContentConfig() {
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
    this._prepareContentConfig();
    return this._content;
  }

  /**
   * @return {?Promise<?Object<string, *>>}
   */
  get config() {
    this._prepareContentConfig();
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
    this._parent = cf;
    this._root = (cf instanceof VirtualContentFile ? cf.root : cf);
    this._gen = gen;
    this._building = false;

    /**
     * @type {?Promise<?string|undefined>}
     */
    this._build = null;
  }

  get root() {
    return this._root;
  }

  get empty() {
    return this._root.empty;
  }

  /**
   * @return {?string|undefined}
   * @override
   */
  async build() {
    if (this._build !== null) {
      return this._build;
    }
    if (this._building) {
      throw new Error('building recursion: already building: ' + this.path);
    }

    const generatedCandPromises = [];
    const otherHandler = (cand) => {
      generatedCandPromises.push(this.loader._dependency(cand));
    };

    this._building = true;
    try {
      // Run our generator code...
      const gen = this._gen(this._parent, otherHandler);
      this._build = gen.then(async (out) => {
        await Promise.all(generatedCandPromises);

        // always call the parent.build(), in case it's enacting other steps
        const parentResult = await this._parent.build();

        // ... if returns undefined, this means defer to the parent result
        if (out === undefined) {
          return parentResult;
        }
        // ... check for non-string
        if (out !== null && typeof out !== 'string') {
          throw new TypeError(`got unexpected output from generator: ${out}`);
        }
        // ... otherwise return its value (null or a string to write)
        return out;
      });
    } finally {
      this._building = false;
    }

    return this._build;
  }

  /**
   * @return {?string}
   * @override
   */
  async read() {
    const out = await this.build();
    return out === undefined ? this._parent.read() : out;
  }
}


class ContentLoader {

  /**
   * @param {function(string): void} cb called when a file requires another to be built
   */
  constructor(cb) {
    this._cb = cb;

    /**
     * @private {!Array<{glob: string, gen: ContentGeneratorFunction}>}
     */
    this._gen = [];

    /**
     * @private {!Object<string, !ContentFile>}
     */
    this._cache = {};
  }

  /**
   * Registers a glob, with paths matching the path being passed to the specified generator.
   *
   * If the specified name is a glob, then this will only create virtual files when explicitly
   * specified or included as a dependency.
   *   e.g. 'example/_config-*.yaml' will not match for 'example/*', but will for an explicit
   *        path such as 'path/to/_config-foo.yaml'.
   *
   * @param {string} cand glob-style path to match
   * @param {ContentGeneratorFunction} gen generator for file
   */
  register(glob, gen) {
    if (glob.endsWith('/') || glob === '.' || !glob) {
      throw new Error(`cannot match whole dir: ${glob}`);
    } else if (glob[0] === '/') {
      throw new TypeError(`cannot match rooted path: ${glob}}`);
    }
    if (typeof gen !== 'function') {
      throw new TypeError(`cannot register non-function generator for: ${glob}, ${gen}`);
    }

    // force async function
    const asyncGen = async (...args) => gen(...args);
    this._gen.push({glob, gen: asyncGen});
  }

  /**
   * @param {string} cand candidate path(s) to include
   */
  async _dependency(cand) {
    const all = await this.build(cand);
    all.forEach((other) => this._cb(other));
  }

  /**
   * @param {string} candidateDir
   * @return {!Array<{glob: string, gen: ContentGeneratorFunction}>}
   */
  _genForDir(candidateDir) {
    // filter generate matches to those which are valid for this directory
    return this._gen.filter(({glob}) =>
        glob.startsWith('./') || micromatch.isMatch(candidateDir, path.dirname(glob)));
  }

  /**
   * @param {string} req specific non-gen path request
   * @return {?ContentFile}
   */
  get(req) {
    if (isGlob(req)) {
      throw new Error('can\'t glob get(): ' + req);
    } else if (isDir(req) === false) {
      return this._concreteFile(req);
    } else {
      return null;  // directory or not a real file
    }
  }

  async build(req, recurse=true) {
    return this.contents(req, {recurse, virtual: true});
  }

  /**
   * @param {string} req glob-style path request
   * @param {{recurse: boolean|undefined, virtual: boolean|undefined}=} opts
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

  /**
   * Glob a directory's contents, optionally recursing into further directories.
   *
   * @param {string} rootDir to read contents of, e.g. "path/to/blah"
   * @param {string} request glob to match in this directory, e.g., "*.md"
   * @param {{recurse: boolean|undefined, virtual: boolean|undefined}} opts
   * @return {!Array<!ContentFile>} files matched
   */
  async _dirContents(rootDir, request, opts) {
    const pendingDir = [rootDir];
    const all = [];

    while (pendingDir.length) {
      const currentDir = pendingDir.shift();
      const out = await this._singleDirContents(currentDir, request, opts.virtual);

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

  /**
   * Glob a single directory's contents.
   *
   * @param {string} currentDir to read contents of, e.g. "path/to/blah"
   * @param {string} request glob to match in this directory, e.g., "*.md"
   * @param {boolean} virtual whether to include virtual files
   * @return {{contents: !Array<!ContentFile>, subdir: !Array<string>}}
   */
  async _singleDirContents(currentDir, request, virtual) {
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

    if (virtual) {
      // grab potential virtual matchers for this directory
      const generators = this._genForDir(currentDir);
      for (const {glob, gen} of generators) {
        // for each generator that matches
        const baseGlob = path.basename(glob);

        // match a generated file (where the 'glob' is a fixed string)
        let matches;
        const generatedMatch = requestMatchGlob(request, baseGlob);
        if (generatedMatch !== null) {
          matches = [generatedMatch];
        } else {
          // ... or match many files (wwhere the glob is actually a glob, e.g. "*.md")
          matches = [...all.keys()].map((raw) => requestMatchGlob(raw, baseGlob)).filter(Boolean);
        }
        for (const match of matches) {
          // link a new VirtualContentFile to any previous ContentFile with this name, and return
          // it instead
          const fullPath = path.join(currentDir, match);
          const prev = all.get(match) || new EmptyContentFile(fullPath, this);
          all.set(match, new VirtualContentFile(fullPath, this, prev, gen));
        }
      }
    }

    return {contents: [...all.values()], subdir};
  }

  /**
   * @param {string} fullPath
   * @return {!ContentFile} returns the ContentFile for this real path, possibly from cache
   */
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
