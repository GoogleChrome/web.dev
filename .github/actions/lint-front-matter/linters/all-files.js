const getYamlFrontMatter = require('../utils/get-yaml-front-matter.js.js');
const checkHasProperty = require('../rules/has-property.js/index.js.js');

/**
 * @param {Array<string>} files Files that should be linted.
 * @return {Array<string>} Error messages from failed lint rules.
 */
module.exports = async (files) => {
  const failures = [];
  for (file of files) {
    const frontMatter = await getYamlFrontMatter(file)
    checkHasProperty(file, frontMatter, 'date', failures);
  }
  return failures;
};