module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'installable'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'installable',
    cover: '/images/collections/installable.svg',
    title: 'Installable',
    updated: 'May 24, 2018',
    description: `Be on users’ home screens with no need for an app store.`,
    overview: `How do you ensure your web app has a place on the user's
    homescreen? What about the Start menu or app launcher? In this section
    you'll learn simple techniques to encourage engagement and ensure your app
    is easy to access.`,
    topics: [
      {
        title: 'Make it installable',
        pathItems: ['discover-installable', 'add-manifest'],
      },
    ],
  },
};
