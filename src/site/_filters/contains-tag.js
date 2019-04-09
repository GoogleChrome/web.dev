// Check to see if the post contains a specific tag.
module.exports = (post, tags) => {
  return (
    post.data.tags &&
    tags.filter((tag) => post.data.tags.indexOf(tag) > -1).length > 0
  );
};
