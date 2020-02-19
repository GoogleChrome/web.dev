/**
 * @param {string} file Filename of the file being linted.
 * @param {Object} yaml The yaml front matter from the file.
 * @param {?string} yaml.updated The updated property in the yaml front matter.
 * @param {Array<string>} failures Error messages from failed lint checks.
 */
module.exports = (file, {updated}, failures) => {
  // If updated is undefined, just return early.
  // Rather than error here, let another lint rule that explicitly checks for
  // the presence of the updated property handle it.
  if (!updated) {
    return;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (today.getTime() > new Date(updated).getTime()) {
    failures.push(`${file} updated field is out of date. It must be at least ${today.toISOString().split('T')[0]}.`);
  }
}