const {html} = require('common-tags');

/* eslint-disable require-jsdoc */

module.exports = ({back, backLabel, forward, forwardLabel}) => {
  function renderBack(link, label) {
    return html`
      <a
        class="w-article-navigation__link w-article-navigation__link--back"
        href="${link}"
      >
        ${label}
      </a>
    `;
  }

  function renderForward(link, label) {
    return html`
      <a
        class="w-article-navigation__link w-article-navigation__link--forward"
        href="${link}"
      >
        <div class="w-article-navigation__column">
          <h3 class="w-article-navigation__heading">Next article</h3>
          ${label}
        </div>
      </a>
    `;
  }

  return html`
    <nav class="w-article-navigation">
      ${back && backLabel && renderBack(back, backLabel)}
      ${forward && forwardLabel && renderForward(forward, forwardLabel)}
    </nav>
  `;
};
