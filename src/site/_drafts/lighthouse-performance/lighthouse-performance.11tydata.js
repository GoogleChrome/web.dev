module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'lighthouse-performance'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'lighthouse-performance',
    cover: '/images/collections/lighthouse-performance.svg',
    title: 'Performance audits',
    description:
      'How long does your app take to show content and become useable?',
    overview: `Lorem ipsum dolor set amet...`,
    topics: [
      {
        title: 'Metrics',
        pathItems: [
          'first-contentful-paint',
          'first-meaningful-paint',
          'speed-index',
          'first-cpu-idle',
          'interactive',
          'estimated-input-latency',
        ],
      },
      {
        title: 'Opportunities',
        pathItems: [
          'render-blocking-resources',
          'uses-responsive-images',
          'offscreen-images',
          'unminified-css',
          'unminified-javascript',
          'unused-css-rules',
          'uses-optimized-images',
          'uses-webp-images',
          'uses-text-compression',
          'uses-rel-preconnect',
          'time-to-first-byte',
          'redirects',
          'uses-rel-preload',
          'efficient-animated-content',
        ],
      },
      {
        title: 'Diagnostics',
        pathItems: [
          'total-byte-weight',
          'uses-long-cache-ttl',
          'dom-size',
          'critical-request-chains',
          'user-timings',
          'bootup-time',
          'mainthread-work-breakdown',
          'font-display',
        ],
      },
    ],
  },
};
