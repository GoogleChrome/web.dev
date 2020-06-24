const md = require('markdown-it')();

/**
 * Render content as inline markdown.
 * @param {string} content
 * @return {?string}
 */
module.exports = (content) => {
  if (!content) {
    return;
  }
  return md.renderInline(content);
};
