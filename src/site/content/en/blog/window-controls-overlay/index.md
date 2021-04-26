---
layout: post
title: Customize the window controls overlay of your PWA's title bar
subhead: |
  Make use of the title bar area next to the window controls to make your PWA feel more like an app.
authors:
  - thomassteiner
  - amandabaker
date: 2021-04-22
description: |
  With the Window Controls Overlay feature, developers can customize the title bar of installed PWAs
  so that their PWAs feel more like apps.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/KEHQXWqr6s7VnEfTqVOC.jpeg
alt: Kid drawing, crafting, and painting rocks.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - progressive-web-apps
  - capabilities
---

If you remember my article [Make your PWA feel more like an app](/app-like-pwas/), you may recall
how I mentioned [customizing the title bar of your app](/app-like-pwas/#customized-title-bar) as a
strategy for creating a more app-like experience. Here is an example of how this can look like
showing the macOS Podcasts app.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/o5gZ3GSKyUZOPhFxX7js.png", alt="macOS Podcasts app title bar showing media control buttons and metadata about the currently playing podcast.", width="800", height="63" %}

Now you may be tempted to object by saying that Podcasts is a platform-specific macOS app that does
not run in a browser and therefore can do what it wants without having to play by the browser's
rules. True, but the good news is that the Window Controls Overlay feature, which is the topic of
this very article, soon lets you create similar user interfaces for your PWA.

## Window Controls Overlay components

Window Controls Overlay consists of four sub-features:

1. The `"window-controls-overlay"` value for the [`"display_override"`](/display-override/) field in
   the web app manifest.
1. The CSS environment variables `titlebar-area-x`, `titlebar-area-y`, `titlebar-area-width`, and
   `titlebar-area-height`.
1. The standardization of the previously proprietary CSS property `-webkit-app-region` as the
   `app-region` property to define draggable regions in web content.
1. A mechanism to query for and work around the window controls region via the
   `windowControlsOverlay` member of `window.navigator`.

## What is Window Controls Overlay

The title bar area refers to the space to the left or right of the window controls (that is, the
buttons to minimize, maximize, close, etc.) and often contains the title of the application. Window
Controls Overlay lets progressive web applications (PWAs) provide a more app-like feel by swapping
the existing full-width title bar for a small overlay containing the window controls. This allows
developers to place custom content in what was previously the browser-controlled title bar area.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                     | Status                   |
| ---------------------------------------- | ------------------------ |
| 1. Create explainer                      | [Complete][explainer]    |
| 2. Create initial draft of specification | Not started              |
| 3. Gather feedback & iterate on design   | [In progress](#feedback) |
| 4. Origin trial                          | Not started              |
| 5. Launch                                | Not started              |

</div>

### Enabling via chrome://flags

To experiment with Window Controls Overlay locally, without an origin trial token, enable the
`#enable-desktop-pwas-window-controls-overlay` flag in `chrome://flags`.

### Enabling support during the origin trial phase

Starting in Chrome&nbsp;92, Window Controls Overlay will be available as an origin trial in Chrome.
The origin trial is expected to end in Chrome&nbsp;94 (expected in July 2021).

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

## How to use Window Controls Overlay

### Adding `window-controls-overlay` to the Web App Manifest

A progressive web app can opt-in to the window controls overlay by adding
`"window-controls-overlay"` as the primary `"display_override"` member in the web app manifest:

```json
{
  "display_override": ["window-controls-overlay"]
}
```

The window controls overlay will be visible only when all of the following conditions are satisfied:

1. The app is _not_ opened in the browser, but in a separate PWA window.
1. The manifest includes `"display_override": ["window-controls-overlay"]`. (Other values are
   allowed thereafter.)
1. The PWA is running on a desktop operating system.
1. The current origin matches the origin for which the PWA was installed.

The result of this is an empty title bar area with the regular window controls on the left or the
right, depending on the operating system.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/7slf2HkHYGyhhLzdBz9Q.png", alt="App window with an empty titlebar with the window controls on the right.", width="800", height="112" %}

### Moving content into the title bar

Now that there is space in the title bar, you can move something there. For this article, I have
built a Chuck Norris jokes PWA. A useful feature for this app may be a search for words in jokes.
Fun fact: Chuck Norris has installed this PWA on his iPhone and has let me know he loves the push
notifications he receives whenever a new joke is submitted. The HTML for the search feature looks
like this:

```html
<div class="search">
  <img src="chuck-norris.png" alt="Chuck Norris" width="32" height="32" />
  <label>
    <input type="search" />
    Search words in jokes
  </label>
</div>
```

To move this `div` up into the title bar, some CSS is needed:

```css
.search {
  /* Make sure the `div` stays there, even when scrolling. */
  position: fixed;
  /**
   * Gradient, because why not. Endless opportunities.
   * The gradient ends in maroon, which happens to be the app's
   * `<meta name="theme-color" content="maroon">`.
   */
  background-image: linear-gradient(90deg, #131313, 33%, maroon);
  /* Use the environment variable for the left anchoring with a fallback. */
  left: env(titlebar-area-x, 0);
  /* Use the environment variable for the top anchoring with a fallback. */
  top: env(titlebar-area-y, 0);
  /* Use the environment variable for setting the width with a fallback. */
  width: env(titlebar-area-width, 100%);
  /* Use the environment variable for setting the height with a fallback. */
  height: env(titlebar-area-height, 33px);
}
```

You can see the effect of this code in the screenshot below. The title bar is fully responsive. When
you resize the PWA window, the title bar reacts as if it were composed of regular HTML content,
which, in fact, it is.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/5dc2j3CfrKczvTaASvKE.png", alt="App window with a search bar in the title bar.", width="800", height="112" %}

### Determining which parts of the title bar are draggable

While the screenshot above suggests that you are done, you are not done quite yet. The PWA window is
no longer draggable (apart from a very small area), since the window controls buttons are no drag
areas, and the rest of the title bar consists of the search widget. This can be fixed by leveraging
the `app-region` CSS property with a value of `drag`. In the concrete case, it is fine to make
everything besides the `input` element draggable.

```css
/* The entire search `div` is draggable… */
.search {
  -webkit-app-region: drag;
  app-region: drag;
}

/* …except for the `input`. */
input {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}
```

{% Aside %}
For now, `app-region` has not been standardized yet, so the plan is to continue using the prefixed
`-webkit-app-region` until `app-region` is standardized. Currently, only `-webkit-app-region` is
supported in the browser.
{% endAside %}

With this CSS in place, the user can drag the app window as usual by dragging the `div`, the `img`,
or the `label`. Only the `input` element is interactive so the search query can be entered.

### Feature detection

Support for Window Controls Overlay can be detected by testing for the existence of
`windowControlsOverlay`:

```js
if ('windowControlsOverlay' in navigator) {
  // Window Controls Overlay is supported.
}
```

### Querying the window controls region with `windowControlsOverlay`

The code so far has only one problem: on some platforms the window controls are on the right, on
others they are on the left. To make matters worse, the "three dots" Chrome menu will change
position, too, based on the platform. This means that the linear gradient background image needs to
be dynamically adapted to run from `#131313`→`maroon` or `maroon`→`#131313`→`maroon`, so that it
blends in with the title bar's `maroon` background color that is determined by
`<meta name="theme-color" content="maroon">`. This can be achieved by querying the
[`getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
API on the `navigator.windowControlsOverlay` property.

```js
if ('windowControlsOverlay' in navigator) {
  const { x } = navigator.windowControlsOverlay.getBoundingClientRect();
  // Window controls are on the right (like on Windows).
  // Chrome menu is left of the window controls.
  // [ windowControlsOverlay___________________ […] [_] [■] [X] ]
  if (x === 0) {
    div.classList.add('search-controls-right');
  }
  // Window controls are on the left (like on macOS).
  // Chrome menu is right of the window controls overlay.
  // [ [X] [_] [■] ___________________windowControlsOverlay [⋮] ]
  else {
    div.classList.add('search-controls-left');
  }
} else {
  // When running in a non-supporting browser tab.
  div.classList.add('search-controls-right');
}
```

Rather than having the background image in the `.search` class CSS rules directly (as before), the
modified code now uses two classes that the code above sets dynamically.

```css
/* For macOS: */
.search-controls-left {
  background-image: linear-gradient(90deg, maroon, 45%, #131313, 90%, maroon);
}

/* For Windows: */
.search-controls-right {
  background-image: linear-gradient(90deg, #131313, 33%, maroon);
}
```

### Determining if the window controls overlay is visible

The window controls overlay will not be visible in the title bar area in all circumstances. While it
will naturally not be there on browsers that do not support the Window Controls Overlay feature, it
will also not be there when the PWA in question runs in a tab. To detect this situation, you can
query the `visible` property of the `windowControlsOverlay`:

```js
if (navigator.windowControlsOverlay.visible) {
  // The window controls overlay is visible in the title bar area.
}
```

{% Aside %} The window controls overlay visibility is not to be confused with the visibility in the
CSS sense of whatever HTML content you place next to the window controls overlay. Even if you set
`display: none` on the `div` placed into the window controls overlay, the `visible` property of the
window controls overlay would still report `true`. {% endAside %}

### Being notified of geometry changes

Querying the window controls overlay area with `getBoundingClientRect()` can suffice for one-off
things like setting the correct background image based on where the window controls are, but in
other cases, more fine-grained control is necessary. For example, a possible use case could be to
adapt the window controls overlay based on the available space and to add a joke right in the window
control overlay when there is enough space.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/Unm5S2dB3szfFF2YCcFO.png", alt="Window controls overlay area on wide window displaying an additional joke (which reads Chuck Norris can find a word that rhymes with orange.)", width="800", height="73" %}

You can be notified of geometry changes by subscribing to
`navigator.windowControlsOverlay.ongeometrychange` or by setting up an event listener for the
`geometrychange` event. This event will only fire when the window controls overlay is visible, that
is, when `navigator.windowControlsOverlay.visible` is `true`.

{% Aside %} Since this event fires frequently (comparable to how a scroll listener fires), I always
recommend you use a
[debounce function](https://css-tricks.com/the-difference-between-throttling-and-debouncing/#debouncing-enforces-that-a-function-not-be-called-again-until-a-certain-amount-of-time-has-passed-without-it-being-called-as-in-execute-this-function-only-if-100-milliseconds-have-passed-witho)
so the event does not fire too often. {% endAside %}

```js
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

if ('windowControlsOverlay' in navigator) {
  navigator.windowControlsOverlay.ongeometrychange = debounce((e) => {
    span.hidden = e.boundingRect.width < 800;
  }, 250);
}
```

Rather than assigning a function to `ongeometrychange`, you can also add an event listener to
`windowControlsOverlay` like below. You can read up on the difference between the two on
[MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers).

```js
navigator.windowControlsOverlay.addEventListener(
  'geometrychange',
  debounce((e) => {
    span.hidden = e.boundingRect.width < 800;
  }, 250),
);
```

### Compatibility when running in a tab and on non-supporting browsers

There are two possible cases to consider:

- The case where an app is running in a browser that _does_ support Window Controls Overlay, but
  where the app is used in a browser tab.
- The case where an app is running in a browser that _does not_ support Window Controls Overlay.

In both cases, by default the HTML the developer has determined to be placed in the window controls
overlay will display inline like regular HTML content and the `env()` variables' fallback values
will kick in for the positioning. On supporting browsers, you can also decide to not display the
HTML designated for the window controls overlay by checking the overlay's `visible` property, and if
it reports `false`, then hiding that HTML content.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/jgS3hkEbaJ8bU2Jl9Pdz.png", alt="PWA running in a browser tab with the window controls overlay displayed in the body.", width="800", height="118" %}

As a reminder, non-supporting browsers will either not consider the
[`"display_override"`](/display-override/) web app manifest property at all, or not recognize the
`"window-controls-overlay"` and thus use the next possible value according to the fallback chain,
for example, `"standalone"`.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/MMgzCRS0207kFpQnNwgb.png", alt="PWA running in standalone mode with the window controls overlay displayed in the body.", width="800", height="99" %}

## Demo

I have created a [demo](https://window-controls-overlay.glitch.me/) that you can play with in
different supporting and non-supporting browsers and in the installed and non-installed state. For
the actual Window Controls Overlay experience, you need to install the app and set the
[flag](#enabling-via-chrome:flags). You can see two screenshots of what to expect below. The
[source code](https://glitch.com/edit/#!/window-controls-overlay) of the app is available on Glitch.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/lbwvSfjfLzPUSCDfDFDE.png", alt="Chuck Norris jokes demo app with Window Controls Overlay.", width="400", height="312" %}

The search feature in the window controls overlay is fully functional:

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/KpJcvlSpdiVw4wG9zPt3.png", alt="Chuck Norris jokes demo app with Window Controls Overlay and active search for the term 'canyon' highlighting one of the jokes with the matched term.", width="400", height="312" %}

## Security considerations

The Chromium team has designed and implemented the Window Controls Overlay API using the core
principles defined in [Controlling Access to Powerful Web Platform Features][powerful-apis],
including user control, transparency, and ergonomics.

### Spoofing

Giving sites partial control of the title bar leaves room for developers to spoof content in what
was previously a trusted, browser-controlled region. Currently, in Chromium browsers, standalone
mode includes a title bar which on initial launch displays the title of the webpage on the left, and
the origin of the page on the right (followed by the "settings and more" button and the window
controls). After a few seconds, the origin text disappears. If the browser is set to a right-to-left
(RTL) language, this layout is flipped such that the origin text is on the left. This opens the
window controls overlay to spoof the origin if there is insufficient padding between the origin and
the right edge of the overlay. For example, the origin "evil.ltd" could be appended with a trusted
site "google.com", leading users to believe that the source is trustworthy. The plan is to keep this
origin text so that users know what the origin of the app is and can ensure that it matches their
expectations. For RTL configured browsers, there must be enough padding to the right of the origin
text to prevent a malicious website from appending the unsafe origin with a trusted origin.

### Fingerprinting

Enabling the window controls overlay and draggable regions do not pose considerable privacy concerns
other than feature detection. However, due to differing sizes and positions of the window controls
buttons across operating systems, the JavaScript API for
<code>navigator.<wbr>windowControlsOverlay.<wbr>getBoundingClientRect()</code> will return a
[`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) whose position and dimensions
will reveal information about the operating system upon which the browser is running. Currently,
developers can already discover the OS from the user agent string, but due to fingerprinting
concerns, there is discussion about freezing the UA string and unifying OS versions. There is an
ongoing effort with the community to understand how frequently the size of the window controls
overlay changes across platforms, as the current assumption is that these are fairly stable across
OS versions and thus would not be useful for observing minor OS versions. Although this is a
potential fingerprinting issue, it only applies to installed PWAs that use the custom title bar
feature and does not apply to general browser usage. Additionally, the
<code>navigator.<wbr>windowControlsOverlay</code> API will not be available to iframes embedded
inside of a PWA.

### Navigation

Navigating to a different origin within the PWA will cause it to fall back to the normal standalone
title bar, even if it meets the above criteria and is launched with the window controls overlay.
This is to accommodate the black bar that appears on navigation to a different origin. After
navigating back to the original origin, the window controls overlay will be used again.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/8Yn3rH0FirYKgiHKUCA7.png", alt="Black URL bar for out-of-origin navigation.", width="800", height="169" %}

## Feedback {: #feedback }

The Chromium team wants to hear about your experiences with the Window Controls Overlay API.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are there missing methods
or properties that you need to implement your idea? Have a question or comment on the security
model? File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an
existing issue.

### Report a problem with the implementation

Did you find a bug with Chromium's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can,
simple instructions for reproducing, and enter `UI>Browser>WebAppInstalls` in the **Components**
box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the Window Controls Overlay API? Your public support helps the Chromium team
to prioritize features and shows other browser vendors how critical it is to support them.

Send a Tweet to [@ChromiumDev][cr-dev-twitter] with the
[`#WindowControlsOverlay`](https://twitter.com/search?q=%23WindowControlsOverlay&src=recent_search_click&f=live)
hashtag and let us know where and how you're using it.

## Helpful links {: #helpful }

- [Explainer][explainer]
- [Chromium bug](https://crbug.com/937121)
- [Chrome Platform Status entry](https://chromestatus.com/feature/5741247866077184)
- [TAG review](https://github.com/w3ctag/design-reviews/issues/481)

## Acknowledgements

Window Controls Overlay was implemented and specified by
[Amanda Baker](https://www.linkedin.com/in/amanda-baker-20a2b962/) from the Microsoft Edge team.
This article was reviewed by
[Joe Medley](https://github.com/jpmedley) and [Kenneth Rohde Christiansen](https://github.com/kenchris).
Hero image by [Sigmund](https://unsplash.com/@sigmund) on
[Unsplash](https://unsplash.com/photos/OV44gxH71DU).

[explainer]: https://github.com/WICG/window-controls-overlay/blob/master/explainer.md
[cr-dev-twitter]: https://twitter.com/ChromiumDev
[issues]: https://github.com/WICG/window-controls-overlay/issues
[powerful-apis]: https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md
