module.exports = function () {
  return {
    eleventyComputed: {
      permalink: (data) => {
        if (process.env.ELEVENTY_ENV === 'prod') {
          return false;
        }

        // I'm not sure why the output-permalinks.js eleventyComputed function
        // isn't stripping this for me, maybe it has to do with the order that
        // eleventy runs these in. But it's not a big deal as this is a short
        // lived 11tydata.js file that we're going to remove when the course
        // ships.
        return (data.page.filePathStem + '.html').replace(/^\/en\//, '/');
      },
    },
  };
};
