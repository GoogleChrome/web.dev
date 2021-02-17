---
layout: post
title:
subhead:
authors:
  - thomassteiner
date: 2021-02-16
description: |

hero: hero.jpg
alt:
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - progressive-web-apps
---

If you remember my article [Make your PWA feel more like an app](/app-like-pwas/), you may recall
how I mentioned [customizing the title bar of your app](/app-like-pwas/#customized-title-bar) as a
strategy for creating a more app-like experience. Here is an example showing the macOS Podcasts app
for how this can look like.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/o5gZ3GSKyUZOPhFxX7js.png", alt="macOS Podcasts app title bar showing media control buttons and metadata about the currently playing podcast.", width="800", height="63" %}

The Window Controls Overlay feature lets you create a similar user interface for your PWA.
Window Controls Overlay consists of four sub-features:

1. The new `"window-controls-overlay"` value for the [`display_override`](/display-override/) field
   in the web app manifest.
1. A mechanism to query for and work around the window controls region via the new
   `windowControlsOverlay` member of `window.navigator`.
1. The new CSS environment variables `titlebar-area-inset-left`, `titlebar-area-inset-right`,
   `titlebar-area-inset-top`, and ``titlebar-area-inset-bottom`.
1. The standardization of the previously proprietary CSS property `-webkit-app-region` as
   `app-region` to define draggable regions in web content.

<!--

The title bar area refers to the space to the left or right of the window controls (minimize,
maximize, close etc.) and often contains the title of the application.
This proposed feature enables developers to create progressive web applications (PWAs) with a native feel by swapping the existing full-width title bar for a small overlay containing the window controls (minimize, maximize/restore, close). This allows the developer to place custom content in what was previously the UA-controlled title bar area.

A progressive web app can opt-in to the window controls overlay by adding window-controls-overlay as the primary display_override member in the manifest.
The window controls overlay will be visible only when all the following are satisfied:
Opened in a PWA (not the browser)
Manifest includes “display_override”: [“window-controls-overlay”, ...]
PWA is not running on Android or iOS
The current origin matches the origin for which the PWA was installed

navigating to a different origin within the PWA will cause it to fall back to the normal standalone title bar, even if it meets the above criteria and is launched with the window controls overlay. This is to accommodate the black bar that appears on navigation to a different origin. After navigating back to the original origin, the window controls overlay will be used again.

query the bounding rects and visibility of the UA provided window controls region which will overlay into the web content area through a new object on the window.navigator property called windowControlsOverlay with two members:
navigator.windowControlsOverlay.getBoundingClientRect(): returns a DOMRect that represents the area under the window controls overlay, or an empty rect if not visible. Interactive web content should not be displayed beneath the overlay
navigator.windowControlsOverlay.visible: a boolean to determine if the window controls overlay has been rendered
When the overlay changes size, position, or visibility, a geometrychange event will be fired against the windowControlsOverlay object to notify the application that it should update to accommodate the changes.
For security and privacy, this information will only be exposed to the top-level frame. All sub-frames will see visible returns false and getBoundingClientRect() returns an empty rect.

CSS environment variables will be added to describe the window controls overlay area:
env(titlebar-area-inset-top)
env(titlebar-area-inset-bottom)
env(titlebar-area-inset-left)
env(titlebar-area-inset-right)
These variables will only be exposed to the top-level frame and will be undefined for all sub-frames.

The existing CSS property -webkit-app-region which defines draggable regions in web content will be standardized to app-region and enabled in the top-level frame of PWAs that satisfy the criteria specified in 2.1.1.
By default, the frameless window is non-draggable. Apps need to specify -webkit-app-region: drag in CSS to tell Electron which regions are draggable (like the OS's standard titlebar), and apps can also use -webkit-app-region: no-drag to exclude the non-draggable area from the draggable region. Note that only rectangular shapes are currently supported.


{
  "name": "Example PWA",
  "display": "standalone",
  "display_override": [
    "window-controls-overlay"
  ],
  "theme_color": "#254B85"
}


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Example PWA</title>
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="./manifest.webmanifest">
  </head>
  <body>
    <div id="titleBarContainer">
      <div id="titleBar" class=" draggable">
        <span class="draggable">Example PWA</span>
        <input class="nonDraggable" type="text"
               placeholder="Search"></input>
      </div>
    </div>
    <div id="mainContent"></div>
  </body>
</html>

:root {
  --fallback-title-bar-height: 40px;
}

.draggable {
  app-region: drag;
}

.nonDraggable {
  app-region: no-drag;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
}

#titleBarContainer {
  position: absolute;
  top: env(titlebar-area-inset-top, 0);
  bottom: env(titlebar-area-inset-bottom,
              calc(100% - var(--fallback-title-bar-height)));
  width: 100%;
  background-color:#254B85;
}

#titleBar {
  position: absolute;
  top: 0;
  display: flex;
  user-select: none;
  height: 100%;
  left: env(titlebar-area-inset-left, 0);
  right: env(titlebar-area-inset-right, 0);

  color: #FFFFFF;
  font-weight: bold;
  text-align: center;
}

#titleBar > span {
  margin: auto;
  padding: 0px 16px 0px 16px;
}

#titleBar > input {
  flex: 1;
  margin: 8px;
  border-radius: 5px;
  border: none;
  padding: 8px;
}

#mainContent {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: env(titlebar-area-inset-bottom,
              calc(100% - var(--fallback-title-bar-height)));
  overflow-y: scroll;
}


In style.css, The draggable regions are set using app-region: drag and app-region: no-drag.
On the body, margins are set to 0 to ensure the title bar reaches to the edges of the window.
The titleBarContainer uses position: absolute and sets the top to titlebar-area-inset-top, fixing the container to the top of the page. The bottom is set to titlebar-area-inset-bottom or to fall back to 100% - var(--fallback-title-bar-height) if the window controls overlay is not visible. The background color of the titleBarContainer is the same as the theme_color. The width is set to 100% so that the div fills the width of the page, and flows under the overlay when it is visible for a seamless appearance.
The titleBar also uses position: absolute and top: titlebar-area-inset-top to pin it to the top of the window. By default, it consumes the full width of the window. The left and right edges are set to titlebar-area-inset-left and titlebar-area-inset-right respectively, both falling back to 0 when these values aren't set. It also sets user-select: none to prevent any attempts at dragging the window to be consumed instead by highlighting text inside of the div.
The container for the mainContent of the webpage is also fixed in place with position: absolute and is anchored to the bottom of the page. The height is set to titlebar-area-inset-bottom, or to fall back to 100% - var(--fallback-titlebar-height), filling in the remaining space below the title bar. It sets overflow-y: scroll to allow its contents to scroll vertically within the container.
For cases where the browser does not support the window control overlay, a CSS variable is added to set a fallback title bar height. The bounds of the titleBarContainer and mainContent are initially set to fill the entire client area, and do not need to be changed if the overlay is not supported.

Giving sites partial control of the title bar leaves room for developers to spoof content in what was previously a trusted, UA-controlled region.
Currently in Chromium browsers, standalone mode includes a title bar which on initial launch displays the title of the webpage on the left, and the origin of the page on the right (followed by the "settings and more" button and the window controls). After a few seconds, the origin text disappears.
In RTL configured browsers, this layout is flipped such that the origin text is on the left. This opens the window controls overlay to spoof the origin if there is insufficient padding between the origin and the right edge of the overlay. For example, the origin "evil.ltd" could be appended with a trusted site "google.com", leading users to believe that the source is trustworthy.

The plan is to keep this origin text so that users know what the origin of the app is and can ensure that it matches their expectations, i.e. their banking app has the origin “bankofamerica.com”, not “myquestionableapp.com”.
For RTL configured browsers, there must be enough padding to the right of the origin text to prevent a malicious website from appending the unsafe origin with a trusted origin.


Enabling the window controls overlay and draggable regions do not pose considerable privacy concerns other than feature detection. However, due to differing sizes and positions of the window control buttons across operating systems, the JavaScript API for navigator.windowControlsOverlay.getBoundingClientRect() will return a rect whose position and dimensions will reveal information about the operating system upon which the browser is running. Currently, developers can already discover the OS from the user agent string, but due to fingerprinting concerns there is discussion about freezing the UA string and unifying OS versions. We would like to work with the community to understand how frequently the size of the window controls overlay changes across platforms, as we believe that these are fairly stable across OS versions and thus would not be useful for observing minor OS versions.
Although this is a potential fingerprinting issue, it only applies to installed PWAs that use the custom title bar feature and does not apply to general browser usage. Additionally, the windowControlsOverlay API will not be available to iframes embedded inside of a PWA.

-->

## Useful links

- [Explainer](https://github.com/WICG/window-controls-overlay/blob/master/explainer.md)
- [Chromium bug](https://crbug.com/937121)
- [Chrome Platform Status entry](https://chromestatus.com/feature/5741247866077184)
- [TAG review](https://github.com/w3ctag/design-reviews/issues/481)
