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
 * Adds a Details shortcodes to Eleventy.
 * We use the custom tags API instead of Eleventy's universal shortcodes
 * because we need tags to separate the subcomponents of the Details component
 * that can't be used independently.
 *
 * Example usage:
 *
 * {%
 * Details headingLevel="h3", state="open" %}
 * Summary text goes here! Can be `markdown`.
 * {% preview %}
 * Optional preview text goes here! Can be `markdown`.
 * {% panel %}
 * Panel text goes here! Can be `markdown`.
 * {% endDetails %}
 *
 */

const md = require('markdown-it')();
const {oneLine} = require('common-tags');

/* eslint-disable no-invalid-this */

/**
 * Render a details heading element as an HTML string.
 * @param {?string} summary A markdown string of summary text.
 * @param {?string} headingLevel A string indicating the heading element.
 * @return {string}
 */
function renderDetailsHeading(summary, headingLevel) {
  if (!headingLevel) {
    headingLevel = 'h2';
  }

  const validLevels = ['h2', 'h3', 'h4', 'h5', 'h6', 'p'];

  if (!validLevels.includes(headingLevel)) {
    /* eslint-disable max-len */
    throw new Error(`Invalid heading level for Details component. Use h2, h3, h4, h5, h6, or p.`);
    /* eslint-enable max-len */
  }

  return oneLine`
    <${headingLevel} class="w-details__header">
      ${md.renderInline(summary)}
    </${headingLevel}>
  `;
}

/**
 * Render a details preview element as an HTML string.
 * @param {?string} preview A markdown string of preview text.
 * @return {string}
 */
function renderDetailsPreview(preview) {
  if (!preview) {
    return '';
  }

  // Needs to be one long line, or you get white space in the preview element.
  return oneLine`
   <p class="w-details__preview">${md.renderInline(preview.trim())}</p>
   `;
}

/**
 * Render a details element as an HTML string.
 * @param {!{headingLevel: string, state: string}} args
 * @param {string} summary A summary text string in markdown.
 * @param {?string} preview An optional preview text string in markdown.
 * @param {string} panel A panel text string in markdown.
 * @return {string}
 */
function renderDetails({headingLevel, state}, summary, preview, panel) {
  const stateOverride = state == 'open' ? 'open' : '';

  return oneLine`
     <details class="w-details" ${stateOverride}>
       <summary class="w-details__summary">
         ${renderDetailsHeading(summary, headingLevel)}
         ${renderDetailsPreview(preview)}
       </summary>
       ${md.render(panel)}
     </details>
   `;
}

/**
 * Define a Details shortcode to be used in page templates.
 * @param {!Object} nunjucksEngine
 * @return {function}
 */
const Details = (nunjucksEngine) => {
  return new function() {
    this.tags = ['Details'];

    this.parse = function(parser, nodes, lexer) {
      const tok = parser.nextToken();

      const args = parser.parseSignature(null, true);
      parser.advanceAfterBlockEnd(tok.value);

      const summary = parser.parseUntilBlocks('preview', 'panel');

      let preview = null;
      if (parser.skipSymbol('preview')) {
        parser.skip(lexer.TOKEN_BLOCK_END);
        preview = parser.parseUntilBlocks('panel');
      }
      parser.advanceAfterBlockEnd();

      const panel = parser.parseUntilBlocks('endDetails');
      parser.advanceAfterBlockEnd();

      return new nodes.CallExtensionAsync(
        this, 'run', args, [summary, preview, panel]
      );
    };

    this.run = function({ctx}, args, summary, preview, panel, callback) {
      const ret = new nunjucksEngine.runtime.SafeString(
        renderDetails(args, summary(), preview(), panel())
      );
      callback(null, ret);
    };
  }();
};

module.exports = {Details};
