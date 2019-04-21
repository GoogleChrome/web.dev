const {html} = require('common-tags');

/* eslint-disable max-len */

/**
 * Count the number of posts in a learning path.
 * @param {*} learningPath A learning path data object.
 * @return {number}
 */
function getPostCount(learningPath) {
  const count = learningPath.topics.reduce((pathItemsCount, topic) => {
    return pathItemsCount + topic.pathItems.length;
  }, 0);
  const label = count > 1 ? 'resources' : 'resource';
  return `${count} ${label}`;
}

/**
 * PathCard used to preview learning paths.
 * @param {Object} path A learning path data object.
 * @return {string}
 */
module.exports = (path) => {
  return html`
    <a href="/${path.slug}" class="w-card" role="listitem">
      <div class="w-path-card">
        <div class="w-path-card__info">
          <ul class="w-path-card__info-list">
            <li
              class="w-path-card__info-listitem w-path-card__info-listitem--category"
            >
              Collection
            </li>
            <li
              class="w-path-card__info-listitem w-path-card__info-listitem--more-info"
            >
              ${getPostCount(path)} resources
            </li>
            <li
              class="w-path-card__info-listitem w-path-card__info-listitem--updated"
            >
              Updated <time>${path.date}</time>
            </li>
          </ul>
        </div>
        <div class="w-path-card__cover">
          <img class="w-path-card__cover-image" src="${path.cover}" alt="" />
        </div>
        <div class="w-path-card__desc">
          <h2 class="w-path-card__headline">${path.title}</h2>
          <p class="w-path-card__subhead">
            ${path.description}
          </p>
        </div>
      </div>
    </a>
  `;
};
