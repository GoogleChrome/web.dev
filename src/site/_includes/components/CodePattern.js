const {html} = require('common-tags');
const Prism = require('prismjs');
const patterns = require('../../_data/patterns')();

module.exports = (patternId, height = 300) => {
  const pattern = patterns[patternId];
  if (!pattern) {
    return '';
  }
  const prismTypes = ['html', 'css', 'js'];
  const assets = Object.values(pattern.assets)
    .map((asset) => {
      const type = prismTypes.includes(asset.type) ? asset.type : 'text';
      const content = Prism.highlight(
        asset.content,
        Prism.languages[type],
        type,
      );
      return html`
        <web-tab title="${asset.type}" data-label="${asset.type}">
          <pre><code class="language-${asset.type}">${content}</code></pre>
        </web-tab>
      `;
    })
    .join('\n');

  return html`<div class="code-pattern flow flow-space-400">
    <div class="code-pattern__content" style="height: ${height}px;">
      <div class="code-pattern__demo">
        <iframe src="${pattern.demo}" title="Demo"></iframe>
      </div>
      <div class="code-pattern__assets">
        <web-tabs>${assets}</web-tabs>
      </div>
    </div>
    <div class="code-pattern__meta">
      <a href="${pattern.demo}" target="_blank">
        <button
          class="w-button w-button--with-icon w-button--primary"
          data-icon="open_in_new"
        >
          Open demo
        </button>
      </a>
    </div>
  </div>`;
};
