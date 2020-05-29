module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'notifications'],
  path: {
    slug: 'push-notifications',
    cover: '/images/collections/reliable.svg',
    title: 'Push notifications',
    updated: 'May 24, 2018',
    description: 'description',
    overview: 'overview',
    topics: [
      {
        title: 'Understand push notifications',
        pathItems: [
          'how-push-notifications-work',
          'the-business-case-for-push-notifications',
        ],
      },
      {
        title: 'Implement push notifications',
        pathItems: [
          'request-permission-to-send-push-notifications',
          'subscribe-users-to-push-notifications',
          'send-push-notifications',
          'receive-push-notifications',
          'measure-push-notification-roi',
        ],
      },
    ],
  },
};
