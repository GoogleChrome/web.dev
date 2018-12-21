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

'use strict';

const handlebars = require('handlebars');
const fsp = require('./deps/fsp.js');
const path = require('path');

const cache = {};

/**
 * Runs the named Handlebars template with the specified payload.
 *
 * @param {string} templateName
 */
module.exports = async function(templateName, payload) {
  let template = cache[templateName];
  if (template === undefined) {
    const p = path.join(__dirname, '..', 'templates', templateName);
    const src = await fsp.readFile(p, 'utf-8');
    template = handlebars.compile(src);
    cache[templateName] = template;
  }
  return template(payload);
};
