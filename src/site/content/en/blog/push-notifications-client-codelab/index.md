---
layout: codelab
title: "Codelab: Build a push notification client"
authors: 
  - kaycebasques
  - katejeffreys
description: >
  A step-by-step interactive tutorial that shows you how to build a
  client that subscribes the user to push notifications,
  displays push messages as notifications, and unsubscribes the user
  from push notifications.
date: 2020-11-11
updated: 2020-12-06
glitch: push-notifications-client-codelab-incomplete
related_post: push-notifications-overview
tags:
  - notifications
  - service-worker
  - progressive-web-apps
  - permissions
  - mobile
  - network
  - capabilities
---

This codelab shows you, step-by-step, how to build a push notification client.
By the end of the codelab you'll have a client that:

* Subscribes the user to push notifications.
* Receives push messages and displays them as notifications.
* Unsubscribes the user from push notifications.

This codelab is focused on helping you learn by doing and doesn't
talk about concepts much. Check out 
[How do push notifications work?](/push-notifications-overview/#how)
to learn about push notification concepts.

The server code of this codelab is already complete. You'll only be
implementing the client in this codelab. To learn how to implement a
push notification server, check out [Codelab: Build a push notification
server](/push-notifications-server-codelab).

Check out [push-notifications-client-codelab-complete](https://push-notifications-client-codelab-complete.glitch.me/)
([source](https://glitch.com/edit/#!/push-notifications-client-codelab-complete))
to see the complete code.

## Browser compatibility {: #browser-compatibility }

This codelab is known to work with the following operating system and browser combinations:

* Windows: Chrome, Edge
* macOS: Chrome, Firefox
* Android: Chrome, Firefox

This codelab is known to **not** work with the following operating systems
(or operating system and browser combinations):

* macOS: Brave, Edge, Safari
* iOS

## Setup {: #setup }

### Get an editable copy of the code {: #remix }

The code editor that you see to the right of these instructions will be called
the **Glitch UI** throughout this codelab.

{% Instruction 'remix', 'ol' %}

{% Aside 'gotchas' %}
  If you're in a Chrome incognito or guest window, you may have
  trouble completing the codelab. Consider using a signed-in
  profile instead.
{% endAside %}

### Set up authentication {: #authentication }

Before you can get push notifications working, you need to set up
your server and client with authentication keys.
See [Sign your web push protocol requests](/push-notifications-overview/#sign)
to learn why.

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
  If you remix your project, the values in `.env` won't get copied over.
{% endAside %}

1. Open `public/index.js`.
1. Replace `VAPID_PUBLIC_KEY_VALUE_HERE` with the value of your public key.

## Register a service worker

Your client will eventually need a service worker to receive and display
notifications. It's best to register the service worker as early as possible.
See [Receive and display the pushed messages as 
notifications](/push-notifications-overview/#notification) for more context.

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

{% Instruction 'preview', 'ol' %}

{% Aside 'key-term' %}
  The tab that you just opened will be referred to as the **app tab**
  throughout this codelab.
{% endAside %}

{% Instruction 'devtools-console', 'ol' %} You should see the message
`Service worker was registered.` logged to the Console.

{% Aside %}
  The previous instruction assumes that you're using Google Chrome and
  Chrome DevTools.
{% endAside %}


## Request push notification permission

You should never request permission to send push notifications on page load.
Instead, your UI should ask the user if they want to receive push notifications.
Once they explicitly confirm (with a button click, for example) then you can
start the formal process for getting push notification permission from the browser.

1. In the Glitch UI click **View Source** to return to your code.
1. In `public/index.js` replace the `// TODO` comment in 
   `subscribeButtonHandler()` with the following code:

```js/1-10/0
// TODO
// Prevent the user from clicking the subscribe button multiple times.
subscribeButton.disabled = true;
const result = await Notification.requestPermission();
if (result === 'denied') {
  console.error('The user explicitly denied the permission request.');
  return;
}
if (result === 'granted') {
  console.info('The user accepted the permission request.');
}
```

1. Go back to the app tab and click **Subscribe to push**. Your browser
   or operating system will probably ask you if you want to let the website
   send you push notifications. Click **Allow** (or whatever equivalent phrase
   your browser/OS uses). In the Console you should see a message indicating
   whether the request was accepted or denied.

{% Aside 'gotchas' %}
  If you're in an incognito or guest window, your browser may deny the
  request automatically. Keep an eye out for any browser UI indicating that
  the request was blocked automatically.
{% endAside %}

## Subscribe to push notifications

The subscription process involves interacting with a web service controlled
by the browser vendor that's called a **push service**. Once you get
the push notification subscription information you need to send it to a server
and have the server store it in a database long-term.
See [Subscribe the client to push notifications](/push-notifications-overview/#subscription)
for more context about the subscription process.

1. Add the following highlighted code to `subscribeButtonHandler()`:

```js/9-28
subscribeButton.disabled = true;
const result = await Notification.requestPermission();
if (result === 'denied') {
  console.error('The user explicitly denied the permission request.');
  return;
}
if (result === 'granted') {
  console.info('The user accepted the permission request.');
}
const registration = await navigator.serviceWorker.getRegistration();
const subscribed = await registration.pushManager.getSubscription();
if (subscribed) {
  console.info('User is already subscribed.');
  notifyMeButton.disabled = false;
  unsubscribeButton.disabled = false;
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

The `userVisibleOnly` option must be `true`. It may one day be possible
to push messages without displaying user-visible notifications
(**silent pushes**) but browsers currently don't allow that capability
because of privacy concerns. 

The `applicationServerKey` value relies on a utility function that
converts a base64 string to a Uint8Array. This value is used for
authentication between your server and the push service.

## Unsubscribe from push notifications

After a user has subscribed to push notifications, your UI needs to
provide a way to unsubscribe in case the user changes their mind
and no longer wants to receive push notifications.

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

As mentioned before, you need a service worker to handle the
receiving and displaying of messages that were pushed to the client
from your server. See [Receive and display the pushed messages as 
notifications](/push-notifications-overview/#notification) for more detail.

1. Open `public/service-worker.js` and replace the `// TODO` comment 
   in the service worker's `push` event handler with the following code:

```js/1-12/0
// TODO
let data = event.data.json();
const image = 'https://cdn.glitch.com/614286c9-b4fc-4303-a6a9-a4cef0601b74%2Flogo.png?v=1605150951230';
const options = {
  body: data.options.body,
  icon: image
}
self.registration.showNotification(
  data.title, 
  options
);
```

1. Go back to the app tab.
1. Click **Notify me**. You should receive a push notification.
1. Try opening the URL of your app tab on other browsers (or even
   other devices), going through the subscription workflow, and then
   clicking **Notify all**. You should receive the same push notification
   on all of the browsers that you subscribed. Refer back to
   [Browser compatibility](#browser-compatibility) to see a list of browser/OS
   combinations that are known to work or not work.

You can customize the notification in lots of ways. See the parameters of
[`ServiceWorkerRegistration.showNotification()`][showNotification] to learn more.

{% Aside 'gotchas' %}
  The call to 
  [`self.skipWaiting()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting) 
  in your service worker's `install` listener is important to understand. See 
  [Skip the waiting phase](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#skip_the_waiting_phase) 
  for an explanation. Without it, the code changes that you make to your service worker
  wouldn't take effect immediately. You may or may not want to use this feature on 
  your own website depending on your needs, but either way it's important to understand its effect.
{% endAside %}

## Open a URL when a user clicks a notification

In the real-world, you'll probably use the notification as a way
to re-engage your user and prompt them to visit your site.
To do that, you need to configure your service worker a bit more.

1. Replace the `// TODO` comment in the service worker's `notificationclick`
   event handler with the following code:

```js/1-2/0
// TODO
event.notification.close();
event.waitUntil(self.clients.openWindow('https://web.dev'));
```

1. Go back to the app tab, send yourself another notification, and then
   click the notification. Your browser should open a new tab and load
   `https://web.dev`.

## Next steps

* Look at [`ServiceWorkerRegistration.showNotification()`][showNotification]
  to discover all of the different ways you can customize notifications.
* Read [Push notifications overview](/push-notifications-overview)
  for a deeper conceptual understanding of how push notifications work.
* Check out [Codelab: Build a push notification server](/push-notifications-server-codelab/)
  to learn how to build a server that manages subscriptions and sends web push protocol
  requests.
* Try out [Notification Generator](https://tests.peter.sh/notification-generator/)
  to test out all the ways you can customize notifications.

[showNotification]: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
[skipWaiting]: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
[skip]: https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#skip_the_waiting_phase