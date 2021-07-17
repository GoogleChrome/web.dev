const md = require('markdown-it')();

/**
 * Render content as inline markdown if single line, or full
 * markdown if multiline
 * @param {string} [content]
 * @param {import('markdown-it').Options} [opts]
 * @return {string|undefined}
 */
module.exports = (content, opts) => {
  if (!content) {
    return;
  }

  if (opts) {
    md.set(opts);
  }

  return content.split('\n').length > 1
    ? md.render(content)
    : md.renderInline(content);
};
