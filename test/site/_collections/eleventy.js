const path = require('path');
const postsWithLighthouse = require(`../../../src/site/_collections/posts-with-lighthouse`);
const recentPosts = require(`../../../src/site/_collections/recent-posts`);


module.exports = function(config) {
  config.addCollection('postsWithLighthouse', postsWithLighthouse);
  config.addCollection('recentPosts', recentPosts);

  return {
    dir: {
      output: path.join(__dirname, '.tmp'),
    },
  };
};
