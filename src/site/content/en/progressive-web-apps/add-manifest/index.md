---
layout: post
title: Add a web app manifest
authors:
  - petelepage
  - beaufortfrancois
  - thomassteiner
  - alexeyrodionov
date: 2018-11-05
updated: 2023-08-11
description: |
  The web app manifest is a simple JSON file that tells the browser about your
  web application and how it should behave when installed on the user's mobile
  device or desktop.
tags:
  - progressive-web-apps
  - web-app-manifest
feedback:
  - api
---

The web app manifest is a JSON file that tells the browser about your
Progressive Web App and how it should behave when installed on the user's
desktop or mobile device. A typical manifest file includes the app name, the
icons the app should use, and the URL that should be opened when the
app is launched, among other things.
{% BrowserCompat 'html.manifest.name' %}

## Create the manifest file {: #create }

The manifest file can have any name, but is commonly named `manifest.json` and
served from the root (your website's top-level directory). The specification
suggests the extension should be `.webmanifest`, but browsers also support
`.json` extensions, which may be easier for developers to understand.

A typical manifest looks something like this:

```json
{
  "short_name": "Weather",
  "name": "Weather: Do I need an umbrella?",
  "icons": [
    {
      "src": "/images/icons-vector.svg",
      "type": "image/svg+xml",
      "sizes": "512x512"
    },
    {
      "src": "/images/icons-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/images/icons-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "id": "/?source=pwa",
  "start_url": "/?source=pwa",
  "background_color": "#3367D6",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#3367D6",
  "shortcuts": [
    {
      "name": "How's weather today?",
      "short_name": "Today",
      "description": "View weather information for today",
      "url": "/today?source=pwa",
      "icons": [{ "src": "/images/today.png", "sizes": "192x192" }]
    },
    {
      "name": "How's weather tomorrow?",
      "short_name": "Tomorrow",
      "description": "View weather information for tomorrow",
      "url": "/tomorrow?source=pwa",
      "icons": [{ "src": "/images/tomorrow.png", "sizes": "192x192" }]
    }
  ],
  "description": "Weather forecast information",
  "screenshots": [
    {
      "src": "/images/screenshot1.png",
      "type": "image/png",
      "sizes": "540x720",
      "form_factor": "narrow"
    },
    {
      "src": "/images/screenshot2.jpg",
      "type": "image/jpg",
      "sizes": "720x540",
      "form_factor": "wide"
    }
  ]
}
```

### Key manifest properties {: #manifest-properties }

#### `short_name` and/or `name` {: #name }

You must provide at least the `short_name` or `name` property. If both are
provided, `short_name` is used on the user's home screen, launcher, or other
places where space may be limited. `name` is used when the app is installed.

{% Aside %}
Operating systems usually expect to have a title for each app window. This
title is displayed in various window-switching surfaces such as
<kbd>alt</kbd>+<kbd>tab</kbd>, overview mode, and the shelf window list.

For PWAs running in standalone mode, Chromium prepends the `short_name`
(or, if it's not available, the `name`) to what is
specified in the `<title>` of the HTML document to prevent disguise attacks
where standalone apps might try to be mistaken, for example, for operating
system dialogs.

In consequence, developers should _not_ repeat the
application name in the `<title>` when the app is running in standalone mode.
{% endAside %}

#### `icons` {: #icons }

When a user installs your PWA, you can define a set of icons for the browser
to use on the home screen, app launcher, task switcher, splash screen, and so on.

The `icons` property is an array of image objects. Each object must
include the `src`, a `sizes` property, and the `type` of image. To use
[maskable icons](/maskable-icon/), sometimes referred to as adaptive
icons on Android, you'll also need to add `"purpose": "any maskable"` to the
`icon` property.

For Chromium, you must provide at least a 192x192 pixel icon, and a 512x512
pixel icon. If only those two icon sizes are provided, Chrome
automatically scales the icons to fit the device. If you'd prefer to scale your
own icons, and adjust them for pixel-perfection, provide icons in increments
of 48dp.

{% Aside %}
Chromium-based browsers also support SVG icons which can be scaled arbitrarily
without looking pixelated and that support advanced features like
[responsiveness to `prefers-color-scheme`](https://blog.tomayac.com/2021/07/21/dark-mode-web-app-manifest-app-icons/),
with the caveat that the icons do not update live, but remain in the
state they were in at install time.

To use SVG icons safely, you should always specify a rasterized icon as a
fallback for browsers that do not support SVG icons.
{% endAside %}

#### `id` {: #id }

The `id` property allows you to explicitly define the identifier used for your application. Adding the `id` property to the manifest removes the dependency on the `start_url` or the location of the manifest, and makes it possible for them to be updated in the future. For more information, see [Uniquely identifying PWAs with the web app manifest id property](https://developer.chrome.com/blog/pwa-manifest-id/).

#### `start_url` {: #start-url }

The `start_url` is required and tells the browser where your application
should start when it is launched, and prevents the app from starting on
whatever page the user was on when they added your app to their home screen.

Your `start_url` should direct the user straight into your app, rather than
a product landing page. Think about what the user will want to do once
they open your app, and place them there.

#### `background_color` {: #background-color }

The `background_color` property is used on the splash screen when the
application is first launched on mobile.

#### `display` {: #display }

You can customize what browser UI is shown when your app is launched. For
example, you can hide the address bar and browser
user interface elements. Games can even
be made to launch full screen. The `display` property takes one of the following values:

<div class="table-wrapper">
  <table id="display-params">
    <thead>
      <tr>
        <th><strong>Property</strong></th>
        <th><strong>Use</strong></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>fullscreen</code></td>
        <td>
          Opens the web application without any browser UI and takes
          up the entirety of the available display area.
        </td>
      </tr>
      <tr>
        <td><code>standalone</code></td>
        <td>
          Opens the web app to look and feel like a standalone
          app. The app runs in its own window, separate from the browser, and
          hides standard browser UI elements such as the URL bar.
          <figure>
            {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/XdBsDeRZozIyXyiXA59n.png", alt="An example of a PWA window with standalone display.", width="800", height="196" %}
          </figure>
        </td>
      </tr>
      <tr>
        <td><code>minimal-ui</code></td>
        <td>
          This mode is similar to <code>standalone</code>, but provides the
          user a minimal set of UI elements for controlling navigation (such
          as back and reload).
          <figure>
            {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/trPwjcMio7tBKGBNoT9u.png", alt="An example of a PWA window with minimal-ui display.", width="800", height="196" %}
          </figure>
        </td>
      </tr>
      <tr>
        <td><code>browser</code></td>
        <td>A standard browser experience.</td>
      </tr>
    </tbody>
  </table>
</div>

#### `display_override` {: #display-override }

Web apps can choose how they are displayed by setting a `display` mode in their manifest as
[explained above](#display). Browsers are *not* required to support all display modes, but they
*are* required to support the
[spec-defined fallback chain](https://w3c.github.io/manifest/#dfn-fallback-display-mode)
(`"fullscreen"` → `"standalone"` → `"minimal-ui"` → `"browser"`). If they don't support a given
mode, they fall back to the next display mode in the chain. This inflexible behavior can be
problematic in rare cases. For example, a developer cannot request `"minimal-ui"` without being
forced back into the `"browser"` display mode when `"minimal-ui"` is not supported.
Another problem is that the current behavior makes it impossible to introduce new display
modes in a backward compatible way, since explorations like tabbed application mode don't have a
natural place in the fallback chain.

These problems are solved by the `display_override` property, which the browser considers *before*
the `display` property. Its value is a sequence of strings that are considered in the listed order, and the
first supported display mode is applied. If none are supported, the browser falls back to evaluating
the `display` field.

Consider the example below. (The details of
[`"window-control-overlay"`](/window-controls-overlay/) are out-of-scope for
this article.)

```json
{
  "display_override": ["window-control-overlay", "minimal-ui"],
  "display": "standalone",
}
```

As stated, the browser will look at `display_override` first.

1. `"window-control-overlay"`
1. `"minimal-ui"`

If neither option is available, it falls back to `display`. If `"standalone"` is
not available, it resumes spec-defined fallabck chain from that point.

1. `"standalone"`
1. `"minimal-ui"`
1. `"browser"`

{% Aside %}
  The browser will not consider `display_override` unless `display` is also present.
{% endAside %}

#### `scope` {: #scope }

The `scope` defines the set of URLs that the browser considers to be within your
app, and is used to decide when the user has left the app. The `scope`
controls the URL structure that encompasses all the entry and exit points in
your web app. Your `start_url` must reside within the `scope`.

{% Aside 'caution' %}
If the user clicks a link in your app that navigates outside of the
`scope`, the link opens and renders within the existing PWA window. If
you want the link to open in a browser tab, you must add `target="_blank"`
to the `<a>` tag. On Android, links with `target="_blank"` open in a
[Chrome Custom Tab](https://developer.chrome.com/multidevice/android/customtabs).
{% endAside %}

A few other notes on `scope`:

* If you don't include a `scope` in your manifest, then the default implied
  `scope` is the directory that your web app manifest is served from.
* The `scope` attribute can be a relative path (`../`), or any higher level
  path (`/`) which would allow for an increase in coverage of navigations
  in your web app.
* The `start_url` must be in the scope.
* The `start_url` is relative to the path defined in the `scope` attribute.
* A `start_url` starting with `/` will always be the root of the origin.

#### `theme_color` {: #theme-color }

The `theme_color` sets the color of the tool bar, and may be reflected in
the app's preview in task switchers. The `theme_color` should match the
`meta` theme color specified in your document head.


<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8mkBdT3O0FZLo0PUppvv.png", alt="An example of a PWA window with custom theme_color.", width="800", height="196" %}
  <figcaption>
    An example of a PWA window with custom theme_color.
  </figcaption>
</figure>

As of Chromium&nbsp;93 and Safari&nbsp;15, you can adjust this color in a
media query with the `media` attribute of the `meta` theme color element. The
first one that matches will be picked. For example, you could have one color for
light mode and another one for dark mode. At the time of writing, you can't
define those in your manifest. See [w3c/manifest#975 GitHub
issue](https://github.com/w3c/manifest/issues/975).

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="white">
<meta name="theme-color" media="(prefers-color-scheme: dark)"  content="black">
```

#### `shortcuts` {: #shortcuts }

The `shortcuts` property is an array of [app shortcut](/app-shortcuts) objects
whose goal is to provide quick access to key tasks within your app. Each member
is a dictionary that contains at least a `name` and a `url`.

#### `description` {: #description }

The `description` property describes the purpose of your app.

In Chrome, the maximum description length is limited to 300 characters on all
platforms. If the description is longer than that, it will be truncated with
an ellipsis character. On Android, there is an additional limit of at most 7 lines.

#### `screenshots` {: #screenshots }

The `screenshots` property is an array of image objects representing your app
in common usage scenarios. Each object must include the `src`, a `sizes`
property, and the `type` of image.  The `form_factor` property is optional.
You can set it either to `"wide"` for screenshots applicable to wide screens
only or `"narrow"` for narrow screenshots.

In Chrome, the image must respond to certain criteria:

* Width and height must be at least 320px and at most 3840px.
* The maximum dimension can't be more than 2.3 times as long as the minimum
  dimension.
* All screenshots matching the appropriate form factor must have the same
  aspect ratio.
* As of Chrome&nbsp;109, only screenshots with the `form_factor` set to `"wide"`
are displayed on desktop.
* As of Chrome&nbsp;109, screenshots with the `form_factor` set to `"wide"` are
ignored on Android. Screenshots without `form_factor` are still displayed for
backwards compatibility. In the future this will be changed to only display
screenshots with the `form_factor` set to `"narrow"`.

Chrome on desktop displays at least 1 and at most 8 screenshots that meet the
criteria above. The rest will be ignored.

Chrome on Android displays at least 1 and at most 5 screenshots that meet the
criteria above. The rest will be ignored.

<figure>
  {% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/5SlCnibmZHqkXdGVgPZY.jpeg", alt="Screenshots of richer installation UI on desktop and mobile", width="800", height="386" %}
  <figcaption>
    Richer installation UI on desktop and mobile.
  </figcaption>
</figure>

## Add the web app manifest to your pages {: #link-manifest }

After creating the manifest, add a `<link>` tag to all the pages of your
Progressive Web App. For example:

```html
<link rel="manifest" href="/manifest.json">
```

{% Aside 'gotchas' %}
The request for the manifest is made **without** credentials (even if it's
on the same domain), thus if the manifest requires credentials, you must
include `crossorigin="use-credentials"` in the manifest tag.
{% endAside %}

## Test your manifest {: #test-manifest }

To verify your manifest is setup correctly, use the **Manifest** pane in the
**Application** panel of Chrome DevTools.


<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FpIOY0Ak6FAA5xMuB9IT.png", alt="The application panel in Chrome Devtools with the manifest tab selected.", width="800", height="601" %}
  <figcaption>
    Test your manifest in DevTools.
  </figcaption>
</figure>

<figure>

</figure>

This pane provides a human-readable version of many of your manifest's
properties, and makes it easy to verify that all of the images are loading
properly.

## Splash screens on mobile {: #splash-screen }

When your app first launches on mobile, it can take a moment for the browser
to spin up, and the initial content to begin rendering. Instead of showing a
white screen that may look to the user like the app is stalled, the browser
will show a splash screen until the first paint.

Chrome automatically creates the splash screen from the manifest
properties, specifically:

* `name`
* `background_color`
* `icons`

The `background_color` should be the same color as the load page, to provide
a smooth transition from the splash screen to your app.

Chrome will choose the icon that closely matches the device resolution for the
device. Providing 192px and 512px icons is sufficient for most cases, but
you can provide additional icons for pixel perfection.

## Further reading

There are several additional properties that can be added to the web app
manifest. Refer to the [MDN Web App Manifest documentation][mdn-manifest]
for more information.

[mdn-manifest]: https://developer.mozilla.org/docs/Web/Manifest
