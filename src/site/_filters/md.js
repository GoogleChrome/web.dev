const md = require('markdown-it')();

/**
 * Render content as inline markdown.
 * @param {string} content
 * @return {string|undefined}
 */
module.exports = (content) => {
  return content ? md.renderInline(content) : undefined;
};
