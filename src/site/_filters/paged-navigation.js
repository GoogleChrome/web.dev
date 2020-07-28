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
 * Takes an object and determines how many links to other pages in the same paginated collection to display.
 * @param {{index: number, pages: number, href: string}} paged Page details including the `index` in the pagination, how many `pages` there are, and the `href` of the page.
 * @return {Array<{showEllipses?: boolean, index: number, href: string}>} An array of up to 8 items to display, including href and index.
 */
module.exports = function pagedNavigation(paged) {
  const halfTargetSize = 4;
  const start = Math.max(paged.index - halfTargetSize, 0);
  const end = Math.min(paged.index + halfTargetSize, paged.pages);

  const pagesToShow = Array.from({
    length: end - start,
  }).map((_, i) => {
    const index = i + start + 1;
    return {
      href: paged.href + (index === 1 ? '' : index),
      index,
    };
  });

  if (pagesToShow.length > 0) {
    const lastPageToShow = pagesToShow[pagesToShow.length - 1];

    if (lastPageToShow.index !== paged.pages) {
      const lastPage = {
        showEllipses: true,
        href: paged.href + paged.pages,
        index: paged.pages,
      };

      if (pagesToShow.length < halfTargetSize * 2) {
        pagesToShow.push(lastPage);
      } else {
        pagesToShow[halfTargetSize * 2 - 1] = lastPage;
      }
    }
  }

  return pagesToShow;
};
