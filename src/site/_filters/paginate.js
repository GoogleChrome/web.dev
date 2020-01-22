/**
 * Take array of paginated hrefs and select the pages to display.
 * @param {any} tag Tag details
 * @return {Array<object>} An array of up to 8 items to display, including href and index.
 */
module.exports = function paginate(tag) {
  const shiftBy = 4;
  const start = tag.index - shiftBy > 0 ? tag.index - shiftBy : 0;
  const end = tag.index + shiftBy < tag.pages ? tag.index + shiftBy : tag.pages;

  const pagesToShow = Array.from({
    length: end - start,
  }).map((_, i) => {
    const index = i + start + 1;
    return {
      href: index === 1 ? tag.href : tag.href + "/" + index,
      index,
    };
  });

  const lastPageToShow = pagesToShow[pagesToShow.length - 1];

  if (lastPageToShow.index !== tag.pages) {
    const lastPage = {
      showEllipses: true,
      href: tag.href + "/" + tag.pages,
      index: tag.pages,
    };

    if (pagesToShow.length < shiftBy * 2) {
      pagesToShow.push(lastPage);
    } else {
      pagesToShow[shiftBy * 2 - 1] = lastPage;
    }
  }

  return pagesToShow;
};
