const path = require('path');
const postsWithLighthouse = require(`../../../../../src/site/_collections/posts-with-lighthouse`);
const recentBlogposts = require(`../../../../../src/site/_collections/recent-blogposts`);

module.exports = function(config) {
  // Order is important, as it uses the same collections object under the hood.
  // Keep the same order of calls as in /eleventy.js.
  config.addCollection('postsWithLighthouse', postsWithLighthouse);
  config.addCollection('recentBlogposts', recentBlogposts);

  return {
    dir: {
      output: path.join(__dirname, '.tmp'),
    },
  };
};
