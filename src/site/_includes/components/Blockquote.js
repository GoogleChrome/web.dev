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

const {Blockquote} = require('webdev-infra/shortcodes/Blockquote');
const md = require('markdown-it')();
const {html} = require('common-tags');

/**
 * @this {{env: Environment, ctx: Object}}
 */
function BlockquoteAlt(content, source, type) {
  if (!this.ctx.export) {
    return Blockquote.call(this, content, source, type);
  }

  const typeAttr = type ? `data-type="${type}"` : '';
  return html`
    <blockquote ${typeAttr}>
      ${md.render(content)}
      <cite>${md.renderInline(source)}</cite>
    </blockquote>
  `;
}

module.exports = {Blockquote: BlockquoteAlt};
