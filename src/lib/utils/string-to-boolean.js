/**
 * Converts string to a boolean.
 *
 * @param {string} value
 * @returns {boolean}
 */
export const stringToBoolean = (value) =>
  value && String(value).toLowerCase() !== 'false';
