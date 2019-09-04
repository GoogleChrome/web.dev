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

module.exports = {
  env: process.env.ELEVENTY_ENV || 'dev',
  title: 'web.dev',
  titleVariation: 'Home',
  url: 'https://web.dev',
  repo: 'https://github.com/GoogleChrome/web.dev',
  subscribe: 'https://web.dev/subscribe',
  isBannerEnabled: true,
  banner: `Register for this year's \`#ChromeDevSummit\` happening on Nov. 11-12
  in San Francisco to learn about the latest features and tools coming to the
  Web. [Request an invite here](https://developer.chrome.com/devsummit/).`,
  // Note that the imageCdn value is only used when we do a production build
  // of the site. Otherwise all image paths are local. This means you can
  // develop locally without having to mess with the CDN at all.
  imageCdn: 'https://webdev.imgix.net',
};
