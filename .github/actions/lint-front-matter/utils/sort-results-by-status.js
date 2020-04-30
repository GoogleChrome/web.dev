const {okStatus, failStatus, warnStatus} = require('./status');

module.exports = (results) => {
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

  return {passes, failures, warnings};
};
