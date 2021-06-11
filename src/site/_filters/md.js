const md = require('markdown-it')();

/**
 * Render content as inline markdown if single line, or full
 * markdown if multiline
 * @param {string?} content
 * @return {string|undefined}
 */
module.exports = (content) => {
  if (!content) {
    return;
  }

  return content.split('\n').length > 1
    ? md.render(content)
    : md.renderInline(content);
};
