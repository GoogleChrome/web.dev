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
    description: `Build the next generation of payments on the web.`,
    overview: `Build the next generation of payments on the web.`,
    overview: `Web Payments aims to provide frictionless payment experience on the web. Learn how it works, its benefits, and get ready to integrate your payment app with Web Payments.`,
    topics: [
      {
        title: 'How payment apps integrate with Web Payments',
        pathItems: [
          'empowering-payment-apps-with-web-payments',
          'life-of-a-payment-transaction',
          'setting-up-a-payment-method',
        ],
      },
      {
        title: 'Build a native payment app',
        pathItems: ['android-payment-apps-overview'],
      },
    ],
  },
};
