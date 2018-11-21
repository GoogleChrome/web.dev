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
const slug = require('slug');
const templates = require('../templates.js');
const markdown = require('../deps/markdown.js');
const flags = require('../flags.js');


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


/**
 * Loads basic config, title and href to all artifacts found in a guide directory.
 * @param {!content.Loader} loader
 * @param {string} guideDir
 * @return {!Array<{type: string, href: string, title: string}>} artifacts in the guideDir
 */
async function artifactsForGuide(loader, guideDir) {
  const artifactFiles = await loader.contents(path.join(guideDir, '*.md'));
  const artifacts = [];
  for (const artifact of artifactFiles) {
    const name = artifact.name;
    const config = await artifact.config;
    if (name === 'index') {
      continue;
    }
    artifacts.push({
      type: config.page_type,
      href: artifact.devsiteAbsolute(),
      title: config.title,
      order: config.order,
    });
  }

  artifacts.sort((a, b) => compareOrder(a.order, b.order));
  return artifacts;
}


/**
 * Loads complete config about a site path (e.g. "fast", "discover").
 * @param {!content.Loader} loader
 * @param {string} sitePath
 * @param {!content.ContentFile} originalCf
 * @return {?{topics: !Array<!Object>, title: string, href: string}}
 */
async function configForSitePath(loader, sitePath, originalCf=null) {
  if (!sitePath) {
    return null;
  }
  const guidesYaml = await loader.get(`${sitePath}/guides.yaml`);
  if (guidesYaml === null) {
    return null;
  }
  const config = await guidesYaml.config;

  const out = {
    title: config.title,
    href: `/${sitePath}`,
    topics: [],
  };

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
        href: `/${sitePath}/${guide}`,  // absolute path to guide
        id: guide,
        config,
        title: config && config.title || guide,
      });
    }

    if (guides.length) {
      out.topics.push({
        title,
        id: slug(title),
        guides,
      });
    }
  }

  return out;
}


/**
 * Finds the next guide, based on a config and the previous guide ID.
 * @param {{topics: !Array<!Object>, title: string, href: string}} sitePathConfig as returned from `configForSitePath`
 * @param {string} fromGuide guide to search from
 * @return {{next: ?Object, topic: ?Object}} next guide info, if any
 */
function findGuideInfo(sitePathConfig, fromGuide) {
  const out = {
    next: null,
    topic: null,
  };
  let returnFirstOfNext = false;
  for (const topic of sitePathConfig.topics) {
    if (returnFirstOfNext) {
      if (!topic.guides.length) {
        continue;  // continue until we find a topic with any guides
      }
      out.next = topic.guides[0];
      break;
    }

    const index = topic.guides.findIndex(({id}) => id === fromGuide);
    if (index !== -1) {
      out.topic = topic;
      if (index + 1 === topic.guides.length) {
        returnFirstOfNext = true;
        continue;
      }
      out.next = topic.guides[index + 1];
      break;
    }
  }

  return out;
}


/**
 * Generates data about all guides, for the profile page. Internally, this matches the object
 * typed as `GuideToAuditMapping`.
 *
 * @param {!content.ContentFile} cf 
 * @return {string}
 */
