---
layout: pattern
title: How to add Picture-in-Picture to video controls
date: 2022-10-14
authors:
  - beaufortfrancois
description: >
  Learn how to create a custom Picture-in-Picture button for your video player.
height: 800
---

## The modern way

The [Picture-in-Picture (PiP) Web API](https://w3c.github.io/picture-in-picture/) allows websites to create a floating video window always on top of other windows so that users may continue consuming media while they interact with other content sites, or applications on their device.

{% BrowserCompat 'api.Picture-in-Picture_API' %}

The example below shows you how to create a button that users can use to toggle Picture-in-Picture on a video.

```js
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
```

## The classic way

Before the availability of the Picture-in-Picture Web API, there was no way to create a floating video window always on top of other windows. Playing the video on top of other elements on the web page is possible though with CSS.

The example below shows you how to display your video on top of other elements at the bottom right corner of your web page when user click a button.

```js
toggleFakePipButton.addEventListener("click", (event) => {
  video.classList.toggle("fake-pip");
});
```

```css
video.fake-pip {
  position: fixed;
  z-index: 1000;
  bottom: 10px;
  right: 10px;
}
```

## Further reading

- [W3C Picture-in-Picture Specification](https://w3c.github.io/picture-in-picture/)
- [Watch video using Picture-in-Picture](https://developer.chrome.com/blog/watch-video-using-picture-in-picture/)
- [MDN Picture-in-Picture API](https://developer.mozilla.org/docs/Web/API/Picture-in-Picture_API)

## Demo
