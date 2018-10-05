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
const path = require('path');
const micromatch = require('micromatch');


class ContentBuilder {

  /**
   * @param {!content.ContentLoader} loader
   */
  constructor(loader) {
    this._loader = loader;

    /**
     * @type {!Array<{match: function(!content.ContentFile): boolean, run: *}>}
     */
    this._post = [];
  }

  post(glob, run) {
    let match;
    if (path.dirname(glob) === '.') {
      // match basename (e.g. "*.md")
      match = (cf) => micromatch.isMatch(cf.base, glob);
    } else {
      // match whole path (e.g. "path/to/whatever/*.md")
      match = (cf) => micromatch.isMatch(cf.path, glob);
    }

    this._post.push({match, run});
  }

  async _postprocess(all, cf) {
    const handlers = this._post.filter(({match}) => match(cf));
    if (handlers.length === 0) {
      return undefined;
    }

    const alsoIncludePaths = [];
    const state = {
      cf,
      loader: this._loader,
      push: (p) => alsoIncludePaths.push(p),
    };

    let anyChange = false;
    let out = await cf.content;
    for (const {run} of handlers) {
      const update = await run(state, out);

      // don't write anything for this file, return early
      if (update === null) {
        return null;
      }

      // got a change for this file's contents, pass to next
      if (update !== undefined) {
        anyChange = true;
        out = update;
      }
    }

    // the postprocess step might add more things to do (e.g. Devsite Markdown)
    for (const p in alsoIncludePaths) {
      const out = await this._loader.contents(p);
      for (const cf of out) {
        all.add(cf);
      }
    }

    return anyChange ? out : undefined;
  }

  /**
   * @param {string} outputDir
   * @param {!Array<string>} target
   * @param {{recurse: boolean, symlink: boolean}} opts
   * @return {!Array<string>}
   */
  async build(outputDir, target, opts) {
    const all = new Set();
    const push = () => {}

    for (const req of target) {
      const out = await this._loader.contents(req, opts.recurse);
      for (const cf of out) {
        all.add(cf);
      }
    }

    const writes = [];
    const paths = [];

    for (const cf of all) {
      const destDir = path.join(outputDir, cf.dir);
      const destFile = path.join(outputDir, cf.path);
      await fsp.mkdirp(destDir);

      const out = await this._postprocess(all, cf);
      if (out === null) {
        // do nothing, don't write this file
        continue;
      } else if (out !== undefined) {
        // write generated file
        writes.push(fsp.writeFile(destFile, out));
      } else if (opts.symlink) {
        // symlink unchanged files with -l
        // TODO(samthor): Why does the first component need to be chopped?
        const relativePath = path.relative(destFile, cf.path).substr(3);
        const safeUnlink = fsp.unlink(destFile).catch(() => null);
        const link = safeUnlink.then(() => fsp.symlink(relativePath, destFile));
        writes.push(link);
      } else {
        // ... finally, fall back to copying into place
        writes.push(fsp.copyFile(cf.path, destFile));
      }

      paths.push(cf.path);
    }

    await Promise.all(writes);
    return paths;
  }
}


module.exports = {ContentBuilder};