const template = (items, symbol) => {
  let out = '';
  for (item of items) {
    const actual = item.actual || 'N/A';
    const expected = item.expected || 'N/A';
    out += `| ${symbol} ${item.message} | ${actual} | ${expected} |\n`;
  }
  return out;
};

/** @typedef {import('./combine-by-file').ResultsByFile} ResultsByFile */

/**
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
