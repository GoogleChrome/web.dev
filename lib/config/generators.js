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

const closest = require('../deps/closest.js');
const path = require('path');
const templates = require('../templates.js');
const marked = require('marked');


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


/**
 * @param {!content.ContentFile} cf
 * @param {function(string): void} cb callback to include other relative files
 * @return {?string|undefined}
 */
async function MarkdownBuilder(cf, cb) {
  if (cf.base.startsWith('_')) {
    return undefined;  // don't process this file
  }

  const config = await cf.config;
  if (config.page_type) {
    cb(cf.swapExt('.html'));
    return null;
  }

  const content = await cf.content;
  if (content === null) {
    return null;
  }

  // If `page_type` wasn't specified, just generate regular Markdown stripped of its config.
  let header = '';
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
 * @param {!content.ContentFile} cf
 * @return {string|undefined}
 */
async function HTMLBuilder(cf) {
  if (await cf.read() !== null) {
    return undefined;  // don't process real HTML file
  }

  const loader = cf.loader;
  const peer = await loader.get(cf.swapExt('.md'));
  if (!peer) {
    return null;  // peer markdown file doesn't exist
  }
  let content = await peer.content;
  const config = await peer.config;

  if (config.title) {
    content = `# ${config.title}\n\n${content}`;
  }
  const main = marked(content);
  let out = null;

  switch (config.page_type) {
    case 'guide': {
      const artifactFiles = await loader.contents(cf.rel(`${cf.name}/*.md`));
      const codelabs = [];
      for (const artifact of artifactFiles) {
        const name = artifact.name;
        const config = await artifact.config;
        codelabs.push({
          name,
          title: config.title,
        });
      }

      const context = {
        name: cf.name,
        main,
        impact: ~~(Math.random() * 100) + '%',  // TODO: real impact %
        codelabs,
      };
      out = await templates('guide.html', context);
      break;
    }

    case 'path':
    case 'glitch':
      // TODO(samthor): Just generate HTML for now.
      out = main;
      break;
  }

  if (out === null) {
    cf.warn(`unknown page_type (${page_type}), skipping: ${cf.path}`);
    return null;
  }

  const meta = [
    {name: 'project_path', value: '/' + closest(cf.path, '_project.yaml')},
    {name: 'book_path', value: '/' + closest(cf.path, 'book.yaml')},
  ];
  return templates('devsite.html', {body: out, title: config.title, meta: []});
}


module.exports = {
  AuditGuidePaths,
  PathIndex,
  MarkdownBuilder,
  HTMLBuilder,
};
