---
title: Share like a native app with the Web Share API
subhead: Web apps can use the same system-provided share capabilities as native apps.
authors:
  - joemedley
date: 2019-11-08
hero: hero.png
alt: An illustration demonstrating that web apps can use the system-provided sharing UI.
description: |
  With the Web Share API, web apps are able to use the same system-provided
  share capabilities as native apps. The Web Share API makes it possible for web
  apps to share links, text, and files to other apps installed on the device in
  the same way as native apps.
tags:
  - post
  - capabilities
  - fugu
---

With the Web Share API, web apps are able to use the same system-provided share
capabilities as native apps. The Web Share API makes it possible for web apps to
share links, text, and files to other apps installed on the device in the same
way as native apps.

{% Aside %}
  Sharing is only half of the magic. Web apps can also be share
  targets, meaning they can receive data, links, text, and files from
  native or web apps. See the [Receive shared data](/web-share-target/)
  post for details on how to register your app as a share target.
{% endAside %}

## Concepts and usage

<figure class="w-figure w-figure--inline-right">
  <img src="./wst-send.png" style="max-width: 370px" alt="System-level share target picker with an installed PWA as an option."/>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    System-level share target picker with an installed PWA as an option.
  </figcaption>
</figure>

### Capabilities and limitations

Web share has the following capabilities and limitations:
* It can only be used on a site that supports HTTPS.
* It must be invoked in response to a user action such as a click. Invoking it
  through the `onload` handler is impossible.
* It can share, URLs, text, or files.

<div class="w-clearfix"></div>

### Sharing links and text

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
navigator.share({url: url});
```

### Sharing files

To share files, first test for and call `navigator.canShare()`. Then include an
array of files in the call to `navigator.share()`:

```js/0-4
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
`naviagator.canShare()` rather than for `navigator.share()`.
The data object passed to `canShare()` only supports the `files` property.
Image, video, audio, and text files can be shared. (See
[Permitted File Extensions in Chromium](https://docs.google.com/document/d/1tKPkHA5nnJtmh2TgqWmGSREUzXgMUFDL6yMdVZHqUsg/edit?usp=sharing).)
More file types may be added in the future.

## Santa Tracker case study

<figure class="w-figure w-figure--inline-right">
  <img src="./santa-phone.png" style="max-width: 400px;" alt="The Santa Tracker app showing a share button."/>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    Santa Tracker share button.
  </figcaption>
</figure>

[Santa Tracker](https://santatracker.google.com/), an open-source project, is a
holiday tradition at Google. Every December, you can celebrate the season
with games and educational experiences.

In 2016, the Santa Tracker team used the Web Share API on Android.
This API was a perfect fit for mobile.
In previous years, the team disabled share buttons on mobile because space is
at a premium, and they couldn't justify having several share targets.

But with the Web Share API, they were able to present just one button,
saving precious pixels.
They also found that users shared with Web Share around 20% more than
users without the API enabled. Head to
[Santa Tracker](https://santatracker.google.com/) to see Web Share in action.

<div class="w-clearfix"></div>

## Helpful Links

[Web Share Demos](https://w3c.github.io/web-share/demos/share-files.html)
