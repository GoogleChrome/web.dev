module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      if (process.env.ELEVENTY_ENV === 'prod') {
        return false;
      } else {
        return (data.page.filePathStem + '.html').replace(/^\/en\//, '/');
      }
    },
  },
};