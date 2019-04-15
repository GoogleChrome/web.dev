module.exports = (collection) => {
  return collection
    .getFilteredByTag('post')
    .reverse();
};
