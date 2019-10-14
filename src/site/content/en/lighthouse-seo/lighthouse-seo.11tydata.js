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
        title: 'Make sure search engines understand your content',
        pathItems: [
          'document-title',
          'meta-description',
          'link-text',
          'hreflang',
          'canonical',
        ],
      },
      {
        title: 'Make sure search engines can crawl and index your page',
        pathItems: [
          'http-status-code',
          'is-crawable',
          'robots-txt',
          'plugins',
        ],
      },
      {
        title: 'Make your page mobile-friendly',
        pathItems: [
          'viewport',
          'font-size',
          'tap-targets',
        ],
      },
      {
        title: 'Things to check manually',
        pathItems: [
          'structured-data',
        ],
      },
    ],
  },
};
