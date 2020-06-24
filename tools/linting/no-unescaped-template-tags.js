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

const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');

module.exports = rule(
  'remark-lint:no-unescaped-template-tags',
  noUnescapedTemplateTags,
);

const reason = `
  Escape template tags such as "{{" and "}}" using {% raw %} and {% verbatim %}.
  e.g. {% raw %}{% verbatim %}{{foo}}{% endverbatim %}{% endraw %}
`;

/**
 * Walk the AST for the markdown file and find any unescaped curly braces.
 * @param {*} tree An AST of the markdown file.
 * @param {*} file The markdown file.
 */
function noUnescapedTemplateTags(tree, file) {
  visit(tree, 'text', visitor);

  /* eslint-disable require-jsdoc */
  function visitor(node) {
    const lines = node.value.split('\n');
    let line;

    for (let index = 0; index < lines.length; index++) {
      line = lines[index].trim();
      /* eslint-disable max-len */
      // This regex looks for unescaped {{ or }} characters.
      // It uses a negative lookbehind to find {{ that are not preceded by {% raw %}{% verbatim %} — https://regexr.com/4iplj
      // It uses a negative lookahead to find }} that are not followed by {% endverbatim %}{% endraw %} — https://regexr.com/4ipk6
      if (
        line.match(
          /(?<!{%\s*raw\s*%}\s*{%\s*verbatim\s*%}\s*){{|}}(?!\s*{%\s*endverbatim\s*%}\s*{%\s*endraw\s*%})/g,
        )
      ) {
        return file.message(reason, node);
      }
    }
  }
}
