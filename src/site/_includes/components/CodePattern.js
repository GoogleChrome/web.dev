// const patterns = require('../_data/patterns')();
// const {getPattern} = require('../../_filters/patterns');
const { html } = require('common-tags');
const Prism = require('prismjs');

const pattern = {
  id: 'example-pattern-suite/example-pattern',
  layout: 'pattern',
  title: 'An example pattern in a suite',
  description: 'A description for the example pattern in a suite',
  content: '<h2>An example pattern in a suites</h2>\n' +
    '<p>Body of the example pattern in a suite</p>\n',
  assets: {
    'body.html': {
      content: '<h1>Hello</h1>',
      type: 'html'
    },
    'script.js': {
      content: 'document.write("hello")',
      type: 'js'
    },
    'style.css': {
      content: 'background: red;',
      type: 'csss'
    }
  },
  demo: '/patterns/example-pattern-suite/example-pattern/demo.html',
  suite: '/patterns/example-pattern-suite/'
};

module.exports = (id) => {
  // const pattern = getPattern(id, patterns);
  const assets = Object.values(pattern.assets).map(asset => {
    const content = Prism.highlight(asset.content, Prism.languages.html, 'html');

    return html`
    <web-tab title="${ asset.type }">
      <pre>
        <code class="language-${asset.type}">${ content }</code>
      </pre>
    </web-tab>
    `;
  }).join('\n');

  return html`<div class="code-pattern flow flow-space-400">
  <div class="code-pattern__content">
    <div class="code-pattern__demo">
      <iframe src="${pattern.demo}"></iframe>
    </div>
    <div class="code-pattern__assets">
      <web-tabs>
        ${assets}
      </web-tabs>
    </div>
  </div>
  <div class="code-pattern__meta">
    <a href="${pattern.demo}" target="_blank">
      <button class="w-button w-button--with-icon w-button--primary" data-icon="open_in_new">Open demo</button>
    </a>
  </div>
</div>`;
};
