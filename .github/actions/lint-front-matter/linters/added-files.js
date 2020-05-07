const core = require('@actions/core');
const getYamlFrontMatter = require('../utils/get-yaml-front-matter');
const tagsAreValid = require('../rules/tags-are-valid');
const urlMatchesTitle = require('../rules/url-matches-title');
const urlLength = require('../rules/url-length');
const sortResultsByStatus = require('../utils/sort-results-by-status');
const {SKIP_URL_LABEL} = require('../utils/constants');
const skipTagsTests = require('../utils/skip-tags-test');
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
  core.debug(`added-files linting ${files.length}: ${files}`);
  const skipTags = skipTagsTests();
  const skipUrls = skipUrlTests();
  const out = [];
  for (file of files) {
    core.debug(`added-files file: ${file}`);
    const results = [];
    const frontMatter = await getYamlFrontMatter(file);

    // Tests ---------------------------------------------------
    if (!skipUrls) {
      results.push(urlMatchesTitle.test(file, frontMatter));
      results.push(urlLength.test(file));
    }

    tagsAreValid
      .test(file, frontMatter, skipTags)
      .forEach((result) => results.push(result));
    // ---------------------------------------------------------

    const {passes, failures, warnings} = sortResultsByStatus(results);
    out.push({file, passes, failures, warnings});
  }
  return out;
};
