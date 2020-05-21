module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'payments'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'payments',
    cover: '/images/collections/payments.svg',
    title: 'Web Payments',
    updated: 'May 25, 2020',
    description: `Easy way to implement payments on the web.`,
    overview: `In this section you'll learn how to use Web Payments APIs.`,
    topics: [
      {
        title: 'Web Payments',
        pathItems: [
          'empowering-payment-apps-with-web-payments',
          'setting-up-a-payment-method',
        ],
      },
    ],
  },
};
