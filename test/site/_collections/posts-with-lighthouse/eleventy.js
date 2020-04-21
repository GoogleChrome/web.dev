const path = require('path');
const postsWithLighthouse = require(`../../../../src/site/_collections/posts-with-lighthouse`);

module.exports = function(config) {
  config.addCollection('postsWithLighthouse', postsWithLighthouse);

  return {
    dir: {
      input: path.join(__dirname, 'stubs'),
      output: path.join(__dirname, '.tmp'),
    },
  };
};
