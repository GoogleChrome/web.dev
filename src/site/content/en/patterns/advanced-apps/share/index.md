---
layout: pattern
title: How to let the user share a website
date: 2022-07-11
description: |
  Learn how to let the user share a website.
height: 800
static:
  - share.svg
  - sharemac.svg
---

Letting the user share the website they are on is a common advanced apps pattern
that you can find on many news sites, blogs, or shopping sites. Since linking is
one of the web's super powers, the hope is to acquire traffic from users who see
the shared link on social networking sites, or who receive it via chat messages
or even plain old school via email.

## The modern way

### Using the Web Share API

The [Web Share API](/web-share/) lets the user share data like
the URL of the page they are on, along with a title and descriptive text.
The `navigator.share()` method of the Web Share API invokes the native sharing
mechanism of the device. It returns a promise and takes a single argument with
the to-be-shared data. Possible values are:

- `url`: A string representing the URL to be shared.
- `text`: A string representing text to be shared.
- `title`: A string representing a title to be shared. May be ignored by the browser.

{% BrowserCompat 'api.Navigator.share' %}

## The classic way

### Using a social networking site's share intent

Not all browsers support the Web Share API yet. A fallback is thus to integrate with
your target audience's most popular social networking sites. A popular example
is Twitter, whose [Web Intent URL](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent) allows for a text and a URL to be shared. The method typically consists
of crafting a URL and opening it in a browser.

## UI considerations

It is a nice touch to respect the platform's established share icon according to the UI
guidelines of the operating system vendors.

- Android and other operating systems:
  <svg style="background-color: white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
- Apple:
  <svg style="background-color: white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/></svg>

## Progressive enhancement

The snippet below uses the Web Share API when it is supported, then falls back to
Twitter's Web Intent URL.

```js
// DOM references
const button = document.querySelector('button');
const icon = button.querySelector('.icon');
const canonical = document.querySelector('link[rel="canonical"]');

// Find out if the user is on a device made by Apple.
const IS_MAC = /Mac|iPhone/.test(navigator.platform);

// For Apple devices, use the platform-specific share icon.
icon.classList.add(`share${IS_MAC? 'mac' : ''}`);

button.addEventListener('click', async () => {
  // Title and text are identical, since the title may actually be ignored.
  const title = document.title;
  const text = document.title;
  // Use the canonical URL, if it exists, else, the current location.
  const url = canonical?.href || location.href;

  // Feature detection to see if the Web Share API is supported.
  if ('share' in navigator) {
    try {
      await navigator.share({
        url,
        text,
        title,
      });
      return;
    } catch (err) {
      // If the user cancels, an `AbortError` is thrown.
      if (err.name !== "AbortError") {
        console.error(err.name, err.message);
      }
    }
  }
  // Fallback to use Twitter's Web Intent URL.
  // (https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent)
  const shareURL = new URL('https://twitter.com/intent/tweet');
  const params = new URLSearchParams();
  params.append('text', encodeURIComponent(text));
  params.append('url', encodeURIComponent(url));
  shareURL.search = params;
  window.open(shareURL, '_blank', 'popup,noreferrer,noopener');
});
```

## Further reading

- [Web Share API](/web-share/)
