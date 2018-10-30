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
const markdown = require('../deps/markdown.js');


/**
 * Returns default DevSite 2 meta content for this path. This is strictly key/value pairs.
 *
 * @param {!ContentFile} cf 
 * @return {!Object<string, string>}
 */
function devsiteMeta(cf) {
  return {
    'project_path': `/${closest(cf.path, '_project.yaml')}`,
    'book_path': `/${closest(cf.path, '_book.yaml')}`,
  };
}


async function guidesConfigForPath(loader, webdevPath, originalCf=null) {
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
      const guidePath = `${guidesYaml.dir}/${guide}/index.md`;
      const guidePage = await loader.get(guidePath);
      if (guidePage === null) {
        const msg = 'could not find guide index.md, skipping from index';
        originalCf && originalCf.warn(msg, guidePath);
        continue;
      }

      const config = await guidePage.config;
      guides.push({
        href: `/path/${webdevPath}/${guide}`,  // absolute path to guide
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


/**
 * Generates the mapping of all guides, for the profile page to include.
 *
 * @param {!content.ContentFile} cf 
 */
async function AllGuidesJSON(cf) {
  const loader = cf.loader;
  const webdevPaths = {};

  // Grab all known Paths under `path/blah.md`.
  const pathPages = await loader.contents(cf.rel('path/*.md'));
  for (const pathPage of pathPages) {
    const id = pathPage.name;
    const title = (await pathPage.config).title;
    webdevPaths[id] = title;
  }

  const allGuides = [];

  // For all paths we found, iterate through all their guides (defined in `path/blah/guides.yaml`)
  // and include inside `allGuides`, in no particular order.
  for (const pathId in webdevPaths) {
    // for each path
    const guidesConfig = await guidesConfigForPath(loader, pathId, cf);
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
          lighthouse: config.web_lighthouse || [],
        });
      });
    });
  }

  return JSON.stringify({guides: allGuides});
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
 * Generates the named `path/{pathName}.html` page based on its corresponding config YAML.
 *
 * @param {!ContentFile} cf 
 * @return {?string}
 */
async function PathPageBuilder(cf) {
  const loader = cf.loader;
  const peerPath = cf.rel(`${cf.name}/guides.yaml`);
  const peer = await loader.get(peerPath);
  if (peer === null) {
    cf.warn(`Couldn't build path page, couldn't find guides config`, peerPath);
    return null;
  }

  const config = await peer.config;
  const context = {
    title: config.title,
    blurb: config.blurb,
    overview: markdown(config.overview),  // render as markdown
    topics: [],
  };

  for (const {title, guides} of (config.topics || [])) {
    // Generate builtGuides which contains read information from the guides that are referenced in
    // our YAML. This is done with a for loop as we need to await for loads.
    const builtGuides = [];
    for (const id of guides) {
      const guidePath = cf.rel(`${cf.name}/${id}/index.md`);
      const guideIndexPage = await loader.get(guidePath);
      if (guideIndexPage === null) {
        cf.warn(`Couldn't find named guide 'index.md'`, guidePath);
        continue;
      }
      const guideConfig = await guideIndexPage.config;

      builtGuides.push({
        id,
        title: guideConfig.title,
        href: cf.devsiteRelative(guideIndexPage),
        codelabs: null,  // TODO(samthor): Read artifacts about guide
      });
    }

    context.topics.push({title, guides: builtGuides});
  }

  // Render inner `path.html` template, then render its content inside `devsite.html`.
  const meta = devsiteMeta(cf);
  const body = await templates('path.html', context);
  return templates('devsite.html', {body, title: config.title, meta});
}


/**
 * Generates 'content pages', content that is located within a path. This represents the bulk of
 * author-generated content.
 *
 * @param {!content.ContentFile} cf
 * @return {string|undefined}
 */
async function ContentPageBuilder(cf) {
  if (await cf.read() !== null) {
    return undefined;  // don't process real HTML file
  }

  const loader = cf.loader;
  const peer = await loader.get(cf.swapExt('.md'));
  if (!peer) {
    return undefined;  // peer markdown file doesn't exist
  }
  let content = await peer.content;
  const config = await peer.config;

  const main = markdown(content);
  let body = null;

  switch (config.page_type) {
    case 'guide': {
      // Render a Guide. This contains its markdown, and links to related peer artifacts found in
      // its current path. Fetch all neighbouring Markdown files, and create links to them if they
      // match types we support (currently just "glitch", for Codelabs).
      const artifactFiles = await loader.contents(cf.rel(`*.md`));
      const codelabs = [];
      for (const artifact of artifactFiles) {
        const name = artifact.name;
        const config = await artifact.config;
        if (name === 'index' || config.page_type !== 'glitch') {
          continue;
        }
        codelabs.push({
          href: cf.devsiteRelative(artifact),
          title: config.title,
        });
      }

      const context = {
        main,
        impact: ~~(Math.random() * 100) + '%',  // TODO: real impact %
        codelabs,
      };
      body = await templates('guide.html', context);
      break;
    }

    case 'glitch': {
      // Render a Glitch codelab.
      // Fetch the related Guide for this codelab so that it can be linked back to.
      const relatedGuide = await loader.get(cf.rel('index.md'));
      if (!relatedGuide) {
        cf.warn('No related guide found', `index.md`);
        return null;
      }
      if (!config.glitch) {
        cf.warn('No Glitch ID specified for `page_type: glitch`');
      }

      const context = {
        main,
        title: config.title,
        glitch: config.glitch,
        relatedGuide: await relatedGuide.config,
        relatedGuideHref: cf.devsiteRelative(relatedGuide),
      };
      body = await templates('glitch.html', context);
      break;
    }

    case 'path':
      // TODO(samthor): Just generate HTML for now.
      body = main;
      break;
  }

  if (body === null) {
    cf.warn(`unknown page_type, skipping`, config.page_type);
    return null;
  }

  const meta = devsiteMeta(cf);
  return templates('devsite.html', {body, title: config.title, meta});
}


/**
 * @param {!content.ContentFile} cf 
 * @return {string}
 */
async function LearnPageBuilder(cf) {
  const loader = cf.loader;

  // Grab all known Paths under `path/*/guides.yaml`.
  const paths = [];
  const allPathGuides = await loader.contents(cf.rel('path/*/guides.yaml'));
  for (const pathGuideFile of allPathGuides) {
    const id = path.basename(pathGuideFile.dir);  // parent of guides.yaml
    paths.push({
      id,
      config: await pathGuideFile.config,
      href: `path/${id}`,
    });
  }
  paths.sort((a, b) => a.config.order - b.config.order);

  const body = await templates('learn.html', {paths});
  const meta = devsiteMeta(cf);
  return templates('devsite.html', {body, title: 'Learn', meta});
}


module.exports = {
  AllGuidesJSON,
  PathPageBuilder,
  MarkdownBuilder,
  ContentPageBuilder,
  LearnPageBuilder,
};
