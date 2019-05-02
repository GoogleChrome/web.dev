---
layout: post
title: Sets an address-bar theme color
description: |
  Learn about `themed-omnibox` audit.
web_lighthouse:
  - themed-omnibox
---

Theming the browser's address bar to match your brand's colors provides
a more immersive user experience.
Lighthouse flags the page when the address bar isn't themed to the page's colors:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="themed-omnibox.png" alt="Lighthouse audit showing address bar isn't themed to the page's colors">
  <figcaption class="w-figcaption">
    Fig. 1 — Address bar isn't themed to page's colors
  </figcaption>
</figure>

## How this audit fails

The audit fails if Lighthouse doesn't find a `theme-color` meta tag in the page's
HTML and a `theme_color` property in the Web App Manifest.
Lighthouse does not test whether the values are valid CSS color values.

## Recommendations

To ensure that the address bar is always themed to your colors:

1. Add a `theme-color` meta tag to the HTML of every page you want to brand.
2. Add the `theme_color` property to your Web App Manifest.

The `theme-color` meta tag ensures that the address bar is branded when
a user visits your site as a normal webpage. Set `content` to any valid CSS
color value. You need to add this meta tag to every page that you want to
brand.

```html
<head>
  <meta name="theme-color" content="#317EFB"/>
  ...
```

Learn more about `theme-color` in
[Support for theme-color in Chrome 39 for Android](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android).

The `theme_color` property in your Web App Manifest ensures that the address
bar is branded when a user launches your progressive web
app from the homescreen. Unlike the `theme-color` meta tag, you only need
to define this once, in the manifest. The browser colors every page of your
app according to the manifest's `theme_color`. Set the property to any valid
CSS color value.

```html
{
  "theme_color": "#317EFB"
  ...
}
 ```

See [User can be prompted to install the web app](/installable-manifest)
for more resources on adding a manifest to your app.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## More information

[Address bar isn't themed to page's color audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/themed-omnibox.js)