const {html} = require('common-tags');

module.exports = ({page, hero, alt, heroPosition}) => {
  return html`
    <img
      class="w-hero ${heroPosition ? `w-hero--${heroPosition}` : ''}"
      src="${page.url + hero}"
      alt="${alt}"
    />
  `;
};
