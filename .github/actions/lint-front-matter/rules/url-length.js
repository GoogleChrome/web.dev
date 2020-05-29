/**
 * @fileoverview Verify the url is not a single word. Catches urls such as
 * web.dev/foo to avoid authors accidentally squatting on high value terms.
 */

const id = 'url-length';
const Rule = require('./rule');
const path = require('path');
const {ok, fail} = require('../utils/status');

/** @typedef {import('../utils/status').Status} Status */

/**
 * @param {string} file Filename of the file being linted.
 * @return {Status}
 */
const test = ({file}) => {
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
