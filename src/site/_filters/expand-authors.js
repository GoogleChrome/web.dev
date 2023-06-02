const {i18n} = require('./i18n');

/**
 *
 * @param {string[]} authorSlugs
 * @param {Authors} authorsCollection
 * @param {string} [lang]
 * @returns
 */
module.exports = (authorSlugs = [], authorsCollection, lang) => {
  return authorSlugs
    .reduce((authors, authorKey) => {
      const profile = authorsCollection[authorKey];

      if (!profile) {
        console.log(`Cannot find author '${authorKey}' in authorsCollection`);
      } else if (profile.twitter) {
        authors.push(`@${profile.twitter}`);
      } else {
        authors.push(i18n(profile.title, lang));
      }

      return authors;
    }, [])
    .join(' | ');
};
