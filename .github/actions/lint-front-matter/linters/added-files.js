const getYamlFrontMatter = require('../utils/get-yaml-front-matter');
const urlMatchesTitle = require('../rules/url-matches-title');
const updatedIsCurrent = require('../rules/updated-is-current');
const urlLength = require('../rules/url-length');
const sortResultsByStatus = require('../utils/sort-results-by-status');
const {SKIP_URL_LABEL} = require('../utils/constants');
const github = require('@actions/github');

/**
 * Check if the url has been approved by the reviewer.
 * This is done through adding a label to the pull request.
 * @return {boolean}
 */
const skipUrlTests = () => {
  const context = github.context;
  return context.payload.pull_request.labels.some(
    (label) => label.name === SKIP_URL_LABEL,
  );
};

/**
 * Run all added files through a set of rules.
 * @param {Array<string>} files Files that should be linted.
 * @return {Array<Object>} Results objects from each check.
 */
module.exports = async (files) => {
  const out = [];
  for (file of files) {
    const results = [];
    const frontMatter = await getYamlFrontMatter(file);

    // Tests ---------------------------------------------------
    if (!skipUrlTests()) {
      results.push(urlMatchesTitle.test(file, frontMatter));
      results.push(urlLength.test(file));
    }

    // The `updated` field is optional on newly added files
    // but if one is present, verify that it's current.
    if (frontMatter.updated) {
      results.push(updatedIsCurrent.test(frontMatter));
    }
    // ---------------------------------------------------------

    const {passes, failures, warnings} = sortResultsByStatus(results);
    out.push({file, passes, failures, warnings});
  }
  return out;
};
