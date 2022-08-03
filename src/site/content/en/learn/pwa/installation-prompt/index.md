---
title: Installation prompt
description: >
  For sites that pass the PWA install criteria, the browser triggers an event to prompt the user to install it. The good news is that you can use this event to customize your prompt and invite users to install your app.
authors:
  - firt
date: 2022-03-09
updated: 2022-03-14
---

Users may not be familiar with the PWA install process. As the developer, you will understand when it is the right time to invite the user to install the app. The default browser installation prompts can also be enhanced. Let's check out the tools available.

## Enhancing the install dialog

Browsers provide default installation prompts when PWAs pass the install criteria. The browser uses the `name` and `icons` properties from your [Web App Manifest](/learn/pwa/web-app-manifest) to build the prompt.

{% Img src="image/RK2djpBgopg9kzCyJbUSjhEGmnw1/Ekh5btJPBqmnX85DonZK.png", alt="Microsoft Edge installation prompt.", width="800", height="426" %}

Some browsers enhance the installation prompt experience using the [promotional fields in the manifest](/learn/pwa/web-app-manifest/#promotional-fields), including `description`, `categories`, and `screenshots`. For example, using Chrome on Android, if your PWA provides values for the `description` and `screenshots` fields, the installation dialog experience transforms from a small **Add to home screen** info bar to a bigger, more detailed dialog, similar to the install prompts from an app store.

{% Video src="video/RK2djpBgopg9kzCyJbUSjhEGmnw1/eU7EiYjZKtVsBrQ3xfBz.mp4" %}

See promotional fields in action:

{% Glitch 'mlearn-pwa-web-app-manifest-promotional' %}

## The beforeinstallprompt event

The browser's installation prompts are the first step in getting  users to install your PWA. To implement your own install experience, your app still needs to pass the install criteria: when the browser detects that your app is installable, it fires the `beforeinstallprompt` event. You need to implement this event handler to customize the user's experience. Here's how:

1. Listen for the `beforeinstallprompt` event.
1. Save it (you'll need it later).
1. Trigger it from your UI.

{% Aside 'caution' %}
Not all browsers support this event, and it has been moved from the Web App Manifest spec to a [separate incubator](https://wicg.github.io/manifest-incubations/).
{% endAside %}

Check the code below for an example of an event listener for the `beforeinstallprompt` event, its capture and later custom use.

```js
// This variable will save the event for later use.
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevents the default mini-infobar or install dialog from appearing on mobile
  e.preventDefault();
  // Save the event because you'll need to trigger it later.
  deferredPrompt = e;
  // Show your customized install prompt for your PWA
  // Your own UI doesn't have to be a single element, you
  // can have buttons in different locations, or wait to prompt
  // as part of a critical journey.
  showInAppInstallPromotion();
});
```

Then, if the user clicks on your customized install button, use the `deferredPrompt` that has previously been saved and call its `prompt()` method, because the user still needs to go through the browser's process to install your app. What you did was delay the event until you gave the user the right context to encourage them to install the PWA.

Capturing the event gives you the opportunity to add hints and incentives for your users to install your app, and to choose to prompt for installation when you know the users are more engaged.

{% Aside 'caution' %}
You can only call `prompt()` on the deferred event once. If the user dismisses it, you need to wait until the `beforeinstallprompt` event is fired again.
{% endAside %}

The event will not fire if:

- The user has already installed the current PWA (valid only for desktop and WebAPK on Android).
- The app does not pass the [PWA installation criteria](/learn/pwa/installation/#installation-criteria).
- The PWA is not installable on the current device for other reasons (for example, a device in kiosk mode or without permissions).

{% Aside 'gotchas' %}
Chrome and Edge on iOS and iPadOS do not support PWA installation, so the `beforeinstallprompt` event can't fire. In this case, the only option is to open the PWA using Safari, where it is installable from the [share, add to the home screen menu](/learn/pwa/installation/#installation-criteria).
{% endAside %}

### The best place to prompt

Where to prompt depends on your application and when your users are most engaged with your content and services. When you capture the `beforeinstallprompt`, you can guide users through the reasons to keep using your app and the advantages they will gain from installing it.
You can choose to display install hints anywhere in your app. Some common patterns are: in the side menu, after a critical user journey such as completing an order, or after a sign-up page. You can read more about this in [Patterns for promoting PWA installation](/promote-install/).

### Gathering analytics

Using analytics will help you to understand better where and when to present your prompts. You can use the `userChoice` property from the `beforeinstallprompt` event; `userChoice` is a promise that will resolve with the action the user took.

```js
// Gather the data from your custom install UI event listener
installButton.addEventListener('click', async () => {
  // deferredPrompt is a global variable we've been using in the sample to capture the `beforeinstallevent`
  deferredPrompt.prompt();
  // Find out whether the user confirmed the installation or not
  const { outcome } = await deferredPrompt.userChoice;
  // The deferredPrompt can only be used once.
  deferredPrompt = null;
  // Act on the user's choice
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt.');
  } else if (outcome === 'dismissed') {
    console.log('User dismissed the install prompt');
  }
});
```

{% Aside %}
Chromium browsers trigger the [`appinstalled`](https://developer.mozilla.org/docs/Web/API/Window/appinstalled_event) event on the `window` object. The event is fired when the user accepts the install, whether action was triggered by a custom install button or by the browser.
{% endAside %}

### See it in action

Try the following sample in action on a Chromium browser (desktop or Android).

{% Glitch 'mlearn-pwa-web-app-install-prompt' %}

## Fallback

If the browser doesn't support the `beforeinstallprompt` or the event does not fire, there is no other way to trigger the browser's installation prompt. However, on platforms that allow the user to install PWAs manually, like iOS, you can display these instructions to the user.

You should only render these instructions in browser mode; other display options, such as `standalone` or `fullscreen` mean the user has already installed the app.

To render the element only in browser mode, use the `display-mode` media query:

```css
#installInstructions {
   display: none
}
@media (display-mode: browser) {
   #installInstructions {
     display: block
   }
}
```

## Codelab

{% Aside 'codelab' %}
Try it yourself with the [Make it installable](/codelab-make-installable/) codelab.
{% endAside %}

## Libraries

Check out these libraries for help with rendering a custom install prompt:

- [PWA Builder <pwa-install>](https://github.com/pwa-builder/pwa-install)
- [PWA Installer Prompt for React](https://github.com/shnaveen25/react-pwa-installer-prompt)
- [React PWA Install](https://www.npmjs.com/package/react-pwa-install)
- [Vue PWA Install](https://github.com/Bartozzz/vue-pwa-install)
- [Add to Home Screen](https://github.com/docluv/add-to-homescreen)

## Resources

- [Patterns for Promoting PWA installation](/promote-install/)
- [How to provide your own in-app install experience](/customize-install/)
- [MDN: Add to Home Screen](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Add_to_home_screen)
- [Web Manifest Incubations](https://wicg.github.io/manifest-incubations/)
