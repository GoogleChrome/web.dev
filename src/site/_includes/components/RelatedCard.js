/* global __basedir */

/*
 * Copyright 2023 Google LLC
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

const fs = require('fs');
const path = require('path');
const {generateImgixSrc} = require('./Img');

/**
 * If an icon is required, it grabs the SVG source with fs
 * because in a shortcode, we have no access to includes etc
 * @param {string} icon - Icon name.
 * @returns {string} SVG code of the icon in the _includes directory.
 */
const getIcon = (icon) => {
  if (!icon.length) return '';

  return fs.readFileSync(
    path.join(__basedir, 'src', 'site', '_includes', 'icons', icon),
    'utf8',
  );
};

/**
 * @param {RelatedCardParam} param
 * @returns {string} Related card template.
 */
function RelatedCard(param) {
  const theme = param.theme || 'quaternary';
  const imageSrc = generateImgixSrc(param.image, {w: 740, auto: 'format'});

  let eyebrowText;
  let eyebrowIcon;

  switch (param.eyebrow) {
    case 'learn':
      eyebrowText = 'Learn';
      eyebrowIcon = 'mortarboard.svg';
      break;
    case 'podcast':
      eyebrowText = 'Podcast';
      eyebrowIcon = 'podcast.svg';
      break;
    case 'pattern':
      eyebrowText = 'Pattern';
      eyebrowIcon = 'pattern.svg';
      break;
    case 'news':
      eyebrowText = 'News';
      eyebrowIcon = 'news.svg';
      break;
    case 'featured':
      eyebrowText = 'Featured';
      eyebrowIcon = 'featured.svg';
      break;
    default:
      eyebrowText = 'Blog';
      eyebrowIcon = 'blog.svg';
      break;
  }

  return `<div class="related-card">
    <a
      href="${param.url}"
      aria-hidden="true"
      class="card card-horizontal bg-${theme}"
    >
      <div class="content">
        <div class="card__eyebrow flow">
          ${getIcon(eyebrowIcon)}
          <span class="text-size-0 color-mid-text">${eyebrowText}</span>
        </div>
        <div class="card__content flow">
          <h4 class="card__heading color-core-text">${param.title}</h4>
          <p class="text-size-1 color-mid-text">${param.summary}</p>
        </div>
      </div>
      <img
        alt="${param.alt}"
        class="card__hero"
        decoding="async"
        loading="lazy"
        src="${imageSrc}"
      />
    </a>
  </div>`;
}

module.exports = {RelatedCard};
