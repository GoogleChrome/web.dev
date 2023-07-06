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
const fse = require('fs-extra');

const BASE_PATH = path.join(__dirname, '../../../dist/_export/');

/**
 * @param {Object} ctx 11ty context object coming from a shortcode
 * @param {any} data The data to be written
 * @param {String?} customFilePath An optional explicit filePath to use
 */
async function exportFile(ctx, data = undefined, customFilePath = undefined) {
  let filePath = customFilePath;
  if (!filePath) {
    filePath = ctx.exportPath;
    // Assume we are only writing .md files, assets gets a forced customFilePath
    // Always check if a .md file with the same name exists, and if it does,
    // rename it and make it the folders index.md
    if (fse.existsSync(path.join(BASE_PATH, filePath, ctx.page.fileSlug))) {
      filePath = `${filePath}/${ctx.page.fileSlug}/index.md`;
    } else {
      // Check if there is a {filePath}.md file and move it to {filePath}/index.md
      // if that's the case
      const filePathStub = filePath.replace(/\/$/, '');
      if (fse.existsSync(`${path.join(BASE_PATH, filePathStub)}.md`)) {
        await fse.move(
          path.join(BASE_PATH, `${filePath}.md`),
          path.join(BASE_PATH, `${filePath}/index.md`),
        );
      }

      filePath = `${filePath}/${ctx.page.fileSlug}.md`;
    }
  }

  filePath = path.join(BASE_PATH, filePath);

  // console.log(`Writing ${filePath}`);
  await fse.outputFile(filePath, data);
}

module.exports = {exportFile};
