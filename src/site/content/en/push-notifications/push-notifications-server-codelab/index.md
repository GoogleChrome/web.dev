---
layout: codelab
title: "Codelab: Build a push notification server"
authors: 
  - kaycebasques
  - katejeffreys
description: |
  In this codelab, learn how to build a push notifications server.
date: 2020-11-05
glitch: push-notification-server-codelab-incomplete
glitch_path: public/index.js
related_post: push-notifications-overview
tags:
  - notifications
---

<!-- https://glitch.com/edit/#!/push-notifications-server-codelab-incomplete?path=README.md%3A1%3A0 -->

This codelab teaches you how to build a push notification server. By the end of the codelab
you'll have a server that:

* Keeps track of push notification subscriptions (i.e. the server creates a
  new database record when a client opts in to push notifications, and it
  deletes an existing database record when a client opts out)
* Sends a push notification to a single client
* Sends a push notification to all subscribed clients

The frontend/client code is already complete. You'll only be implementing the backend/server in
this codelab. To learn how to implement a push notification client, check out
[Codelab: Build a push notification client](/push-notification-client-codelab).

## Application stack

* The server is built on top of [Express.js](https://expressjs.com/)
* The [web-push](https://www.npmjs.com/package/web-push) Node.js library
  handles all of the push notification logic
* Subscription data is written to a JSON file using [lowdb](https://www.npmjs.com/package/lowdb)

## Setup

### Get an editable copy of the code

{% Instruction 'remix', 'ol' %}

<!--

{% Aside 'key-term' %}
  We'll refer to the page that you're currently on (the one with the instructions on the left and
  the Glitch editor on the right) as the **codelab tab**. We'll refer to the new tab that you
  just opened as the **live app tab**.
{% endAside %}

-->

### Set up authentication

When users subscribe to notifications, they need to trust the identity of the
website and its server. Users also need to be confident that, when they receive a
notification, it's from the same website that set up the subscription. They also
need to trust that nobody else can read the notification content.

The protocol that makes push notifications secure and private is called
Voluntary Application Server Identification for Web Push (VAPID). [VAPID] uses
public key cryptography to verify the identity of apps, servers, and
subscription endpoints, and to encrypt notification content.

<!-- https://glitch.com/edit/#!/vapid-keys-generator -->

1. Open the Glitch terminal by clicking **Tools** and then clicking **Terminal**.
1. In the terminal, run `npx web-push generate-vapid-keys`. Copy the private key
   and public key values.
1. Close the Glitch terminal.
1. Open `.env` and update `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`. Set
   `VAPID_SUBJECT` to `mailto:test@test.test`. All of these values should be wrapped
   in double quotes. After making your updates, your `.env` file should look
   similar to this:

   ```text
   VAPID_PUBLIC_KEY="BKiwTvD9HA…"
   VAPID_PRIVATE_KEY="4mXG9jBUaU…"
   VAPID_SUBJECT="mailto:test@test.test"
   ```

{% Aside 'gotchas' %}
  Environment variable values (the stuff in `.env`) are unique to a single Glitch project.
  I.e. if you remix your project, the values in `.env` won't get copied over.
{% endAside %}

1. Open `public/index.js`.
1. Replace `VAPID_PUBLIC_KEY_VALUE_HERE` with the value of your public key.

## Manage subscriptions

When a client wants to receive push notifications it's known as a **subscription**.
Your server needs to keep track of client subscriptions. When
a new client opts in to push notifications, your server needs to store some
information related to that client so that it can reach it in the future.
When a client opts out of push notifications, your server needs to delete
that client's subscription information from the database.

### Save new subscription information

{% Instruction 'preview', 'ol' %}

{% Aside 'key-term' %}
  We'll refer to the tab that you just opened as the **app tab**.
{% endAside %}

1. Click **Register service worker** in the app tab. In the status box you
   should see a message similar to this:

```text
Service worker registered.
Scope: https://desert-cactus-sunset.glitch.me/
```

1. In the app tab click **Subscribe to push**. In the status box you should
   see a message similar to this:

```text
Service worker subscribed to push. 
Endpoint: https://fcm.googleapis.com/fcm/send/…
```

{% Aside %}
  The endpoint URL changes depending on what browser you're using.
  For example, on Firefox the URL looks starts with
  `https://updates.push.services.mozilla.com/wpush/v2/…`.
{% endAside %}

{% Instruction 'source', 'ol' %}
1. Open the Glitch Logs by clicking **Tools** and then clicking **Logs**. You should see
   `/add-subscription` followed by some data. `/add-subscription` is the URL that
   the client [POSTs][POST] to when it wants to subscribe to push notifications.
   The data that follows is the client's subscription information that you need to
   save.
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
  The database writes to `.data/db.json`. To inspect this file in the Glitch
  Terminal, click **Tools**, then click **Terminal**, then run `cat .data/db.json`
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

To send push notifications, your server basically just sends POST requests
to a web service API managed by the browser vendor. Your server provides
the client subscription data and the browser vendor's web service handles
actually sending the data to the client device.

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

```js/2-25/1
function sendNotifications(subscriptions) {
  // TODO
  // Create the notification content.
  const notification = JSON.stringify({
    title: "Hello, Notifications!",
    options: {
      body: `ID: ${Math.floor(Math.random() * 100)}`
    }
  });
  const options = {
    // TODO https://developers.google.com/web/fundamentals/push-notifications/web-push-protocol#ttl_header
    TTL: 10000,
    vapidDetails: vapidDetails
  };
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
1. Click **Notify me**. You should receive a push notification. The title should
   be `Hello, Notifications!` and the body should be `ID: <ID>` where `<ID>` is a
   random number.

<!--

## Setup

Notifications are automatically blocked from the embedded Glitch app, so you won't be able to preview the app on this page. Instead, here's what to do:

{% Instruction 'remix', 'ol' %}
{% Instruction 'preview', 'ol' %}

The [Glitch](https://glitch.com) should open in a new Chrome tab:

In the embedded Glitch, click **View Source** to show the code again.

{% Aside 'key-term' %}
  We'll refer to the page that you're currently on (the one with the instructions on the left and
  the Glitch editor on the right) as the **codelab tab**. We'll refer to the new tab that you
  just opened as the **live app tab**.
{% endAside %}



## Get familiar with the starting app and its code

Start by taking a look at the app's client UI.

**In the new Chrome tab:**

1.  {% Instruction 'devtools-console', 'none' %}

1.  Try clicking buttons in the UI (check the Chrome dev console for output).

    * **Register service worker** registers a service worker for the scope of your Glitch project URL. **Unregister service worker** removes the service worker. If a push subscription is attached to it, the push subscription will also be de-activated.

    * **Subscribe to push** creates a push subscription. It is only available when a service worker has been registered and a `VAPID_PUBLIC_KEY` constant is present in the client code (more about this later), so you can't click it just yet.

    * When you have an active push subscription, **Notify current subscription** requests that the server send a notification to its endpoint.

    * **Notify all subscriptions** tells the server to send a notification to all of the subscription endpoints in its database.

      Note that some of these endpoints might be inactive. It's always possible that a subscription will disappear by the time the server sends a notification to it.

Let's look at what's going on server-side. To see messages from the server code, look at the Node.js log within the Glitch interface.

* In the Glitch app, click **Tools -> Logs**.

  You'll probably see a message like `Listening on port 3000`.

  If you tried clicking **Notify current subscription** or **Notify all subscriptions** in the live app UI, you'll also see the following message:

  ```bash
  TODO: Implement sendNotifications()
  Endpoints to send to:  []
  ```

Now let's look at some code.

* `public/index.js` contains the completed client code. It performs feature detection, registers and unregisters the service worker, and controls the user's subscription to push notifications. It also sends information about new and deleted subscriptions to the server.

  Since you're only going to be working on the server functionality, you won't be editing this file (apart from populating the `VAPID_PUBLIC_KEY` constant).

* `public/service-worker.js` is a simple service worker that captures push events and displays notifications.

* `/views/index.html` contains the app UI.

* `.env` contains the environment variables that Glitch loads into your app server when it starts up. You'll populate `.env` with authentication details for sending notifications.

* `server.js` is the file you'll be doing most of your work in during this codelab.

  The starting code creates a simple [Express](https://www.npmjs.com/package/express) web server. There are four TODO items for you, marked in code comments with `TODO:`. You need to:

  * [Load VAPID details from environment variables](#load-vapid-details-from-environment-variables).

  * [Implement functionality to send notifications](#implement-functionality-to-send-notifications).

  * [Handle new subscriptions](#handle-new-subscriptions).

  * [Handle subscription cancellations](#handle-subscription-cancellations).

  In this codelab, you'll work through these TODO items one at a time.

## Generate and load VAPID details

Your first TODO item is to generate VAPID details, add them to the Node.js environment variables, and update the client and server code with the new values.

### Background

When users subscribe to notifications, they need to trust the identity of the app and its server. Users also need to be confident that, when they receive a notification, it's from the same app that set up the subscription. They also need to trust that nobody else can read the notification content.

The protocol that makes push notifications secure and private is called Voluntary Application Server Identification for Web Push (VAPID). VAPID uses public key cryptography to verify the identity of apps, servers, and subscription endpoints, and to encrypt notification content.

In this app, you'll use the [web-push npm package](https://www.npmjs.com/package/web-push) to generate VAPID keys, and to encrypt and send notifications.

### Implementation

In this step, generate a pair of VAPID keys for your app and add them to the environment variables. Load the environment variables in the server and add the public key as a constant in the client code.

1.  Use the `generateVAPIDKeys` function of the `web-push` library to create a pair of VAPID keys.

    In **server.js**, remove the comments from around the following lines of code:

    _`server.js`_

    ```js/5-6/
    // Generate VAPID keys (only do this once).
    /*
     * const vapidKeys = webpush.generateVAPIDKeys();
     * console.log(vapidKeys);
     */
    const vapidKeys = webpush.generateVAPIDKeys();
    console.log(vapidKeys);
    ```

1.  After Glitch restarts your app, it outputs the generated keys to the Node.js log within the Glitch interface (**not** to the Chrome console). To see the VAPID keys, select **Tools -> Logs** in the Glitch interface.

    Make sure that you copy your public and private keys from the same key pair!

    Glitch restarts your app every time you edit your code, so the first pair of keys you generate might scroll out of view as more output follows.

1.  In **.env**, copy and paste the VAPID keys. Enclose the keys in double quotes (`"..."`).

    For `VAPID_SUBJECT`, you can enter `"mailto:test@test.test"`.

    _`.env`_

    ```js/4-6/1-3
    # process.env.SECRET
    VAPID_PUBLIC_KEY=
    VAPID_PRIVATE_KEY=
    VAPID_SUBJECT=
    VAPID_PUBLIC_KEY="BN3tWzHp3L3rBh03lGLlLlsq..."
    VAPID_PRIVATE_KEY="I_lM7JMIXRhOk6HN..."
    VAPID_SUBJECT="mailto:test@test.test"
    ```

1.  In **server.js**, comment out those two lines of code again, since you only need to generate VAPID keys once.

    _`server.js`_

    ```js//5-6
    // Generate VAPID keys (only do this once).
    /*
    const vapidKeys = webpush.generateVAPIDKeys();
    console.log(vapidKeys);
    */
    const vapidKeys = webpush.generateVAPIDKeys();
    console.log(vapidKeys);
    ```

1.  In **server.js**, load the VAPID details from the environment variables.

    _`server.js`_

    ```js/2-4/1
    const vapidDetails = {
      // TODO: Load VAPID details from environment variables.
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
      subject: process.env.VAPID_SUBJECT
    }
    ```

1.  Copy and paste the **public** key into the client code as well.

    In **public/index.js**, enter the same value for `VAPID_PUBLIC_KEY` that you copied into the .env file:

    _`public/index.js`_

    ```js/2/1
    // Copy from .env
    const VAPID_PUBLIC_KEY = '';
    const VAPID_PUBLIC_KEY = 'BN3tWzHp3L3rBh03lGLlLlsq...';
    ````

{% Aside %}

The values for the environment variables in **.env** are unique to a single Glitch project. If you remix your code, you'll need to repeat the steps above in your new Glitch project.

{% endAside %}

## Manage subscriptions



## Implement functionality to send notifications

### Background

In this app, you'll use the [web-push npm package](https://www.npmjs.com/package/web-push) to send notifications.

This package automatically encrypts notifications when     `webpush.sendNotification()` is called, so you don't need to worry about that.

web-push accepts multiple options for notifications–for example, you can attach headers to the message, and specify content encoding.

In this codelab, you'll only use two options, defined with the following lines of code:

TODO(kaycebasques): Where is this code supposed to be?

```js
let options = {
  TTL: 10000; // Time-to-live. Notifications expire after this.
  vapidDetails: vapidDetails; // VAPID keys from .env
};
```

The `TTL` (time-to-live) option sets an expiry timeout on a notification. This is a way for the server to avoid sending a notification to a user after it is no longer relevant.

The `vapidDetails` option contains the VAPID keys you loaded from the environment variables.

### Implementation

In **server.js**, modify the `sendNotifications` function as follows:

_`server.js`_

```js/4-12/1-3
function sendNotifications(database, endpoints) {
  // TODO: Implement functionality to send notifications.
  console.log('TODO: Implement sendNotifications()');
  console.log('Endpoints to send to: ', endpoints);
  let notification = JSON.stringify(createNotification());
  let options = {
    TTL: 10000, // Time-to-live. Notifications expire after this.
    vapidDetails: vapidDetails // VAPID keys from .env
  };
  endpoints.map(endpoint => {
    let subscription = database[endpoint];
    webpush.sendNotification(subscription, notification, options);
  });
}
```

Since `webpush.sendNotification()` returns a promise, you can easily add error handling.

In **server.js**, modify the `sendNotifications` function again:

_`server.js`_

```js/9-18/8
function sendNotifications(database, endpoints) {
  let notification = JSON.stringify(createNotification());
  let options = {
    TTL: 10000, // Time-to-live. Notifications expire after this.
    vapidDetails: vapidDetails // VAPID keys from .env
  };
  endpoints.map(endpoint => {
    let subscription = database[endpoint];
    webpush.sendNotification(subscription, notification, options);
    let id = endpoint.substr((endpoint.length - 8), endpoint.length);
    webpush.sendNotification(subscription, notification, options)
    .then(result => {
      console.log(`Endpoint ID: ${id}`);
      console.log(`Result: ${result.statusCode} `);
    })
    .catch(error => {
      console.log(`Endpoint ID: ${id}`);
      console.log(`Error: ${error.body} `);
    });
  });
}
```

## Handle new subscriptions

### Background

Here's what happens when the user subscribes to push notifications:

1.  User clicks **Subscribe to push**.

1.  Client uses the `VAPID_PUBLIC_KEY` constant (the server's public VAPID key) to generate a unique, server-specific `subscription` object. The `subscription` object looks like this:

    ```json
    {
      "endpoint": "https://fcm.googleapis.com/fcm/send/cpqAgzGzkzQ:APA9...",
      "expirationTime": null,
      "keys":
      {
        "p256dh": "BNYDjQL9d5PSoeBurHy2e4d4GY0sGJXBN...",
        "auth": "0IyyvUGNJ9RxJc83poo3bA"
      }
    }
    ```

1.  Client sends a `POST` request to the `/add-subscription` URL, including the subscription as stringified JSON in the body.

1.  Server retrieves the stringified `subscription` from the body of the POST request, parses it back to JSON, and adds it to the subscriptions database.

    The database stores subscriptions using their own endpoints as a key:

    ```js
    {
      "https://fcm...1234": {
        endpoint: "https://fcm...1234",
        expirationTime: ...,
        keys: { ... }
      },
      "https://fcm...abcd": {
        endpoint: "https://fcm...abcd",
        expirationTime: ...,
        keys: { ... }
      },
      "https://fcm...zxcv": {
        endpoint: "https://fcm...zxcv",
        expirationTime: ...,
        keys: { ... }
      },
    }
    ```

Now, the new subscription is available to the server for sending notifications.

### Implementation

Requests for new subscriptions come to the `/add-subscription` route, which is a POST URL. You'll see a stub route handler in **server.js**:

_`server.js`_

```js
app.post('/add-subscription', (request, response) => {
  // TODO: implement handler for /add-subscription
  console.log('TODO: Implement handler for /add-subscription');
  console.log('Request body: ', request.body);
  response.sendStatus(200);
});
```

In your implementation, this handler must:

*   Retrieve the new subscription from the body of the request.
*   Access the database of active subscriptions.
*   Add the new subscription to the list of active subscriptions.

{% Aside %}

In this example, we use the `express-session` npm package to store a list of active subscriptions in a session variable.

This works for a demonstration, but it's not suitable for production. For compatible production packages, see the [express-session documentation](https://www.npmjs.com/package/express-session).

{% endAside %}

**To handle new subscriptions:**

*   In **server.js**, modify the route handler for `/add-subscription` as follows:

    _`server.js`_

    ```js/4-6/1-3
    app.post('/add-subscription', (request, response) => {
      // TODO: implement handler for /add-subscription
      console.log('TODO: Implement handler for /add-subscription');
      console.log('Request body: ', request.body);
      let subscriptions = Object.assign({}, request.session.subscriptions);
      subscriptions[request.body.endpoint] = request.body;
      request.session.subscriptions = subscriptions;
      response.sendStatus(200);
    });
    ```

## Handle subscription cancellations

### Background

The server won't always know when a subscription becomes inactive–for example, a subscription could be wiped when the browser shuts down the service worker.

The server can, however, find out about subscriptions that are cancelled through the app UI. In this step, you'll implement functionality to remove a subscription from the database.

This way, the server avoids sending out a bunch of notifications to non-existent endpoints. Obviously this doesn't really matter with a simple test app, but it becomes important at a larger scale.

### Implementation

Requests to cancel subscriptions come to the  `/remove-subscription` POST URL.

The stub route handler in **server.js** looks like this:

_`server.js`_

```js
app.post('/remove-subscription', (request, response) => {
  // TODO: implement handler for /remove-subscription
  console.log('TODO: Implement handler for /remove-subscription');
  console.log('Request body: ', request.body);
  response.sendStatus(200);
});
```

In your implementation, this handler must:

* Retrieve the endpoint of the cancelled subscription from the body of the request.
* Access the database of active subscriptions.
* Remove the cancelled subscription from the list of active subscriptions.

The body of the POST request from the client contains the endpoint that yoou need to remove:

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/cpqAgzGzkzQ:APA9..."
}
```

**To handle subscription cancellations:**

* In **server.js**, modify the route handler for `/remove-subscription` as follows:

  _`server.js`_

  ```js/4-6/1-3
  app.post('/remove-subscription', (request, response) => {
    // TODO: implement handler for /remove-subscription
    console.log('TODO: Implement handler for /remove-subscription');
    console.log('Request body: ', request.body);
    let subscriptions = Object.assign({}, request.session.subscriptions);
    delete subscriptions[request.body.endpoint];
    request.session.subscriptions = subscriptions;
    response.sendStatus(200);
  });
  ```

{% Aside 'success' %}
  You have implemented a push notifications server. Try it out in the live app UI! Register a service worker, subscribe to push, and send yourself some test notifications.
{% endAside %}

-->

[VAPID]: https://tools.ietf.org/html/draft-thomson-webpush-vapid-02
[POST]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST