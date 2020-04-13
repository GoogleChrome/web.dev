module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'lighthouse-pwa'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'lighthouse-pwa',
    cover: '/images/collections/lighthouse-pwa.svg',
    title: 'PWA audits',
    description: 'Measure if your site is fast, reliable and installable.',
    overview: `These checks validate the aspects of a Progressive Web App.`,
    topics: [
      {
        title: 'Fast and reliable',
        pathItems: [
          'load-fast-enough-for-pwa',
          'works-offline',
          'offline-start-url',
        ],
      },
      {
        title: 'Installable',
        pathItems: ['is-on-https', 'service-worker', 'installable-manifest'],
      },
      {
        title: 'PWA optimized',
        pathItems: [
          'redirects-http',
          'splash-screen',
          'themed-omnibox',
          'content-width',
          'viewport',
          'without-javascript',
          'apple-touch-icon',
        ],
      },
      {
        title: 'Additional items to manually check',
        pathItems: [
          'pwa-cross-browser',
          'pwa-page-transitions',
          'pwa-each-page-has-url',
        ],
      },
    ],
  },
};
