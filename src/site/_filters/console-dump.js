// Use console.log while rendering nunjucks templates.
// e.g. {{ collections.blogPosts | consoleDump }}
// https://twitter.com/eleven_ty/status/1227229750747389952
// Note, this will be added by eleventy v0.11 but it's still nice to
// have our own version that we can use with the debugger.
module.exports = (values) => {
  // Uncomment the debugger statement below to use the debugger.
  // Then run `npm run debug:eleventy`
  // debugger;
  console.log(values);
};
