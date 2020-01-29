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
 * Take array of paginated hrefs and select the pages to display.
 * @param {any} paged Page details
 * @return {Array<object>} An array of up to 8 items to display, including href and index.
 */
module.exports = function pagedNavigation(paged) {
  const shiftBy = 4;
  const start = paged.index - shiftBy > 0 ? paged.index - shiftBy : 0;
  const end =
    paged.index + shiftBy < paged.pages ? paged.index + shiftBy : paged.pages;

  const pagesToShow = Array.from({
    length: end - start,
  }).map((_, i) => {
    const index = i + start + 1;
    return {
      href: index === 1 ? paged.href : paged.href + "/" + index,
      index,
    };
  });

  const lastPageToShow = pagesToShow[pagesToShow.length - 1];

  if (lastPageToShow.index !== paged.pages) {
    const lastPage = {
      showEllipses: true,
      href: paged.href + "/" + paged.pages,
      index: paged.pages,
    };

    if (pagesToShow.length < shiftBy * 2) {
      pagesToShow.push(lastPage);
    } else {
      pagesToShow[shiftBy * 2 - 1] = lastPage;
    }
  }

  return pagesToShow;
};
