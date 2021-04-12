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
 * image CDN and makes sure all local images have width and height html
 * attributes set to avoid layout shift.
 */

const cheerio = require('cheerio');
const fs = require('fs');
const sizeOf = require('image-size');
const path = require('path');
const {determineImagePath} = require('./helpers');

const responsiveImages = (content, outputPath) => {
  if (!outputPath || !outputPath.endsWith('.html')) {
    return content;
  }

  const $ = cheerio.load(content);
  const $img = $('img');
  $img.each((_, elem) => {
    const $elem = $(elem);
    const originalSrc = $elem.attr('src').trim();
    if (!originalSrc) {
      return;
    }

    // If the author has not specified a width or height on the image then
    // one will be provided.
    // nb. If the author has only specified a single dimension,
    // like a width without a height, then only that dimensions will be used.
    // We don't compute the other dimension because the author may be
    // purposefully displaying the image smaller than its original size and
    // for a high res image we could end up with a very tall height that doesn't
    // match the width (i.e. width=200 height=3000 for a 2x image).
    if (!$elem.attr('width') && !$elem.attr('height')) {
      const isLocal = !RegExp('^(https?://|/)').test(originalSrc);
      if (isLocal) {
        const distSrc = path.join(path.dirname(outputPath), originalSrc);
        if (fs.existsSync(distSrc)) {
          const {width, height} = sizeOf(distSrc);
          $elem.attr('width', width);
          $elem.attr('height', height);
        }
      }
    }

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
  // TODO: Create a generic function that takes other elements than img.
  const originalLogo = $('web-navigation-drawer').attr('logo');
  if (originalLogo) {
    const newLogo = determineImagePath(originalLogo, outputPath).src;
    $('web-navigation-drawer').attr('logo', newLogo);
  }
  return $.html();
};

module.exports = {responsiveImages};
