const {html} = require('common-tags');
const stripLanguage = require('../../_filters/strip-language');
const Author = require('./Author');

/* eslint-disable require-jsdoc,indent */

/**
 * Article card used on blog landing page.
 * @param {*} post
 * @param {*} author
 * @return {string}
 */
module.exports = ({post, author}) => {
  const url = stripLanguage(post.url);
  const data = post.data;
  const hero = data && data.hero;

  function renderHero(post, url) {
    return html`
      <figure class="w-article__figure">
        <img
          class="w-article__image"
          src="${url + hero}"
          alt="${data.alt}"
        />
      </figure>
    `;
  }

  return html`
    <a href="${url}" class="w-card">
      <article class="w-article">
        <div class="w-article__cover ${hero && `w-article__cover--with-image`}">
          ${hero && renderHero(post, url)}
          <h2
            class="${hero
              ? `w-article__headline--with-image`
              : `w-article__headline`}"
          >
            ${data.title}
          </h2>
          ${Author({post, author, avatar: data.author, small: true})}
        </div>
        <div class="w-article__desc">
          <p class="w-article__summary">
            ${data.description}
          </p>
        </div>
      </article>
    </a>
  `;
};
