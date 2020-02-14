module.exports = {
  // Tags are inherited by all posts.
  tags: ["pathItem", "progressive-web-apps"],
  path: {
    draft: true,
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: "progressive-web-apps",
    cover: "/images/collections/pwa.svg",
    title: "Progressive Web Apps",
    updated: "November 1, 2019",
    description: `Websites that took all the right vitamins`,
    overview: `In this collection, you'll learn what makes a Progressive Web
    App special, how they can affect your business, and how to build them.`,
    topics: [
      {
        title: "Introduction",
        pathItems: ["what-are-pwas", "pwa-checklist"],
      },
      {
        title: "Capable",
        pathItems: [],
      },
      {
        title: "Reliable",
        pathItems: [],
      },
      {
        title: "Installable",
        pathItems: [],
      },
    ],
  },
};
