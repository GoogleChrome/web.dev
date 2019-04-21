const {html} = require('common-tags');
const stripLanguage = require('../../_filters/strip-language');
const Author = require('./Author');

/* eslint-disable require-jsdoc,indent */

/**
 * PostCard used to preview posts.
 * @param {Object} post An eleventy collection item with post data.
 * @param {Object} author An author data object.
 * @return {string}
 */
module.exports = ({post, author}) => {
  const url = stripLanguage(post.url);
  const data = post.data;
  const hero = data && data.hero;

  function renderHero(post, url) {
    return html`
      <figure class="w-post-card__figure">
        <img class="w-post-card__image" src="${url + hero}" alt="${data.alt}" />
      </figure>
    `;
  }

  return html`
    <a href="${url}" class="w-card">
      <article class="w-post-card">
        <div
          class="w-post-card__cover ${hero && `w-post-card__cover--with-image`}"
        >
          ${hero && renderHero(post, url)}
          <h2
            class="${hero
              ? `w-post-card__headline--with-image`
              : `w-post-card__headline`}"
          >
            ${data.title}
          </h2>
          ${Author({post, author, avatar: data.author, small: true})}
        </div>
        <div class="w-post-card__desc">
          <p class="w-post-card__subhead">
            ${data.subhead}
          </p>
        </div>
      </article>
    </a>
  `;
};
