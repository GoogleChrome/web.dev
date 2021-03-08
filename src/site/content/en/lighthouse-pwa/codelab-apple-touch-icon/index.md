---
layout: codelab
title: Add an Apple touch icon to your Progressive Web App
authors:
  - kaycebasques
date: 2019-08-26
description: |
  An interactive demonstration of how to specify which icon should show up on iOS home screens.
glitch: apple-touch-icon
related_post: apple-touch-icon
---

{% include 'content/devtools-headsup.njk' %}

Safari for iOS users can manually add [Progressive Web Apps (PWAs)](/discover-installable) to
their home screen. The icon that appears on the iOS home screen when a PWA is added is called
the *Apple touch icon*. This codelab shows you how to add an Apple touch icon to a PWA. It assumes
that you have access to an iOS device.

{% Aside %}
  iOS Safari users can add any webpage to their home screen. It doesn't have to be a PWA.
  In fact, the example app used in this codelab isn't a PWA.  But in most cases a PWA would be
  the kind of app that a user would most likely want to add to their home screen.
{% endAside %}

## Measure

Open the example app in a new tab:

{% Instruction 'remix', 'ol' %}

{% Instruction 'preview', 'ol' %}

1. Note the URL of your example app. It'll be something like `https://example.glitch.me`.

Run a [Lighthouse PWA audit](/lighthouse-pwa) on your example app in Chrome DevTools:

{% Instruction 'audit-pwa', 'ol' %}

In the **PWA Optimized** section, Lighthouse reports that the example app [doesn't provide a valid
Apple touch icon](/apple-touch-icon).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MTeobnXovn2UGJW1lhQ9.png", alt="Does not provide a valid apple-touch-icon", width="800", height="283", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    The <b>Does not provide a valid apple-touch-icon</b> audit
  </figcaption>
</figure>

## Add the example app to an iOS home screen

To demonstrate how an Apple touch icon provides a more polished user experience, first try adding
the example app to your iOS device's home screen when an Apple touch icon hasn't been specified.

1. Open Safari for iOS.
1. Open the URL of your example app. This is the URL like `https://example.glitch.me` that you
   noted earlier.
1. Tap **Share** <img style="height:1.2em;vertical-align:top;" src="share.png"/>  >
   **Add to Home Screen**. You'll probably have to swipe left to see this option.
1. Tap **Add**.

Because the site hasn't specified an Apple touch icon, iOS just generates an icon for the site
from the page's content.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mjkYYf7Fjpm4EwzMJ7Xc.png", alt="An auto-generated home screen icon.", width="640", height="1136", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    An auto-generated home screen icon.
  </figcaption>
</figure>

## Add an Apple touch icon to the example app

- Uncomment the `<link rel="apple-touch-icon">` tag at the bottom of the `<head>` of `index.html`.

```html/4/3
    …
    <link rel="stylesheet" href="/index.css">
    <link rel="shortcut icon" href="https://cdn.glitch.com/49d34dc6-8fbd-46bb-8221-b99ffd36f1af%2Ftouchicon-180.png?v=1566411949736">
    <!-- <link rel="apple-touch-icon" href="https://cdn.glitch.com/49d34dc6-8fbd-46bb-8221-b99ffd36f1af%2Ftouchicon-180.png?v=1566411949736"> -->
    <link rel="apple-touch-icon" href="https://cdn.glitch.com/49d34dc6-8fbd-46bb-8221-b99ffd36f1af%2Ftouchicon-180.png?v=1566411949736">
  </head>
  …
```

## Add the example app to an iOS home screen (again)

- Try adding the example app to an iOS home screen again. This time, a proper icon is generated for
  the site. If you audit the page again with Lighthouse you'll also see that the
  **Does not provide a valid `apple-touch-icon`** audit now passes.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Z8nauimUFUDPY8HJDGER.png", alt="The Apple touch icon.", width="640", height="1136", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    The Apple touch icon.
  </figcaption>
</figure>
