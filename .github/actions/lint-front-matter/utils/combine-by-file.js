/**
 * @fileoverview Combine results into an object keyed by filenames.
 */

/**
 * @typedef {import('../main').TestResults} TestResults
 * @typedef {import('../rules/rule').TestResult} TestResult
 */

/**
 * @typedef {{[key: string]: {passes: Array<TestResult>, failures: Array<TestResult>, warnings: Array<TestResult>}}} ResultsByFile
 */

/**
 * Returns a new object where each key is a file name, and the values are
 * the combined results of all of the rules that checked the file.
 * @param {Array<TestResults>} results
 * @return {ResultsByFile}
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
