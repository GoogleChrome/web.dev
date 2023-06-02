const {Details} = require('webdev-infra/shortcodes/Details');
const {DetailsSummary} = require('webdev-infra/shortcodes/DetailsSummary');

function DetailsAlt(content, state) {
  if (!process.env.ALT_BUILD) {
    return Details(content, state);
  }

  const stateOverride = state === 'open' ? 'expanded' : '';
  // Whitespace is intentional to allow markdown parser to kick back in.
  return `
<div>
  <devsite-expandable ${stateOverride} class="arrow-icon">
    ${content}
  </devsite-expandable>
</div>`;
}

function DetailsSummaryAlt(content, state) {
  if (!process.env.ALT_BUILD) {
    return DetailsSummary(content, state);
  }

  const stateOverride = state === 'open' ? 'expanded' : '';
  // Whitespace is intentional to allow markdown parser to kick back in.
  return `<devsite-expandable ${stateOverride}>
${content}
</devsite-expandable>`;
}

module.exports = {Details: DetailsAlt, DetailsSummary: DetailsSummaryAlt};
