const path = require('path');
const site = require('../../_data/site');
const {html} = require('common-tags');

/* eslint-disable max-len */

module.exports = (learningPath) => {
  let linkText;
  if (learningPath.slug === 'blog') {
    linkText = learningPath.titleVariation;
  } else {
    linkText = learningPath.title;
  }

  return html`
    <ul class="w-breadcrumbs">
      <li class="w-breadcrumbs__crumb">
        <a
          class="w-breadcrumbs__link w-breadcrumbs__link--left-justify gc-analytics-event"
          data-category="web.dev"
          data-label="post, home breadcrumb"
          data-action="click"
          href="/"
        >
          ${site.titleVariation}
        </a>
      </li>
      <li class="w-breadcrumbs__crumb">
        <a
          class="w-breadcrumbs__link gc-analytics-event"
          data-category="web.dev"
          data-label="post, path breadcrumb"
          data-action="click"
          href=${path.join('/', learningPath.slug)}
        >
          ${linkText}
        </a>
      </li>
    </ul>
  `;
};
