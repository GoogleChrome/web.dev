/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is di_plstributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const md = require('markdown-it');
const slugify = require('slugify');

const markdown = md({
  html: true,
})
  // Let folks author definition lists using markdown syntax.
  .use(require('markdown-it-deflist'))
  // Let folks customize markdown output with attributes (id, class, data-*)
  .use(require('markdown-it-attrs'), {
    leftDelimiter: '{:',
    rightDelimiter: '}',
    allowedAttributes: ['id', 'class', /^data-.*$/],
  })
  // Automatically add anchors to headings
  .use(require('markdown-it-anchor'), {
    level: 2,
    permalink: true,
    permalinkClass: 'w-headline-link',
    permalinkSymbol: '#',
    // @ts-ignore
    slugify: (s) => slugify(s, {lower: true}),
  })
  // Disable indented code blocks.
  // We only support fenced code blocks.
  .disable('code');

// Custom renderer rules
const fence = markdown.renderer.rules.fence;
const rules = {
  // Wrap code blocks in a web-copy-code element so folks can copy the
  // snippet.
  fence: (tokens, idx, options, env, slf) => {
    const fenced = fence(tokens, idx, options, env, slf);
    return `<web-copy-code>${fenced}</web-copy-code>`;
  },
  // Wrap tables in a <div class="w-table-wrapper"> element to make them
  // responsive.
  table_close: () => '</table>\n</div>',
  table_open: () => '<div class="w-table-wrapper">\n<table>\n',
};

markdown.renderer.rules = {...markdown.renderer.rules, ...rules};

module.exports = markdown;
