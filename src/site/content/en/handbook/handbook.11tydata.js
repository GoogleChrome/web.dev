module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'handbook'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'handbook',
    cover: '/images/collections/handbook.svg',
    title: 'Content handbook',
    updated: 'Aug 26, 2019',
    description: 'How to write great content and get it published on web.dev.',
    overview: `The goal of this handbook is to provide web.dev content 
      contributors with everything they could possibly need to know in order
      to write great content and get it published on web.dev. As a contributor
      you don't have to read the whole handbook, but the more you do, the
      faster your content will likely get published. Note that this handbook
      is also the web.dev editorial team's single source of truth on how to
      maintain content quality across the site.`,
    topics: [
      {
        title: 'Propose your content',
        pathItems: [
          'quick-start',
          'audience',
          'content-types',
          'third-party-contributions',
        ],
      },
      {
        title: 'Draft high-quality content',
        pathItems: [
          'style',
          'voice',
          'inclusion-and-accessibility',
          'effective-instruction',
          'write-code-samples',
          'use-media',
          'tooling-and-libraries',
          'markup-sample-app',
        ],
      },

      {
        title: 'Get your content reviewed',
        pathItems: [
          'content-checklist',
        ],
      },
      {
        title: 'Copyedit your content',
        pathItems: [
          'word-list',
          'grammar',
        ],
      },
      {
        title: 'Format your content',
        pathItems: [
          'markup-post-codelab',
          'web-dev-components',
          'contributor-profile',
          'markup-media',
          'markup-code',
        ],
      },
    ],
  },
};
