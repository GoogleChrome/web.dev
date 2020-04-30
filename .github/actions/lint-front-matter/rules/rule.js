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
