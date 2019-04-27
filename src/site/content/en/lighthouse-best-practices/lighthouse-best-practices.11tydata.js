module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'lighthouse-seo'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'lighthouse-seoe',
    cover: '/images/collections/lighthouse.png',
    title: 'SEO audits',
    description:
      'How well can search engines understand your content?',
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
