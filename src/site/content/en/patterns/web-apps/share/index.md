---
layout: pattern
title: How to let the user share the website they are on
date: 2022-10-10
updated: 2022-10-17
description: >
  Learn how to let the user share the website they are on.
authors:
  - thomassteiner
height: 800
static:
  - share.svg
  - sharemac.svg
  - sharewindows.svg
---

Letting the user share the website they are on is a common web apps pattern
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

- Windows:
  <svg style="display: block; background-color: white; width: 24px; height: 24px;" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M31.605 6.83811C31.2415 6.49733 30.7103 6.40497 30.2531 6.60304C29.7959 6.80111 29.5 7.25178 29.5 7.75003V13.2223C29.1425 13.2305 28.7251 13.2514 28.26 13.2944C26.725 13.4362 24.6437 13.8204 22.4841 14.799C18.0824 16.7935 13.5579 21.1728 12.5081 30.3581C12.4493 30.8729 12.7141 31.3706 13.174 31.6094C13.6338 31.8482 14.1932 31.7785 14.5805 31.4343C18.9164 27.5801 22.9778 25.9209 25.9168 25.2155C27.3897 24.862 28.5872 24.7466 29.4032 24.718C29.4361 24.7169 29.4684 24.7158 29.5 24.715V30.25C29.5 30.7483 29.7959 31.1989 30.2531 31.397C30.7103 31.5951 31.2415 31.5027 31.605 31.162L43.605 19.9119C43.857 19.6756 44 19.3455 44 19C44 18.6545 43.857 18.3244 43.605 18.0881L31.605 6.83811ZM30.606 15.7422L30.6257 15.7438L30.6285 15.7441L30.6269 15.7439C30.9779 15.7787 31.3272 15.6635 31.5888 15.4268C31.8506 15.1899 32 14.8532 32 14.5V10.6353L40.9224 19L32 27.3647V23.5C32 22.8696 31.5462 22.34 30.9051 22.2597L30.9036 22.2595L30.902 22.2593L30.8982 22.2588L30.8883 22.2577L30.8597 22.2545C30.8368 22.252 30.8062 22.249 30.768 22.2456C30.6917 22.2389 30.5853 22.2309 30.4506 22.2242C30.1812 22.2109 29.7982 22.2026 29.3156 22.2195C28.3503 22.2534 26.9854 22.3881 25.3333 22.7845C22.6531 23.4278 19.2341 24.7565 15.5547 27.4384C17.0405 21.3588 20.4181 18.4798 23.5159 17.0761C25.3563 16.2422 27.15 15.9076 28.49 15.7838C29.1577 15.7221 29.7057 15.7134 30.081 15.7196C30.2684 15.7227 30.412 15.7295 30.5052 15.7351C30.5517 15.738 30.5856 15.7405 30.606 15.7422ZM12.25 8.00003C8.79822 8.00003 6 10.7983 6 14.25V35.75C6 39.2018 8.79822 42 12.25 42H33.75C37.2018 42 40 39.2018 40 35.75V33.5C40 32.8097 39.4404 32.25 38.75 32.25C38.0596 32.25 37.5 32.8097 37.5 33.5V35.75C37.5 37.8211 35.8211 39.5 33.75 39.5H12.25C10.1789 39.5 8.5 37.8211 8.5 35.75V14.25C8.5 12.179 10.1789 10.5 12.25 10.5H20.5C21.1904 10.5 21.75 9.94039 21.75 9.25003C21.75 8.55967 21.1904 8.00003 20.5 8.00003H12.25Z" fill="#212121"/>
</svg>
- Apple:
  <svg style="display: block; background-color: white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/></svg>
- Android and other operating systems:
  <svg style="display: block; background-color: white" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>

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
// Find out if the user is on a Windows device.
const IS_WINDOWS = /Win/.test(navigator.platform);
// For Apple devices or Windows, use the platform-specific share icon.
icon.classList.add(`share${IS_MAC? 'mac' : (IS_WINDOWS? 'windows' : '')}`);

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
  params.append('text', text);
  params.append('url', url);
  shareURL.search = params;
  window.open(shareURL, '_blank', 'popup,noreferrer,noopener');
});
```

## Further reading

- [Web Share API](/web-share/)

## Demo
