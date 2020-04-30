const id = 'updated-is-current';
const Rule = require('./rule');
const {ok, warn} = require('../utils/status');

/**
 * @param {Object} yaml The yaml front matter from the file.
 * @param {?string} yaml.updated The updated property in the yaml front matter.
 * @return {Object} The result of the check and any failure/warning messages.
 */
const test = ({updated}) => {
  // If updated is undefined, just return early.
  // Rather than error here, let another lint rule that explicitly checks for
  // the presence of the updated property handle it.
  if (!updated) {
    return ok();
  }

  const today = new Date();
  today.setUTCHours(12, 0, 0, 0);
  const updatedDate = new Date(updated);
  updatedDate.setUTCHours(12, 0, 0, 0);
  if (today.getTime() > updatedDate.getTime()) {
    return warn(`\`updated\` field is out of date`, {
      expected: today.toISOString().split('T')[0],
      actual: updatedDate.toISOString().split('T')[0],
    });
  }

  return ok();
};

module.exports = new Rule(id, test);
