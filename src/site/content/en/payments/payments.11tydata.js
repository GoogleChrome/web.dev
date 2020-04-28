module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'payments'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'secure',
    cover: '/images/collections/secure.svg',
    title: 'Payments',
    updated: 'May 1, 2020',
    description: `Ensure your site and your users' data is secure.`,
    overview: `Every website is vulnerable to attack—not just those handling
    sensitive data. In this section you'll learn simple techniques to keep your
    users, your content and your business secure.`,
    topics: [
      {
        title: 'Building a payment app using the Web Payments',
        pathItems: ['setting-up-a-payment-method'],
      },
    ],
  },
};
