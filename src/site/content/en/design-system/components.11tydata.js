module.exports = {
  eleventyComputed: {
    title: ({item}) => `${item.data.title} - web.dev Design System Component`,
    summary: ({item}) => item.data.summary || '',
  },
};
