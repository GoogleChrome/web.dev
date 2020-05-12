const capitalize = require('./capitalize');

/**
 * Title case a string of dash separated words
 * @param {string} str
 * @return {string} A title cased copy of the string.
 */
module.exports = (str) => {
  return str
    .split('-')
    .map((part) => {
      return capitalize(part);
    })
    .join(' ');
};
