---
title: Managing several displays with the Multi-Screen Window Placement API
subhead: Get information about connected displays and position windows relative to those displays.
authors:
  - thomassteiner
description:
  The Multi-Screen Window Placement API allows you to enumerate the displays connected to your
  machine and to place windows on specific screens.
date: 2020-09-14
updated: 2022-07-19
tags:
  - blog
  - capabilities
hero: image/admin/9wQYJACMKOM6aUA0BPsW.jpg
alt: Simulated trading desk showing multiple fake cryptocurrencies and their price charts.
feedback:
  - api
---

{% Aside 'success' %} The Multi-Screen Window Placement API was part of the
[capabilities project](https://developer.chrome.com/blog/fugu-status/) and is now launched. {% endAside %}

The Multi-Screen Window Placement API allows you to enumerate the displays connected to your machine
and to place windows on specific screens.

{% Aside %} The Multi-Screen Window Placement API is distinct from the proposed
[Viewport Segments Property](https://github.com/WICG/visual-viewport/blob/gh-pages/segments-explainer/SEGMENTS-EXPLAINER.md),
which is concerned with the representation of the regions of the window that reside on separate
(adjacent) displays, for example, on foldable devices. {% endAside %}

### Suggested use cases {: #use-cases }

Examples of sites that may use this API include:

- Multi-window graphics editors à la
  [Gimp](https://www.gimp.org/release-notes/gimp-2.8.html#single-window-mode) can place various
  editing tools in accurately positioned windows.
- Virtual trading desks can show market trends in multiple windows any of which can be viewed in
  fullscreen mode.
- Slideshow apps can show speaker notes on the internal primary screen and the presentation on an
  external projector.

## Current status {: #status }

<div>

| Step                                     | Status                           |
| ---------------------------------------- | -------------------------------- |
| 1. Create explainer                      | [Complete][explainer]            |
| 2. Create initial draft of specification | [Complete][spec]                 |
| 3. Gather feedback & iterate on design   | [In progress](#feedback)         |
| 4. Origin trial                          | Complete                         |
| 5. **Launch**                            | **Complete** (Chromium&nbsp;100) |

</div>

## How to use the Multi-Screen Window Placement API {: #use }

### The problem

The time-tested approach to controlling windows,
[`Window.open()`](https://developer.mozilla.org/docs/Web/API/Window/open), is unfortunately
unaware of additional screens. While some aspects of this API seem a little archaic, such as its
[`windowFeatures`](https://developer.mozilla.org/docs/Web/API/Window/open#Parameters:~:text=title.-,windowFeatures)
`DOMString` parameter, it has nevertheless served us well over the years. To specify a window's
[position](https://developer.mozilla.org/docs/Web/API/Window/open#Position), you can pass the
coordinates as `left` and `top` (or `screenX` and `screenY` respectively) and pass the desired
[size](https://developer.mozilla.org/docs/Web/API/Window/open#Size:~:text=well.-,Size) as
`width` and `height` (or `innerWidth` and `innerHeight` respectively). For example, to open a
400×300 window at 50 pixels from the left and 50 pixels from the top, this is the code that you
could use:

```js
const popup = window.open(
  'https://example.com/',
  'My Popup',
  'left=50,top=50,width=400,height=300',
);
```

You can get information about the current screen by looking at the
[`window.screen`](https://developer.mozilla.org/docs/Web/API/Window/screen) property, which
returns a [`Screen`](https://developer.mozilla.org/docs/Web/API/Screen) object. This is the
output on my MacBook Pro 13″:

```js
window.screen;
/* Output from my MacBook Pro 13″:
  availHeight: 969
  availLeft: 0
  availTop: 25
  availWidth: 1680
  colorDepth: 30
  height: 1050
  isExtended: true
  onchange: null
  orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
  pixelDepth: 30
  width: 1680
*/
```

Like most people working in tech, I have had to adapt myself to the new work reality and set up my
personal home office. Mine looks like on the photo below (if you are interested, you can read the
[full details about my setup](https://blog.tomayac.com/2020/03/23/my-working-from-home-setup-during-covid-19/)).
The iPad next to my MacBook is connected to the laptop via
[Sidecar](https://support.apple.com/en-us/HT210380), so whenever I need to, I can quickly turn the
iPad into a second screen.

<figure>
  {% Img src="image/admin/Qt3SlHOLDzxpZ3l3bN5t.jpg", alt="School bench on two chairs. On top of the school bench are shoe boxes supporting a laptop and two iPads surrounding it.", width="558", height="520" %}
  <figcaption>A multi-screen setup.</figcaption>
</figure>

If I want to take advantage of the bigger screen, I can put the popup from the
[code sample](/multi-screen-window-placement/#the-problem) above on to the second screen. I do it
like this:

```js
popup.moveTo(2500, 50);
```

This is a rough guess, since there is no way to know the dimensions of the second screen. The info
from `window.screen` only covers the built-in screen, but not the iPad screen. The reported `width`
of the built-in screen was `1680` pixels, so moving to `2500` pixels _might_ work to shift the
window over to the iPad, since _I_ happen to know that it is located on the right of my MacBook. How
can I do this in the general case? Turns out, there is a better way than guessing. That way is the
Multi-Screen Window Placement API.

### Feature detection

To check if the Multi-Screen Window Placement API is supported, use:

```js
if ('getScreenDetails' in window) {
  // The Multi-Screen Window Placement API is supported.
}
```

### The `window-placement` permission

Before I can use the Multi-Screen Window Placement API, I must ask the user for permission to do so.
The new `window-placement` permission can be queried with the
[Permissions API](https://developer.mozilla.org/docs/Web/API/Permissions_API) like so:

```js
let granted = false;
try {
  const { state } = await navigator.permissions.query({ name: 'window-placement' });
  granted = state === 'granted';
} catch {
  // Nothing.
}
```

The browser
[can](https://webscreens.github.io/window-placement/#usage-overview-screen-information:~:text=This%20method%20may%20prompt%20the%20user%20for%20permission)
choose to show the permission prompt dynamically on the first attempt to use any of the methods of
the new API. Read on to learn more.

### The `window.screen.isExtended` property

To find out if more than one screen is connected to my device, I access the
`window.screen.isExtended` property. It returns `true` or `false`. For my setup, it returns `true`.

```js
window.screen.isExtended;
// Returns `true` or `false`.
```

### The `getScreenDetails()` method

Now that I know that the current setup is multi-screen, I can obtain more information about the
second screen using `Window.getScreenDetails()`. Calling this function will show a permission prompt that
asks me whether the site may open and place windows on my screen. The function returns a promise
that resolves with a `ScreenDetailed` object. On my MacBook Pro 13 with a connected iPad,
this includes a `screens` field with two `ScreenDetailed` objects:

```js
await window.getScreenDetails();
/* Output from my MacBook Pro 13″ with the iPad attached:
{
  currentScreen: ScreenDetailed {left: 0, top: 0, isPrimary: true, isInternal: true, devicePixelRatio: 2, …}
  oncurrentscreenchange: null
  onscreenschange: null
  screens: [{
    // The MacBook Pro
    availHeight: 969
    availLeft: 0
    availTop: 25
    availWidth: 1680
    colorDepth: 30
    devicePixelRatio: 2
    height: 1050
    isExtended: true
    isInternal: true
    isPrimary: true
    label: "Built-in Retina Display"
    left: 0
    onchange: null
    orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
    pixelDepth: 30
    top: 0
    width: 1680
  },
  {
    // The iPad
    availHeight: 999
    availLeft: 1680
    availTop: 25
    availWidth: 1366
    colorDepth: 24
    devicePixelRatio: 2
    height: 1024
    isExtended: true
    isInternal: false
    isPrimary: false
    label: "Sidecar Display (AirPlay)"
    left: 1680
    onchange: null
    orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
    pixelDepth: 24
    top: 0
    width: 1366
  }]
}
*/
```

Information about the connected screens is available in the `screens` array. Note how the value of
`left` for the iPad starts at `1680`, which is exactly the `width` of the built-in display. This
allows me to determine exactly how the screens are arranged logically (next to each other, on top of
each other, etc.). There is also data now for each screen to show whether it is an `isInternal` one
and whether it is an `isPrimary` one. Note that the built-in screen
[is not necessarily the primary screen](https://osxdaily.com/2010/04/27/set-the-primary-display-mac/#:~:text=Click%20on%20the%20Display%20icon,primary%20display%20for%20your%20Mac).

The `currentScreen` field is a live object corresponding to the current `window.screen`. The object
is updated on cross-screen window placements or device changes.

{% Aside %}
Chromium's latest API implementation returns screen labels provided by the underlying platform, like
`"Built-in Retina Display"`, instead of less descriptive placeholders, like `"Internal Display 1"`.
{% endAside %}

### The `screenschange` event

The only thing missing now is a way to detect when my screen setup changes. A new event,
`screenschange`, does exactly that: it fires whenever the screen constellation is modified. (Notice
that "screens" is plural in the event name.) This means the event fires whenever a new screen or an
existing screen is (physically or virtually in the case of Sidecar) plugged in or unplugged.

Note that you need to look up the new screen details asynchronously, the `screenschange` event
itself does not provide this data. To look up the screen details, use the live object from a cached
`Screens` interface.

```js
const screenDetails = await window.getScreenDetails();
let cachedScreensLength = screenDetails.screens.length;
screenDetails.addEventListener('screenschange', (event) => {
  if (screenDetails.screens.length !== cachedScreensLength) {
    console.log(
      `The screen count changed from ${cachedScreensLength} to ${screenDetails.screens.length}`,
    );
    cachedScreensLength = screenDetails.screens.length;
  }
});
```

### The `currentscreenchange` event

If I am only interested in changes to the current screen (that is, the value of the live object
`currentScreen`), I can listen for the `currentscreenchange` event.

```js
const screenDetails = await window.getScreenDetails();
screenDetails.addEventListener('currentscreenchange', async (event) => {
  const details = screenDetails.currentScreen;
  console.log('The current screen has changed.', event, details);
});
```

### The `change` event

Finally, if I am only interested in changes to a concrete screen, I can listen to that screen's
`change` event.

```js
const firstScreen = (await window.getScreenDetails())[0];
firstScreen.addEventListener('change', async (event) => {
  console.log('The first screen has changed.', event, firstScreen);
});
```

### New fullscreen options

Until now, you could request that elements be displayed in fullscreen mode via the aptly named
[`requestFullScreen()`](https://developer.mozilla.org/docs/Web/API/Element/requestFullscreen)
method. The method takes an `options` parameter where you can pass
[`FullscreenOptions`](https://developer.mozilla.org/docs/Web/API/FullscreenOptions). So far,
its only property has been
[`navigationUI`](https://developer.mozilla.org/docs/Web/API/FullscreenOptions/navigationUI).
The Multi-Screen Window Placement API adds a new `screen` property that allows you to determine
which screen to start the fullscreen view on. For example, if you want to make the primary screen
fullscreen:

```js
try {
  const primaryScreen = (await getScreenDetails()).screens.filter((screen) => screen.isPrimary)[0];
  await document.body.requestFullscreen({ screen: primaryScreen });
} catch (err) {
  console.error(err.name, err.message);
}
```

### Polyfill

It is not possible to polyfill the Multi-Screen Window Placement API, but you can shim its shape so
you can code exclusively against the new API:

```js
if (!('getScreenDetails' in window)) {
  // Returning a one-element array with the current screen,
  // noting that there might be more.
  window.getScreenDetails = async () => [window.screen];
  // Set to `false`, noting that this might be a lie.
  window.screen.isExtended = false;
}
```

The other aspects of the API, that is, the various screen change events and the `screen` property of
the `FullscreenOptions`, would simply never fire or silently be ignored respectively by
non-supporting browsers.

## Demo

If you are anything like me, you keep a close eye on the development of the various
cryptocurrencies. (In reality I very much do not because I love this planet, but,
for the sake of this article, just assume I
did.) To keep track of the cryptocurrencies that I own, I have developed a web app that allows me to
watch the markets in all life situations, such as from the comfort of my bed, where I have a decent
single-screen setup.

<figure>
  {% Img src="image/admin/sSLkcAMHuqBaj4AmT5eP.jpg", alt="Massive TV screen at the end of a bed with the author's legs partly visible. On the screen, a fake crypto currency trading desk. ", width="800", height="863" %}
  <figcaption>Relaxing and watching the markets.</figcaption>
</figure>

This being about crypto, the markets can get hectic at any time. Should this happen, I can quickly
move over to my desk where I have a multi-screen setup. I can click on any currency's window and
quickly see the full details in a fullscreen view on the opposite screen. Below is a recent photo of
me taken during the last [YCY bloodbath](https://www.youtube.com/watch?v=dQw4w9WgXcQ). It caught me
completely off-guard and left me
[with my hands on my face](https://www.buzzfeednews.com/article/gavon/brokers-with-hands-on-their-faces).

<figure>
  {% Img src="image/admin/wFu8TBzOAqaKCgcERr3z.jpg", alt="The author with his hands on his panicking face staring at the fake crypto currency trading desk.", width="800", height="600" %}
  <figcaption>Panicky, witnessing the YCY bloodbath.</figcaption>
</figure>

You can play with the [demo][demo] embedded below, or see its [source code][demo-source] on glitch.

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 800px; width: 100%;">
  <iframe src="https://window-placement.glitch.me/"
    title="window-placement on Glitch"
    allow="fullscreen; window-placement" sandbox="allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Security and permissions

The Chrome team has designed and implemented the Multi-Screen Window Placement API using the core
principles defined in [Controlling Access to Powerful Web Platform Features][powerful-apis],
including user control, transparency, and ergonomics. The Multi-Screen Window Placement API exposes
new information about the screens connected to a device, increasing the fingerprinting surface of
users, especially those with multiple screens consistently connected to their devices. As one
mitigation of this privacy concern, the exposed screen properties are limited to the minimum needed
for common placement use cases. User permission is required for sites to get multi-screen
information and place windows on other screens. While Chromium returns detailed screen labels,
browsers are free to return less descriptive (or even empty labels).

### User control

The user is in full control of the exposure of their setup. They can accept or decline the
permission prompt, and revoke a previously granted permission via the site information feature in
the browser.

### Enterprise control

Chrome Enterprise users can control several aspects of the Multi-Screen Window Placement API as
outlined in the relevant section of the
[Atomic Policy Groups](https://chromeenterprise.google/policies/atomic-groups/#:~:text=Window%20Placement%20settings)
settings.

### Transparency

The fact whether the permission to use the Multi-Screen Window Placement API has been granted is
exposed in the browser's site information and is also queryable via the Permissions API.

### Permission persistence

The browser persists permission grants. The permission can be revoked via the browser's site
information.

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with the Multi-Screen Window Placement API.

### Tell us about the API design

Is there something about the API that does not work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model?

- File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an existing
  issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation different from the spec?

- File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you
  can, simple instructions for reproducing, and enter [`Blink>Screen>MultiScreen`][blink-component] in the
  **Components** box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Multi-Screen Window Placement API? Your public support helps the Chrome
team to prioritize features and shows other browser vendors how critical it is to support them.

- Share how you plan to use it on the [WICG Discourse thread][wicg-discourse].
- Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
  [`#WindowPlacement`](https://twitter.com/search?q=%23WindowPlacement&src=typed_query&f=live) and
  let us know where and how you are using it.
- Ask other browser vendors to implement the API.

## Helpful links {: #helpful }

- [Spec draft][spec]
- [Public explainer][explainer]
- [Multi-Screen Window Placement API demo][demo] | [Multi-Screen Window Placement API demo
  source][demo-source]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`Blink>Screen>MultiScreen`][blink-component]
- [TAG Review][tag-review]
- [Intent to Experiment][i2e]

## Acknowledgements

The Multi-Screen Window Placement API spec was edited by
[Victor Costan](https://www.linkedin.com/in/pwnall),
[Joshua Bell](https://www.linkedin.com/in/joshuaseanbell), and
[Mike Wasserman](https://www.linkedin.com/in/mike-wasserman-9900a079/).
The API was implemented by
[Mike Wasserman](https://www.linkedin.com/in/mike-wasserman-9900a079/) and
[Adrienne Walker](https://github.com/quisquous). This article was reviewed by
[Joe Medley](https://github.com/jpmedley), [François Beaufort](https://github.com/beaufortfrancois),
and [Kayce Basques](https://github.com/kaycebasques). Thanks to Laura Torrent Puig for the photos.

[spec]: https://webscreens.github.io/window-placement/
[issues]: https://github.com/webscreens/window-placement/issues
[demo]: https://window-placement.glitch.me/
[demo-source]: https://glitch.com/edit/#!/window-placement
[explainer]: https://github.com/webscreens/window-placement/blob/main/EXPLAINER.md
[wicg-discourse]:
  https://discourse.wicg.io/t/proposal-supporting-window-placement-on-multi-screen-devices/3948
[cr-bug]: https://crbug.com/897300
[cr-status]: https://chromestatus.com/feature/5252960583942144
[blink-component]: https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3EScreen%3EMultiScreen
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[powerful-apis]:
  https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
[tag-review]: https://github.com/w3ctag/design-reviews/issues/602
[i2e]: https://groups.google.com/a/chromium.org/g/blink-dev/c/C6xw8i1ZIdE/m/TJsr0zXxBwAJ
