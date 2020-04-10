module.exports = {
  // Tags are inherited by all posts.
  tags: ['handbook'],
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
          'handbook/quick-start',
          'handbook/content-checklist',
          'handbook/third-party-contributions',
        ],
      },
      {
        title: 'Content guidelines',
        pathItems: [
          'handbook/content-types',
          'handbook/quality',
          'handbook/voice',
          'handbook/audience',
          'handbook/grammar',
          'handbook/inclusion-and-accessibility',
          'handbook/effective-instruction',
          'handbook/write-code-samples',
          'handbook/use-media',
          'handbook/word-list',
          'handbook/tooling-and-libraries',
        ],
      },
      {
        title: 'web.dev markup',
        pathItems: [
          'handbook/contributor-profile',
          'handbook/markup-post-codelab',
          'handbook/web-dev-components',
          'handbook/markup-media',
          'handbook/markup-code',
          'handbook/markup-sample-app',
          'handbook/self-assessment-components',
        ],
      },
    ],
  },
};
