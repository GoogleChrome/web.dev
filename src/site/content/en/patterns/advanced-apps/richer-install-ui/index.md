---
layout: pattern
title: How to add Richer Install UI
date: 2023-03-27
authors:
  - ajara
description: |
  Add an app store-like install experience to your app by adding the description and screenshots fields to your manifest.
height: 800
static:
  - sw.js
  - assets/manifest.json
  - icons/favicon.png
  - assets/screens/squoosh-riui-desktop.jpg
  - assets/screens/squoosh-riui-desktop1.jpg
  - assets/screens/squoosh-riui-phone.jpg
  - assets/screens/squoosh-riui-phone1.jpg
---

App stores provide a space for developers to showcase their apps before installation, with screenshots and text information that help the user make the choice to install the app. Richer install UI provides a similar space for web app developers to invite their users to install their app, directly from the browser. This enhanced UI is available in Chrome for Android and desktop environments.

## Default prompt
See the example below for the default experience, which doesn’t provide enough context.

<figure>
{% Img src="image/SeARmcA1EicLXagFnVOe0ou9cqK2/yshUdzH27Gm1Rzdj9s8O.png", alt="The browser default install dialog for desktop.", width="385", height="676" %}
 <figcaption>
    Default install dialog on desktop
  </figcaption>
</figure>

<figure>
{% Img src="image/SeARmcA1EicLXagFnVOe0ou9cqK2/y5sNbIN19bPNbqni3xay.png", alt="The browser default install dialog for mobile.", width="556", height="781" %}
 <figcaption>
    Default install dialog on mobile
  </figcaption>
</figure>

## Richer Install UI
To get the Richer Install UI dialog instead of the regular small default prompt,  add  `screenshots` and `description` fields to your web manifest. Check out the Squoosh.app example below:

<figure>
  {% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/5SlCnibmZHqkXdGVgPZY.jpeg", alt="Richer Install UI on desktop and mobile", width="800", height="386" %}
  <figcaption>
    Richer installation UI on desktop and mobile.
  </figcaption>
</figure>

The Richer Install UI dialog is composed of the contents of the `description` and `screenshots` fields in the web manifest.

To trigger the dialog you just need to add at least one screenshot for the corresponding form factor, but it is recommended to add the description as well. Checkout the specifics for those fields below.
## Screenshots

Screenshots really add the 'richer' part to the new install UI and we strongly recommend their use. In your manifest you add the `screenshots` member, which takes an array that requires at least one image and Chrome will display up to eight. An example is shown below.

```json
 "screenshots": [
    {
     "src": "source/image1.gif",
      "sizes": "640x320",
      "type": "image/gif",
      "form_factor": "wide",
      "label": "Wonder Widgets"
    }
]
```
Screenshots must follow these criteria:

- Width and height must be at least 320px and at most 3,840px.
- The maximum dimension can't be more than 2.3 times as long as the minimum dimension.
- All screenshots with the _same form factor_ value must have _identical aspect ratios_.
- Only JPEG and PNG image formats are supported.
- Only eight screenshots will be shown. If more are added, the user agent simply ignores them.

Also, you need to include the size and type of the image so it renders correctly. [See this demo](https://glitch.com/edit/#!/richerinstall-screenshot?path=manifest.json%3A14%3A24).

The `form_factor` indicates to the browser whether the screenshot should appear on desktop (`wide`) or mobile environments (`narrow`).

## Description

The `description` member describes the application in the installation prompt, to invite the user to keep the app.

The dialog would display even without a `description`, but it is encouraged.
There is a maximum that kicks in after 7 lines of text (roughly 324 characters) and longer descriptions are truncated and an ellipsis is appended (as you can see in [this example](https://glitch.com/edit/#!/richerinstall-longer-description)).

```json
{
…
"description": "Compress and compare images with different codecs
right in your browser."
}
```


<figure>
  {% Img src="image/xizoeLGxYNf3VLUHc5BsIoiE1Af1/oOj7Ls7cQ8E274faxfOz.jpg",
alt="Description added", width="342", height="684" %}
  <figcaption>Description added.</figcaption>
</figure>
<figure>
  {% Img src="image/xizoeLGxYNf3VLUHc5BsIoiE1Af1/Dpzs03K6QmBkZaefX2nU.jpg",
alt="A longer description that has been truncated.", width="342", height="684" %}
  <figcaption>Longer descriptions are truncated.</figcaption>
</figure>

The description appears at the top of the installation prompt.

You may have noticed from the screenshots that installation dialogs also list the app's origin. Origins that are too long to fit the UI are truncated, this is also known as eliding and is used
as a [security measure to protect users](https://chromium.googlesource.com/chromium/src/+/master/docs/security/url_display_guidelines/url_display_guidelines.md#eliding-urls).

## Further reading

- [Richer PWA installation UI](https://developer.chrome.com/blog/richer-pwa-installation/)
- [Richer install UI available for desktop](https://developer.chrome.com/blog/richer-install-ui-desktop/)

## Demo
