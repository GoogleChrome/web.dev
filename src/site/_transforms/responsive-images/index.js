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

/**
 * @fileoverview An eleventy transform that rewrites image paths to use our
 * image CDN.
 */

const cheerio = require('cheerio');
const {determineImagePath} = require('./helpers');

const responsiveImages = (content, outputPath) => {
  if (!outputPath || !outputPath.endsWith('.html')) {
    return content;
  }

  const $ = cheerio.load(content);
  const $img = $('img');
  $img.each((_, elem) => {
    const $elem = $(elem);
    const originalSrc = $elem.attr('src');
    const newSrc = determineImagePath($elem.attr('src'), outputPath).src;
    $elem.attr('src', newSrc);
    // Note the code below is a short term fix and should be removed eventually.
    // If the image already has srcset defined,
    // update that to use the image CDN as well.
    // This assumes the srcset paths use the same src as the image.
    // e.g. src=./foo.jpg srcset=./foo.jpg?w=640w.
    // We do this because some components, like Hero, and PostCard, will
    // attempt to define a srcset for their images before their html makes it to
    // this transform.
    // Ultimately we'd like to add support for the sizes attribute, so authors
    // can tell us what dimensions they want their images displayed at
    // and then this transform can do all the srcsetting for the entire site.
    const originalSrcSet = $elem.attr('srcset');
    if (originalSrcSet) {
      const newSrcSet = originalSrcSet
        .split(' ')
        .map((src) => src.replace(originalSrc, newSrc))
        .join(' ');
      $elem.attr('srcset', newSrcSet);
    }
  });
  return $.html();
};

module.exports = {responsiveImages};