async function AllGuidesJSON(cf) {
  const loader = cf.loader;
  const sitePaths = {};

  // Grab all known site paths, and their configs, from under `blah/guides.yaml`. The existence of
  // `guides.yaml` in a subfolder predisposes a path. This just fetches the files so that names can
  // be resolved.
  const allSitePathYaml = await loader.contents(cf.rel('*/guides.yaml'));
  for (const sitePathYaml of allSitePathYaml) {
    const sitePath = path.basename(sitePathYaml.dir);
    sitePaths[sitePath] = await configForSitePath(loader, sitePath, cf);
  }

  const allGuides = [];

  // For all paths we found, iterate through all their guides (defined in `blah/guides.yaml`)
  // and include inside `allGuides`, in no particular order.
  for (const sitePath in sitePaths) {
    const config = sitePaths[sitePath];
    config.topics.forEach(({title: topic, guides}) => {
      // for each topic in the path
      guides.forEach(({id, title, config: guideConfig}) => {
        // for each guide in that topic

        const lighthouse = [];
        if (guideConfig.web_lighthouse instanceof Array) {
          // some folks have written "N/A", so look explicitly for an Array
          lighthouse.push(...guideConfig.web_lighthouse);
        }

        allGuides.push({
          path: config.title,  // title of the path, not its ID
          topic,               // title of the topic inside the path
          id,
          lighthouse,
          title,
          url: `/${sitePath}/${id}`,
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
 * Generates the named `pathName.html` page based on its corresponding config YAML.
 *
 * @param {!ContentFile} cf 
 * @return {?string}
 */
async function PathPageBuilder(cf) {
  const loader = cf.loader;
  const peerPath = cf.rel(`${cf.name}/guides.yaml`);
  const peer = await loader.get(peerPath);
  if (peer === null) {
    // This isn't a path page: we expect to build e.g. "foo.html", and it to have a corresponding
    // "foo/guides.yaml" file. Skip.
    return undefined;
  }

  const config = await peer.config;
  if (config.disabled) {
    return null;  // this path is disabled, don't generate it
  }
  const context = {
    flags,
    title: config.title,
    description: config.description,
    path: cf.name,
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

      const codelabs = (await artifactsForGuide(loader, guideIndexPage.dir))
          .filter(({type}) => type === 'glitch');
      builtGuides.push({
        id,
        title: guideConfig.title,
        href: guideIndexPage.devsiteAbsolute(),
        codelabs,
      });
    }

    context.topics.push({
      title,
      id: slug(title),
      guides: builtGuides,
    });
  }

  // Render inner `path.html` template, then render its content inside `devsite.html`.
  const meta = devsiteMeta(cf);
  meta.description = context.description;  // use short description as meta description
  const body = await templates('path.html', context);
  return templates('devsite.html', {body, title: config.title, meta});
}


function matchLeftPath(cand) {
  const parsed = path.parse(cand);
  const parts = parsed.dir.split(path.sep);
  return parts[0] || null;
}


/**
 * Generates 'content pages', content that is located within a site path. This represents the bulk
 * of author-generated content.
 *
 * @param {!content.ContentFile} cf
 * @return {string|undefined}
 */
async function ContentPageBuilder(cf) {
  const loader = cf.loader;

  if (await cf.read() !== null) {
    return undefined;  // don't process real HTML file
  }

  // Every content page is located within a 'site path', so fetch its config. This is the left-most
  // part of the total path (e.g. `accessible/blah/foo.html` => `accessible`, assuming that
  // `accessible/guides.yaml` exists).
  // TODO(samthor): This is relatively slow (0.5s => 1.5s build) as we have LOTS of these content
  // pages. Perhaps memoize per-path (as we only have ~6 in total)?
  const sitePath = matchLeftPath(cf.path);
  const sitePathConfig = await configForSitePath(loader, sitePath, cf);
  if (!sitePathConfig) {
    return undefined;  // not a real path, ignore: maybe some unrelated content
  }

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
      if (cf.name !== 'index') {
        cf.warn('expected `guide` page_type to be index.md', cf.path);
      }

      // Find the next guide following this one, if any.
      const guideId = path.basename(cf.dir);  // e.g. ContentFile "fast/foo/index.md" => "foo"
      const guideInfo = findGuideInfo(sitePathConfig, guideId);

      // Render a Guide. This contains its markdown, and links to related peer artifacts found in
      // its current path. Fetch all neighbouring Markdown files, and create links to them if they
      // match types we support (currently just "glitch", for Codelabs).
      const codelabs =
          (await artifactsForGuide(loader, cf.dir)).filter(({type}) => type === 'glitch');
      const context = {
        flags,
        id: guideId,
        path: sitePathConfig,
        topic: null,
        main,
        impact: ~~(Math.random() * 100) + '%',  // TODO: real impact %
        codelabs,
        next: guideInfo.next,
      };

      // It's possible although unlikely that this Guide is not actually part of a path's topics.
      // So check to see whether it is actually part of a topic.
      if (guideInfo.topic !== null) {
        const t = guideInfo.topic;
        context.topic = {
          guides: t.guides,
          title: t.title,
          id: slug(t.title),
        };
      }

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
        flags,
        main,
        title: config.title,
        glitch: config.glitch,
        relatedGuide: await relatedGuide.config,
        relatedGuideHref: relatedGuide.devsiteAbsolute(),
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
  meta.description = config.description;
  return templates('devsite.html', {body, title: config.title, meta});
}


/**
 * @param {!content.ContentFile} cf 
 * @return {string}
 */
async function RootCardsHTML(cf) {
  const loader = cf.loader;

  // Grab all known Paths under `*/guides.yaml`.
  const paths = [];
  const allPathGuides = await loader.contents(cf.rel('*/guides.yaml'));
  for (const pathGuideFile of allPathGuides) {
    const id = path.basename(pathGuideFile.dir);  // parent of guides.yaml
    paths.push({
      id,
      config: await pathGuideFile.config,
      href: `/${id}`,
    });
  }
  paths.sort((a, b) => compareOrder(a.config.order, b.config.order));

  return await templates('root-cards.html', {flags, paths});
}


function compareOrder(a, b) {
  if (a === undefined) {
    a = Infinity;
  }
  if (b === undefined) {
    b = Infinity;
  }
  if (a === b) {
    return 0;
  } else if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
}


module.exports = {
  AllGuidesJSON,
  PathPageBuilder,
  MarkdownBuilder,
  ContentPageBuilder,
  RootCardsHTML,
};
