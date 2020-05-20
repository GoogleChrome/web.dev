/**
 * @typedef {import('../main').FileResults} FileResults
 * @typedef {import('../rules/rule').RuleResult} RuleResult
 */

/**
 * @typedef {{string, {passes: Array<RuleResult>, failures: Array<RuleResult>, warnings: Array<RuleResult>}}} CombinedResults
 */

/**
 * Returns a new object where each key is a file name, and the values are
 * the combined results of all of the rules that checked the file.
 * @param {Array<FileResults>} results
 * @return {Object}
 */
module.exports = (results) => {
  const out = {};
  for (result of results) {
    const {passes, failures, warnings} = result;
    const existing = out[result.file] || {
      passes: [],
      failures: [],
      warnings: [],
    };
    out[result.file] = {
      passes: [...existing.passes, ...passes],
      failures: [...existing.failures, ...failures],
      warnings: [...existing.warnings, ...warnings],
    };
  }
  return out;
};
