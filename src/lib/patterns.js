/*
 * Copyright 2021 Google LLC
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
 * @fileoverview A singleton that collects all Code Patterns from .md files
 *   under "basePath" directory. Code Patterns then get exposed as part of
 *   the _data directory, for use in eleventy.
 */

const glob = require('fast-glob');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const {forceForwardSlash} = require('./utils/path');

const stripDot = /^\./;

const contentRoot = path.join(
  __dirname,
  '..',
  '..',
  'src',
  'site',
  'content',
  'en',
);
const basePath = path.join(contentRoot, 'patterns');

const patternPaths = [
  path.join(contentRoot, 'patterns', '**', 'index.md'),
  path.join(
    contentRoot,
    'handbook',
    'content-types',
    'example-pattern',
    '**',
    'index.md',
  ),
];

const patterns = glob.sync(patternPaths.map((path) => forceForwardSlash(path)));

/** @type {CodePatternSets} */
const allPatternSets = {};

/** @type {CodePatterns} */
const allPatterns = patterns.reduce((patterns, file) => {
  const id = path.relative(basePath, path.dirname(file));
  const fileContents = matter(fs.readFileSync(file, 'utf-8'));
  const suite = path.dirname(id);

  // This only reads front-matter from files, and doesn't inherit any data
  // from Eleventy data cascade (e.g. "11tydata.js" files).
  if (fileContents.data.layout === 'pattern-set') {
    const set = {
      id,
      title: fileContents.data.title,
      description: fileContents.data.description,
      hero: fileContents.data.hero,
      draft: Boolean(fileContents.data.draft),
      rawContent: fileContents.content,
      suite: suite !== '.' ? suite : null,
    };
    /** @type {CodePatternSet} */
    allPatternSets[id] = set;
  }

  if (fileContents.data.layout !== 'pattern') {
    return patterns;
  }

  const assetsPaths = glob.sync(
    forceForwardSlash(path.join(path.dirname(file), 'assets', '*')),
  );

  /** @type {CodePatternAssets} */
  const assets = assetsPaths.reduce((out, assetPath) => {
    // Ignore images.
    if (/\.(?:png|jpe?g|avif|webp|gif|svg)$/.test(assetPath)) {
      return out;
    }
    const basename = path.basename(assetPath);
    const type = path.extname(assetPath).replace(stripDot, '');
    const content = fs.readFileSync(assetPath, 'utf-8');
    out[basename] = {
      content,
      type,
      name: basename,
    };
    return out;
  }, {});

  // Use external demo url from frontmatter, if set, or default to local demo.
  const demo =
    fileContents.data.demo || path.join('/', 'patterns', id, 'demo.html');
  const set = path.dirname(id);
  patterns[id] = /** @type {CodePattern} */ ({
    id,
    ...fileContents.data,
    rawContent: fileContents.content,
    assets,
    demo,
    set,
  });
  return patterns;
}, /** @type {CodePatterns} */ ({}));

module.exports = {
  patterns: function () {
    return allPatterns;
  },
  sets: function () {
    return allPatternSets;
  },
};
