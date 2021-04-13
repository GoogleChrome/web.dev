---
title: Adaptive icon support in PWAs with maskable icons
subhead: A new icon format to use adaptive icons on supporting platforms.
description: |
  Maskable icons are a new icon format that give you more control and let your Progressive Web App
  use adaptive icons. By supplying a maskable icon, your icon can look great on all Android
  devices.
authors:
  - tigeroakes
  - thomassteiner
date: 2019-12-19
updated: 2020-09-16
hero: image/admin/lzLo9JCh6bcehH2nSH0n.png
alt: Icons contained inside white circles compared to icons covering its entire circle
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

## What are maskable icons? {: #what }

If you've installed a Progressive Web App on a recent Android phone, you might notice the icon shows
up with a white background. Android Oreo introduced adaptive icons, which display app icons in a
variety of shapes across different device models. Icons that don't follow this new format are given
white backgrounds.

<figure class="w-figure">
  {% Img src="image/admin/jzjx6dGkXN9EdqnUzAeg.png", alt="PWA icons in white circles on Android", width="400", height="100" %}
  <figcaption class="w-figcaption">Transparent PWA icons appear inside white circles on Android</figcaption>
</figure>

Maskable icons are a new icon format that give you more control and let your Progressive Web App use
adaptive icons. If you supply a maskable icon, your icon can fill up the entire shape and look great
on all Android devices. Firefox and Chrome have recently added support for this new format, and you
can adopt it in your apps.

<figure class="w-figure">
  {% Img src="image/admin/J7gkg9ylP2ANlFawblze.png", alt="PWA icons covering the entire circle on Android", width="400", height="100" %}
  <figcaption class="w-figcaption">Maskable icons cover the entire circle instead</figcaption>
</figure>

## Are my current icons ready?

Since maskable icons need to support a variety of shapes, you supply an opaque image with some
padding that the browser can later crop into the desired shape and size. It's best not to rely on
any particular shape, since the ultimately chosen shape can vary by browser and per platform.

<figure class="w-figure w-figure--inline-right">
  {% Video
    src=["video/tcFciHGuF3MxnTr1y5ue01OGLBn2/mx1PEstODUy6b5TXjo4S.webm", "video/tcFciHGuF3MxnTr1y5ue01OGLBn2/tw7QbXq9SBjGL3UYW0Fq.mp4"],
    class="w-screenshot",
    autoplay=true,
    loop=true,
    muted=true,
    playsinline=true
  %}
  <figcaption class="w-figcaption">
    Different platform specific shapes
  </figcaption>
</figure>

Luckily, there's a well-defined and [standardized](https://w3c.github.io/manifest/#icon-masks)
"minimum safe zone" that all platforms respect. The important parts of your icon, such as your logo,
should be within a circular area in the center of the icon with a radius equal to 40% of the icon
width. The outer 10% edge may be cropped.

You can check which parts of your icons land within the safe zone with Chrome DevTools. With your
Progressive Web App open, launch DevTools and navigate to the **Application** panel. In the
**Icons** section, you can choose to **Show only the minimum safe area for maskable icons**. Your
icons will be trimmed so that only the safe area is visible. If your logo is visible within this
safe area, you're good to go.

<figure class="w-figure">
  {% Img src="image/admin/UeKTJM2SE0SQhgnnyaQG.png", alt="Applications panel in DevTools displaying PWA icons with edges cropped", width="762", height="423", class="w-screenshot" %}
  <figcaption class="w-figcaption">The Applications panel</figcaption>
</figure>

To test your maskable icon with the variety of Android shapes, use the
[Maskable.app](https://maskable.app/) tool I've created.
Open an icon, then Maskable.app will let you
try out various shapes and sizes, and you can share the preview with others on your team.

## How do I adopt maskable icons?

If you want to create a maskable icon based on your existing icon, you can use the
[Maskable.app Editor](https://maskable.app/editor). Upload your icon, adjust the color and size,
then export the image.

<figure class="w-figure">
  {% Img src="image/admin/MDXDwH3RWyj4po6daeXw.png", alt="Maskable.app Editor screenshot", width="670", height="569", class="w-screenshot" %}
  <figcaption class="w-figcaption">Creating icons in Maskable.app Editor</figcaption>
</figure>

Once you've created a maskable icon image and tested it out in DevTools, you'll need to update your
[Web App Manifest](https://developers.google.com/web/fundamentals/web-app-manifest) to point to the
new assets. The Web App Manifest provides information about your web app in a JSON file, and
includes an [`icons` array](https://developers.google.com/web/fundamentals/web-app-manifest#icons).

With the inclusion of maskable icons, a new property value has been added for image resources listed
in a Web App Manifest. The `purpose` field tells the browser how your icon should be used. By
default, icons will have a purpose of `"any"`. These icons will be resized on top of a white
background on Android.

Maskable icons should use a different purpose: `"maskable"`. This indicates that an image is meant
to be used with icon masks, giving you more control over the result. This way, your icons will not
have a white background. You can also specify multiple space-separated purposes (for example,
`"any maskable"`), if you want your maskable icon to be used without a mask on other devices.

{% Aside %}
  While you _can_ specify multiple space-separated purposes like `"any maskable"`, in
  practice you _shouldn't_. Using `"maskable"` icons as `"any"` icons is suboptimal as the icon
  is going to be used as-is, resulting in excess padding and making the core icon content smaller.
  Ideally, icons for the `"any"` purpose should have transparent regions and no extra padding, like your site's favicons,
  since the browser isn't going to add that for them.
{% endAside %}

```json
{
  …
  "icons": [
    …
    {
      "src": "path/to/regular_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "path/to/maskable_icon.png",
      "sizes": "196x196",
      "type": "image/png",
      "purpose": "maskable" // <-- New property value `"maskable"`
    },
    …
  ],
  …
}
```

With this, you can go forth and create your own maskable icons, making sure you app looks great
edge-to-edge (and for what it's worth, circle-to-circle, oval-to-oval 😄).

## Acknowledgements

This article was reviewed by [Joe Medley](https://github.com/jpmedley).
