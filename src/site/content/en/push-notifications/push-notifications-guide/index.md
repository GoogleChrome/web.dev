---
layout: post
title: Push notifications guide
subhead: How to implement push notifications on the web.
description: How to implement push notifications on the web.
authors:
  - katejeffreys
  - kaycebasques
date: 2020-11-04
codelabs:
  - codelab-notifications-get-started
  - codelab-notifications-service-worker
draft: true
tags:
  - notifications
---

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

