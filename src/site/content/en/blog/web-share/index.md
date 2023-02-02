---
title: Integrate with the OS sharing UI with the Web Share API
subhead: Web apps can use the same system-provided share capabilities as platform-specific apps.
authors:
  - joemedley
date: 2019-11-08
updated: 2022-03-30
hero: image/admin/ruvEms3AeSZvlEI01DKo.png
alt: An illustration demonstrating that web apps can use the system-provided sharing UI.
description: |
  With the Web Share API, web apps are able to use the same system-provided
  share capabilities as platform-specific apps. The Web Share API makes it possible for web
  apps to share links, text, and files to other apps installed on the device in
  the same way as platform-specific apps.
tags:
  - blog
  - capabilities
feedback:
  - api
stack_overflow_tag: web-share
---

With the Web Share API, web apps are able to use the same system-provided share
capabilities as platform-specific apps. The Web Share API makes it possible for web apps to
share links, text, and files to other apps installed on the device in the same
way as platform-specific apps.

{% Aside %}
  Sharing is only half of the magic. Web apps can also be share
  targets, meaning they can receive data, links, text, and files from
  platform-specific or web apps. Read [Receive shared data](/web-share-target/)
  to learn how to register your app as a share target.
{% endAside %}

<figure data-float="right">
  {% Img src="image/admin/cCXNoHbXAfkAQzTTuS0Z.png", alt="System-level share target picker with an installed PWA as an option.", width="370", height="349" %}
  <figcaption>
    System-level share target picker with an installed PWA as an option.
  </figcaption>
</figure>

## Capabilities and limitations

Web share has the following capabilities and limitations:
* It can only be used on a site that is [accessed via HTTPS](https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features).
* If the share happens in a third-party iframe, the `allow` attribute must be used.
* It must be invoked in response to a user action such as a click. Invoking it
  through the `onload` handler is impossible.
* It can share URLs, text, or files.

{% BrowserCompat 'api.Navigator.share' %}

## Sharing links and text

To share links and text, use the `share()` method, which is a promise-based
method with a required properties object.
To keep the browser from throwing a `TypeError`,
the object must contain at least one
of the following properties: `title`, `text`, `url` or `files`. You
can, for example, share text without a URL or vice versa. Allowing all three
members expands the flexibility of use cases. Imagine if after running the code
below, the user chose an email application as the target. The `title` parameter
might become the email subject, the `text`, the message body, and the files, the
attachments.

```js
if (navigator.share) {
  navigator.share({
    title: 'web.dev',
    text: 'Check out web.dev.',
    url: 'https://web.dev/',
  })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
}
```

If your site has multiple URLs for the same content, share the page's
canonical URL instead of the current URL. Instead of sharing
`document.location.href`, you would check for a canonical URL `<meta>` tag in
the page's `<head>` and share that. This will provide a better experience to the
user. Not only does it avoid redirects, but it also ensures that a shared URL serves
the correct user experience for a particular client. For example, if a friend
shares a mobile URL and you look at it on a desktop computer,
you should see a desktop version:

```js
let url = document.location.href;
const canonicalElement = document.querySelector('link[rel=canonical]');
if (canonicalElement !== null) {
    url = canonicalElement.href;
}
navigator.share({url});
```

## Sharing files

To share files, first test for and call `navigator.canShare()`. Then include an
array of files in the call to `navigator.share()`:

```js/0-5
if (navigator.canShare && navigator.canShare({ files: filesArray })) {
  navigator.share({
    files: filesArray,
    title: 'Vacation Pictures',
    text: 'Photos from September 27 to October 14.',
  })
  .then(() => console.log('Share was successful.'))
  .catch((error) => console.log('Sharing failed', error));
} else {
  console.log(`Your system doesn't support sharing files.`);
}
```

Notice that the sample handles feature detection by testing for
`navigator.canShare()` rather than for `navigator.share()`.
The data object passed to `canShare()` only supports the `files` property.
Certain types of audio, image, pdf, video, and text files can be shared.
See [Permitted File Extensions in Chromium](https://docs.google.com/document/d/1tKPkHA5nnJtmh2TgqWmGSREUzXgMUFDL6yMdVZHqUsg/edit?usp=sharing)
for a complete list. More file types may be added in the future.

## Sharing in third-party iframes

To trigger the share action from within a third-party iframe,
embed the iframe with the `allow` attribute with a value of `web-share`:

```html
<!-- On https://example.com/index.html -->
<iframe allow="web-share" src="https://third-party.example.com/iframe.html"></iframe>
```

You can see this in action in a [demo on Glitch](https://web-share-in-third-party-iframe.glitch.me/)
and view the [source code](https://glitch.com/edit/#!/web-share-in-third-party-iframe?path=index.html%3A17%3A44).
Failing to provide the attribute will result in a `NotAllowedError` with the message
`Failed to execute 'share' on 'Navigator': Permission denied`.

## Santa Tracker case study

<figure data-float="right">
  {% Img src="image/admin/2I5iOXaOpzEJlEbM694n.png", alt="The Santa Tracker app showing a share button.", width="343", height="600" %}
  <figcaption>
    Santa Tracker share button.
  </figcaption>
</figure>

[Santa Tracker](https://santatracker.google.com/), an open-source project, is a
holiday tradition at Google. Every December, you can celebrate the season
with games and educational experiences.

In 2016, the Santa Tracker team used the Web Share API on Android.
This API was a perfect fit for mobile.
In previous years, the team removed share buttons on mobile because space is
at a premium, and they couldn't justify having several share targets.

But with the Web Share API, they were able to present one button,
saving precious pixels.
They also found that users shared with Web Share around 20% more than
users without the API enabled. Head to
[Santa Tracker](https://santatracker.google.com/) to see Web Share in action.

## Browser support

Browser support for the Web Share API is nuanced, and it's recommended that you use feature
detection (as described in the earlier code samples) instead of assuming that a particular method is
supported.

Here's a rough outline of support for this feature. For detailed information, follow either of the support links.

<dl>
  <dt><code>navigator.canShare()</code></dt>
  <dd>{% BrowserCompat 'api.Navigator.canShare' %}</dd>
  <dt><code>navigator.share()</code></dt>
  <dd>{% BrowserCompat 'api.Navigator.share' %}</dd>
</dl>

## Show support for the API

Are you planning to use the Web Share API? Your public support helps the Chromium team
prioritize features and shows other browser vendors how critical it is to support them.

Send a tweet to [@ChromiumDev][cr-dev-twitter] using the hashtag
[`#WebShare`](https://twitter.com/search?q=%23WebShare&src=recent_search_click&f=live)
and let us know where and how you're using it.

## Helpful Links

- [Web Share Demos](https://w3c.github.io/web-share/demos/share-files.html)
- [Scrapbook PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)

[cr-dev-twitter]: https://twitter.com/ChromiumDev
