const site = require("./site");

const podcasts = [
  {
    title: "HTTP 203",
    url: "https://developers.google.com/web/shows/http203/podcast",
    description: `Google Developers Jake and Surma discuss their philosophies
      about web development and the various aspects of it, meanwhile dropping in
      lifehacks, lessons and some rather honest truths.`,
    thumbnail: "/images/podcasts/http203.jpg",
  },
  {
    title: "Designers vs Developer",
    url: "https://anchor.fm/mustafa-kurtuldu",
    description: `A show that tries to solve the challenges faced in industry
      by having an open conversation between the two.`,
    thumbnail: "/images/podcasts/designer-vs-developer.jpg",
  },
  {
    title: "The CSS Podcast",
    url: "https://pod.link/thecsspodcast",
    description: `Una and Adam gleefully breakdown complex aspects of CSS into
      digestible episodes covering everything from accessibility to z-index.`,
    thumbnail: "/images/podcasts/css-podcast.jpg",
  },
  {
    title: "State of the Web",
    url:
      "https://www.youtube.com/playlist?list=PLNYkxOF6rcIBGvYSYO-VxOsaYQDw5rifJ",
    description: `The web and how we build it is rapidly changing. In this
      series, we'll be using big data to understand the macro trends that are
      pushing the web forward in the areas of performance, security, publishing,
      and more.`,
    thumbnail: "/images/podcasts/state-of-the-web.jpg",
  },
].map((podcast) => {
  // If we're in a production environment,
  // use the image CDN for our show thumbnails.
  if (process.env.ELEVENTY_ENV === "prod") {
    podcast.thumbnail = new URL(podcast.thumbnail, site.imageCdn);
  }
  return podcast;
});

module.exports = podcasts;
