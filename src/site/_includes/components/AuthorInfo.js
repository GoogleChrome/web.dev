const {html} = require('common-tags');

/* eslint-disable require-jsdoc */

module.exports = (author, showSocialMedia=false) => {
  const fullName = `${author.name.given} ${author.name.family}`;

  function renderTwitter({twitter}) {
    return html`
      <li class="w-author__link-listitem">
        <a href="https://twitter.com/${twitter}">Twitter</a>
      </li>
    `;
  }

  function renderGitHub({github}) {
    return html`
      <li class="w-author__link-listitem">
        <a href="https://github.com/{${github}">GitHub</a>
      </li>
    `;
  }

  function renderGlitch({glitch}) {
    return html`
      <li class="w-author__link-listitem">
        <a href="https://glitch.com/@${glitch}">Glitch</a>
      </li>
    `;
  }

  function renderSocialMedia(author) {
    return html`
      <ul class="w-author__link-list">
        ${author.twitter && renderTwitter(author)}
        ${author.github && renderGitHub(author)}
        ${author.glitch && renderGlitch(author)}
      </ul>
    `;
  }

  return html`
    <div class="w-author__info">
      <cite class="w-author__name">${fullName}</cite>
      ${showSocialMedia && renderSocialMedia(author)}
      <time class="w-author__published">Jan 31, 2019</time>
    </div>
  `;
};
