module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'sandbox'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'sandbox',
    title: 'Sandbox',
    updated: 'Jun 24, 2019',
    description: 'Instructions for working with web.dev.',
    overview: `Learn how to author content and build web.dev.`,
    topics: [
      {
        title: 'Authoring content',
        pathItems: [
          'authoring-content-for-web-dev',
        ],
      },
      {
        title: 'Components',
        pathItems: [
          'web-dev-components',
        ],
      },
    ],
  },
};
