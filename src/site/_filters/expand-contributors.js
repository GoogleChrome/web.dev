module.exports = (contributorSlugs = [], authorsCollection) => {
  return contributorSlugs
    .map((contributor) => {
      const profile = authorsCollection[contributor];

      if (!profile) {
        throw new Error(
          `Author '${contributor}' does not exist in '_data/contributors.json'.`,
        );
      }

      if (profile.twitter) {
        return `@${profile.twitter}`;
      }

      return profile.title;
    })
    .join(' | ');
};
