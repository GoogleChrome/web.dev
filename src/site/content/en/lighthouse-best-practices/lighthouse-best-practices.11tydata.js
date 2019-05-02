module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'lighthouse-best-practices'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'lighthouse-best-practices',
    cover: '/images/collections/lighthouse-best-practices.svg',
    title: 'Best Practices audits',
    description:
      'Improve code health of your web page following these best practices',
    overview: `These checks highlight opportunities
    to improve the overall code health of your web app.`,
    topics: [
      {
        title: 'Best practices',
        pathItems: [
          'appcache-manifest',
          'uses-http2',
          'uses-passive-event-listeners',
          'no-document-write',
          'external-anchors-use-rel-noopener',
          'geolocation-on-start',
          'doctype',
          'no-vulnerable-libraries',
          'js-libraries',
          'notification-on-start',
          'deprecations',
          'password-inputs-can-be-pasted-into',
          'errors-in-console',
          'image-aspect-ratio',
        ],
      },
    ],
  },
};
