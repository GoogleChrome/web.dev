// If a post contains a collection combine it with its file slug to create a
// permalink.
// If not, just return the file slug.
module.exports = (slug, collection) => {
  if (!collection) {
    return slug;
  }

  return `${collection}/${slug}`;
};
