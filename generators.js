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

async function AuditGuidePaths(loader, cf) {
  // TODO(samthor): Glob format in directories not actually supported yet.
  // const pathConfig = await loader.contents(`${cf.dir}/path/*/guides.yaml`);

  // TODO(samthor): Generate Markdown/HTML for all guides that will surface from the profile/audits
  // page. These are the guides that are surfaced based on poor Lighthouse scores and are filtered
  // by the TODO element.
  return '<!-- TODO: audit paths -->';
}

async function PathIndex(loader, cf) {
  const guidesYaml = await loader.get(`${cf.dir}/guides.yaml`);
  const config = await guidesYaml.config;

  // TODO(samthor): This is just a demo which should be replaced by a Handlebars renderer.
  let out = '';
  for (const {title, guides} of config.topics) {
    out += `<h1>${title}</h1>\n<ul>`;
    for (const guide of guides) {

      const guideYaml = await loader.get(`${cf.dir}/${guide}/index.md`);
      let title = guide;
      if (guideYaml !== null) {
        title = (await guideYaml.config).title;
      }
      out += `<li><a href="./${guide}">${title}</a></li>\n`;
    }
    out += `</ul>\n\n`;
  };

  return out;
}

module.exports = {
  AuditGuidePaths,
  PathIndex,
};
