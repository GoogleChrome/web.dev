---
layout: post
title: Use push notifications to engage and re-engage users
authors:
  - katejeffreys
description: |
  Use push notifications to engage users with targeted, timely updates.
date: 2019-10-21
codelabs:
  - codelab-notifications-get-started
  - codelab-notifications-service-worker
---

## Why use push notifications?

Notifications present small chunks of information to a user. Web apps can use notifications to tell users about important, time-sensitive events, or actions the user needs to take. 

The look-and-feel of notifications varies between platforms.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./predicaments-android.png" alt="">
  <figcaption class="w-figcaption">A notification on an Android device.</figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./predicaments-macbook.png" alt="">
  <figcaption class="w-figcaption">A notification on a MacBook.</figcaption>
</figure>

Traditionally, web browsers had to initiate the exchange of information between server and client by making a request. [Web push technology](https://developer.mozilla.org/en-US/docs/Web/API/Push_API), on the other hand, lets you configure your server to send notifications when it makes sense for your app. 

{# Too much technical detail too quickly. #}

A push service creates unique push subscriptions for each subscribed service worker. Sending messages to a user's push subscriptions raises events on that service worker, prompting it to display a notification.

{% Aside 'key-term' %}

Each browser platform has a push service backend which can forward messages to users. When a user gives permission to receive notifications from your site, you can use JavaScript to get a unique subscription ID for the user from their browser's push service. The subscription data identifies the device, browser and service worker that requested it.

Using that ID, you send messages from your application server to the browser's push service, which then forwards messages to the correct user. This process uses the Push API.

On the client side, the operating system notifies the browser when a push message is received. Service workers can listen out for push events—even when the browser is closed—and display a notification using the Notification API.

{% endAside %}

{# TODO continue an example here? #}

Push notifications can help users to get the most out of your app by prompting them to re-open the app and use it based on the latest information. 

## Creating and sending notifications

Create notifications using the [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API). A `Notification` object has a `title` string and an `options` object. For example:

```js
const title = 'Hi!';
const options = { 
  body: 'Very Important Message',
  /* other options can go here */
};
const notification = new Notification(title, options);
```

The `title` is displayed in bold when the notification is active, while the `body` contains additional text.

### Get permission to send notifications

To display a notification, your app must get permission from the user to do so: 

```js
Notification.requestPermission();
```

{% Aside %}

The web platform encourages developers to request notifications permission when users understand what is being asked and why. 

Bring up the permission prompt **in response to a user gesture** and **when the value of notifications is obvious**. Avoid bringing up the permission prompt immediately when the user lands on your site.

For example, describe briefly what your notifications have to offer, and provide the user with Sign Up button, rather than simply displaying the Notifications permission dialog.

{% endAside %}

## How do push notifications work?

The real power of notifications comes from the combination of service workers and push APIs:

*   [Service workers](https://developers.google.com/web/fundamentals/primers/service-workers) can run in the background and display notifications even when your app isn't visible on screen. 

*   Push technology lets you configure your server to send notifications when it makes sense for your app. A push service creates subscriptions for each subscribed service worker. Sending messages to a service worker's URL raises events on that service worker, prompting it to display a notification.

In the following example flow, a client registers a service worker and subscribes to push notifications. Then, the server sends a notification to the subscription endpoint. 

The client and service worker use vanilla JavaScript with no extra libraries. The server is built with the [`express` npm package](https://www.npmjs.com/package/express) on [Node.js](https://nodejs.org/en/), and uses the [`web-push` npm package](https://www.npmjs.com/package/web-push) to send notifications. To send information to the server, the client makes a call to a POST URL that the server has exposed.

### Part 1: Register a service worker and subscribe to Push

1.  A client app registers a service worker with `ServiceWorkerContainer.register()`. The registered service worker will continue to run in the background even if the browser is closed.

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

    Push services operate on a subscription model. When a service worker subscribes to a push service by calling `PushManager.subscribe()`, the push service creates a **subscription endpoint**. 

1.  From the client, send subscription data to your server:

    {# TODO replace sendToServer with fetch #}

    ```js/1-3/1/
    navigator.serviceWorker.register('sw.js').then(sw => {
      sw.pushManager.subscribe({ /* API key */ }).then(subscription => {
        sendToServer(subscription, '/new-subscription', 'POST');
      });
    });
    ```

    In your server, listen for subscription requests:

    ```js
    app.post('/new-subscription', (request, response) => {
      // extract subscription from request
      // send 'OK' response
    });
    ```

### Part 2: Send a notification

1.  From your server, send a request to the push service using the subscription endpoint data:

    Server code:

    ```js
    const webpush = require('web-push');

    const options = { /* config info for cloud messaging and API key */ };  
    const subscription = { /* subscription created in Part 1*/ };
    const payload = { /* notification */ };

    webpush.sendNotification(subscription, payload, options);
    ```

1.  Notifications sent to the subscription endpoint fire push events with the service worker as the target. The service worker receives the message and displays it to the user as a notification.

    Service worker code:

    ```js
    self.addEventListener('push', (event) => {
      const title = { /* get notification title from event data */ }
      const options = { /* get notification options from event data */ }
      showNotification(title, options);
    })
    ```

1.   The user interacts with the notification, making the web app active if it wasn't already.

## Next steps

As a next step, implement push notifications! 

We've created a series of codelabs to guide you through each step of the process.
