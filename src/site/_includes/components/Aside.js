const md = require('markdown-it')();

module.exports = (content, type='note') => {
  if (type === 'codelab') {
    content = `**Codelab**: ${content}`;
  }

  return `
<div class="w-aside w-aside--${type}">
${md.render(content)}
</div>
  `;
};
