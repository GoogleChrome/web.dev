/* eslint-disable max-len */

/**
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 * @module fenced-code-flag
 * @fileoverview
 *   Check fenced code block flags.
 *
 *   Options: `Array.<string>` or `Object`, optional.
 *
 *   Providing an array is as passing `{flags: Array}`.
 *
 *   The object can have an array of `'flags'` which are deemed valid.
 *   In addition it can have the property `allowEmpty` (`boolean`, default:
 *   `false`) which signifies whether or not to warn for fenced code blocks
 *   without language flags.
 *
 * @example {"name": "valid.md"}
 *
 *   ```alpha
 *   bravo();
 *   ```
 *
 * @example {"name": "invalid.md", "label": "input"}
 *
 *   ```
 *   alpha();
 *   ```
 *
 * @example {"name": "invalid.md", "label": "output"}
 *
 *   1:1-3:4: Missing code-language flag
 *
 * @example {"name": "valid.md", "setting": {"allowEmpty": true}}
 *
 *   ```
 *   alpha();
 *   ```
 *
 * @example {"name": "invalid.md", "setting": {"allowEmpty": false}, "label": "input"}
 *
 *   ```
 *   alpha();
 *   ```
 *
 * @example {"name": "invalid.md", "setting": {"allowEmpty": false}, "label": "output"}
 *
 *   1:1-3:4: Missing code-language flag
 *
 * @example {"name": "valid.md", "setting": ["alpha"]}
 *
 *   ```alpha
 *   bravo();
 *   ```
 *
 * @example {"name": "invalid.md", "setting": ["charlie"], "label": "input"}
 *
 *   ```alpha
 *   bravo();
 *   ```
 *
 * @example {"name": "invalid.md", "setting": ["charlie"], "label": "output"}
 *
 *   1:1-3:4: Invalid code-language flag
 */

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

'use strict';

const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');
const position = require('unist-util-position');
const generated = require('unist-util-generated');

module.exports = rule('remark-lint:fenced-code-flag', fencedCodeFlag);

const start = position.start;
const end = position.end;

const fence = /^ {0,3}([~`])\1{2,}/;
const reasonInvalid =
  'Invalid code-language flag. See https://web.dev/handbook/markup-code/#code-blocks';
const reasonMissing =
  'Missing code-language flag. See https://web.dev/handbook/markup-code/#code-blocks';

/* eslint-disable require-jsdoc */

function fencedCodeFlag(tree, file, pref) {
  const contents = String(file);
  let allowEmpty = false;
  let flags = [];

  if (typeof pref === 'object' && !('length' in pref)) {
    allowEmpty = Boolean(pref.allowEmpty);
    pref = pref.flags;
  }

  if (typeof pref === 'object' && 'length' in pref) {
    flags = String(pref).split(',');
  }

  visit(tree, 'code', visitor);

  function visitor(node) {
    let value;

    if (!generated(node)) {
      if (node.lang) {
        if (flags.length !== 0 && flags.indexOf(node.lang) === -1) {
          file.message(reasonInvalid, node);
        }
      } else {
        value = contents.slice(start(node).offset, end(node).offset);

        if (!allowEmpty && fence.test(value)) {
          file.message(reasonMissing, node);
        }
      }
    }
  }
}
