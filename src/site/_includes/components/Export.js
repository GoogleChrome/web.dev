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

// Imported just for types.
// eslint-disable-next-line no-unused-vars
const {Environment} = require('nunjucks');

const {findByUrl} = require('../../_filters/find-by-url');

/**
 * Renders content with Nunjucks instance configured in .eleventy.
 * This emulates pre-processing of the actual page content.
 *
 * @this {{env: Environment, ctx: Object}}
 */
async function Export() {
  // Need to re-retrieve the page from the collections.all array (which findByUrl uses)
  // as the page object from the context does not have the source content and environment.
  const page = findByUrl(this.ctx.page.url);

  // The nunjucks env is not available in the context, so we need to dig it out
  // from 11ty internals
  const njkEnv = page.template._extensionMap._engineManager.engineCache.njk.njkEnv;

  const source = page?.template?.frontMatter?.content;
  if (!source) {
    return '';
  }

  const markdown = await new Promise((resolve, reject) => {
    njkEnv.renderString(source, this.ctx, (err, result) => {
      if (err) {
        resolve('Could not render template');
        return;
      }

      resolve(result);
    });
  });

  return `<template id="markdown-source">${markdown}</template>`;
}

module.exports = {Export};
