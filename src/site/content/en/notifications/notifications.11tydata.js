module.exports = {
  // Tags are inherited by all posts.
  tags: ["pathItem", "notifications"],
  path: {
    draft: false,
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: "notifications",
    cover: "/images/collections/notifications.svg",
    title: "Notifications",
    updated: "November 1, 2019",
    description: `Notifications`,
    overview: `In this collection, Notifications`,
    topics: [
      {
        title: "Notifications",
        pathItems: [
          "codelab-notifications-push-server",
        ],
      },
    ],
  },
};
