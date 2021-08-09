const {html} = require('common-tags');
const Prism = require('prismjs');

module.exports = () => {
  // Temporarily use a hardcoded pattern data.
  const pattern = {
    id: 'example-pattern',
    layout: 'pattern',
    title: 'An example pattern in a suite',
    description: 'A description for the example pattern',
    content: '<h2>An example pattern in a suites</h2>',
    assets: {
      'body.html': {
        content: '<h1>Hello</h1>',
        type: 'html',
      },
      'script.js': {
        content: 'document.write("hello")',
        type: 'js',
      },
      'style.css': {
        content: 'background: red;',
        type: 'css',
      },
    },
    demo: '/patterns/example-pattern/demo.html',
    suite: '/patterns/',
  };

  const prismTypes = ['html', 'css', 'js'];

  const assets = Object.values(pattern.assets)
    .map((asset) => {
      const type = prismTypes.includes(asset.type)
        ? asset.type
        : 'text';
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
    <div class="code-pattern__content">
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
