const Prism = require('prismjs');
const patterns = require('../../_data/patterns').patterns;

/**
 * @fileoverview A component to display code samples, organized in tabs,
 *   and a code demo side-by-side.
 */

/**
 * Height of a one line of code, in px. Used to calculate the default height
 *   of the component.
 */
const lineHeight = 24;

/**
 * Margin of the <pre> element, in px. Used to calculate the default height
 *   of the component.
 */
const preMargin = 2 * 16;

/**
 * Tab list height, in px. Used to calculate the default height
 *   of the component.
 */
const tabListHeight = 54;

/**
 * A component to display code samples and a code demo side-by-side.
 * @param {string} patternId Id of the Code Pattern to be displayed.
 * @param {number} height Optional desired height of the demo frame.
 */
module.exports = (patternId, height) => {
  const pattern = patterns[patternId];
  if (!pattern) {
    return '';
  }
  const prismTypes = ['html', 'css', 'js'];
  const assetLines = [];
  const assets = Object.values(pattern.assets)
    .map((asset) => {
      const type = prismTypes.includes(asset.type) ? asset.type : 'text';
      assetLines.push(asset.content.split('\n').length);
      const content = Prism.highlight(
        asset.content,
        Prism.languages[type],
        type,
      );
      return `<web-tab title="${asset.type}" data-label="${asset.type}">
          <pre><code class="language-${asset.type}">${content}</code></pre>
        </web-tab>`;
    })
    .join('\n');

  const defaultHeight =
    Math.max(...assetLines) * lineHeight + preMargin + tabListHeight;
  height = height || pattern.height || defaultHeight;

  return `<div class="code-pattern">
    <div class="code-pattern__content">
      <div class="code-pattern__demo" style="min-height: ${height}px">
        <iframe src="${pattern.demo}" title="Demo" height="${height}"></iframe>
      </div>
      <div class="code-pattern__assets" style="height: ${height}px">
        <web-tabs>${assets}</web-tabs>
      </div>
    </div>
    <div class="code-pattern__meta">
      <a
        href="${pattern.demo}"
        target="_blank"
        class="code-pattern__icon"
        data-icon="open_in_new"
      >Open demo</a>
    </div>
  </div>`;
};
