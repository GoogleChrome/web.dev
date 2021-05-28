module.exports = (authorSlugs = [], authorsCollection) => {
  return authorSlugs
    .reduce((authors, authorKey) => {
      const profile = authorsCollection[authorKey];

      if (!profile) {
        console.log(`Author '${authorKey}'pages`);
      } else if (profile.twitter) {
        authors.push(`@${profile.twitter}`);
      } else {
        authors.push(profile.title);
      }

      return authors;
    }, [])
    .join(' | ');
};
