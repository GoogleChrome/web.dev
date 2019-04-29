module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'react'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'react',
    cover: '/images/collections/react.svg',
    title: 'React',
    updated: 'April 28, 2019',
    description: `Build performant and progressive React applications.`,
    overview: `In this section you'll learn how to use built-in APIs and
    third-party libraries to improve the performance of your
    React applications.`,
    topics: [
      {
        title: 'Introduction',
        pathItems: [
          'get-started-optimize-react',
        ],
      },
      {
        title: 'Fast',
        pathItems: [
          'code-splitting-suspense',
          'virtualize-long-lists-react-window',
        ],
      },
      {
        title: 'Reliable',
        pathItems: [
          'precache-with-workbox-react',
        ],
      },
      {
        title: 'Discoverable',
        pathItems: [
          'prerender-with-react-snap',
        ],
      },
      {
        title: 'Installable',
        pathItems: [
          'add-manifest-react',
        ],
      },
      {
        title: 'Accessible',
        pathItems: [
          'accessibility-auditing-react',
        ],
      },
    ],
  },
};
