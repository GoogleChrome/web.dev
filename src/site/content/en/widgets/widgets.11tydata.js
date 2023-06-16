module.exports = function () {
  return {
    eleventyComputed: {
      layout: 'post',
      permalink: '/widgets/{{page.fileSlug}}.html',
    },
  };
};
