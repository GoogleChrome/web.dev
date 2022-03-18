const patterns = require('../../_data/patterns').patterns;

/**
 * @fileoverview A component to display an interactive demo,
 * specified as part of a code pattern in /patterns/ directory,
 * as an iframe embed.
 */

/**
 * @param {string} patternId Id of the Code Pattern to be displayed.
 * @param {string} height Optional height of the widget with units, e.g. 100px.
 */
module.exports = (patternId, height) => {
  const pattern = patterns[patternId];
  if (!pattern) {
    return '';
  }
  return `<div class="widget">
      <iframe
        src="${pattern.demo}"
        title="Demo"
        height="${height}"
        loading="lazy"
        width="100%"
        scrolling="no"></iframe>
  </div>`;
};
