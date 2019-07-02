module.exports = {
  // Tags are inherited by all posts.
  tags: ['pathItem', 'lighthouse-accessibility'],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: 'lighthouse-accessibility',
    cover: '/images/collections/lighthouse-accessibility.svg',
    title: 'Accessibility audits',
    description:
      'Can all users access content and navigate your site effectively?',
    overview: `These checks highlight opportunities
    to improve the accessibility of your web app.
    Only a subset of accessibility issues can be automatically detected
    so manual testing is also encouraged.`,
    topics: [
      {
        title: 'ARIA',
        pathItems: [
          'aria-allowed-attr',
          'aria-required-attr',
          'aria-required-children',
          'aria-required-parent',
          'aria-roles',
          'aria-valid-attr-value',
          'aria-valid-attr',
        ],
      },
      {
        title: 'Audio and video',
        pathItems: [
          'audio-caption',
          'video-caption',
          'video-description',
        ],
      },
      {
        title: 'Best practices',
        pathItems: [
          'duplicate-id',
          'meta-refresh',
          'meta-viewport',
        ],
      },
      {
        title: 'Contrast',
        pathItems: [
          'color-contrast',
        ],
      },
      {
        title: 'Internationalization and localization',
        pathItems: [
          'html-has-lang',
          'html-lang-valid',
          'valid-lang',
        ],
      },
      {
        title: 'Names and labels',
        pathItems: [
          'button-name',
          'document-title',
          'frame-title',
          'image-alt',
          'input-image-alt',
          'label',
          'link-name',
          'object-alt',
        ],
      },
      {
        title: 'Navigation',
        pathItems: [
          'accesskeys',
          'bypass',
          'tabindex',
        ],
      },
      {
        title: 'Tables and lists',
        pathItems: [
          'definition-list',
          'dlitem',
          'layout-table',
          'list',
          'listitem',
          'td-headers-attr',
          'th-has-data-cells',
        ],
      },
      {
        title: 'Additional items to manually check',
        pathItems: [
          'custom-controls-labels',
          'custom-control-roles',
          'focus-traps',
          'focusable-controls',
          'heading-levels',
          'interactive-element-affordance',
          'logical-tab-order',
          'managed-focus',
          'offscreen-content-hidden',
          'use-landmarks',
          'visual-order-follows-dom',
        ],
      },
    ],
  },
};
