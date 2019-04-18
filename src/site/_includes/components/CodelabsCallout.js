const {html} = require('common-tags');
const {findBySlug} = require('../../_filters/find-by-slug');
const stripLanguage = require('../../_filters/strip-language');

/* eslint-disable require-jsdoc */

module.exports = (slugs) => {
  // Coerce slugs to Array just in case someone pasted in a single slug string.
  slugs = slugs instanceof Array ? slugs : [slugs];

  const codelabs = slugs.map((slug) => findBySlug(slug));
  if (!codelabs.length) {
    /* eslint-disable-next-line */
    console.warn(`Did not find any matching codelabs.`);
    return;
  }

  function renderCodelab(codelab) {
    return html`
      <li class="w-codelabs-callout__listitem">
        <a
          class="w-codelabs-callout__link"
          href="${stripLanguage(codelab.url)}"
        >
          ${codelab.data.title}
        </a>
      </li>
    `;
  }

  return html`
    <div class="w-codelabs-callout">
      <div class="w-codelabs-callout__header">
        <h2 class="w-codelabs-callout__lockup">Codelabs</h2>
        <div class="w-codelabs-callout__headline">See it in action</div>
        <div class="w-codelabs-callout__blurb">
          Learn more and put this guide into action.
        </div>
      </div>
      <ul class="w-unstyled-list w-codelabs-callout__list">
        ${codelabs.map(renderCodelab)}
      </ul>
    </div>
  `;
};
