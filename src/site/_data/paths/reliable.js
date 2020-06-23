module.exports = {
  // Slug is used by landing pages like / and /learn to link to this path.
  // Because it affects urls, the slug should never be translated.
  slug: 'reliable',
  cover: '/images/collections/reliable.svg',
  title: 'Network reliability',
  updated: 'May 24, 2018',
  description: `See consistent, reliable performance regardless of network
  quality.`,
  overview: `The modern web gives you access to a diverse global audience
  with a range of devices and network connections. In this section you'll
  learn how to provide a consistently reliable experience to all your users,
  wherever and however they access the internet.`,
  topics: [
    {
      title: 'How to measure network reliability',
      pathItems: [
        'network-connections-unreliable',
        'identify-resources-via-network-panel',
      ],
    },
    {
      title: 'The options in your caching toolbox',
      pathItems: ['http-cache', 'service-workers-cache-storage', 'workbox'],
    },
    {
      title: 'How caching strategies work',
      pathItems: ['precache-with-workbox', 'runtime-caching-with-workbox'],
    },
    {
      title: 'Advanced patterns',
      pathItems: [
        'resilient-search-experiences',
        'instant-navigation-experiences',
        'app-shell-ux-with-service-workers',
        'adaptive-loading-with-service-workers',
      ],
    },
  ],
};
