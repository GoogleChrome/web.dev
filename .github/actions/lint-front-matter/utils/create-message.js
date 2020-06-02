/** @typedef {import('../rules/rule').TestResult} TestResult */
/** @typedef {import('./combine-by-file').ResultsByFile} ResultsByFile */

/**
 * Create markdown table rows from an array of test results.
 * @param {Array<TestResult>} items
 * @param {string} prefix A prefix to put in front of the output message.
 * Usually this is an emoji to signify a pass/fail/warning.
 * @return {string}
 */
const template = (items, prefix) => {
  let out = '';
  for (item of items) {
    const actual = item.actual || 'N/A';
    const expected = item.expected || 'N/A';
    out += `| ${prefix} ${item.message} | ${actual} | ${expected} |\n`;
  }
  return out;
};

/**
 * Create a markdown table with rows for failures and warnings.
 * @param {ResultsByFile} files
 * @return {string}
 */
module.exports = (files) => {
  const messages = [];

  for (const [file, results] of Object.entries(files)) {
    let message = '';
    const {failures, warnings} = results;
    if (!failures.length && !warnings.length) {
      continue;
    }

    message += `:file_folder: **${file}**\n`;
    message += `| Rules  | Actual | Expected |\n`;
    message += `| ----- | :---: | :---: |\n`;

    if (failures.length) {
      message += template(failures, ':x:');
    }

    if (warnings.length) {
      message += template(warnings, ':warning:');
    }

    messages.push(message);
  }

  if (!messages.length) {
    return ':white_check_mark: All YAML lint tests passed!';
  } else {
    return messages.join('\n---\n');
  }
};
