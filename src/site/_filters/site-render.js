/*
 * Copyright 2021 Google LLC
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

const md = require('../_plugins/markdown');

// Imported just for types.
// eslint-disable-next-line no-unused-vars
const {Environment} = require('nunjucks');

/**
 * Renders content with Nunjucks _then_ with Markdown. This emulates rendering actual page content.
 *
 * This relies on the shape of the Nunjucks `this` object, which has a Nunjucks `Environment`.
 *
 * @this {{env: Environment, ctx: Object}}
 * @param {string} raw
 * @param {(err: Error?, result: string?) => void} callback
 */
function siteRender(raw, callback) {
  const env = this.env;

  // This renders Nunjucks, then we apply Markdown to the output.
  // We use the async callback in case Nunjucks itself calls further async code (otherwise it will
  // throw using the sync call).
  env.renderString(raw, this.ctx, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }

    const markdownResult = md.render(result);
    callback(null, markdownResult);
  });
}

module.exports = {siteRender};
