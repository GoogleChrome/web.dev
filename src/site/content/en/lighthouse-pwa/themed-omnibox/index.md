---
layout: post
title: Does not set a theme color for the address bar
description: |
  Learn how to set an address bar theme color for your Progressive Web App.
web_lighthouse:
  - themed-omnibox
date: 2019-05-04
updated: 2020-06-17
---

Theming the browser's address bar to match the brand colors
of your [Progressive Web App (PWA)](/discover-installable) provides a more immersive user experience.

## Browser compatibility

At the time of writing, theming the browser address bar is supported on
Android-based browsers. See
[Browser compatibility](https://developer.mozilla.org/docs/Web/Manifest/theme_color#Browser_compatibility)
for updates.

## How the Lighthouse theme color audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that don't apply a theme to the address bar:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YadFSuw8denjl1hhnvFs.png", alt="Lighthouse audit showing address bar isn't themed to the page's colors", width="800", height="98", class="w-screenshot" %}
</figure>

The audit fails if Lighthouse doesn't find a `theme-color` meta tag in the page's
HTML and a `theme_color` property in the [web app manifest](/add-manifest).

Note that Lighthouse doesn't test whether the values are valid CSS color values.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to set a theme color for the address bar

### Step 1: Add a `theme-color` meta tag to every page you want to brand

The `theme-color` meta tag ensures that the address bar is branded when
a user visits your site as a normal webpage.
Set the tag's `content` attribute to any valid CSS color value:

```html/4
<!DOCTYPE html>
<html lang="en">
<head>
  …
  <meta name="theme-color" content="#317EFB"/>
  …
</head>
…
```

Learn more about the `theme-color` meta tag in Google's
[Support for `theme-color` in Chrome 39 for Android](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android).

### Step 2: Add the `theme_color` property to your web app manifest

The `theme_color` property in your web app manifest ensures that the address
bar is branded when a user launches your PWA from the home screen.
Unlike the `theme-color` meta tag, you only need
to define this once, in the [manifest](/add-manifest).
Set the property to any valid CSS color value:

```html/1
{
  "theme_color": "#317EFB"
  …
}
 ```

The browser will set the the address bar color of every page of your app
according to the manifest's `theme_color`.

## Resources

- [Source code for **Does not set a theme color for the address bar** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/themed-omnibox.js)
- [Add a web app manifest](/add-manifest)
- [Support for `theme-color` in Chrome 39 for Android](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android)
