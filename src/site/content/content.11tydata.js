const outputPermalink = require('../../build/output-permalink');

module.exports = {
  eleventyComputed: {
    permalink: (data) => outputPermalink(data),
  },
};
