module.exports = {
  // Tags are inherited by all posts.
  tags: ["pathItem", "react"],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: "react",
    cover: "/images/collections/react.svg",
    title: "React",
    updated: "October 11, 2019",
    description: `Build performant and progressive React applications.`,
    overview: `In this section you'll learn how to use built-in APIs and
    third-party libraries to improve the performance of your
    React applications.`,
    topics: [
      {
        title: "Next.js",
        pathItems: [
          "performance-as-a-default-with-nextjs",
          "route-prefetching-in-nextjs",
          "code-splitting-with-dynamic-imports-in-nextjs",
          "how-amp-can-guarantee-fastness-in-your-nextjs-app",
        ],
      },
      {
        title: "Create React App",
        pathItems: [
          "get-started-optimize-react",
          "code-splitting-suspense",
          "virtualize-long-lists-react-window",
          "precache-with-workbox-react",
          "prerender-with-react-snap",
          "add-manifest-react",
          "accessibility-auditing-react",
        ],
      },
    ],
  },
};
