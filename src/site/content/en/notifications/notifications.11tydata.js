module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'notifications'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'notifications',
    cover: '/images/collections/notifications.svg',
    title: 'Notifications',
    description:
      'Notifications best practices',
    overview: `Implement notifications best pracs`,
    topics: [
      {
        title: 'Get started with the Notifications API',
        pathItems: [
          'codelab-notifications-api-get-started',
        ],
      },
    ],
  },
};
