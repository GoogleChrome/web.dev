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

const closest = require('./deps/closest.js');
const path = require('path');
const templates = require('./templates.js');


async function guidesConfigForPath(loader, webdevPath) {
  const guidesYaml = await loader.get(`path/${webdevPath}/guides.yaml`);
  if (guidesYaml === null) {
    return [];
  }

  const out = [];
  const config = await guidesYaml.config;
  let count = 0;
  for (const topic of config.topics || []) {
    const title = topic.title;
    const guides = [];

    for (const guide of topic.guides) {
      const guidePage = await loader.get(`${guidesYaml.dir}/${guide}/index.md`);
      if (guidePage === null) {
        continue;
      }

      const config = await guidePage.config;
      guides.push({
        id: guide,
        config,
        title: config && config.title || guide,
      });
    }

    if (guides.length) {
      out.push({title, guides, num: ++count});
    }
  }

  return out;
}


async function AuditGuidePaths(cf) {
  const loader = cf.loader;
  const webdevPaths = {};

  const pathPages = await loader.contents(cf.rel('path/*.md'));
  for (const pathPage of pathPages) {
    const id = pathPage.name;
    const title = (await pathPage.config).title;
    webdevPaths[id] = title;
  }

  const allGuides = [];

  for (const pathId in webdevPaths) {
    // for each path
    const guidesConfig = await guidesConfigForPath(loader, pathId);
    guidesConfig.forEach(({title: category, guides}) => {
      // for each category in the path
      guides.forEach(({id, title, config}) => {
        // for each guide in that category
        allGuides.push({
          id,
          url: `path/${pathId}/${id}`,
          path: webdevPaths[pathId],
          category,
          title,
          lighthouse: config.lighthouse_ids || [],
        });
      });
    });
  }

  return templates('auditpaths.md', {guides: allGuides});
}


async function PathIndex(cf) {
  const id = path.basename(cf.dir);
  const guidesConfig = await guidesConfigForPath(cf.loader, id);

  return templates('path-guidelist.md', {
    path: id,
    categories: guidesConfig,
  });
}


async function MarkdownBuilder(cf) {
  if (cf.base.startsWith('_')) {
    return undefined;  // don't process this file
  }

  const content = await cf.content;
  if (content === null) {
    return null;
  }
  const config = await cf.config;

  // Simple demo that adds some extra markup based on the optional config.
  // TODO(samthor): Perform alternative tasks on e.g. `page_type`, and use a Markdown parser to
  // parse the _content_ if changes are required.

  let header = '';

  if (config.mdn_features) {
    const features = config.mdn_features.join(' ');
    header += `<web-mdn-features features="${features}"></web-mdn-features>\n\n`;
  }

  if (config.title) {
    header += `# ${config.title}\n\n`;
  }

  // Insert standard DevSite preamble and merge header/content. Note that this
  // is NOT yaml, it is simply `key: value` pairs.
  const preamble = {
    'project_path': '/' + closest(cf.path, '_project.yaml'),
    'book_path': '/' + closest(cf.path, '_book.yaml'),
  };
  const generated = Object.keys(preamble).map((key) => `${key}: ${preamble[key]}`).join('\n');
  return `${generated}\n\n${header}${content}`;
}


/**
 * Restricts the output of YAML files such that only expected ouputs are generated. DevSite only
 * expects certain names and formats.
 *
 * @param {!content.ContentFile} cf
 * @return {?string|undefined}
 */
async function FilterYaml(cf) {
  const validMarkdownNames = ['_index', '_book', '_project'];
  if (!validMarkdownNames.includes(cf.name)) {
    return null;
  }
}


module.exports = {
  AuditGuidePaths,
  PathIndex,
  MarkdownBuilder,
  FilterYaml,
};
