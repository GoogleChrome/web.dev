/**
 * Check whether an element has overflow.
 * @param {Object} scroller The element to check for overflow.
 * @param {string} dimension The dimension to check (height or width).
 * @return {Boolean} Whether the element has overflow.
 */
export const handleOverflow = (scroller, dimension) => {
  if (dimension !== "height" && dimension !== "width") {
    return console.error("Can only check overflow for height or width.");
  }

  if (!scroller) {
    return console.error("Can't check overflow on an undefined element.");
  }

  const clientDimension =
    dimension === "width" ? scroller.clientWidth : scroller.clientHeight;
  const scrollDimension =
    dimension === "width" ? scroller.scrollWidth : scroller.scrollHeight;

  return scrollDimension > clientDimension;
};
