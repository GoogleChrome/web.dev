const md = require('markdown-it')();

/**
 * Render content as inline markdown.
 * @param {string?} content
 * @return {string|undefined}
 */
module.exports = (content) => {
  if (!content) {
    return undefined;
  }
  return md.renderInline(content);
};
