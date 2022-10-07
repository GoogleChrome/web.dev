---
layout: pattern
title: How to create an app badge
date: 2022-10-10
authors:
  - thomassteiner
description: >
  Learn how to create an app badge.
height: 800
static:
  - sw.js
  - assets/manifest.json
  - assets/app-badge.png
  - assets/app-icon.png
  - assets/favicon.png
  - assets/favicon.svg
---

Badges are used to convey non-urgent information to the user. For example,
they are used to indicate the status of an app, or the number of unread items.
The classic way of creating an app badge is to add a number to the favicon.
On modern browsers, after an app has been installed, there is a built-in way
to add a badge to the app icon in the operating system's task bar.

## The modern way

### Using the `navigator.setAppBadge()` method

The `navigator.setAppBadge()` method sets a badge on the icon associated with
the installed app. The method takes an optional single argument, which is
an integer which will be used as the value of the badge. Setting the number to 0
clears the app badge. Not providing an argument results in a generic badge, commonly
displayed as a colored dot.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/Niy9c011GzoVQmPbSEF5.png", alt="App icon showing the actual icon with the number 3 as the badge value.", width="282", height="388" %}

{% BrowserCompat 'api.Navigator.setAppBadge' %}

## The classic way

### Adding a number to the favicon

If the app is not installed yet, you can add a number to the favicon. There are many
ways of doing so, for example, by drawing the favicon dynamically to a canvas with
the badge info added and displaying it as a Blob URL, or to craft an SVG image with
the badge info as a data URL.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/lGNsfETYtEFncrktRX6F.png", alt="Favicon showing the actual icon with the number 5 as the badge value.", width="760", height="86" %}

## Progressive enhancement

The snippet below uses a custom element
[`<favicon-badge></favicon-badge>`](https://github.com/fallaciousreasoning/badgable-favicon#readme)
that lets the developer declaratively set a badge on the favicon specified via the `src` attribute
by passing an integer to the `badge` attribute. When the user installs the application, the badge
is "upgraded" to a native operating system badge.

```js
import 'https://unpkg.com/favicon-badge@2.0.0/dist/FavIconBadge.js';

// DOM references.
const favicon = document.querySelector('favicon-badge');
const installButton = document.querySelector('button');

// Feature detection.
const supportsAppBadge = 'setAppBadge' in navigator;

let setAppBadge;

// For the demo simply set the badge between [0, 9].
let i = 0;
const getAppBadgeValue = () => {
  if (i > 9) {
    i = 0;
  }
  return i++;
};

// Set the badge on the favicon.
const setAppBadgeFavicon = (value) => {
  favicon.badge = value;
};

// Set the native operating system badge.
const setAppBadgeNative = (value) => {
  navigator.setAppBadge(value);
}

// If the app is installed and the Badging API is supported,
// set the badge on the native operating system. Else, fall
// back to the favicon.
if (
  matchMedia('(display-mode: standalone)').matches &&
  supportsAppBadge
) {
  setAppBadge = setAppBadgeNative;
} else {
  setAppBadge = setAppBadgeFavicon;
}

// Set a new badge every second.
setInterval(() => {
  setAppBadge(getAppBadgeValue());
}, 1000);

// If installation is supported…
if ('BeforeInstallPromptEvent' in window) {
  let installEvent = null;
  const onInstall = () => {
    // After installation, "upgrade" to the native operating system badge.
    installButton.disabled = true;
    installEvent = null;
    if (supportsAppBadge) {
      favicon.badge = false;
      setAppBadge = setAppBadgeNative;
    }
  };

  // …listen for the `beforeinstallprompt` event.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installEvent = event;
    installButton.disabled = false;
  });

  // Deal with installation.
  installButton.addEventListener('click', async () => {
    if (!installEvent) {
      return;
    }
    installEvent.prompt();
    const result = await installEvent.userChoice;
    if (result.outcome === 'accepted') {
      onInstall();
    }
  });

  // Listen for the `appinstalled` in case the user installs the app manually.
  window.addEventListener('appinstalled', (event) => {
    onInstall();
  });
}
```

## Further reading

- [Badging for app icons](badging-api/)

## Demo
