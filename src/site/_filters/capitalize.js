/**
 * Capitalize the first letter of a word.
 * @param {string} str
 * @return {string} A capitalized copy of the string.
 */
module.exports = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
