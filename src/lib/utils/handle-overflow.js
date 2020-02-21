/**
 * Check whether an element has overflow.
 * @param {Object} scroller The element to check for overflow.
 * @param {string} dimension The dimension to check (height or width).
 * @param {string} overflowClass The class to add.
 * @param {Object} container The element to add a class to.
 * @return {null}
 */
export const handleOverflow = (
  scroller,
  dimension,
  overflowClass,
  container,
) => {
  if (dimension !== "height" && dimension !== "width") {
    return console.error("Can only check overflow for height or width.");
  }

  if (!scroller) {
    return console.error("Can't check overflow on an undefined element.");
  }

  if (!overflowClass) {
    return console.error("No overflow class to apply.");
  }

  if (!container) container = scroller;

  const clientDimension =
    dimension === "width" ? scroller.clientWidth : scroller.clientHeight;
  const scrollDimension =
    dimension === "width" ? scroller.scrollWidth : scroller.scrollHeight;

  if (scrollDimension > clientDimension) {
    container.classList.add(overflowClass);
  } else {
    container.classList.remove(overflowClass);
  }
};
