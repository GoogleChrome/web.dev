---
title: New requirements for the Web Share API in third-party iframes
subhead:
  For improved privacy and security, Web Share API calls in third-party iframes now need to be
  explicitly allowed.
date: 2023-02-03
author: thomassteiner
tags:
  - blog
---

The [Web Share API](https://developer.mozilla.org/docs/Web/API/Web_Share_API) allows you to share
text, URLs, or files. In its simplest form, the share code looks something like this:

```js
try {
  await navigator.share({
    title: 'Title',
    text: 'Text',
    url: location.href,
  });
} catch (err) {
  console.error(`${err.name}: ${err.message}`);
}
```

If such a sharing action needs to happen in a third-party iframe, a
[recent spec change](https://github.com/w3c/web-share/pull/252) requires you to now explicitly state
that the operation is fine. You do so by adding an
[`allow` attribute](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attr-allow) to the
`<iframe>` tag with a value of `web-share`. This tells the browser that the embedding site is OK
with the embedded third-party iframe to trigger the share action.

```html/6
<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>Web Share in third-party iframes</h1>
    <!-- The embedding page is hosted on https://example.com/index.html. -->
    <iframe allow="web-share" src="https://third-party.example.com/iframe.html"></iframe>
  </body>
</html>
```

You can see this in action in a [demo on Glitch](https://web-share-in-third-party-iframe.glitch.me/)
and view the
[source code](https://glitch.com/edit/#!/web-share-in-third-party-iframe?path=index.html%3A17%3A44).
Failing to provide the attribute will result in a `NotAllowedError` with the message
`Failed to execute 'share' on 'Navigator': Permission denied`. This limitation was required to
improve the privacy and security of users and to prevent bad actors, for example, abusive ads, from
triggering unexpected share actions, and all browser vendors agreed upon it. It's shipping in
[Chrome 110](https://chromestatus.com/feature/6362499966304256),
[Safari Technology Preview 160](https://webkit.org/blog/13708/allowing-web-share-on-third-party-sites/),
and is already live in Firefox.
