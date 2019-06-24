module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'react'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'angular',
    cover: '/images/collections/angular.svg',
    title: 'Angular',
    updated: 'June 24, 2019',
    description: `Build performant and progressive Angular applications.`,
    overview: `In this section you'll learn how to use built-in APIs and
    third-party libraries to improve the performance of your
    Angular applications.`,
    topics: [
      {
	title: 'Introduction',
	pathItems: [
	  'get-started-optimize-angular',
	],
      },
    ],
  },
};
