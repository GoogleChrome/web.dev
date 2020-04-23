module.exports = class MockCollection {
  constructor(items) {
    this.items = items;
  }

  getAll() {
    return this.items;
  }

  getFilteredByGlob() {
    return this.items;
  }

  getFilteredByTag() {
    return this.items;
  }

  getFilteredByTags() {
    return this.items;
  }
};
