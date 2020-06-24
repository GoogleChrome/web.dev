/**
 * @param {!Element} scroller
 * @param {string} dimension
 * @return {boolean}
 */
export const checkOverflow = (scroller, dimension) => {
  if (dimension !== 'height' && dimension !== 'width') {
    throw new TypeError('Can only check overflow for height or width.');
  }

  if (!scroller) {
    throw new TypeError(`Can't check overflow on an undefined element.`);
  }

  const clientDimension =
    dimension === 'width' ? scroller.clientWidth : scroller.clientHeight;
  const scrollDimension =
    dimension === 'width' ? scroller.scrollWidth : scroller.scrollHeight;

  return scrollDimension > clientDimension;
};
