const core = require('@actions/core');
const getYamlFrontMatter = require('../utils/get-yaml-front-matter');
const hasProperty = require('../rules/has-property');
const hasAltText = require('../rules/has-alt-text');
const sortResultsByStatus = require('../utils/sort-results-by-status');

/**
 * Run all files through a set of rules.
 * @param {Array<string>} files Files that should be linted.
 * @return {Array<Object>} Results objects from each check.
 */
module.exports = async (files) => {
  core.debug(`all-files linting ${files.length}: ${files}`);
  const out = [];
  for (file of files) {
    core.debug(`all-files file: ${file}`);
    const results = [];

    const frontMatter = await getYamlFrontMatter(file);

    // Tests ---------------------------------------------------
    results.push(hasProperty.test(frontMatter, 'date'));
    results.push(hasAltText.test(frontMatter));
    // ---------------------------------------------------------

    const {passes, failures, warnings} = sortResultsByStatus(results);
    out.push({file, passes, failures, warnings});
  }
  return out;
};
