const {okStatus, failStatus, warnStatus} = require('./status');

/**
 * Take the array of results returned from linting a sinlge file
 * and bucket them by passes/failures/warnings.
 * @param {!Object} data
 * @param {!string} data.file A path to a file.
 * @param {!Array} data.results An array of Rule results (pass/fail/warn).
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
