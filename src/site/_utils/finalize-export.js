/*
 * Copyright 2023 Google LLC
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

const path = require('path');
const zip = require('cross-zip');
const fse = require('fs-extra');
const gulp = require('gulp');
const each = require('gulp-each');

const {
  pluck,
  insert,
  MULTI_LINE_CODE_PATTERN,
  MULTI_LINE_CODE_PLACEHOLDER,
  INLINE_CODE_PATTERN,
  INLINE_CODE_PLACEHOLDER,
} = require('./pluck-insert');
const {exportUrls} = require('../_includes/components/Export');

/**
 *
 */
function rewriteUrls() {
  function rewrite(inputUrl) {
    // If the URL is a fragment, just return it.
    if (inputUrl.startsWith('#')) {
      return inputUrl;
    }

    // Check if the URL is relative, if not just return it.
    const url = new URL(inputUrl, 'https://web.dev');
    if (url.origin !== 'https://web.dev') {
      return inputUrl;
    }

    return exportUrls.get(url.pathname) || inputUrl;
  }

  return new Promise((resolve, reject) => {
    gulp
      .src('dist/_export/**/*.md')
      .pipe(
        each((content, file, callback) => {
          // Pluck out code snippets to not accidentally alter code examples
          const codeBlocks = [];
          content = pluck(
            codeBlocks,
            MULTI_LINE_CODE_PATTERN,
            MULTI_LINE_CODE_PLACEHOLDER,
            content,
          );
          const inlineCode = [];
          content = pluck(
            inlineCode,
            INLINE_CODE_PATTERN,
            INLINE_CODE_PLACEHOLDER,
            content,
          );

          // Rewrite markdown links.
          content.replace(/\[(.*)\]\((.*?)\)/g, (match, text, url) => {
            return `[${text}](${rewrite(url)})`;
          });

          // Some links might have been transformed to HTML, if they are inside
          // a table, link, etc. Rewrite those too.
          content.replace(/href="(.*?)"/g, (match, url) => {
            return `href="${rewrite(url)}"`;
          });

          // Put code snippets back in
          content = insert(codeBlocks, MULTI_LINE_CODE_PLACEHOLDER, content);
          content = insert(inlineCode, INLINE_CODE_PLACEHOLDER, content);

          // Put code snippets back in
          callback(null, content);
        }),
      )
      .pipe(gulp.dest('dist/_export/'))
      .on('end', resolve)
      .on('error', reject);
  });
}

/**
 */
async function finalizeExport() {
  // await rewriteUrls();
  // Also zip the export directory for download.
  // console.log('Zipping export directory...');
  // zip.zipSync('dist/_export', 'export.zip');
  // console.log('Removing export directory...');
  // fse.remove('dist/_export');
}

module.exports = {finalizeExport};
