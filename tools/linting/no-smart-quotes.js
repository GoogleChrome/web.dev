const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');

module.exports = rule('remark-lint:no-smart-quotes', noSmartQuotes);

/* eslint-disable-next-line */
const reason = 'No smart quotes or apostrophes. Use a straight quote or apostrophe instead.';

/**
 * Walk the AST for the markdown file and find any smart quotes or apostrophes.
 * @param {*} tree An AST of the markdown file.
 * @param {*} file The markdown file.
 */
function noSmartQuotes(tree, file) {
  visit(tree, 'text', visitor);

  /* eslint-disable require-jsdoc */
  function visitor(node) {
    const lines = node.value.split('\n');
    let line;

    for (let index = 0; index < lines.length; index++) {
      line = lines[index].trim();
      if (line.match(/[“”‘’]/g)) {
        return file.message(reason, node);
      }
    }
  }
}
