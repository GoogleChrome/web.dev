/**
 * @fileoverview Utility to fetch and return frontmatter.
 */

const fs = require('fs').promises;
const yaml = require('yaml-front-matter');

/**
 * @param {!string} file A path to a file.
 * @return {{file: string, frontMatter: Object}}
 */
module.exports = async (file) => {
  const content = await fs.readFile(file, 'utf-8');
  const frontMatter = await yaml.loadFront(content);
  return {file, frontMatter};
};
