module.exports = {
  // Tags are inherited by all posts.
  tags: ["media"],
  path: {
    // Slug is used by landing pages like / and /learn to link to this path.
    // Because it affects urls, the slug should never be translated.
    slug: "media",
    cover: "/images/collections/media.svg",
    title: "Media",
    updated: "April 30, 2020",
    description: `Add audio and video to your web sites`,
    overview: `Learn to add media capabilities to your website using either
    basic markdown or a media framework such as Google's Shaka Player, JW
    Player or Video.js.`,
    topics: [
      {
        title: "Conceptual basics",
        pathItems: [
          "media-experience",
          "file-basics",
          "application-basics",
          "cheetsheet",
        ],
      },
      {
        title: "Prepare media files for the web",
        pathItems: [
          "for-the-web",
          "containers-and-codecs",
          "bitrate",
          "resolution",
          "encryption",
          "application-cheetsheet",
        ],
      },
      {
        title: "Prepare the web page",
        pathItems: [
          "the-video-tag",
          "the-audio-tag",
          "the-source-tag",
          "the-track-tag",
          "media-controls",
        ],
      },
      {
        title: "Using media frameworks",
        pathItems: [
          "for-frameworks",
          "splitting-streams",
          "selecting-a-framework",
        ],
      },
      {
        title: "Serving media",
        pathItems: ["preloading", "server-basics"],
      },
    ],
  },
};
