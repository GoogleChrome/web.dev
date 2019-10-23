module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'notifications'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'notifications',
    cover: '/images/collections/notifications.svg',
    title: 'Notifications',
    updated: 'October 23, 2019',
    description: `Use push notifications to engage users`,
    overview: `In this section you'll learn how to create and send
    notifications. You'll add push capabilities to an app server, and use
    built-in APIs to subscribe to notifications, receive them from a server,
    and display them on screen.`,
    topics: [
      {
        title: 'Notifications',
        pathItems: [
          'use-push-notifications-to-engage-users',
          'codelab-notifications-get-started',
          'codelab-notifications-service-worker',
          'codelab-notifications-push-server'
        ],
      }
    ],
  },
};
