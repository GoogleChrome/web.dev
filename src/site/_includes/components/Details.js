const {Details} = require('webdev-infra/shortcodes/Details');
const {DetailsSummary} = require('webdev-infra/shortcodes/DetailsSummary');
const md = require('markdown-it')();
const cheerio = require('cheerio');

/**
 * @this {Object}
 * @param {*} content
 * @param {*} state
 * @returns
 */
function DetailsAlt(content, state) {
  if (!this.ctx.export) {
    return Details(content, state);
  }

  // Parse content to DOM, to pluck out a potential DetailsSummary/h*.showalways element
  // and move it out of the actual content div
  const $ = cheerio.load(`<div id="content">${content}</div>`);

  const $summary = $('div.showalways');
  let summary = '';
  if ($summary) {
    // The summary can have a heading element, and a preview sentence, which need
    // to be rendered as markdown, independently
    const $heading = $summary.find('.inline');
    $heading.html(md.renderInline($heading.html()));

    const $preview = $summary.find('.block');
    if ($preview.length) {
      $preview.html(md.renderInline($preview.html()));
    }

    summary = $summary.prop('outerHTML');
    $('#content').html($('#content').html().replace(summary, ''));
  }

  $('#content').html(md.render($('#content').html()));

  const computedState = state === 'open' ? 'expanded' : '';
  return `
<div>
  <devsite-expandable ${computedState} class="arrow-icon">
    ${summary}
    <div>${$('#content').html()}</div>
  </devsite-expandable>
</div>`;
}

/**
 * @this {Object}
 * @param {*} content
 * @param {*} headingLevel
 * @returns
 */
function DetailsSummaryAlt(content, headingLevel = 'h2') {
  if (!this.ctx.export) {
    return DetailsSummary(content, headingLevel);
  }

  // The heading level is actually ignored in the original implementation

  const lines = content.trim().split('\n');
  const heading = lines.shift();

  content = lines.length ? lines.join('\n') : '';

  // Just return the plain text content here as rendering markdown will cause
  // weird escaping issues - Markdown is rendered in `Details`, once the DOM
  // has been ordered in a DevSite compatible way
  return `<div class="showalways">
    <div class="inline">${heading}</div>
    ${content ? `<div class="block">${content}</div>` : ''}
</div>`;
}

module.exports = {Details: DetailsAlt, DetailsSummary: DetailsSummaryAlt};
