const video = document.querySelector('video');
const togglePipButton = document.querySelector('#togglePipButton');
const toggleFakePipButton = document.querySelector('#toggleFakePipButton');

togglePipButton.addEventListener("click", async (event) => {
  togglePipButton.disabled = true;
  try {
    if (video !== document.pictureInPictureElement)
      await video.requestPictureInPicture();
    else await document.exitPictureInPicture();
  } finally {
    togglePipButton.disabled = false;
  }
});

video.addEventListener("enterpictureinpicture", (event) => {
  togglePipButton.classList.add("on");
});

video.addEventListener("leavepictureinpicture", (event) => {
  togglePipButton.classList.remove("on");
});

/* Feature support */

if ("pictureInPictureEnabled" in document) {
  // Hide fake PiP button if Picture-in-Picture is supported.
  toggleFakePipButton.hidden = true;
  // Set button ability depending on whether Picture-in-Picture can be used.
  setPipButton();
  video.addEventListener("loadedmetadata", setPipButton);
  video.addEventListener("emptied", setPipButton);
} else {
  // Hide button if Picture-in-Picture is not supported.
  togglePipButton.hidden = true;
}

function setPipButton() {
  togglePipButton.disabled =
    video.readyState === 0 ||
    !document.pictureInPictureEnabled ||
    video.disablePictureInPicture;
}

/* Fake Picture-in-Picture */

toggleFakePipButton.addEventListener("click", (event) => {
  toggleFakePipButton.classList.toggle("on");
  video.classList.toggle("fake-pip");
});