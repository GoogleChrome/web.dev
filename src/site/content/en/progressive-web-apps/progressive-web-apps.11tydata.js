module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'progressive-web-apps'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'progressive-web-apps',
    cover: '/images/collections/pwa.svg',
    title: 'Progressive Web Apps',
    updated: 'February 24, 2019',
    description: 'Websites that took all the right vitamins',
    overview: `In this collection, you'll learn what makes a Progressive Web
    App special, how they can affect your business, and how to build them.`,
    topics: [
      {
        title: 'Introduction',
        pathItems: [
          'what-are-pwas',
          'drive-business-success',
          'define-install-strategy',
          'pwa-checklist',
        ],
      },
      {
        title: 'Capable',
        pathItems: [],
      },
      {
        title: 'Reliable',
        pathItems: [],
      },
      {
        title: 'Installable',
        pathItems: ['install-criteria'],
        subtopics: [
          {
            title: 'Provide an installable experience',
            pathItems: [
              'add-manifest',
              'customize-install',
              'promote-install',
              'using-a-pwa-in-your-android-app',
            ],
          },
          {
            title: 'Codelabs',
            pathItems: ['codelab-make-installable'],
          },
        ],
      },
    ],
  },
};
