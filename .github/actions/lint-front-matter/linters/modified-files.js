const getYamlFrontMatter = require('../utils/get-yaml-front-matter');
const hasProperty = require('../rules/has-property');
const updatedIsCurrent = require('../rules/updated-is-current');
const sortResultsByStatus = require('../utils/sort-results-by-status');

/**
 * Run all modified files through a set of rules.
 * @param {Array<string>} files Files that should be linted.
 * @return {Array<Object>} Results objects from each check.
 */
module.exports = async (files) => {
  const out = [];
  for (file of files) {
    const results = [];
    const frontMatter = await getYamlFrontMatter(file);

    // Tests ---------------------------------------------------
    results.push(hasProperty.test(frontMatter, 'updated'));
    results.push(updatedIsCurrent.test(frontMatter));
    // ---------------------------------------------------------

    const {passes, failures, warnings} = sortResultsByStatus(results);
    out.push({file, passes, failures, warnings});
  }
  return out;
};
