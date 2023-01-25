---
layout: codelab
title: Adapt video to image serving based on network quality
date: 2019-07-08
authors:
  - mihajlija
description: |
  Learn how to use the Network Information API to adapt
  your content based on the network quality.
glitch: adaptive-serving-netinfo-starter
related_post: adaptive-serving-based-on-network-quality
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

In this codelab, you'll learn how to adapt your content based on the network
quality. This page's background video will load only when users are on a fast
network. On slower networks, an image will load instead.

The
[Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation)
enables you to access information about the user's connection quality. You will
use its `effectiveType` property to decide when to serve a video and when to
serve an image. `effectiveType` can be `'slow-2g'`, `'2g'`, `'3g'`, or `'4g'`.

## Step 1: Check connection type

The `index.html` file contains a `<video>` tag to display the background video (line 22). The code in `script.js` loads the video by setting the video tag's `src` attribute. (The video loading code is described in more detail in [Step 2](/codelab-adapt-video-to-image-serving-based-on-network-quality#step-2:-load-video).)

To load the video conditionally, first check if the Network Information API is available; if it is, check the connection type.

1. In `script.js`, add an `if` statement that tests whether the `navigator.connection` object exists and whether it has the `effectiveType` property.
2. Add an `if` statement to check the `effectiveType` of the network.

```js
if (navigator.connection && !!navigator.connection.effectiveType) {
  if (navigator.connection.effectiveType === '4g') {
    // Only load video on the fastest connections.
  } else {
    // In any other case load the image.
  }
}
```

Wrap the existing video loading code in an `else` statement, so that video will
still load in browsers that don't support the Network Information API.

```js
if (navigator.connection && !!navigator.connection.effectiveType) {
  if (navigator.connection.effectiveType === '4g') {
    // video loading code
  } else {
    // image loading code
  }
} else {
  const video = document.getElementById('coverVideo');
  const videoSource = video.getAttribute('data-src');
  video.setAttribute('src', videoSource);

  video.setAttribute('style', 'height: 100%; width: 100%; display:inline');
}
```

## Step 2: Load video

If the `effectiveType` is `'4g'`, use the video loading code from the
beginning of the codelab.

```js
if (navigator.connection.effectiveType === '4g') {
  const video = document.getElementById('coverVideo');
  const videoSource = video.getAttribute('data-src');
  video.setAttribute('src', videoSource);
  video.setAttribute('style', 'height: 100%; width: 100%; display:inline');
} else {
  // image loading code
}
```

Here's how the video loading code works: the `<video>` tag doesn't download or display anything at first because its `src` attribute is not set. The video URL to load is specified using the `data-src` attribute.

```html
<video id="coverVideo" autoplay loop muted data-src="https://cdn.glitch.com/b6491350-b058-4eb6-aa6c-55c93122073e%2FMatrix%2C%20Console%2C%20Hacking%2C%20Code.mp4?1551464245607"></video>
```

[Data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) allow you to store extra information on standard HTML elements. A data element can be named anything, as long as it starts with "data-".

To actually display the video on the page, you need to get the value from `data-src` and set it as the video element's `src` attribute.

First, get the DOM element that contains the asset:

```js
const video = document.getElementById('coverVideo');
```

Then get the resource location from the `data-src` attribute:

```js
const videoSource = video.getAttribute('data-src');
```

And finally set that as the `src` attribute of the video element:

```js
video.setAttribute('src', videoSource);
```

The last line takes care of CSS positioning:

```js
video.setAttribute('style', 'height: 100%; width: 100%; display:inline');
```

## Step 3: Load image

To conditionally load an image on slower networks, use the same strategy as for
the video.

Add an image element to `index.html` (right after the video element), and use
the `data-src` attribute instead of the `src` attribute.

```html
<img id="coverImage" data-src="https://cdn.glitch.com/36529535-5976-40f8-979b-40c898b86bd0%2F36529535-5976-40f8-979b-40c898b86bd0_1_Sn80dgiwpMjBVrqjfiDbnA.jpg?1553003835358" />
```

In `script.js`, add code to set the image's `src` attribute depending on the
`effectiveType` of the network.

```js
if (navigator.connection.effectiveType === '4g') {
  const video = document.getElementById('coverVideo');
  const videoSource = video.getAttribute('data-src');
  video.setAttribute('src', videoSource);

  video.setAttribute('style', 'height: 100%; width: 100%; display:inline');
} else {
  const image = document.getElementById('coverImage');
  const imageSource = image.getAttribute('data-src');
  image.setAttribute('src', imageSource);

  image.setAttribute('style', 'height: 100%; width: 100%; display:inline');
}
```

## Try it out

To test it yourself:

{% Instruction 'preview', 'ol' %}
{% Instruction 'devtools-network', 'ol' %}
1. Click the **Throttling** drop-down, which is set to **No throttling** by default. Select **Fast 3G**.

{% Img src="image/admin/um0BRQOmsqGgZzWeLDHY.png", alt="DevTools Network tab with Fast 3G throttling option highlighted", width="723", height="198", class="w-screenshot" %}

Now reload the page with Fast 3G still enabled. The app loads an image in the background instead of the video:

{% Img src="image/admin/wtQs6oCU8c5q23SQOnHo.png", alt="Matrix-like image background with 'NETWORK INFORMATION' text overlay", width="800", height="456", class="w-screenshot" %}

## Extra Credit: Respond to changes

Remember how this API has an `onchange`
[event listener](/adaptive-serving-based-on-network-quality#how-it-works)?
You can use it for many things: dynamically adapting content such as video quality; restarting deferred data transfers when a change to a high-bandwidth network type is detected; or notifying users when the network quality changes.

Here's a simple example of how to use this listener. Add it to `script.js`. This
code will call the `displayNetworkInfo` function whenever the network
information changes.

```js
navigator.connection.addEventListener('change', displayNetworkInfo);
```

There's already an empty `<h2>` element on the `index.html` page. Now define the
`displayNetworkInfo` function so that it displays the network information in the
`<h2>` element and invoke the function.

```js
function displayNetworkInfo() {
  document.getElementById('connection').innerHTML = navigator.connection.effectiveType;
}

displayNetworkInfo();
```

Here's the final state of the [app on Glitch](https://glitch.com/~adaptive-serving-netinfo).

{% Img src="image/admin/0cTTeeAMgl5lD1PKRjy2.png", alt="Matrix-like video background with 'NETWORK INFORMATION 4g' text overlay", width="800", height="447", class="w-screenshot" %}

To test it again:

{% Instruction 'preview', 'ol' %}
{% Instruction 'devtools-network', 'ol' %}
1. Click the **Throttling** drop-down, which is set to **No throttling** by default. Select **Fast 3G**.
{% Instruction 'reload-app', 'ol' %}

The app will update the network information to **3g**:

{% Img src="image/admin/WRp4ceBiuDQZoWmuaZx4.png", alt="Matrix-like video background with 'NETWORK INFORMATION 3g' text overlay", width="800", height="447", class="w-screenshot" %}
