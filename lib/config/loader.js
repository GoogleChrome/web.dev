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

const content = require('../deps/content.js');
const generators = require('./generators.js');
const validate = require('./validate.js');


// configure paths that are dynamically generated
const loader = new content.ContentLoader();
loader.register('_auditpaths.md', generators.AuditGuidePaths);
loader.register('path/*/_guidelist.md', generators.PathIndex);
loader.register('./*.md', generators.MarkdownBuilder);
loader.register('./*.yaml', generators.FilterYaml);
loader.register('./*.json', validate.testJSON);
loader.register('./*.{md,html}', generators.DevsiteRelativeInclude);


module.exports = loader;