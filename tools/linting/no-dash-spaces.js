const rule = require('unified-lint-rule');
const visit = require('unist-util-visit');

module.exports = rule('remark-lint:no-dash-spaces', noDashSpaces);

/* eslint-disable-next-line */
const reason = 'No spaces around en or em dashes.';

/**
 * Walk the AST for the markdown file and find any en dashes or em dashes.
 * @param {*} tree An AST of the markdown file.
 * @param {*} file The markdown file.
 */
function noDashSpaces(tree, file) {
  visit(tree, 'text', visitor);

  /* eslint-disable require-jsdoc */
  function visitor(node) {
    const lines = node.value.split('\n');
    let line;

    for (let index = 0; index < lines.length; index++) {
      line = lines[index].trim();
      if (line.match(/\s—\s|\s–\s/g)) {
        return file.message(reason, node);
      }
    }
  }
}
