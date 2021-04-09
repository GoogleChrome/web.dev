---
layout: post
title: Customize the window controls overlay of your PWA's title bar
subhead:
authors:
  - thomassteiner
date: 2021-04-08
description: |

# hero: hero.jpg
alt:
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

Now you may be tempted to object by saying that Podcasts is a platform-specific macOS app
that does not run in a browser and therefore can do what it wants without having to play by the browser's rules.
True, but the good news is that the Window Controls Overlay feature, which is the topic of this
very article, soon lets you create similar user interfaces for your PWA.

## Window Controls Overlay components

Window Controls Overlay consists of four sub-features:

1. The `"window-controls-overlay"` value for the [`"display_override"`](/display-override/) field
   in the web app manifest.
1. The CSS environment variables `titlebar-area-x`, `titlebar-area-y`,
   `titlebar-area-width`, and `titlebar-area-height`.
1. The standardization of the previously proprietary CSS property `-webkit-app-region` as the
   `app-region` property to define draggable regions in web content.
1. A mechanism to query for and work around the window controls region via the
   `windowControlsOverlay` member of `window.navigator`.

## What is Window Controls Overlay

The title bar area refers to the space to the left or right of the window controls (that is, the
buttons to minimize, maximize, close, etc.) and often contains the title of the application.
Window Controls Overlay lets Progressive Web Applications (PWAs)
provide a more app-like feel by swapping the existing full-width title bar for a small overlay containing the
window controls. This allows developers to place custom content in what was previously the
browser-controlled title bar area.

## Current status {: #status }

<div class="w-table-wrapper">

