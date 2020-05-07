const core = require('@actions/core');
const getYamlFrontMatter = require('../utils/get-yaml-front-matter');
const tagsAreValid = require('../rules/tags-are-valid');
const urlMatchesTitle = require('../rules/url-matches-title');
const urlLength = require('../rules/url-length');
const sortResultsByStatus = require('../utils/sort-results-by-status');
const skipTagsTest = require('../utils/skip-tags-test');
const skipUrlsTest = require('../utils/skip-urls-test');

/**
 * Run all added files through a set of rules.
 * @param {Array<string>} files Files that should be linted.
 * @return {Array<Object>} Results objects from each check.
 */
module.exports = async (files) => {
  core.debug(`added-files linting ${files.length}: ${files}`);
  const skipTags = skipTagsTest();
  const skipUrls = skipUrlsTest();
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

    if (!skipTags) {
      results.push(tagsAreValid.test(frontMatter));
    }
    // ---------------------------------------------------------

    const {passes, failures, warnings} = sortResultsByStatus(results);
    out.push({file, passes, failures, warnings});
  }
  return out;
};
