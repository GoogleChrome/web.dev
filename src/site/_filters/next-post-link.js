const paths = require('../_data/learn').paths;

/* eslint-disable require-jsdoc */

function getGuidesFromTopics(topics) {
  return topics.reduce((guides, topic) => guides.concat(topic.guides), []);
}

module.exports = (slug, pathName) => {
  const path = paths[pathName];
  if (!path) {
    /* eslint-disable-next-line */
    console.warn(`Could not find path: ${pathName}`);
    return;
  }

  const posts = getGuidesFromTopics(path.topics);
  const idx = posts.indexOf(slug);
  if (path[idx + 1]) {
    return path[idx + 1];
  }
};