| Step                                       | Status                       |
| ------------------------------------------ | ---------------------------- |
| 1. Create explainer                        | [Complete][explainer]        |
| 2. Create initial draft of specification   | Not started                  |
| 3. Gather feedback & iterate on design     | [In progress](#feedback)     |
| 4. Origin trial                            | Not started                  |
| 5. Launch                                  | Not started                  |

</div>

### Enabling via chrome://flags

To experiment with Window Controls Overlay locally, without an origin trial token, enable the `#enable-desktop-pwas-window-controls-overlay` flag in `chrome://flags`.

### Enabling support during the origin trial phase

Starting in Chrome XX, Window Controls Overlay will be available as an origin trial in Chrome. The origin trial is expected to end in Chrome XX (TODO exact date).

{% include 'content/origin-trials.njk' %}

### Register for the origin trial {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

## How to use Window Controls Overlay

### Adding `window-controls-overlay` to the Web App Manifest

A progressive web app can opt-in to the window controls overlay by adding `"window-controls-overlay"`
as the primary `"display_override"` member in the web app manifest:

```json
{
  …
  "display_override": ["window-controls-overlay"],
  …
}
```

The window controls overlay will be visible only when all of the following conditions are satisfied:

1. The app is _not_ opened in the browser, but in a separate PWA window.
1. The manifest includes `"display_override": ["window-controls-overlay"]"`.
   (Other values are allowed thereafter.)
1. The PWA is running on a desktop operating system.
1. The current origin matches the origin for which the PWA was installed.

The result of this is an empty title bar area with the regular window controls on the left or the
right, depending on the operating system.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/7slf2HkHYGyhhLzdBz9Q.png", alt="App window with an empty titlebar with the window controls on the right.", width="800", height="112" %}

### Moving content into the title bar

Now that there is space in the title bar, I can move something there.
For this article, I have built a Chuck Norris jokes PWA. A useful feature for this app may be a
search for words in jokes. Fun fact: Chuck Norris has installed this PWA on his iPhone and has let
me know he loves the push notifications he receives whenever a new joke is submitted.
The HTML for the search feature looks like this:

```html
<div class="search">
  <img src="chuck-norris.png" alt="Chuck Norris" width="32" height="32">
  <label>
    <input type="search">
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

You can see the effect of this code in the screenshot below. The title bar is fully responsive.
When I resize the PWA window, the title bar reacts as if it were composed of regular HTML content,
which, in fact, it is.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/5dc2j3CfrKczvTaASvKE.png", alt="App window with a search bar in the title bar.", width="800", height="112" %}

### Determining which parts of the title bar are draggable

While the screenshot above suggests that I am done, I am not done quite yet. The PWA window is no longer
draggable, since the window controls buttons are no drag areas, and the rest of the title bar consists of the
search widget. This can be fixed by leveraging the `app-region` CSS property with a value of `drag`.
In the concrete case it is fine to make everything besides the `input` element draggable.

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

With this CSS in place, the user can drag the app window as usual by dragging the `div`, the `img`,
or the `label`. Only the `input` element is interactive so the search query can be entered.

### Querying the window controls region with `windowControlsOverlay`



### Compatibility when running in tab and non-supporting browsers



## Security considerations

Giving sites partial control of the title bar leaves room for developers to spoof content in what was previously a trusted, UA-controlled region.
Currently in Chromium browsers, standalone mode includes a title bar which on initial launch displays the title of the webpage on the left, and the origin of the page on the right (followed by the "settings and more" button and the window controls). After a few seconds, the origin text disappears.
In RTL configured browsers, this layout is flipped such that the origin text is on the left. This opens the window controls overlay to spoof the origin if there is insufficient padding between the origin and the right edge of the overlay. For example, the origin "evil.ltd" could be appended with a trusted site "google.com", leading users to believe that the source is trustworthy.

The plan is to keep this origin text so that users know what the origin of the app is and can ensure that it matches their expectations, i.e. their banking app has the origin “bankofamerica.com”, not “myquestionableapp.com”.
For RTL configured browsers, there must be enough padding to the right of the origin text to prevent a malicious website from appending the unsafe origin with a trusted origin.

Enabling the window controls overlay and draggable regions do not pose considerable privacy concerns other than feature detection. However, due to differing sizes and positions of the window control buttons across operating systems, the JavaScript API for navigator.windowControlsOverlay.getBoundingClientRect() will return a rect whose position and dimensions will reveal information about the operating system upon which the browser is running. Currently, developers can already discover the OS from the user agent string, but due to fingerprinting concerns there is discussion about freezing the UA string and unifying OS versions. We would like to work with the community to understand how frequently the size of the window controls overlay changes across platforms, as we believe that these are fairly stable across OS versions and thus would not be useful for observing minor OS versions.
Although this is a potential fingerprinting issue, it only applies to installed PWAs that use the custom title bar feature and does not apply to general browser usage. Additionally, the windowControlsOverlay API will not be available to iframes embedded inside of a PWA.

Navigating to a different origin within the PWA will cause it to fall back to the normal standalone title bar, even if it meets the above criteria and is launched with the window controls overlay. This is to accommodate the black bar that appears on navigation to a different origin. After navigating back to the original origin, the window controls overlay will be used again.

## Security and permissions

The Chrome team has designed and implemented the API_NAME API using the core principles defined in [Controlling Access to Powerful Web Platform Features][powerful-apis], including user control, transparency, and ergonomics.

### User control

TODO: How does a user enable or disable this API? Will they be prompted for permission before it's enabled? Is it on by default, can they turn it off?

### Transparency

TODO: Is there any indication that the API is in use? Is there an icon in the address bar, or tab? How does a user know that the site is using the API?

### Permission persistence
TODO: Is the permission persisted between visits? Or when they come back, do they need to give permission again?

## Feedback {: #feedback }

The Chrome team wants to hear about your experiences with the API_NAME API.

### Tell us about the API design

Is there something about the API that doesn't work like you expected? Or are there missing methods or properties that you need to implement your idea? Have a question or comment on the security model?
File a spec issue on the corresponding [GitHub repo][issues], or add your thoughts to an existing issue.

### Report a problem with the implementation

Did you find a bug with Chrome's implementation? Or is the implementation different from the spec?
File a bug at [new.crbug.com](https://new.crbug.com). Be sure to include as much detail as you can, simple instructions for reproducing, and enter `TODO` in the **Components** box. [Glitch](https://glitch.com/) works great for sharing quick and easy repros.

### Show support for the API

Are you planning to use the API_NAME API? Your public support helps the Chrome team to prioritize features and shows other browser vendors how critical it is to support them.

Share how you plan to use it on the [WICG Discourse thread][wicg-discourse]
Send a Tweet to [@ChromiumDev][cr-dev-twitter] with the [`#WindowControlsOverlay`](https://twitter.com/search?q=%23WindowControlsOverlay&src=recent_search_click&f=live) hashtag and let us know where and how you're using it.

## Helpful links {: #helpful }

- [Explainer][explainer]
- [Chromium bug](https://crbug.com/937121)
- [Chrome Platform Status entry](https://chromestatus.com/feature/5741247866077184)
- [TAG review](https://github.com/w3ctag/design-reviews/issues/481)

## Acknowledgements

[explainer]: https://github.com/WICG/window-controls-overlay/blob/master/explainer.md

