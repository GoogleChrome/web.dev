module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'metrics'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'metrics',
    cover: '/images/collections/metrics.svg',
    title: 'Metrics',
    description: 'Measure and optimize performance and user experience',
    overview: `User-centric performance metrics are a critical tool in
      understanding and improving the experience of your site in a way that
      benefits real users.`,
    topics: [
      {
        title: 'Introduction',
        pathItems: ['user-centric-performance-metrics'],
      },
      {
        title: 'Important metrics to measure',
        pathItems: ['fcp', 'lcp', 'fid', 'tti', 'tbt', 'cls'],
      },
      {
        title: 'Define your own metrics',
        pathItems: ['custom-metrics'],
      },
    ],
  },
};
