---
layout: post
title: Screensharing a browser tab in HTML5?
authors:
  - ericbidelman
date: 2012-09-21
tags:
  - blog
---

In the past couple of years, I've helped a few different companies achieve screensharing-like functionality using only browser technologies. From my experience, implementing [VNC](http://en.wikipedia.org/wiki/Virtual_Network_Computing) solely in web platform technologies (i.e. no plugins) is a hard problem. There are a lot of things to consider and a lot of challenges to overcome. Relaying mouse pointer position, forwarding keystrokes, and achieving full 24-bit color repaints at 60fps are just a few of the issues.

## Capturing tab content

If we remove the complexities of traditional screen sharing and focus on sharing the contents of a browser tab, the problem greatly simplifies to a.) capturing the visible tab in its current state, and b.) sending that "frame" across the wire. Essentially, we need a way to snapshot the DOM and share it out.

The sharing part is easy. Websockets are very capable of sending data in different formats (string, JSON, binary). The snapshotting part is a much harder problem. **Projects like [html2canvas](http://html2canvas.hertzen.com/) have tackled screencapturing HTML by re-implementing the browser's rendering engine…in JavaScript!** Another example is [Google Feedback](http://www.google.com/tools/feedback/intl/), though it's not open-source. These types of projects are *very* cool, but they're also dreadfully slow. You'd be lucky to get 1fps throughput, much less that covetted 60fps.

This article discusses a few of my favorite proof-of-concept solutions for "screensharing" a tab.

## Method 1: Mutation Observers + WebSocket

One approach for mirroring a tab was demonstrated by +[Rafael Weinstein](https://plus.google.com/111386188573471152118/) earlier this year. His technique uses [Mutation Observers](https://developer.mozilla.org/docs/DOM/DOM_Mutation_Observers) and a WebSocket.

Essentially, the tab that the presenter is sharing watches for changes to the page and sends diffs to the viewer using a websocket. As the user scrolls or interacts with the page, the observers pick up these changes and report them back to the viewer using Rafael's [mutation summary library](https://code.google.com/p/mutation-summary/). This keeps things performant. The entire page isn't sent for every frame.

{% YouTube id="eRZ4pO0gVWw", startTime="106" %}

As Rafael points out in the video, this is merely a proof of concept. Still, I think it's a neat way to combine a newer platform feature like Mutation Observers with an older one like Websockets.

## Method 2: Blob from an HTMLDocument + Binary WebSocket

This next method is one that recently dawned on me. It's similar to the Mutation Observers approach, but instead of sending summary diffs, it creates a Blob clone of the entire `HTMLDocument` and sends it across a binary websocket. Here's the setup by setup:

1. Rewrite all URLs on the page to be absolute. This prevents static image and CSS assets from containing broken links.
1. Clone the page's document element: `document.documentElement.cloneNode(true);`
1. Make the clone readonly, non-selectable, and prevent scrolling using CSS `pointer-events: 'none';user-select:'none';overflow:hidden;`
1. Capture the current scroll position of the page and add them as `data-*` attributes on the duplicate.
1. Create a `new Blob()` from the `.outerHTML` of the duplicate.

The code looks something like this (I've made simplifications from the full source):

```js
function screenshotPage() {
    // 1. Rewrite current doc's imgs, css, and script URLs to be absolute before
    // we duplicate. This ensures no broken links when viewing the duplicate.
    urlsToAbsolute(document.images);
    urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
    urlsToAbsolute(document.scripts);

    // 2. Duplicate entire document tree.
    var screenshot = document.documentElement.cloneNode(true);

    // 3. Screenshot should be readyonly, no scrolling, and no selections.
    screenshot.style.pointerEvents = 'none';
    screenshot.style.overflow = 'hidden';
    screenshot.style.userSelect = 'none'; // Note: need vendor prefixes

    // 4. … read on …

    // 5. Create a new .html file from the cloned content.
    var blob = new Blob([screenshot.outerHTML], {type: 'text/html'});

    // Open a popup to new file by creating a blob URL.
    window.open(window.URL.createObjectURL(blob));
}
```

`urlsToAbsolute()` contains simple regexs to rewrite relative/schemeless URLs to absolute ones. That's necessary so images, css, fonts, and scripts don't break when viewed in the context of a blob URL (e.g. from a different origin).

One last tweak I made was to add scroll support. When presenter scrolls the page, the viewer should follow along. To do that, I stash the current `scrollX` and `scrollY` positions as `data-*` attributes on the duplicate `HTMLDocument`. Before the final Blob is created, a bit of JS is injected that fires on page load:

```js
// 4. Preserve current x,y scroll position of this page. See addOnPageLoad().
screenshot.dataset.scrollX = window.scrollX;
screenshot.dataset.scrollY = window.scrollY;

// 4.5. When screenshot loads (e.g. in blob URL), scroll it to the same location
// of this page. Do this by appending a window.onDOMContentLoaded listener
// which pulls out the screenshot (dupe's) saved scrollX/Y state on the DOM.
var script = document.createElement('script');
script.textContent = '(' + addOnPageLoad_.toString() + ')();'; // self calling.
screenshot.querySelector('body').appendChild(script);

// NOTE: Not to be invoked directly. When the screenshot loads, scroll it
// to the same x,y location of original page.
function addOnPageLoad() {
    window.addEventListener('DOMContentLoaded', function(e) {
    var scrollX = document.documentElement.dataset.scrollX || 0;
    var scrollY = document.documentElement.dataset.scrollY || 0;
    window.scrollTo(scrollX, scrollY);
    });
```

Faking the scrolling gives the impression that we've screenshoted a portion of the original page, when in fact, we've duplicated the entire thing and merely repositioned it. #clever

### Demo

{% Aside %}
You may need to unblock the popup if the browser blocks it.
{% endAside %}

But for tab sharing, we need to continuously capture the tab and send it to viewers. For that I've written a small Node websocket server, app, and bookmarklet that demonstrates
the flow. If you're not interested in [the code](https://github.com/ebidel/html5demos/tree/master/screenshoter), here's a short video of things in action:

{% YouTube id="2Ke_qEZGMeo" %}

### Future Improvements

One optimization is not to duplicate the entire document on every frame. That's wasteful and something the Mutation Observer example does well at. Another improvement is
to handle relative CSS background images in `urlsToAbsolute()`. That's something
the current script doesn't consider.

## Method 3: Chrome Extension API + Binary WebSocket

At [Google I/O 2012](https://developers.google.com/events/io/sessions/gooio2012/204/), I demonstrated another approach for screensharing the contents of a browser tab. However, this one is a cheat. It requires a Chrome Extension API: not pure HTML5 magic.

{% YouTube id="X_ek1wSe66o" , startTime="2318"%}

The [source](https://github.com/ebidel/html5can/tree/master/demos/screenshare) for
this one is also up on Github, but the gist is:

1. Capture the current tab as a .png dataURL. Chrome Extensions have an API for that [`chrome.tabs.captureVisibleTab()`](http://developer.chrome.com/extensions/tabs.html#method-captureVisibleTab).
1. Convert the dataURL to a `Blob`. See [`convertDataURIToBlob()`](https://github.com/ebidel/html5can/blob/master/demos/screenshare/app.js#L40) helper.
1. Send each Blob (frame) to the viewer using a binary websocket by setting `socket.responseType='blob'`.

### Example

Here's code to screenshot the current tab as a png and send the frame through a websocket:

```js
var IMG_MIMETYPE = 'images/jpeg'; // Update to image/webp when crbug.com/112957 is fixed.
var IMG_QUALITY = 80; // [0-100]
var SEND_INTERVAL = 250; // ms

var ws = new WebSocket('ws://…', 'dumby-protocol');
ws.binaryType = 'blob';

function captureAndSendTab() {
    var opts = {format: IMG_MIMETYPE, quality: IMG_QUALITY};
    chrome.tabs.captureVisibleTab(null, opts, function(dataUrl) {
    // captureVisibleTab returns a dataURL. Decode it -> convert to blob -> send.
    ws.send(convertDataURIToBlob(dataUrl, IMG_MIMETYPE));
    });
}

var intervalId = setInterval(function() {
    if (ws.bufferedAmount == 0) {
    captureAndSendTab();
    }
}, SEND_INTERVAL);
```

### Future Improvements

The framerate is surprisingly good for this one, but it could be even better. One improvement would be to remove the overhead of converting the dataURL to a Blob. Unfortunately, `chrome.tabs.captureVisibleTab()` only gives us a dataURL. If it returned a Blob or Typed Array, we could send that directly through the websocket rather than doing the conversion to a Blob ourselves. Please star [crbug.com/32498](http://crbug.com/32498) to make that happen!

{% Aside %}
Side rant: it would be killer if FF ([bug 648610](https://bugzilla.mozilla.org/show_bug.cgi?id=648610)) and Chrome ([crbug.com/67587](http://crbug.com/67587)) implemented  `<canvas>.toBlob()`. I want to add filters/effects to an image without having to induce the overhead of a dataURL! FF has [`canvas.mozGetAsFile()`](https://developer.mozilla.org/docs/DOM/HTMLCanvasElement), but it's non-standard :(
{% endAside %}

## Method 4: WebRTC - the true future

Last but not least!

The future of screensharing in the browser will be realized by [WebRTC](http://webrtc.org). In August 14, 2012, the team proposed a [WebRTC Tab Content Capture](http://www.chromium.org/developers/design-documents/extensions/proposed-changes/apis-under-development/webrtc-tab-content-capture) API for sharing tab contents:

{% Aside %}
The proposed APIs enable tab output to be captured as a media stream, and transmitted using WebRTC.  Supporting APIs are also defined to notify and query the capture status for tabs….This API enables a special form of screencasting, but in which users are able to share the contents of a tab rather than sharing their entire desktop.*
{% endAside %}

Until this guy is ready we're left with methods 1-3.

## Conclusion

So browser tab sharing is possible with today's web technology!

But…that statement should be taken with a grain of salt. While neat, the techniques in this article fall short of a great sharing UX in one way or another. That will all change
with the [WebRTC Tab Content Capture](#toc-webrtc) effort, but until it's a reality, we're left with browser plugins or limited solutions like the ones covered here.

Have more techniques? Post a comment!