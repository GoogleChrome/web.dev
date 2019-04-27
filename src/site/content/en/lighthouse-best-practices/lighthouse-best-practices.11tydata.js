module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'lighthouse-best-practices'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'lighthouse-best-practices',
    cover: '/images/collections/lighthouse.png',
    title: 'Best Practices audits',
    description:
      'Improve the code health of your web page following these best practices',
    overview: `Lorem ipsum dolor set amet...`,
    topics: [
      {
        title: 'Best practices',
        pathItems: [
          'appcache-manifest',
          'is-on-https',
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
