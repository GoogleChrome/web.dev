/**
 * Check whether an element has overflow.
 * @param {Object} scroller The element to check for overflow.
 * @param {string} dimension The dimension to check (height or width).
 * @return {Boolean} Whether the passed element has overflow.
 */
export const checkOverflow = (scroller, dimension) => {
  if (dimension !== "height" && dimension !== "width") {
    throw new TypeError("Can only check overflow for height or width.");
  }

  if (!scroller) {
    throw new TypeError("Can't check overflow on an undefined element.");
  }

  const clientDimension =
    dimension === "width" ? scroller.clientWidth : scroller.clientHeight;
  const scrollDimension =
    dimension === "width" ? scroller.scrollWidth : scroller.scrollHeight;

  return scrollDimension > clientDimension;
};
