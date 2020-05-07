/**
 * @fileoverview A class to give all rules a consistent interface. Its main
 * goal is to ensure each rule exposes a `test()` method that can take variable
 * arguments, and that each rule exposes an `id` that will show up in the test
 * results.
 */

class Rule {
  constructor(id, testFn) {
    this.id = id;
    this.testFn = testFn;
  }

  test(...args) {
    const result = this.testFn(...args);
    result.id = this.id;
    return result;
  }
}

module.exports = Rule;
