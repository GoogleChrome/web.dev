const {DateTime} = require('luxon');

/**
 * Convert a JavaScript Date object into a human readable string.
 * @param {Date} date The date to convert.
 * @return {string} A human readable date string.
 */
module.exports = (date) => {
  if (!date) {
    /* eslint-disable-next-line */
    console.warn('Date passed to prettyDate filter was undefined or null.');
    return;
  }

  return DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_MED);
};
