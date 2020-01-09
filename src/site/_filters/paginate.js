/**
 * Take array of paginated hrefs and select the pages to display.
 * @param {Array<string>} pages An array of hrefs of all the pages.
 * @param {string} current Href of current page.
 * @return {Array<object>} An array of up to 10 items to display, including href and index.
 */
module.exports = function paginate(pages, current) {
  const currentIndex = pages.indexOf(current);

  if (currentIndex < 0) return [];

  const shiftBy = 4;
  const shouldShift = currentIndex > shiftBy;
  const start = shouldShift ? currentIndex - shiftBy : 0;
  const end = shouldShift ? currentIndex + shiftBy : shiftBy * 2;
  const pagesToShow = pages
    .slice(start, end)
    .map((href, index) => ({href, index: start + index + 1}));

  if (currentIndex < pages.length - shiftBy + 1) {
    pagesToShow[pagesToShow.length - 1] = {
      showEllipses: currentIndex < pages.length - shiftBy,
      href: pages.slice(-1)[0],
      index: pages.length,
    };
  }

  return pagesToShow;
};
