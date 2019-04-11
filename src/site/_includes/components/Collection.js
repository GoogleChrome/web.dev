const {html} = require('common-tags');

/**
 * Count the number of posts in a learning path.
 * @param {*} learningPath A learning path data object.
 * @return {number}
 */
function getPostCount(learningPath) {
  const count = learningPath.topics.reduce((guidesCount, topic) => {
    return guidesCount + topic.guides.length;
  }, 0);
  const label = count > 1 ? 'resources' : 'resource';
  return `${count} ${label}`;
}

module.exports = (path) => {
  return html`
    <a href="${path.url}" class="w-card">
      <div class="w-collection">
        <div class="w-collection__info">
          <ul class="w-collection__info-list">
            <li
              class="w-collection__info-listitem w-collection__info-listitem--category"
            >
              Collection
            </li>
            <li
              class="w-collection__info-listitem w-collection__info-listitem--more-info"
            >
              ${getPostCount(path)} resources
            </li>
            <li
              class="w-collection__info-listitem w-collection__info-listitem--updated"
            >
              Updated <time>${path.date}</time>
            </li>
          </ul>
        </div>
        <div class="w-collection__cover">
          <img class="w-collection__cover-image" src="${path.cover}" alt="" />
        </div>
        <div class="w-collection__desc">
          <h2 class="w-collection__headline">${path.title}</h2>
          <p class="w-collection__summary">
            ${path.description}
          </p>
        </div>
      </div>
    </a>
  `;
};
