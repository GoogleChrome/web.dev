const postsWithLighthouse = require(`../../../../src/site/_collections/posts-with-lighthouse`);

module.exports = function(config) {
  config.addCollection('postsWithLighthouse', postsWithLighthouse);
  return {
    dir: {
      input: './stubs',
      output: '.tmp',
    },
  };
};
