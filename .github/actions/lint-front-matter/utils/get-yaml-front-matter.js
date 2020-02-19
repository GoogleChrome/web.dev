const fs = require('fs').promises;
const yaml = require('yaml-front-matter');

/**
 * @param {string} file A path to a file.
 * @return {Object} The parsed YAML front matter from the file.
 */
module.exports = async (file) => {
  const content = await fs.readFile(file, 'utf-8');
  return yaml.loadFront(content);
};