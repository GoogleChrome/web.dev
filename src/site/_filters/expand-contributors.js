const contributors = require('../_data/contributors.json');

module.exports = (contributorSlugs = []) => {
  return contributorSlugs.map((slug) => contributors[slug]);
};
