module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'angular'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'angular',
    cover: '/images/collections/angular.svg',
    title: 'Angular',
    updated: 'June 24, 2019',
    description: `Build performant and progressive Angular applications.`,
    overview: `In this collection you’ll learn practical tips and tricks to
    make your Angular applications faster, more reliable, more accessible,
    and generally awesome.`,
    topics: [
      {
        title: 'Introduction',
        pathItems: ['get-started-optimize-angular'],
      },
      {
        title: 'Fast',
        pathItems: [
          'route-level-code-splitting-in-angular',
          'route-preloading-in-angular',
          'performance-budgets-with-the-angular-cli',
          'faster-angular-change-detection',
          'virtualize-lists-with-angular-cdk',
        ],
      },
      {
        title: 'Reliable',
        pathItems: ['precaching-with-the-angular-service-worker'],
      },
      {
        title: 'Installable',
        pathItems: ['creating-pwa-with-angular-cli'],
      },
      {
        title: 'Accessible',
        pathItems: ['accessible-angular-with-codelyzer'],
      },
    ],
  },
};
