/**
 * @fileoverview A class to give all rules a consistent interface. Its main
 * goal is to ensure each rule exposes a `test()` method that can take variable
 * arguments, and that each rule exposes an `id` that will show up in the test
 * results.
 */

/**
 * @typedef {{
 *  id: string,
 *  status: string,
 *  message: string,
 *  actual?: string,
 *  expected?: string
 * }} TestResult
 */

class Rule {
  /**
   * @constructor
   * @param {!string} id A unique identifier for the rule.
   * @param {!Function} testFn The function to call as part of the test.
   */
  constructor(id, testFn) {
    this.id = id;
    this.testFn = testFn;
  }

  /**
   * A facade for running the test function and supplying its arguments.
   * @param {{file: string, frontMatter: Object, args: ?Array}} args
   * @return {TestResult}
   */
  test(args) {
    const result = this.testFn(args);
    result.id = this.id;
    return result;
  }
}

module.exports = Rule;
