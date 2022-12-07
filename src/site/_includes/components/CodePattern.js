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

      // Jake says:
      // Because Prism outputs preformatted code, it will often contain blank
      // lines, eg if the source contains blank lines. Unfortunately the
      // markdown parser sees that as "the HTML has ended, process as markdown".
      // This results in lots of malformed HTML that may appear fine in dev,
      // but may appear differently once the minifier has chewed through it.
      // To avoid this, 'blank lines' (which in markdown-speak can include
      // whitespace) are replaced with an empty span, followed by any
      // whitespace. The span is not an empty line in markdown-speak, so it
      // continues to defer to HTML source.
      const content = Prism.highlight(
        asset.content,
        Prism.languages[type],
        type,
      ).replace(/^(\s*?)$/gm, '<span></span>$1');

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
        <iframe src="${pattern.demo}" title="Demo" height="${height}" loading="lazy"></iframe>
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
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>Open demo
      </a>
    </div>
  </div>`;
};
