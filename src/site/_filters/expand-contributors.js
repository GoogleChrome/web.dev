const contributors = require('../_data/contributors');

module.exports = (contributorSlugs = []) => {
  return contributorSlugs.map((contributor) => {
    const profile = contributors[contributor];

    if (!profile) {
      throw new Error(
        `Author '${contributor}' does not exist in '_data/contributors.js'.`,
      );
    }

    if (profile.twitter) {
      return `@${profile.twitter}`;
    }

    return profile.title;
  });
};
