module.exports = {
  // Tags are inherited by all posts.
  tags: ["pathItem", "lighthouse-accessibility"],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: "lighthouse-accessibility",
    cover: "/images/collections/lighthouse-accessibility.svg",
    title: "Accessibility audits",
    description:
      "Can all users access content and navigate your site effectively?",
    overview: `These checks highlight opportunities
    to improve the accessibility of your web app.
    Only a subset of accessibility issues can be automatically detected
    so manual testing is also encouraged.`,
    topics: [
      {
        title: "Audit scoring",
        pathItems: ["accessibility-scoring"],
      },
      {
        title: "Navigation",
        pathItems: [
          "accesskeys",
          "bypass",
          "duplicate-id-active",
          "heading-order",
          "tabindex",
        ],
      },
      {
        title: "ARIA",
        pathItems: [
          "aria-allowed-attr",
          "aria-hidden-body",
          "aria-hidden-focus",
          "aria-input-field-name",
          "aria-required-attr",
          "aria-required-children",
          "aria-required-parent",
          "aria-roles",
          "aria-toggle-field-name",
          "aria-valid-attr-value",
          "aria-valid-attr",
          "duplicate-id-aria",
        ],
      },
      {
        title: "Names and labels",
        pathItems: [
          "button-name",
          "document-title",
          "form-field-multiple-labels",
          "frame-title",
          "image-alt",
          "input-image-alt",
          "label",
          "link-name",
          "object-alt",
        ],
      },
      {
        title: "Contrast",
        pathItems: ["color-contrast"],
      },
      {
        title: "Tables and lists",
        pathItems: [
          "definition-list",
          "dlitem",
          "list",
          "listitem",
          "layout-table",
          "td-headers-attr",
          "th-has-data-cells",
        ],
      },
      {
        title: "Best practices",
        pathItems: ["meta-refresh", "meta-viewport"],
      },
      {
        title: "Internationalization and localization",
        pathItems: ["html-has-lang", "html-lang-valid", "valid-lang"],
      },
      {
        title: "Additional items to manually check",
        pathItems: [
          "logical-tab-order",
          "focusable-controls",
          "interactive-element-affordance",
          "managed-focus",
          "focus-traps",
          "custom-controls-labels",
          "custom-control-roles",
          "visual-order-follows-dom",
          "offscreen-content-hidden",
          "use-landmarks",
          "audio-caption",
          "video-caption",
          "video-description",
        ],
      },
    ],
  },
};
