/*
 * Copyright 2019 Google LLC
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

const fs = require("fs").promises;
const path = require("path");
const postEleventyBuild = require("./post-eleventy-build");

const suffixLength = "index.html".length;

const writePartial = async (to, raw) => {
  await fs.mkdir(path.dirname(to), {recursive: true});
  await fs.writeFile(to, JSON.stringify(raw));
};

module.exports = function buildPartial() {
  const work = [];

  postEleventyBuild(async () => {
    await Promise.all(work);
  });

  return function(content, page, collections, renderData = {}) {
    if (!page.outputPath.endsWith("/index.html")) {
      return content; // unexpected output format
    }

    // nb. matches the Meta component, used for title
    const pageData = {
      ...collections.all.find((item) => item.fileSlug === page.fileSlug).data,
      ...renderData,
    };

    const outputPath =
      page.outputPath.substr(0, page.outputPath.length - suffixLength) +
      "index.json";

    const partial = {
      raw: content,
      lang: pageData.lang,
      title: pageData.title || pageData.page.title,
      offline: pageData.offline || undefined,
    };
    const p = writePartial(outputPath, partial);
    work.push(p);

    return content;
  };
};
