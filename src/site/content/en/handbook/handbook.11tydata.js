module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'handbook'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'handbook',
    cover: '/images/collections/handbook.svg',
    title: 'Content handbook',
    updated: 'Jun 24, 2019',
    description: 'Create great content for web.dev.',
    overview: `This handbook helps contributors to web.dev create effective,
      engaging content and get it published as easily as possible. This is a
      living document that will evolve as we learn more about what works.`,
    topics: [
      {
        title: 'Content process',
        pathItems: [
          'quick-start',
          'content-checklist',
          'third-party-contributions',
        ],
      },
      {
        title: 'Content guidelines',
        pathItems: [
          'content-types',
          'style',
          'voice',
          'audience',
          'grammar',
          'inclusion-and-accessibility',
          'effective-instruction',
          'write-code-samples',
          'use-media',
          'word-list',
          'tooling-and-libraries',
        ],
      },
      {
        title: 'web.dev markup',
        pathItems: [
          'contributor-profile',
          'markup-post-codelab',
          'web-dev-components',
          'markup-media',
          'markup-code',
          'markup-sample-app',
        ],
      },
    ],
  },
};
