const {html} = require('common-tags');
const stripLanguage = require('../../_filters/strip-language');
const Author = require('./Author');

/* eslint-disable require-jsdoc,indent */

/**
 * Smaller article card used on home and learn pages.
 * @param {*} post
 * @param {*} author
 * @return {string}
 */
module.exports = ({post, author}) => {
  const url = stripLanguage(post.url);
  const data = post.data;
  const hero = data.hero;

  function renderHero(post, url) {
    return html`
      <figure class="w-article__figure">
        <img
          class="w-article__image--small"
          src="${url + post.data.hero}"
          alt="${post.data.alt}"
        />
      </figure>
    `;
  }

  return html`
    <a href="${url}" class="w-card w-card--raised">
      <article class="w-article w-article--small">
        <div
          class="w-article__cover ${hero
            ? `w-article__cover--with-image-small`
            : `w-article__cover--small`}"
        >
          ${hero && renderHero(post, url)}
          <h3
            class="w-article__headline ${hero
              ? `w-article__headline--with-image-small`
              : `w-article__headline--small`}"
          >
            ${data.title}
          </h3>
        </div>

        ${Author({author: author, avatar: data.author, small: true})}
      </article>
    </a>
  `;
};
