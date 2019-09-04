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

/**
 * Adds two new shortcodes to Eleventy: Image and Figure.
 * These shortcodes will convert local image paths to image CDN paths depending
 * on the build environment. This allows authors to dev with local images but
 * switch to using image CDN images with srcset and other fanciness during
 * production.
 *
 * We use the custom tags API instead of Eleventy's universal shortcodes here
 * because we need access to the page context object (specifically the URL for
 * the page that's being rendered). Unfortunately Eleventy's universal
 * shortcodes don't have access to this information, so custom tags it is!
 *
 * Example usage:
 *
 * {%
 *  Image
 *  src="./label-a11y-lint.png",
 *  alt="hello",
 *  maxWidth="300px"
 * %}
 *
 * {%
 *  Figure
 *  src="./label-a11y-lint.png",
 *  alt="hello",
 *  type="fullbleed screenshot",
 *  maxWidth="300px"
 * %}
 *  Figcaption text goes here! Can be `markdown`.
 * {% endFigure %}
 *
 */

const path = require('path');
const {oneLine} = require('common-tags');
const {ifDefined} = require('../helpers');
const md = require('markdown-it')();
const stripLanguage = require('../../../_filters/strip-language');
const imageCdn = require('../../../_data/site').imageCdn;

/* eslint-disable no-invalid-this, max-len */

// -----------------------------------------------------------------------------
// IMAGE
// -----------------------------------------------------------------------------

/**
 * Takes a path to an image and converts it to an image CDN path if we're in
 * a production environment.
 * @param {!string} src A path to an image asset.
 * @param {!Object} ctx An eleventy context object for the current page.
 * @return {string} An image path. May be converted to an image CDN path if
 * it's a production environment.
 */
function getImagePath(src, ctx) {
  let imagePath = src;
  if (process.env.ELEVENTY_ENV === 'prod') {
    imagePath = path.join(stripLanguage(ctx.page.url), src);
    imagePath = new URL(imagePath, imageCdn).href;
  }
  return imagePath;
}

/**
 * Render an image element as an HTML string.
 * @param {!{src: string, alt: string, maxWidth: number}} args
 * @param {!Object} ctx An eleventy context object.
 * @return {string}
 */
function renderImage({src, alt, maxWidth}, ctx) {
  const imagePath = getImagePath(src, ctx);
  let style;
  if (maxWidth) {
    style = `max-width: ${maxWidth};`;
  }
  // Using oneLine seems to make Nunjucks' SafeString function happy.
  return oneLine`
    <img
      src="${imagePath}"
      alt="${alt}"
      ${ifDefined('style', style)}
    />
  `;
}

/**
 * Define an Image shortcode to be used in page templates.
 * @param {!Object} nunjucksEngine
 * @return {function}
 */
const Image = (nunjucksEngine) => {
  return new function() {
    this.tags = ['Image'];

    this.parse = function(parser, nodes, lexer) {
      const tok = parser.nextToken();

      const args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value);

      return new nodes.CallExtensionAsync(this, 'run', args);
    };

    this.run = function({ctx}, args, callback) {
      const ret = new nunjucksEngine.runtime.SafeString(
        renderImage(args, ctx)
      );
      callback(null, ret);
    };
  }();
};

// -----------------------------------------------------------------------------
// FIGURE
// -----------------------------------------------------------------------------

/**
 * Render a figcaption element as an HTML string.
 * @param {?string} caption A markdown string of caption text.
 * @param {!Array<string>} figCaptionClasses An Array of classes to apply to the
 * figcaption element.
 * @return {string}
 */
function renderFigCaption(caption, figCaptionClasses) {
  if (!caption) {
    return '';
  }

  // Needs to be one long line, else we get white space inside of the
  // figcaption element.
  return oneLine`
    <figcaption class="${figCaptionClasses.join(' ')}">${md.renderInline(caption.trim())}</figcaption>
  `;
}

/**
 * Render a figure element as an HTML string.
 * @param {!string} image An HTML string for an image element.
 * @param {{type: string}} args
 * @param {?string} caption An optional caption string in markdown.
 * @return {string}
 */
function renderFigure(image, {type}, caption) {
  const figClasses = ['w-figure'];
  const figCaptionClasses = ['w-figcaption'];

  if (type) {
    type.split(' ').forEach((entry) => {
      figClasses.push(`w-figure--${entry}`);
      // w-figure--fulbleed is the only modifier class we use on figcaption.
      if (entry === 'fullbleed') {
        figCaptionClasses.push(`w-figure--${entry}`);
      }
    });
  }

  return oneLine`
    <figure class="${figClasses.join(' ')}">
      ${image}
      ${renderFigCaption(caption, figCaptionClasses)}
    </figure>
  `;
}

/**
 * Define a Figure shortcode to be used in page templates.
 * @param {!Object} nunjucksEngine
 * @return {function}
 */
const Figure = (nunjucksEngine) => {
  return new function() {
    this.tags = ['Figure'];

    this.parse = function(parser, nodes, lexer) {
      const tok = parser.nextToken();

      const args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value);
      const caption = parser.parseUntilBlocks('endFigure');
      parser.advanceAfterBlockEnd();

      return new nodes.CallExtensionAsync(this, 'run', args, [caption]);
    };

    this.run = function({ctx}, args, caption, callback) {
      const ret = new nunjucksEngine.runtime.SafeString(
        renderFigure(renderImage(args, ctx), args, caption())
      );
      callback(null, ret);
    };
  }();
};

module.exports = {Image, Figure};
