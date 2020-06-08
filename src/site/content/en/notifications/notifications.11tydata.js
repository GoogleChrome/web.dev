module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'notifications'],
  path: {
    draft: true,
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'notifications',
    cover: '',
    title: 'Notifications',
    updated: 'May 24, 2018',
    description: 'Notifications',
    overview: 'Notifications',
    topics: [
      {
        title: 'Notifications',
        pathItems: ['codelab-notifications-get-started'],
      },
    ],
  },
};
