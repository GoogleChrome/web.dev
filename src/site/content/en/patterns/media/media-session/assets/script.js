const video = document.querySelector("video");

navigator.mediaSession.metadata = new MediaMetadata({
  title: "Caminandes 2: Gran Dillama - Blender Animated Short",
  artist: "Blender Foundation",
  artwork: [
    { src: "https://storage.googleapis.com/media-session/caminandes/artwork-96.png",  sizes: "96x96" },
    { src: "https://storage.googleapis.com/media-session/caminandes/artwork-128.png", sizes: "128x128" },
    { src: "https://storage.googleapis.com/media-session/caminandes/artwork-256.png", sizes: "256x256" },
    { src: "https://storage.googleapis.com/media-session/caminandes/artwork-512.png", sizes: "512x512" },
  ],
});

navigator.mediaSession.setActionHandler("play", async () => {
  // Resume playback
  await video.play();
});

navigator.mediaSession.setActionHandler("pause", () => {
  // Pause active playback
  video.pause();
});

video.addEventListener("play", () => {
  navigator.mediaSession.playbackState = "playing";
});

video.addEventListener("pause", () => {
  navigator.mediaSession.playbackState = "paused";
});
