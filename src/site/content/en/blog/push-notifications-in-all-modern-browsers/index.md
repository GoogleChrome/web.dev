---
title: Push notifications are now supported cross-browser
subhead: >
  Deliver timely and useful notifications to your users.
date: 2023-03-28
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/wh2VQyIaAgf3TolWMePH.jpg
alt: The word push written in mirrored letters.
authors:
  - thomassteiner
tags:
  - blog
  - newly-interoperable
---

{% Aside 'celebration' %}
This web feature is now available in all three browser engines!
{% endAside %}

Push notifications were standardized in 2016 with the release of the Push API and the Notification API, which are part of the W3C's Web Applications Working Group. These APIs provide the necessary functionality for web developers to incorporate push notifications into their web applications and for users to receive and interact with notifications on their web browsers. Push messages are notifications that are sent to a user's web browser from a website or application that the user has previously granted permission to send notifications. These messages can be used to alert the user of new content or updates, remind them of upcoming events or deadlines, or provide other important information. Push messages can be particularly useful for applications that need to deliver timely, relevant information to their users, such as news or sports apps, or for e-commerce websites that want to send users notifications about special offers or sales.

To sign up for push notifications, first check if your browser supports them by checking for the `serviceWorker` and `PushManager` objects in the `navigator` and `window` objects. If push notifications are supported, use the `async` and `await` keywords to register the service worker and subscribe for push notifications. Here is an example of how you can do this using JavaScript:

```js
// Check if the browser supports push notifications.
if ("serviceWorker" in navigator && "PushManager" in window) {
  try {
    // Register the service worker.
    const swReg = await navigator.serviceWorker.register("/sw.js");

    // Subscribe for push notifications.
    const pushSubscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true
    });

    // Save the push subscription to the database.
    savePushSubscription(pushSubscription);
  } catch (error) {
    // Handle errors.
    console.error("Error subscribing for push notifications.", error);
  }
} else {
  // Push notifications are not supported by the browser.
  console.error("Push notifications are not supported by the browser.");
}
```

{% Aside 'gotcha' %}
Prior to version 16, **Safari on macOS** supported a [proprietary version of push notifications](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html#//apple_ref/doc/uid/TP40013225-CH3-SW1). Since version 16, Safari for macOS now supports standard push notifications as other browsers.

**Safari for iOS and iPadOS** supports push notifications as of version 16.4, but only for apps that were added to the Home Screen. Apple calls these Home Screen web apps.
{% endAside %}

{% BrowserCompat '​​api.PushEvent' %}

## Further reading

- [Push notifications overview](/push-notifications-overview/)
- [Push API](https://developer.mozilla.org/docs/Web/API/Push_API)
- [Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)

## Acknowledgements

Hero image by [Jean Bach](https://unsplash.com/@jeans514) on [Unsplash](https://unsplash.com/photos/X8GTI5tx6UA).
