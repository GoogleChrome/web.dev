/**
 * @fileoverview
 * Take the array of results returned from linting a single file and sort them
 * by passes/failures/warnings.
 */

const {okStatus, failStatus, warnStatus} = require('./status');

/** @typedef {import('../rules/rule').TestResult} TestResult */

/**
 * @param {string} file The file associated with the results.
 * @param {Array<TestResult>} results The collection of rule results.
 * @return {{file: string, passes: Array, failures: Array, warnings: Array}}
 */
module.exports = (file, results) => {
  const passes = [];
  const failures = [];
  const warnings = [];

  for (result of results) {
    switch (result.status) {
      case okStatus:
        passes.push(result);
        break;

      case failStatus:
        failures.push(result);
        break;

      case warnStatus:
        warnings.push(result);
        break;

      default:
        throw new Error(`Unknown status: ${result.status}.`);
    }
  }

  return {file, passes, failures, warnings};
};
