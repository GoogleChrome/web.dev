const isMarkdownFile = new RegExp(/^.*\.(md|markdown)$/);

/**
 * @param {string} files A space separated list of file names.
 * @return {Array<string>} An array of markdown file names.
 */
module.exports = (files="") => {
  return files.split(' ').filter((file) => isMarkdownFile.test(file));
}