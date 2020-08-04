module.exports = (authorSlugs = [], authorsCollection) => {
  return authorSlugs
    .map((authorKey) => {
      const profile = authorsCollection[authorKey];

      if (!profile) {
        throw new Error(
          `Author '${authorKey}' does not exist in '_data/authorsData.json'.`,
        );
      }

      if (profile.twitter) {
        return `@${profile.twitter}`;
      }

      return profile.title;
    })
    .join(' | ');
};
