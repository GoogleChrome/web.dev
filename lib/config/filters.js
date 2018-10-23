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

'use strict';

/**
 * Restricts the output of YAML files such that only expected ouputs are generated. DevSite only
 * expects certain names and formats.
 *
 * @param {!content.ContentFile} cf
 * @return {?string|undefined}
 */
async function FilterYaml(cf) {
  const validMarkdownNames = ['_index', '_book', '_project'];
  if (!validMarkdownNames.includes(cf.name)) {
    return null;
  }
}

module.exports = {
  FilterYaml,
};
