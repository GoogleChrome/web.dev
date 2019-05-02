module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'fast'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'fast',
    cover: '/images/collections/fast.svg',
    title: 'Fast load times',
    updated: 'May 24, 2018',
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
        title: 'Measure your site\'s performance',
        pathItems: ['discover-performance-opportunities-with-lighthouse'],
      },
      {
        title: 'Optimize your images',
        pathItems: [
          'use-imagemin-to-compress-images',
          'replace-gifs-with-videos',
          'use-lazysizes-to-lazyload-images',
          'serve-responsive-images',
          'serve-images-with-correct-dimensions',
          'serve-images-webp',
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
        ],
      },
      {
        title: 'Optimize your CSS',
        pathItems: [
          'defer-non-critical-css',
          'minify-css',
        ],
      },
      {
        title: 'Optimize web fonts',
        pathItems: ['avoid-invisible-text'],
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
        title: 'Enforce performance budgets',
        pathItems: [
          'performance-budgets-101',
          'your-first-performance-budget',
          'incorporate-performance-budgets-into-your-build-tools',
          'using-bundlesize-with-travis-ci',
          'using-lighthouse-bot-to-set-a-performance-budget',
        ],
      },
    ],
  },
};
