module.exports = {
  eleventyComputed: {
    title: ({item}) => `${item.title} - web.dev Design System Page`,
    summary: ({item}) => item.summary || '',
  },
};
