// Return the three most recent blog posts.
module.exports = (collection) => {
  return collection
    .getFilteredByTag('post')
    .reverse()
    .slice(0, 3);
};
