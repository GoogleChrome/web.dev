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

  let inline = !content.includes('\n');

  // If there's quite a bit of content, we want to make sure
  // it's marked up for readability purposes
  if (inline && content.length > 200) {
    inline = false;
  }

  return inline ? md.renderInline(content) : md.render(content);
};
