module.exports = {
  // Slug is used by landing pages like / and /learn to link to this path.
  // Because it affects urls, the slug should never be translated.
  slug: 'fast',
  cover: '/images/collections/fast.svg',
  title: 'Fast load times',
  updated: 'June 5, 2020',
  description: 'Guarantee your site loads quickly to avoid user drop off.',
  overview: `When you're building a modern web experience, it's important to
  measure, optimize, and monitor if you're to get fast and stay fast.
  Performance plays a significant role in the success of any online venture,
  as high performing sites engage and retain users better than poorly
  performing ones.

  Sites should focus on optimizing for user-centric happiness metrics. Tools
  like Lighthouse (baked into web.dev!) highlight these metrics and help you
  take the right steps toward improving your performance. To "stay fast", set
  and enforce performance budgets to help your team work within the
  constraints needed to continue loading fast and keeping users happy after
  your site has launched.`,
  topics: [
    {
      title: 'Introduction',
      pathItems: [
        'why-speed-matters',
        'what-is-speed',
        'how-to-measure-speed',
        'how-to-stay-fast',
        'rail',
      ],
    },
    {
      title: 'Set performance budgets',
      pathItems: [
        'performance-budgets-101',
        'your-first-performance-budget',
        'incorporate-performance-budgets-into-your-build-tools',
        'use-lighthouse-for-performance-budgets',
        'using-bundlesize-with-travis-ci',
        'using-lighthouse-bot-to-set-a-performance-budget',
      ],
    },
    {
      title: 'Optimize your images',
      pathItems: [
        'use-imagemin-to-compress-images',
        'replace-gifs-with-videos',
        'serve-responsive-images',
        'serve-images-with-correct-dimensions',
        'serve-images-webp',
        'image-cdns',
      ],
    },
    {
      title: 'Lazy-load images and video',
      pathItems: [
        'lazy-loading',
        'lazy-loading-images',
        'lazy-loading-video',
        'native-lazy-loading',
        'use-lazysizes-to-lazyload-images',
        'lazy-loading-problems',
      ],
    },
    {
      title: 'Optimize your JavaScript',
      pathItems: [
        'apply-instant-loading-with-prpl',
        'preload-critical-assets',
        'reduce-javascript-payloads-with-code-splitting',
        'remove-unused-code',
        'reduce-network-payloads-using-text-compression',
        'serve-modern-code-to-modern-browsers',
        'commonjs-larger-bundles',
      ],
    },
    {
      title: 'Optimize your CSS',
      pathItems: [
        'defer-non-critical-css',
        'minify-css',
        'extract-critical-css',
        'optimize-css-background-images-with-media-queries',
      ],
    },
    {
      title: 'Optimize your third-party resources',
      pathItems: [
        'third-party-javascript',
        'identify-slow-third-party-javascript',
        'efficiently-load-third-party-javascript',
      ],
    },
    {
      title: 'Optimize web fonts',
      pathItems: ['avoid-invisible-text'],
    },
    {
      title: 'Optimize for network quality',
      pathItems: ['adaptive-serving-based-on-network-quality'],
    },
    {
      title: 'Measure performance in the field',
      pathItems: [
        'chrome-ux-report',
        'chrome-ux-report-data-studio-dashboard',
        'chrome-ux-report-pagespeed-insights',
        'chrome-ux-report-bigquery',
      ],
    },
    {
      title: 'Build a performance culture',
      pathItems: [
        'value-of-speed',
        'how-can-performance-improve-conversion',
        'what-should-you-measure-to-improve-performance',
        'how-to-report-metrics',
        'fixing-website-speed-cross-functionally',
      ],
    },
  ],
};
