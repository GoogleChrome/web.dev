const {DateTime} = require("luxon");

/**
 * Convert a JavaScript Date object into a html date string, e.g.: 2019-10-31.
 * @param {Date} date The date to convert.
 * @return {string} An html date string.
 */
module.exports = (date) => {
  if (!date) {
    /* eslint-disable-next-line */
    console.warn('Date passed to htmlDateString filter was undefined or null.');
    return;
  }
  return DateTime.fromISO(date.toISOString(), {zone: "utc"}).toFormat(
    "yyyy-LL-dd",
  );
};
