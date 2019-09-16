const md = require("markdown-it")();

module.exports = (content) => {
  if (!content) {
    return;
  }
  return md.renderInline(content);
};
