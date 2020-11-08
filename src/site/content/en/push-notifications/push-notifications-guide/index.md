---
layout: post
title: Push notifications guide
subhead: How to implement push notifications on the web.
description: How to implement push notifications on the web.
authors:
  - katejeffreys
  - kaycebasques
date: 2020-11-05
codelabs:
  - push-notifications-server-codelab
  - push-notifications-client-codelab
tags:
  - notifications
---

## Browser compatibility {: #browser-compatibility }

TODO

## Creating and sending notifications

Create notifications using the [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API). A `Notification` object has a `title` string and an `options` object. For example:

```js
let title = 'Hi!';
let options = {
  body: 'Very Important Message',
  /* other options can go here */
};
let notification = new Notification(title, options);
```

The `title` is displayed in bold when the notification is active, while the `body` contains additional text.

### Get permission to send notifications

To display a notification, your app must get permission from the user to do so:

```js
Notification.requestPermission();
```

{% Aside %}

The web platform encourages developers to request notifications permission when users understand what is being asked and why.

Bring up the permission prompt **in response to a user gesture** and **when the value of notifications is obvious**. Avoid bringing up the permission prompt immediately when the user lands on the page.

{% endAside %}

#### Chrome TODO

The user can make one of three responses to the permission popup.

| **User response** | **Notification permission state** |
|-----|-----|
| User selects **Allow** | `granted` |
| User selects **Block**  | `denied` |
| User dismisses popup without making a selection | `default` |

**If the user clicks Allow:**

*   `Notification.permission` is set to `granted`.

*   The site will be able to display notifications.

*   Subsequent calls to `Notification.requestPermission` will resolve to `granted` without a popup.

**If the user clicks Block:**

*   `Notification.permission` is set to `denied`.

*   The site will _not_ be able to display notifications to the user.

*   Subsequent calls to `Notification.requestPermission` will resolve to `denied` without a popup.

**If the user dismisses the popup:**

*   `Notification.permission` remains `default`.

*   The site will not be able to display notifications to the user.

*   Subsequent calls to `Notification.requestPermission` will produce more popups.

    However, if the user continues to dismiss the popups, the browser might block the site, setting `Notification.permission` to `denied`. Neither permission request popups nor notifications can then be displayed to the user.

    At the time of writing, browser behavior in response to dismissed notifications permission popups is still subject to change. The best way to handle this is to always request notification permission in response to some interaction the user has initiated so that they are expecting it and know what's going on.

### Part 1: Register a service worker and subscribe to Push

1.  A client app registers a service worker with `ServiceWorkerContainer.register()`. The registered service worker will continue to run in the background when the client is inactive.

    Client code:

    ```js
    navigator.serviceWorker.register('sw.js');
    ```

1.  The client requests permission from the user to send notifications.

    Client code:

    ```js
    Notification.requestPermission();
    ```

1.  To enable push notifications, the service worker uses `PushManager.subscribe()` to create a push subscription. In the call to `PushManager.subscribe()`, the service worker supplies the app's API key as an identifier.

    Client code:

    ```js/0-1/0/
    navigator.serviceWorker.register('sw.js').then(sw => {
      sw.pushManager.subscribe({ /* API key */ });
    });
    ```

    Push services like Firebase Cloud Messaging operate on a subscription model. When a service worker subscribes to a push service by calling `PushManager.subscribe()`, the push service creates a URL unique to that service worker. The URL is known as a **subscription endpoint**.

1.  The client sends the subscription endpoint to the app server.

    Client code:

    ```js/1-3/1/
    navigator.serviceWorker.register('sw.js').then(sw => {
      sw.pushManager.subscribe({ /* API key */ }).then(subscription => {
        sendToServer(subscription, '/new-subscription', 'POST');
      });
    });
    ```

    Server code:

    ```js
    app.post('/new-subscription', (request, response) => {
      // extract subscription from request
      // send 'OK' response
    });
    ```

### Part 2: Send a notification

1.  The web server sends a notification to the subscription endpoint.

    Server code:

    ```js
    const webpush = require('web-push');

    let options = { /* config info for cloud messaging and API key */ };
    let subscription = { /* subscription created in Part 1*/ };
    let payload = { /* notification */ };

    webpush.sendNotification(subscription, payload, options);
    ```

1.  Notifications sent to the subscription endpoint fire push events with the service worker as the target. The service worker receives the message and displays it to the user as a notification.

    Service worker code:

    ```js
    self.addEventListener('push', (event) => {
      let title = { /* get notification title from event data */ }
      let options = { /* get notification options from event data */ }
      showNotification(title, options);
    })
    ```

1.   The user interacts with the notification, making the web app active if it wasn't already.

