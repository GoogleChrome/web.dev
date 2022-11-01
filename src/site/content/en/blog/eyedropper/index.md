---
layout: post
title: Picking colors of any pixel on the screen with the EyeDropper API
subhead: >
  The EyeDropper API enables authors to use a browser-supplied eyedropper in the construction of
  custom color pickers.
authors:
  - patrickbrosset
  - thomassteiner
description: >
  Creative application developers can use the EyeDropper API to implement a picker that allows users
  to select colors from pixels on their screen, including those outside the browser.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/6Gl4RG1zitlgmpMZviDD.jpg
alt: A pipette.
date: 2021-10-27
updated: 2022-11-01
tags:
  - capabilities
  - progressive-web-apps
  - blog
---

{% Aside %} The EyeDropper API is part of the [capabilities project](https://developer.chrome.com/blog/fugu-status/) and is currently
in development. This post will be updated as the implementation progresses. {% endAside %}

## What is the EyeDropper API? {: #what }

Many creative applications allow users to pick colors from parts of the app window or even from the
entire screen, typically using an eyedropper metaphor.

Photoshop, for example, lets users sample colors from the canvas so they don't have to guess a color
and risk getting it wrong. PowerPoint also has an eyedropper tool,
useful when setting the outline or fill color of a shape. Even Chromium DevTools has an eyedropper
you can use when editing colors in the CSS styles panel so you don't have to remember or copy the
color code from somewhere else.

If you're building a creative application with web technologies, you might want to provide a similar
feature to your users. However, doing this on the web is hard, if possible at all, especially if you
want to sample colors from the entire device's screen (for example, from a different application)
and not just from the current browser tab. There isn't a browser-supplied eyedropper tool that web
apps can use for their own needs.

The [`<input type="color">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/color)
element comes close. On Chromium-based browsers running on desktop devices, it provides a helpful
eyedropper in the color picker drop down. However, using this means your app would have to customize
it with CSS, and wrap it in a bit of JavaScript to make it available to other parts of your app.
Going with this option also means other browsers would not have access to the feature.

The EyeDropper API fills this gap by providing a way to sample colors from the screen.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/JqDpX2OSqF6WAO9ytD8x.png", alt="Chromium color picker.", width="308", height="400" %}

## Current status {: #status }

<div>

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | [Complete][spec]         |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | Complete                 |
| 5. **Launch**                            | **Chromium&nbsp;95**<br/>(Desktop only.)             |

</div>

## How to use the EyeDropper API {: #use }

### Feature detection and browser support

First, make sure the API is available before using it.

```javascript
if ('EyeDropper' in window) {
  // The API is available!
}
```

The EyeDropper API is supported on Chromium-based browsers like Edge or Chrome as of
version&nbsp;95.

### Using the API

To use the API, create an `EyeDropper` object and then call its `open()` method.

```js
const eyeDropper = new EyeDropper();
```

The `open()` method returns a promise that resolves after the user selects a pixel on the
screen, and the resolved value provides access to the pixel's color in sRGBHex format (`#RRGGBB`).
The promise is rejected if the user leaves the eyedropper mode by pressing the <kbd>esc</kbd> key.

```js
try {
  const result = await eyeDropper.open();
  // The user selected a pixel, here is its color:
  const colorHexValue = result.sRGBHex;
} catch (err) {
  // The user escaped the eyedropper mode.
}
```

The app's code can also cancel the eyedropper mode. This can come in handy if the app's state
changes in a substantial way. Maybe a popup dialog appears and requires the input of the user. The
eyedropper mode should be stopped at that point.

To cancel the eyedropper, you can use an
[AbortController](https://developer.mozilla.org/docs/Web/API/AbortController) object's signal and
pass it to the `open()` method.

```js
const abortController = new AbortController();

try {
  const result = await eyeDropper.open({signal: abortController.signal});
  // ...
} catch (err) {
  // ...
}

// And then later, when the eyedropper mode needs to be stopped:
abortController.abort();
```

Putting it all together, below you can find a reusable async function:

```js
async function sampleColorFromScreen(abortController) {
  const eyeDropper = new EyeDropper();
  try {
    const result = await eyeDropper.open({signal: abortController.signal});
    return result.sRGBHex;
  } catch (e) {
    return null;
  }
}
```

## Try it!

Using Microsoft Edge or Google Chrome 95 or later, on Windows or Mac, open one of the
[EyeDropper demos](https://captainbrosset.github.io/eyedropper-demos/).

Try the [color game demo](https://captainbrosset.github.io/eyedropper-demos/color-game.html) for
instance. Hit the **Play** button and in a limited amount of time, attempt to sample a color from
the list at the bottom that matches the colored square at the top.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/gD2C2AmnOnP4EhVBhczm.png", alt="Color game demo.", width="800", height="455" %}

## Privacy and security considerations

Behind this seemingly simple web API hides a potentially harmful privacy and security concern. What
if a malicious website could start seeing pixels from your screen?

To address this concern, the API specification requires the following measures:

- First, the API doesn't actually let the eyedropper mode start without user intent. The `open()` method
  can only be called in response to a user action (like a button click).
- Second, no pixel information can be retrieved without user intent again. The promise returned by
  `open()` only resolves to a color value in response to a user action (clicking on a pixel). So the
  eyedropper cannot be used in the background without the user noticing it.
- To help users notice the eyedropper mode easily, browsers are required to make the mode obvious.
  This is why the normal mouse cursor disappears after a short delay and the dedicated user interface
  appears instead. There's also a delay between when the eyedropper mode starts and when the user
  can select a pixel to ensure the user has had time to see the magnifying glass.
- Finally, users are able to cancel the eyedropper mode at any time (by pressing the <kbd>esc</kbd>
  key).

## Feedback {: #feedback }

The Chromium team wants to hear about your experiences with the EyeDropper API.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the API's [GitHub repo][issues], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `Blink>Forms>Color` in the **Components** box.
[Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the EyeDropper API? Your public support helps the Chromium team prioritize
features and shows other browser vendors how critical it is to support them. Send a tweet to
[@ChromiumDev][cr-dev-twitter] using the hashtag
[`#EyeDropper`](https://twitter.com/search?q=%23EyeDropper&src=recent_search_click&f=live) and let
us know where and how you're using it.

## Helpful links {: #helpful }

- [Public explainer][explainer]
- [Spec draft][spec]
- [EyeDropper API Demo][demo] | [EyeDropper API Demo source][demo-source]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`Blink>Forms>Color`][blink-component]
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/587)
- [WebKit position request](https://lists.webkit.org/pipermail/webkit-dev/2021-July/031929.html)
- [Mozilla position request](https://github.com/mozilla/standards-positions/issues/557)
- [Intent to Ship](https://groups.google.com/a/chromium.org/g/blink-dev/c/rdniQ0D5UfY/m/Aywn9XyyAAAJ)

## Acknowledgements

The EyeDropper API was specified and implemented by
[Ionel Popescu](https://www.linkedin.com/in/ionelpopescu/) from the Microsoft Edge team. This post
was reviewed by [Joe Medley](https://github.com/jpmedley).

[spec]: https://wicg.github.io/eyedropper-api/
[issues]: https://github.com/wicg/eyedropper-api/issues
[demo]: https://captainbrosset.github.io/eyedropper-demos/
[demo-source]: https://github.com/captainbrosset/eyedropper-demos
[explainer]: https://github.com/WICG/eyedropper-api
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=897309
[cr-status]: https://bugs.chromium.org/p/chromium/issues/detail?id=897309
[blink-component]: https://chromestatus.com/features#component%3ABlink%3EForms%3EForms
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
