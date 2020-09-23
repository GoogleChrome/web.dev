/**
 * A simple debounce util for ensuring a function only gets called once during
 * a particular interval.
 * @param {!Function} func A function to debounce based on the wait time.
 * @param {!number} wait Time in milliseconds to wait before invoking function.
 * @return {() => void | Promise<void> | TODO} A debounced copy of the function.
 */
export const debounce = (func, wait) => {
  if (!func) {
    throw new TypeError('func is a required argument.');
  }

  if (!wait) {
    throw new TypeError('wait is a required argument.');
  }

  let timeout;
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
