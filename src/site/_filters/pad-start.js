/**
 * Pads the current string with another string (multiple times, if needed) until
 * the resulting string reaches the given length. The padding is applied from
 * the start of the current string.
 * @param {string} str The string to pad
 * @param {number} targetLength The length of the resulting string once the
 * current str has been padded. If the value is less than str.length, then str
 * is returned as-is.
 * @param {string} padString The string to pad the current str with.
 * @return {string}
 */
module.exports = function (str, targetLength, padString) {
  // Be sure to cast to a string.
  // If you pass in a Number, node will throw because padStart() is not
  // available on Number.
  str = str.toString();
  return str.padStart(targetLength, padString);
};
