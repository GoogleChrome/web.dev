module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'lighthouse-seo'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'lighthouse-seo',
    cover: '/images/collections/lighthouse-seo.svg',
    title: 'SEO audits',
    description:
      'How well can search engines understand your content?',
    overview: `These checks ensure that your page is optimized
    for search engine results ranking.`,
    topics: [
      {
        title: 'Content best practices',
        pathItems: [
          'meta-description',
          'link-text',
          'hreflang',
          'canonical',
          'plugins',
        ],
      },
      {
        title: 'Mobile friendly',
        pathItems: [
          'font-size',
          'tap-targets',
        ],
      },
      {
        title: 'Crawling and indexing',
        pathItems: [
          'http-status-code',
          'is-crawable',
          'robots-txt',
        ],
      },
      {
        title: 'Additional items to manually check',
        pathItems: [
          'structured-data',
        ],
      },
    ],
  },
};
