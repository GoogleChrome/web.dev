---
layout: pattern
title: How to use multiple screens
date: 2022-10-10
updated: 2023-05-19
authors:
  - pliao
  - thomassteiner
description: >
  Learn how to use the Window Management API to control multiple screens.
height: 800
static:
  - popup.html
---

## The modern way

### Using `window.getScreenDetails()`

To make sure your browser supports the `getScreenDetails()` method, first check if it exists
on the `window` object. Then, call `window.getScreenDetails()` to get attached screens. Adding an
event listener to adapt to changed screen details allows you to manage multiple screens according to
the needs of your app.

```js
if ('getScreenDetails' in window) {
  // The Window Management API is supported.
  const screenDetails = await window.getScreenDetails();
  screenDetails.addEventListener('screenschange', (event) => {
    // Handle screens change.
  });
}
```

{% BrowserCompat 'api.Window.getScreenDetails' %}

## The classic way

### Using the window.screen method

There's no classic way to control multi-screen layouts, but you can fall back to controlling the
current screen by using the `window.screen` property and polyfill the new API shape.

```js
if (!('getScreenDetails' in window)) {
  // Returning a one-element array with the current screen,
  // noting that there might be more.
  window.getScreenDetails = async () => [window.screen];
  // Set to `false`, noting that this might be a lie.
  window.screen.isExtended = false;
}
```

{% BrowserCompat 'api.Window.screen' %}

## Progressive enhancement

The demo below shows how you can handle multiple screens with the Window Management API.
The code checks the browser capability first and then falls back to the classic way.

```js
const detectButton = document.querySelector('#detectScreen');
const createButton = document.querySelector('#create');
const permissionLabel = document.querySelector('#permissionStatus');
const screensAvailLabel = document.querySelector('#screensAvail');
const popupUrl = './popup.html';
let screenDetails = undefined;
let permission = undefined;
let currentScreenLength = undefined;

detectButton.addEventListener('click', async () => {
  if ('getScreenDetails' in window) {
    screenDetails = await window.getScreenDetails();
    screenDetails.addEventListener('screenschange', (event) => {
      if (screenDetails.screens.length !== currentScreenLength) {
        currentScreenLength = screenDetails.screens.length;
        updateScreenInfo();
      }
    });
    try {
      permission =
        (await navigator.permissions.query({ name: 'window-management' })).state === 'granted'
          ? 'Granted'
          : 'No Permission';
    } catch (err) {
      console.error(err);
    }
    currentScreenLength = screenDetails.screens.length;
    updateScreenInfo();
  } else {
    screenDetails = window.screen;
    permission = 'Window Management API - NOT SUPPORTED';
    currentScreenLength = 1;
    updateScreenInfo();
  }
});

createButton.addEventListener('click', () => {
  let screen = screenDetails.screens[Math.floor(Math.random() * currentScreenLength)];
  options = {
    x: screen.availLeft,
    y: screen.availTop,
    width: screen.availWidth,
    height: screen.availHeight,
  };
  window.open(popupUrl, '_blank', getFeaturesFromOptions(options));
});

function getFeaturesFromOptions(options) {
  return (
    'left=' +
    options.x +
    ',top=' +
    options.y +
    ',width=' +
    options.width +
    ',height=' +
    options.height
  );
}

updateScreenInfo = () => {
  screensAvailLabel.innerHTML = currentScreenLength;
  permissionLabel.innerHTML = permission;
  if ('getScreenDetails' in window && screenDetails.screens.length > 1) {
    createButton.disabled = false;
  } else {
    createButton.disabled = true;
  }
};
```

## Further reading

- [Managing several displays with the Window Management API](https://developer.chrome.com/articles/window-management/)
- [Screen API](https://developer.mozilla.org/docs/Web/API/Screen)

## Demo
