module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'discoverable'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'discoverable',
    cover: '/images/collections/discoverable.svg',
    title: 'Easily discoverable',
    updated: 'August 23, 2019',
    description: 'Ensure users can find your site easily through search.',
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
    ],
  },
};
