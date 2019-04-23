const {html} = require('common-tags');
const path = require('path');
const stripLanguage = require('../../_filters/strip-language');

module.exports = ({page, hero, alt, heroPosition}) => {
  return html`
    <img
      class="w-hero ${heroPosition ? `w-hero--${heroPosition}` : ''}"
      src="${stripLanguage(path.join(page.url, hero))}"
      alt="${alt}"
    />
  `;
};
