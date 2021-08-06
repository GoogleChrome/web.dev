module.exports = {
  eleventyComputed: {
    title: ({item}) => `${item.data.title} - web.dev Design System Pattern`,
    summary: ({item}) => item.data.summary || '',
  },
};
