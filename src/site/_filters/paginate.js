/**
 * Take array of paginated hrefs and select the pages to display.
 * @param {string[]} pages An array of hrefs of all the pages.
 * @param {string} current Href of current page.
 * @return {object[]} An array of up to 10 items to display, including href and index.
 */
module.exports = function paginate(pages, current) {
  const currentIndex = pages.findIndex((page) => page === current);

  if (currentIndex < 0) return [];

  let curated = pages.slice(0, 10);
  const start = currentIndex > 5 ? currentIndex - 5 : 0;
  const end = currentIndex + 5;

  if (currentIndex > 5) curated = pages.slice(start, end);

  return curated.map((href, index) => ({href, index: start + index + 1}));
};
