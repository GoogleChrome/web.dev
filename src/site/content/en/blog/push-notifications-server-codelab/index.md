---
layout: codelab
title: "Codelab: Build a push notification server"
authors: 
  - kaycebasques
  - katejeffreys
description: >
  A step-by-step interactive tutorial that shows you how to build a
  server that manages push notification subscriptions and sends
  web push protocol requests to a push service.
date: 2020-11-11
updated: 2020-12-06
glitch: push-notifications-server-codelab-incomplete
related_post: push-notifications-overview
tags:
  - notifications
  - progressive-web-apps
  - mobile
  - network
  - capabilities
---

This codelab shows you, step-by-step, how to build a push notification server.
By the end of the codelab you'll have a server that:

* Keeps track of push notification subscriptions (i.e. the server creates a
  new database record when a client opts in to push notifications, and it
  deletes an existing database record when a client opts out)
* Sends a push notification to a single client
* Sends a push notification to all subscribed clients

This codelab is focused on helping you learn by doing and doesn't
talk about concepts much. Check out 
[How do push notifications work?](/push-notifications-overview/#how)
to learn about push notification concepts.

The client code of this codelab is already complete. You'll only be
implementing the server in this codelab. To learn how to implement a
push notification client, check out [Codelab: Build a push notification
client](/push-notifications-client-codelab).

Check out [push-notifications-server-codelab-complete](https://push-notifications-server-codelab-complete.glitch.me/)
([source](https://glitch.com/edit/#!/push-notifications-server-codelab-complete))
to see the complete code.

## Browser compatibility

This codelab is known to work with the following operating system and browser combinations:

* Windows: Chrome, Edge
* macOS: Chrome, Firefox
* Android: Chrome, Firefox

This codelab is known to **not** work with the following operating systems
(or operating system and browser combinations):

* macOS: Brave, Edge, Safari
* iOS

## Application stack {: #stack }

* The server is built on top of [Express.js](https://expressjs.com/).
* The [web-push](https://www.npmjs.com/package/web-push) Node.js library
  handles all of the push notification logic.
* Subscription data is written to a JSON file using [lowdb](https://www.npmjs.com/package/lowdb).

You don't have to use any of these technologies to implement push notifications.
We chose these technologies because they provide a reliable codelab experience.

## Setup {: #setup }

### Get an editable copy of the code {: #remix }

The code editor that you see to the right of these instructions will be called
the **Glitch UI** throughout this codelab.

{% Instruction 'remix', 'ol' %}

### Set up authentication {: #authentication }

Before you can get push notifications working, you need to set up
your server and client with authentication keys.
See [Sign your web push protocol requests](/push-notifications-overview/#sign)
to learn why.

1. Open the Glitch terminal by clicking **Tools** and then clicking **Terminal**.
1. In the terminal, run `npx web-push generate-vapid-keys`. Copy the private key
   and public key values.
1. Open `.env` and update `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`. Set
   `VAPID_SUBJECT` to `mailto:test@test.test`. All of these values should be wrapped
   in double quotes. After making your updates, your `.env` file should look
   similar to this:

```text
VAPID_PUBLIC_KEY="BKiwTvD9HA…"
VAPID_PRIVATE_KEY="4mXG9jBUaU…"
VAPID_SUBJECT="mailto:test@test.test"
```

1. Close the Glitch terminal.

{% Aside 'gotchas' %}
  Environment variable values (the stuff in `.env`) are unique to a single Glitch project.
  If you remix your project, the values in `.env` won't get copied over.
{% endAside %}

1. Open `public/index.js`.
1. Replace `VAPID_PUBLIC_KEY_VALUE_HERE` with the value of your public key.

## Manage subscriptions {: #manage }

Your client handles most of the subscription process. The main
things your server needs to do are save new push notification subscriptions
and delete old subscriptions. These subscriptions are what enable you to
push messages to clients in the future.
See [Subscribe the client to push notifications](/push-notifications-overview/#subscription)
for more context about the subscription process.

### Save new subscription information {: #save }

{% Instruction 'preview', 'ol' %}

{% Aside 'key-term' %}
  We'll refer to the tab that you just opened as the **app tab**.
{% endAside %}

1. Click **Register service worker** in the app tab. In the status box you
   should see a message similar to this:

```text
Service worker registered. Scope: https://desert-cactus-sunset.glitch.me/
```

1. In the app tab click **Subscribe to push**. Your browser or operating system will probably 
ask you if you want to let the website send you push notifications. Click **Allow** (or whatever 
equivalent phrase your browser/OS uses). In the status box you should see a message similar 
to this:

```text
Service worker subscribed to push.  Endpoint: https://fcm.googleapis.com/fcm/send/…
```

{% Aside %}
  The endpoint URL changes depending on what browser you're using.
  For example, on Firefox the URL starts with `https://updates.push.services.mozilla.com/…`.
{% endAside %}

1. Go back to your code by clicking **View Source** in the Glitch UI.
1. Open the Glitch Logs by clicking **Tools** and then clicking **Logs**. You
   should see `/add-subscription` followed by some data. `/add-subscription` is
   the URL that the client sends a
   [POST](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST)
   request to when it wants to subscribe to push notifications. The data that
   follows is the client's subscription information that you need to save.
1. Open `server.js`.
1. Update the `/add-subscription` route handler logic with the following code:

```js/3-6/1-2
app.post('/add-subscription', (request, response) => {
  console.log('/add-subscription');
  console.log(request.body);
  console.log(`Subscribing ${request.body.endpoint}`);
  db.get('subscriptions')
    .push(request.body)
    .write();
  response.sendStatus(200);
});
```

{% Aside %}
  The database writes to `.data/db.json`. To inspect this file in Glitch,
  click **Tools**, then click **Terminal**, then run `cat .data/db.json`
  in the Terminal. `.data/db.json` is deleted every time that you edit your app.
  This is because Glitch runs the `start` script in `package.json` every time you
  edit your app, and that script includes a call to `rm .data/db.json`.
{% endAside %}

### Delete old subscription information 

1. Go back to the app tab.
1. Click **Unsubscribe from push**.
1. Look at the Glitch Logs again. You should see `/remove-subscription` followed
   by the client's subscription information.
1. Update the `/remove-subscription` route handler logic with the following code:

```js/3-6/1-2
app.post('/remove-subscription', (request, response) => {
  console.log('/remove-subscription');
  console.log(request.body);
  console.log(`Unsubscribing ${request.body.endpoint}`);
  db.get('subscriptions')
    .remove({endpoint: request.body.endpoint})
    .write();
  response.sendStatus(200);
});
```

## Send notifications

As explained in [Send a push message](/push-notifications-overview/#send),
your server doesn't actually send the push messages directly to clients.
Rather, it relies on a push service to do that. Your server basically
just kicks off the process of pushing messages to clients by making web
service requests (web push protocol requests) to a web service (the push service)
owned by the browser vendor that your user uses.

1. Update the `/notify-me` route handler logic with the following code:

```js/3-6/1-2
app.post('/notify-me', (request, response) => {
  console.log('/notify-me');
  console.log(request.body);
  console.log(`Notifying ${request.body.endpoint}`);
  const subscription = 
      db.get('subscriptions').find({endpoint: request.body.endpoint}).value();
  sendNotifications([subscription]);
  response.sendStatus(200);
});
```

1. Update the `sendNotifications()` function with the following code:

```js/2-28/1
function sendNotifications(subscriptions) {
  // TODO
  // Create the notification content.
  const notification = JSON.stringify({
    title: "Hello, Notifications!",
    options: {
      body: `ID: ${Math.floor(Math.random() * 100)}`
    }
  });
  // Customize how the push service should attempt to deliver the push message.
  // And provide authentication information.
  const options = {
    TTL: 10000,
    vapidDetails: vapidDetails
  };
  // Send a push message to each client specified in the subscriptions array.
  subscriptions.forEach(subscription => {
    const endpoint = subscription.endpoint;
    const id = endpoint.substr((endpoint.length - 8), endpoint.length);
    webpush.sendNotification(subscription, notification, options)
      .then(result => {
        console.log(`Endpoint ID: ${id}`);
        console.log(`Result: ${result.statusCode}`);
      })
      .catch(error => {
        console.log(`Endpoint ID: ${id}`);
        console.log(`Error: ${error} `);
      });
  });
}
```

1. Update the `/notify-all` route handler logic with the following code:

```js/3-11/1-2
app.post('/notify-all', (request, response) => {
  console.log('/notify-all');
  response.sendStatus(200);
  console.log('Notifying all subscribers');
  const subscriptions =
      db.get('subscriptions').cloneDeep().value();
  if (subscriptions.length > 0) {
    sendNotifications(subscriptions);
    response.sendStatus(200);
  } else {
    response.sendStatus(409);
  }
});
```

1. Go back to the app tab.
1. Click **Unsubscribe from push** and then click **Subscribe to push** again.
   This is only necessary because, as mentioned before, Glitch restarts the project
   every time you edit the code and the project is configured to delete the database on startup.
1. Click **Notify me**. You should receive a push notification. The title should
   be `Hello, Notifications!` and the body should be `ID: <ID>` where `<ID>` is a
   random number.
1. Open your app on other browsers or devices and try subscribing them to push notifications
   and then clicking the **Notify all** button. You should receive the same notification on 
   all of your subscribed devices (i.e. the ID in the body of the push notification should
   be the same).

## Next steps

* Read [Push notifications overview](/push-notifications-overview)
  for a deeper conceptual understanding of how push notifications work.
* Check out [Codelab: Build a push notification client](/push-notifications-client-codelab/)
  to learn how to build a client that requests notification permission, subscribes
  the device to receive push notifications, and uses a service worker to receive
  push messages and display the messages as notifications.