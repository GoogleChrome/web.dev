---
layout: codelab
title: Make it installable
authors:
  - petelepage
date: 2018-11-05
updated: 2021-02-12
description: |
  In this codelab, learn how to make a site installable using the
  beforeinstallprompt event.
glitch: make-it-installable?path=script.js
related_post: customize-install
tags:
  - progressive-web-apps
---

This glitch already contains the critical components required to make a
Progressive Web App installable, including a
[very simple service worker](https://glitch.com/edit/#!/make-it-installable?path=service-worker.js)
and a
[web app manifest](https://glitch.com/edit/#!/make-it-installable?path=manifest.json).
It also has an install button that is hidden by default.

## Listen for the beforeinstallprompt event

When the browser fires the `beforeinstallprompt` event, that's the indication
that the Progressive Web App can be installed and an install button can be shown
to the user. The `beforeinstallprompt` event is fired when the PWA meets [the
installability criteria](/install-criteria/).

{% Instruction 'remix', 'ol' %}
1. Add a `beforeinstallprompt` event handler to the `window` object.
1. Save the `event` as a global variable; we'll need it later to show the
    prompt.
1. Unhide the install button.

Code:

```js
window.addEventListener('beforeinstallprompt', (event) => {
  console.log('👍', 'beforeinstallprompt', event);
  // Stash the event so it can be triggered later.
  window.deferredPrompt = event;
  // Remove the 'hidden' class from the install button container
  divInstall.classList.toggle('hidden', false);
});
```

## Handle the install button click

To show the install prompt, call `prompt()` on the saved `beforeinstallprompt`
event. Calling `prompt()` is done in the install button click handler because
`prompt()` must be called from a user gesture.

1. Add a click event handler for the install button.
1. Call `prompt()` on the saved `beforeinstallprompt` event.
1. Log the results of the prompt.
1. Set the saved `beforeinstallprompt` event to null.
1. Hide the install button.

Code:

```js
butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // The deferred prompt isn't available.
    return;
  }
  // Show the install prompt.
  promptEvent.prompt();
  // Log the result
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  window.deferredPrompt = null;
  // Hide the install button.
  divInstall.classList.toggle('hidden', true);
});
```

## Track the install event

Installing a Progressive Web App through an install button is only one way users
can install a PWA. They can also use Chrome's menu, the mini-infobar, and
through [an icon in the omnibox](/promote-install/#browser-promotion). You can
track all of these ways of installation by listening for the `appinstalled`
event.

1. Add an `appinstalled` event handler to the `window` object.
1. Log the install event to analytics or other mechanism.

Code:

```js
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  // Clear the deferredPrompt so it can be garbage collected
  window.deferredPrompt = null;
});
```

## Further reading

Congratulations, you app is now installable!

Here are some additional things that you can do:

+  [Detect if your app is launched from the home screen](/customize-install/#detect-mode)
+  [Show the operating system's app install prompt instead](https://developers.google.com/web/fundamentals/app-install-banners/native)