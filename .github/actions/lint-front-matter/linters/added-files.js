const getYamlFrontMatter = require('../utils/get-yaml-front-matter');
const checkUpdatedIsCurrent = require('../rules/updated-is-current');

/**
 * @param {Array<string>} files Files that should be linted.
 * @return {Array<string>} Error messages from failed lint rules.
 */
module.exports = async (files) => {
  const failures = [];
  for (file of files) {
    // The `updated` field is optional on newly added files
    // but if one is present, verify that it's current.
    const frontMatter = await getYamlFrontMatter(file);
    if (frontMatter.updated) {
      checkUpdatedIsCurrent(file, frontMatter, failures);
    }
  }
  return failures;
}