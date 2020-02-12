const contributors = require("../_data/contributors");

module.exports = (contributorSlugs = []) => {
  const profiles = contributorSlugs.map((slug) => contributors[slug]);
  return profiles.map((profile) => {
    if (profile.twitter) {
      return `@${profile.twitter}`;
    }
    return `${profile.name.given} ${profile.name.family}`;
  });
};
