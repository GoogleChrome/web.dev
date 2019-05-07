module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'reliable'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'reliable',
    cover: '/images/collections/reliable.svg',
    title: 'Network resilience',
    updated: 'May 24, 2018',
    description: `See consistent, reliable performance regardless of network
    quality.`,
    overview: `The modern web gives you access to a diverse global audience
    with a range of devices and network connections. In this section you'll
    learn how to provide a consistently reliable experience to all your users,
    wherever and however they access the internet.`,
    topics: [
      {
        title: 'How to measure network resilience',
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
        title: 'How to build a resilient sample app',
        pathItems: [
          'codelab-reliability-overview',
          'codelab-reliability-setup',
          'codelab-reliability-get-familiar',
          'codelab-reliability-register-service-worker',
          'codelab-reliability-precaching',
          'codelab-reliability-integrate-workbox',
          'codelab-reliability-handle-nav-requests',
          'codelab-reliability-runtime-caching',
          'codelab-reliability-offline-fallback',
          'codelab-reliability-access-caches',
          'codelab-reliability-user-control',
          'codelab-reliability-conclusion',
        ],
      },
    ],
  },
};
