// If a post is part of a learning path combine it with its file slug to create
// a permalink. If not, just return the file slug.
module.exports = (slug, path) => {
  if (!path) {
    return slug;
  }

  return `${path}/${slug}`;
};
