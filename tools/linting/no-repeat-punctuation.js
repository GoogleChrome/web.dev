/**
  MIT License

  Copyright (c) 2019-present, LaySent <laysent@gmail.com> (github.com/laysent)

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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

const rule = require('unified-lint-rule');
const map = require('unist-util-map');
const toList = require('unist-util-to-list-of-char');

// nb. We removed "~" here because it flagged strikethrough content.
const punctuations = '！!～.。,，·?？';

/* eslint-disable require-jsdoc */
class Traveler {
  constructor(file, config) {
    this.file = file;
    this.prev = null;
    this.config = config;
  }

  process(node) {
    const {value} = node;
    if (this.config.indexOf(value) >= 0 && value === this.prev) {
      if (value === '.') {
        this.file.message(
          `Should not repeat "${value}". Use ellipsis "…" character instead.`,
          node,
        );
      } else {
        this.file.message(`Should not repeat "${value}"`, node);
      }
    }
    this.prev = value;
  }

  end() {} // eslint-disable-line class-methods-use-this
}

function processor(tree, file, config = punctuations) {
  function callback(list) {
    const traveler = new Traveler(file, config);
    list.forEach((node) => {
      traveler.process(node);
    });
    traveler.end();
  }
  const inlineCodeReplaced = map(tree, (node) => {
    if (node.type !== 'inlineCode') return node;
    /**
     * Change the value of code, so that lint rule won't throw error for
     * anything inside. However, don't change the position info, so that warning
     * still shows the correct position.
     */
    return Object.assign({}, node, {value: '\u200b'});
  });
  toList(inlineCodeReplaced, 'paragraph', callback);
  toList(inlineCodeReplaced, 'heading', callback);
}

module.exports = rule('remark-lint:no-repeat-punctuation', processor);
