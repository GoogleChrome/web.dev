module.exports = {
  // Slug is used by landing pages like / and /learn to link to this path.
  // Because it affects urls, the slug should never be translated.
  slug: 'lighthouse-performance',
  cover: '/images/collections/lighthouse-performance.svg',
  title: 'Performance audits',
  description:
    'Measure performance and find opportunities to speed up page loads.',
  overview: `These checks ensure that your page is optimized for users
  to be able to see and interact with page content.`,
  topics: [
    {
      title: 'Performance audit scoring',
      pathItems: ['performance-scoring'],
    },
    {
      title: 'Metrics',
      pathItems: [
        'first-contentful-paint',
        'first-meaningful-paint',
        'speed-index',
        'first-cpu-idle',
        'interactive',
        'lighthouse-max-potential-fid',
        'lighthouse-total-blocking-time',
        'lighthouse-largest-contentful-paint',
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
        'third-party-summary',
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
        'resource-summary',
      ],
    },
  ],
};
