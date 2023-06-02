module.exports = function () {
  return {
    eleventyComputed: {
      layout: 'post',
      permalink: '/styleguide/{{page.fileSlug}}.html',
    },
  };
};
