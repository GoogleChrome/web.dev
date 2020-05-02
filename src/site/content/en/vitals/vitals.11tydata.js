module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'vitals'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'vitals',
    cover: '/vitals/web-vitals.svg',
    title: 'Web Vitals',
    description: 'Essential metrics for a healthy site',
    topics: [
      {
        title: 'Web Vitals',
        pathItems: ['vitals'],
      },
    ],
  },
};
