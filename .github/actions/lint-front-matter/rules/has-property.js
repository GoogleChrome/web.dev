/**
 * @param {string} file Filename of the file being linted.
 * @param {Object} yaml The yaml front matter from the file.
 * @param {string} property The name of the property to check for.
 * @param {Array<string>} failures Error messages from failed lint checks.
 */
module.exports = (file, yaml, property, failures) => {
  if (!(property in yaml)) {
    failures.push(`${file} is missing its ${property} field.`);
  }
}