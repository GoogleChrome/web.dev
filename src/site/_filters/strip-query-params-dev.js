/*
 * Copyright 2020 Google LLC
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

const isProd = process.env.ELEVENTY_ENV === 'prod';
const noop = (url) => url;
const strip = (url) => url.split('?')[0];

// Strip query params from URLs in dev only. Used for lazy cache-busting
// e.g. in non-prod, app.css?blah => app.css
module.exports = isProd ? noop : strip;
