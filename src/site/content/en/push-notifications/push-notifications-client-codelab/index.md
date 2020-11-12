---
layout: codelab
title: "Codelab: Build a push notifications client"
authors: 
  - kaycebasques
  - katejeffreys
description: >
  A step-by-step interactive tutorial that shows you how to build a
  client that subscribes the user to push notifications,
  displays push messages as notifications, and unsubscribes the user
  from push notifications.
date: 2020-11-11
glitch: push-notifications-client-codelab-incomplete
related_post: push-notifications-overview
tags:
  - notifications
---

This codelab shows you, step-by-step, how to build a push notification client.
By the end of the codelab you'll have a client that:

* Subscribes the user to push notifications.
* Receives push messages and displays them as notifications.
* Unsubscribes the user from push notifications.

This codelab doesn't explain push notification concepts. Check out
[How do push notifications work?](/push-notifications-overview/#how) if you want a
high-level conceptual overview of the push notification implementation workflow.

The server code of this codelab is already complete. You'll only be
implementing the client in this codelab. To learn how to implement a
push notification server, check out [Codelab: Build a push notification
server](/push-notification-server-codelab).

Check out [push-notifications-client-codelab-complete](https://push-notifications-server-codelab-complete.glitch.me/)
([source](https://glitch.com/edit/#!/push-notifications-client-codelab-complete))
to see the complete code.

## Setup {: #setup }

### Get an editable copy of the code {: #remix }

The code editor that you see to the right of these instructions will be called
the **Glitch UI** throughout this codelab.

{% Instruction 'remix', 'ol' %}

### Set up authentication {: #authentication }

See [Sign your web push protocol requests](/push-notifications-overview/#sign)
for more context about the authentication process.

<!-- https://glitch.com/edit/#!/vapid-keys-generator -->

1. In the Glitch UI click **Tools** and then click **Terminal** to open the Glitch Terminal.
1. In the Glitch Terminal, run `npx web-push generate-vapid-keys`. Copy the private key
   and public key values.
1. In the Glitch UI open `.env` and update `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`. Set
   `VAPID_SUBJECT` to `mailto:test@test.test`. All of these values should be wrapped
   in double quotes. After making your updates, your `.env` file should look
   similar to this:

```text
VAPID_PUBLIC_KEY="BKiwTvD9HA…"
VAPID_PRIVATE_KEY="4mXG9jBUaU…"
VAPID_SUBJECT="mailto:test@test.test"
```

1. Close the Glitch Terminal.

{% Aside 'gotchas' %}
  Environment variable values (the stuff in `.env`) are unique to a single Glitch project.
  I.e. if you remix your project, the values in `.env` won't get copied over.
{% endAside %}

1. Open `public/index.js`.
1. Replace `VAPID_PUBLIC_KEY_VALUE_HERE` with the value of your public key.

## Register a service worker

1. Replace the `// TODO add startup logic here` comment with the following code:

```js/1-15/0
// TODO add startup logic here
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('./service-worker.js').then(serviceWorkerRegistration => {
    console.info('Service worker was registered.');
    console.info({serviceWorkerRegistration});
  }).catch(error => {
    console.error('An error occurred while registering the service worker.');
    console.error(error);
  });
  subscribeButton.disabled = false;
} else {
  console.error('Browser does not support service workers or push messages.');
}

subscribeButton.addEventListener('click', subscribeButtonHandler);
unsubscribeButton.addEventListener('click', unsubscribeButtonHandler);
```

## Request push notification permission

See [Get permission to send push notifications](/push-notifications-overview/#permission)
for more context about the permission process.

1. Replace the `// TODO` comment in `subscribeButtonHandler()` with the following code:

```js/1-6/0
// TODO
subscribeButton.disabled = true;
const result = await Notification.requestPermission();
if (result === 'denied') {
  console.error('The user explicitly denied the permission request.');
  return;
}
```

Note that some browsers (such as Safari on macOS) use an older, callback-based
version of `Notifcation.requestPermission()`. If you want to support browsers
that use the older version of the method, you can do something like the following.

{% Aside 'caution' %}
  Don't add the code below to your Glitch project. We're just providing
  it for your information.
{% endAside %}

```js
async function subscribeButtonHandler() {
  function permissionRequestCallback(result) {
    permissionStatus = result;
    subscribe();
  }
  async function subscribe() {
    // Some of the browsers that use the newer, Promise-based version of 
    // Notification.requestPermission() still call the callback if you
    // pass one. So we use a sentinel value to prevent subscribe() from
    // being called twice.
    if (subscriptionAttemptInFlight) return;
    subscriptionAttemptInFlight = true;
    if (permissionStatus === 'denied') {
      console.error('The user explicitly denied notification permission.');
      return;
    }
    // Proceed with attempting to subscribe to push messages.
  }
  let permissionStatus;
  let subscriptionAttemptInFlight = false;
  try {
    Notification.requestPermission(permissionRequestCallback).then(result => {
      permissionStatus = result;
      subscribe();
    });
  } catch (error) {
    if (error instanceof TypeError) {
      console.info('Callback version of Notification.requestPermission() detected.');
    }
  }
}
```

## Subscribe to push notifications

See [Subscribe the client to push notifications](/push-notifications-overview/#subscription)
for more context about the subscription process.

1. Add the following code to `subscribeButtonHandler()`:

```js/6-24
subscribeButton.disabled = true;
const result = await Notification.requestPermission();
if (result === 'denied') {
  console.error('The user explicitly denied the permission request.');
  return;
}
const registration = await navigator.serviceWorker.getRegistration();
const subscribed = await registration.pushManager.getSubscription();
if (subscribed) {
  console.info('User is already subscribed.');
  return;
}
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY)
});
notifyMeButton.disabled = false;
fetch('/add-subscription', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(subscription)
});
```

## Unsubscribe from push notifications

1. Replace the `// TODO` comment in `unsubscribeButtonHandler()`
   with the following code:

```js/1-16/0
  // TODO
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.getSubscription();
  fetch('/remove-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({endpoint: subscription.endpoint})
  });
  const unsubscribed = await subscription.unsubscribe();
  if (unsubscribed) {
    console.info('Successfully unsubscribed from push notifications.');
    unsubscribeButton.disabled = true;
    subscribeButton.disabled = false;
    notifyMeButton.disabled = true;
  }
  ```

## Receive a push message and display it as a notification

  1. Replace the `// TODO` comment in the service worker's `push` event handler
     with the following code:

```js/1-12/0
  // TODO
  let data = event.data.json();
  const image = 'https://cdn.glitch.com/614286c9-b4fc-4303-a6a9-a4cef0601b74%2Flogo.png?v=1605150951230';
  const options = {
    body: data.options.body,
    icon: image,
    badge: image,
    image
  }
  self.registration.showNotification(
    data.title, 
    options
  );
```

## Open a URL when a user clicks a notification

1. Replace the `// TODO` comment in the service worker's `notificationclick`
   event handler with the following code:

```js/1-2/0
// TODO
event.notification.close();
event.waitUntil(self.clients.openWindow('https://web.dev'));
```