const freshnessTreshold = 1000 * 60 * 60 * 24 * 30; // 30 days

/**
 * Returns true if the date is fresher than the freshnes treshold.
 * @param {Date} date Date to be checked
 * @return {Boolean} isNew
 */
module.exports = (date) => {
  if (!date) {
    return;
  }
  return date.getTime() > Date.now() - freshnessTreshold;
};
