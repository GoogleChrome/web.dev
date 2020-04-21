const path = require('path');
const recentPosts = require(`../../../../src/site/_collections/recent-posts`);

module.exports = function(config) {
  config.addCollection('recentPosts', recentPosts);

  return {
    dir: {
      input: path.join(__dirname, 'stubs'),
      output: path.join(__dirname, '.tmp'),
    },
  };
};
