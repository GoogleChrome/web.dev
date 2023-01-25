---
layout: post
title: Does not provide a valid apple-touch-icon
description: |
  Learn how to specify what icon your Progressive Web App displays on iOS home screens.
web_lighthouse:
  - apple-touch-icon
codelabs: codelab-apple-touch-icon
date: 2019-08-27
updated: 2019-09-19
---

When iOS Safari users add [Progressive Web Apps (PWAs)](/discover-installable) to
their home screens, the icon that appears is called the *Apple touch icon*.
You can specify what icon your app should use by including a
`<link rel="apple-touch-icon" href="/example.png">` tag in the `<head>` of your
page. If your page doesn't have this link tag, iOS generates an icon by taking a screenshot of
the page content. In other words, instructing iOS to download an icon results in a more polished
user experience.

## How the Lighthouse Apple touch icon audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages without a `<link rel="apple-touch-icon" href="/example.png">`
tag in the `<head>`:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mXGs4XSr4DXMxLk536wo.png", alt="Does not provide a valid apple-touch-icon", width="800", height="95", class="w-screenshot" %}
</figure>

{% Aside %}
  A `rel="apple-touch-icon-precomposed"` link passes the audit, but it has been
  obsolete since iOS 7. Use `rel="apple-touch-icon"` instead.
{% endAside %}

Lighthouse doesn't check whether the icon actually exists or whether the icon is
the correct size.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to add an Apple touch icon

1. Add `<link rel="apple-touch-icon" href="/example.png">` to the `<head>` of your page:

    ```html/4
    <!DOCTYPE html>
    <html lang="en">
      <head>
        …
        <link rel="apple-touch-icon" href="/example.png">
        …
      </head>
      …
    ```

1. Replace `/example.png` with the actual path to your icon.

{% Aside 'codelab' %}
  Check out the [Add an Apple touch icon to your Progressive Web App](/codelab-apple-touch-icon)
  codelab to see how adding an Apple touch icon creates a more polished user experience.
{% endAside %}

To provide a good user experience, make sure that:

- The icon is 180x180&nbsp;pixels or 192x192&nbsp;pixels
- The specified path to the icon is valid
- The background of the icon is not transparent

## Resources

- [Source code for **Does not provide a valid `apple-touch-icon`** audit][source]
- [Discover what it takes to be installable](/install-criteria)
- <a href="https://webhint.io/docs/user-guide/hints/hint-apple-touch-icons/" rel="noreferrer">Use Apple Touch Icon</a>

[a2hs]: https://support.apple.com/guide/shortcuts/run-shortcuts-from-the-ios-home-screen-apd735880972/ios#apd175362e63
[source]: https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/apple-touch-icon.js
