---
layout: post
title: Add a web app manifest
authors:
  - petelepage
  - beaufortfrancois
date: 2018-11-05
updated: 2020-02-25
description: |
  The web app manifest is a simple JSON file that tells the browser about your
  web application and how it should behave when installed on the user's mobile
  device or desktop.
---

The web app manifest is a JSON file that tells the browser about your
Progressive Web App and how it should behave when installed on the user's
desktop or mobile device. A typical manifest file includes the app name, the
icons the app should use, and the URL that should be opened when the
app is launched.

Manifest files are [supported](https://developer.mozilla.org/en-US/docs/Web/Manifest#Browser_compatibility) in Chrome, Edge, Firefox, UC Browser, Opera,
and the Samsung browser. Safari has partial support.

## Create the manifest.webmanifest file {: #create }

The manifest file can have any name, but is commonly named
`manifest.webmanifest` and served from the root (your website's top-level
directory).

```json
{
  "short_name": "Weather",
  "name": "Weather: Do I need an umbrella?",
  "description": "Weather forecast information",
  "icons": [
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
  "start_url": "/?source=pwa",
  "background_color": "#3367D6",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#3367D6"
}
```

### Key manifest properties {: #manifest-properties }

#### `short_name` and/or `name` {: #name }

You must provide at least the `short_name` or `name` property. If both are
provided, `short_name` is used on the user's home screen, launcher, or other
places where space may be limited. `name` is used when the app is installed.

#### `icons` {: #icons }

When a user installs your PWA, you can define a set of icons for the browser
to use on the home screen, app launcher, task switcher, splash screen, and so on.

The `icons` property is an array of image objects. Each object must
include the `src`, a `sizes` property, and the `type` of image. To use
[maskable icons](/maskable-icon/), sometimes referred to as adaptive
icons on Android, you'll also need to add `"purpose": "any maskable"` to the
`icon` property.

For Chrome, you must provide at least a 192x192 pixel icon, and a 512x512
pixel icon. If only those two icon sizes are provided, Chrome will
automatically scale the icons to fit the device. If you'd prefer to scale your
own icons, and adjust them for pixel-perfection, provide icons in increments
of 48dp.

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
example, you can hide the address bar and browser chrome. Games can even
be made to launch full screen.

<div class="w-table-wrapper">
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
          Opens the web app to look and feel like a standalone native
          app. The app runs in its own window, separate from the browser, and
          hides standard browser UI elements like the URL bar.
          <figure class="w-figure">
            <img class="w-screenshot"
                src="standalone-pwa-window.png"
                alt="An example of a PWA window with standalone display.">
          </figure>
        </td>
      </tr>
      <tr>
        <td><code>minimal-ui</code></td>
        <td>
          This mode is similar to <code>standalone</code>, but provides the
          user a minimal set of UI elements for controlling navigation (such
          as back and reload).
          <figure class="w-figure">
            <img class="w-screenshot"
                src="minimal-ui-pwa-window.png"
                alt="An example of a PWA window with minimal-ui display.">
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

#### `scope` {: #scope }

The `scope` defines the set of URLs that the browser considers to be within your
app, and is used to decide when the user has left the app. The `scope`
controls the URL structure that encompasses all the entry and exit points in
your web app. Your `start_url` must reside within the `scope`.

{% Aside 'caution' %}
If the user clicks a link in your app that navigates outside of the
`scope`, the link will open and render within the existing PWA window. If
you want the link to open in a browser tab, you must add `target="_blank"`
to the `<a>` tag. On Android, links with `target="_blank"` will open in a
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

<figure class="w-figure">
  <img class="w-screenshot"
      src="theme_color-pwa-window.png"
      alt="An example of a PWA window with custom theme_color.">
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

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled"
       src="lh-manifest.png"
       alt="The application panel in Chrome Devtools with the manifest tab selected.">
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

<div class="w-clearfix">&nbsp;</div>

## Further reading

There are several additional properties that can be added to the web app
manifest. Refer to the [MDN Web App Manifest documentation][mdn-manifest]
for more information.

[mdn-manifest]: https://developer.mozilla.org/en-US/docs/Web/Manifest
