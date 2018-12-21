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

/* eslint-disable require-jsdoc, valid-jsdoc */

const marked = require('marked');

// nb. mirror Marked's replacement code,
// as its `escape` method is not exposed to users.

const escapeReplace = /[<>"']|&(?!#?\w+;)/g;
const escapeReplacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;', // eslint-disable-line quotes
};

function escape(raw) {
  return raw.replace(escapeReplace, (ch) => escapeReplacements[ch]);
}

class Renderer extends marked.Renderer {
  code(code, lang, escaped) {
    let className = 'prettyprint';
    if (lang) {
      // we set langPrefix below, so might as well use the option here
      className += ` ${this.options.langPrefix}${lang}`;
    }
    if (!escaped) {
      code = escape(code);
    }

    // DevSite doesn't expect a `<code>` block,
    // it just looks for `<pre class="prettyprint">`.
    return `<pre class="${className}">${code}</pre>`;
  }
}

const renderer = new Renderer();

module.exports = (raw) => {
  if (raw == null) {
    // check for null/undefined
    return '';
  }
  return marked(raw, {renderer, langPrefix: 'lang-'});
};
