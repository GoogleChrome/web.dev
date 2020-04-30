const id = 'url-length';
const Rule = require('./rule');
const path = require('path');
const {ok, fail} = require('../utils/status');

/**
 * @param {string} file Filename of the file being linted.
 * @return {Object} The result of the check and any failure/warning messages.
 */
const test = (file) => {
  const dirname = path
    .dirname(file)
    .split('/')
    .pop();

  if (dirname.split('-').length === 1) {
    return fail(`URL is too short.`);
  }

  return ok();
};

module.exports = new Rule(id, test);
