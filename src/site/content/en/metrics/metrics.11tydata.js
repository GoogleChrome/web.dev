module.exports = {
  // Tags are inherited by all posts.
  tags: ["pathItem", "metrics"],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: "metrics",
    // cover: "/images/collections/metrics.svg",
    cover: "/images/collections/lighthouse-performance.svg",
    title: "Metrics",
    description: "Measure and optimize performance and user experience",
    overview: `User-centric metrics are a critical tool in understanding and
      improving the experience of your site in a way that matters and benefits
      real users.`,
    topics: [
      {
        title: "Get started",
        pathItems: ["user-centric-metrics"],
      },
      // {
      //   title: "Important metrics to measure",
      //   pathItems: [
      //     "fcp",
      //     "lcp",
      //     "fid",
      //     "tti",
      //     "tbt",
      //     "cls",
      //   ],
      // },
      {
        title: "Create your own metrics",
        pathItems: ["custom-metrics"],
      },
    ],
  },
};
