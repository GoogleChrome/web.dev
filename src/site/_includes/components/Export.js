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
const cheerio = require('cheerio');

const {findByUrl} = require('../../_filters/find-by-url');
const {exportFile} = require('../../_utils/export-file');

function addCaptionStyles($) {
  $('figcaption').each((i, el) => {
    const $figcaption = $(el);
    $figcaption.addClass('webdev-caption');
  });
}

function rewriteFloatClasses($) {
  $('.float-left').each((i, el) => {
    const $el = $(el);
    $el.removeClass('float-left');
    $el.addClass('attempt-left');
  });

  $('.float-right').each((i, el) => {
    const $el = $(el);
    $el.removeClass('float-right');
    $el.addClass('attempt-right');
  });
}

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
  const njkEnv =
    page.template._extensionMap._engineManager.engineCache.njk.njkEnv;

  const source = page?.template?.frontMatter?.content;
  if (!source) {
    return '';
  }

  const markdown = await new Promise((resolve) => {
    njkEnv.renderString(
      source,
      Object.assign({}, this.ctx, {export: true}),
      (err, result) => {
        if (err) {
          resolve('Could not render template: ' + err);
          return;
        }

        resolve(result);
      },
    );
  });

  const $ = cheerio.load(`<main>${markdown}</main>`);
  addCaptionStyles($);
  rewriteFloatClasses($);

  const transformedMarkdown = $('main').html();

  // Note: the following lines can be altered to produce any directory scheme
  // that is convenient for the migration
  await exportFile(this.ctx, transformedMarkdown);

  return transformedMarkdown;
}

module.exports = {Export};
