---
layout: post
title: Does not provide a valid apple-touch-icon
description: |
  How to specify what icon should appear on iOS homescreens for your Progressive Web App.
web_lighthouse:
  - apple-touch-icon
---

iOS Safari users can manually add Progressive Web Apps to their homescreens.
You can specify what icon should appear on iOS homescreens by adding a 
`<link rel="apple-touch-icon" href="/example.png">` tag to the `<head>` of your
page. If your page doesn't have this link tag, iOS generates an icon from page content.
In other words, instructing iOS to download an icon results in a more polished user experience.
Lighthouse flags pages that don't provide this link tag:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="apple-touch-icon.png" 
       alt="Does not provide a valid apple-touch-icon">
  <figcaption class="w-figcaption">
    The <b>Does not provide a valid apple-touch-icon</b> audit
  </figcaption>
</figure>

{% Aside 'codelab' %}
  Check out the [Add an Apple touch icon to your Progressive Web App](/codelab-apple-touch-icon)
  codelab to see how adding an Apple touch icon creates a more polished user experience.
{% endAside %}

## How this audit fails

This audit fails when Lighthouse doesn't find a `<link rel="apple-touch-icon" href="/example.png">` 
tag in the `<head>` of the page. A `<link rel="apple-touch-icon-precomposed" href="/example.png">` 
tag also passes the audit, but `rel="apple-touch-icon"` is preferred because
`rel="apple-touch-icon-precomposed"` has been obsolete since iOS 7. Lighthouse doesn't check whether 
the icon actually exists or whether the icon is the correct size.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Recommendations

- Add a `<link rel="apple-touch-icon" href="/example.png">` to the `<head>` of your page.
- Replace `/example.png` with the actual path to your icon.

```html
...
<head>
  ...
  <link rel="apple-touch-icon" href="/example.png">
  ...
</head>
...
```

As mentioned above, Lighthouse doesn't check the following considerations, but to provide a
good user experience you'll want to make sure that:

- The icon is 180 pixels wide and 180 pixels tall, or 192 pixels wide and 192 pixels tall
- The specified URL to the icon is valid
- The background of the icon is not transparent


## More information

- <a href="https://webhint.io/docs/user-guide/hints/hint-apple-touch-icons/" rel="noreferrer">Use Apple Touch icon</a>
- [Source code](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/apple-touch-icon.js) for
  the **Does not provide a valid apple-touch-icon** audit

[a2hs]: https://support.apple.com/guide/shortcuts/run-shortcuts-from-the-ios-home-screen-apd735880972/ios#apd175362e63