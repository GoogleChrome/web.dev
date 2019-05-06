module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'discoverable'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'discoverable',
    cover: '/images/collections/discoverable.svg',
    title: 'Easily discoverable',
    updated: 'May 24, 2018',
    description: `Ensure users can find your site easily through search.`,
    overview: `Making your content discoverable matters because it's how you get
    more relevant users viewing your content. If a search engine has trouble
    seeing your page, you're possibly missing out on a source of traffic.

    By making sure search engines can find and automatically understand your
    content, you are improving the visibility of your site for relevant
    searches. This is called SEO, or search engine optimization, which can
    result in more interested users coming to your site. Audit your site and
    check the SEO results to see how well search engines can surface your
    content.`,
    topics: [
      {
        title: 'How search works and how to measure discoverability',
        pathItems: ['how-search-works', 'pass-lighthouse-seo-audit'],
      },
      {
        title: 'Make sure search engines can understand your content',
        pathItems: [
          'write-descriptive-text',
          'tell-search-translated-pages-equal',
          'tell-search-engine-canonical-url',
        ],
      },
      {
        title: 'Make sure search engines can crawl and index your page',
        pathItems: [
          'remove-code-blocking-indexing',
          'fix-http-status-codes',
          'remove-browser-plugins',
          'fix-robot-errors',
        ],
      },
      {
        title: 'Make sure your page is mobile-friendly',
        pathItems: ['fix-small-fonts', 'fix-viewport-tag'],
      },
    ],
  },
};
