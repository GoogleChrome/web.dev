/**
 * Check whether an element has overflow.
 * @param {Object} elem The element to check.
 * @param {string} dimension The dimension to check (height or width).
 * @return {Boolean}
 */
export const checkOverflow = (elem, dimension) => {
  if (dimension !== "height" && dimension !== "width") {
    throw new Error("Can only check overflow for height or width.");
  }

  const clientDimension =
    dimension === "width" ? elem.clientWidth : elem.clientHeight;
  const scrollDimension =
    dimension === "width" ? elem.scrollWidth : elem.scrollHeight;

  return scrollDimension > clientDimension;
};
