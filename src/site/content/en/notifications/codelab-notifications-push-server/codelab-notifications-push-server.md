---
layout: codelab
title: Do push notifications
description: |
  In this codelab, learn how to build a push server.
date: 2019-10-02
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
glitch: notifications-push-server-step-0
# Specify which file the glitch should start on.
glitchPath: public/index.js
related_post: notifications-push-server
---

In this codelab, build a simple push server.

## Remix the sample app and view it in a new tab

Notifications are automatically blocked from the embedded Glitch app, so you won't be able to preview the app on this page. Instead, here's what to do:

1.  In the embedded Glitch, click **Remix to Edit**. Glitch creates a copy of the project.

2.  Click **Share** and select **Live App**. Then click **Copy**. Glitch copies the URL of your live app to the clipboard.

3.  Open a new Chrome tab. Paste the live app URL into the URL bar and press **Enter**.

As you work through this codelab, make changes to the code in the embedded Glitch on this page. Refresh the new tab with your live app to see the changes.

## Get familiar with the starting app and its code

1.  In the Chrome tab where you're viewing the live app, open **Developer Tools** and make sure the console is displayed. You should see a console message: 

    `Notification permission is default`.     

1.  In the embedded Glitch on this page, open public/index.js. The existing code does only four things: 

    *   Defines the `showPermission` function to get the current notification permission state and prints it to the console and the screen.
    
    *   Defines the `requestPermission` function to request the user's permission to send notifications.

    *   Defines the `sendNotification` function to create and sends a new notification to the user.

    *   Sets an event listener for window.onload to call `showPermission`.

    See the [Get started with the Notifications API](notifications-api-get-started) codelab for more information on this code.

1.  In the embedded glitch on this page, open public/serviceworker.js. 

    This file is almost empty, and is not yet in use by the app. As the name suggests, you'll register this file as a service worker. 

    You'll also move the functionality for requesting notification permission and sending notifications to this service worker.

## Register a service worker

In this step, you'll register serviceworker.js as a service worker, and make sure you can see its output in the console.

In index.js, add the following code to the end of the file:

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./serviceworker.js');
}
```

`if ('serviceWorker' in navigator)` checks that the user's browser is capable of handling service workers. 

`navigator.serviceWorker.register('./serviceworker.js')` uses the ServiceWorker API to register the file `serviceworker.js` as a service worker. 

`serviceworker.js` has some console output: 

```js
console.log('Hello from serviceworker.js');
```

Note that the code above will only run once, upon registration. Depending on your browser settings, the service worker may or may not be re-registered with a hard page reload (shift + reload). 

Modify some code in public/index.js:

Before

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./serviceworker.js');
}
```

After 

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./serviceworker.js')
    .then((registration) => {
      console.log(
        'Service worker registered with scope: ' + 
        registration.scope
      );
    });
}
```

Reload the page and look at the console output. Whether or not the service worker is re-registered, you should always see a message with the service worker scope.

For best practices, avoid an uncaught promise error with a `catch` block:

Before

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./serviceworker.js')
    .then((registration) => {
      console.log(
        'Service worker registered with scope: ' + 
        registration.scope
      );
    });
}
```

After 

```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./serviceworker.js')
    .then((registration) => {
      console.log(
        'Service worker registered with scope: ' + 
        registration.scope
      );
    })
    .catch((error) => { console.log(
      'Could not register service worker.' + 
      'Error: ' + error
    )});
}
```

## Move Notifications functionality to the service worker

Replace the sendNotification function with the following code:

```js
function sendNotification() {
  let title = 'Test';
  let options = {
    body: 'body',
    icon: 'https://cdn2.thecatapi.com/images/b50.gif'
  };
  console.log('Creating new notification');
  navigator.serviceWorker.getRegistration()
    .then((registration) => {
      registration.showNotification(title, options)
        .then((result) => { console.log(result); })
        .catch((err) => { console.log(err); } );
    })
    .catch((err) => { console.log(err); } );
}
```

Since you are now using a service worker to display notifications, the following options are also available:

* lskdjf

* lkdsfj

* sldkfj

Try this out by adding an `actions` field to the `options` objec:

Before 

```js
let options = {
  body: 'body',
  icon: 'https://cdn2.thecatapi.com/images/b50.gif'
};
```

After 

```js
let options = {
  body: 'body',
  icon: 'https://cdn2.thecatapi.com/images/b50.gif',
  actions: [{
    action: 'cart',
    title: 'View Cart'
  },{
    action: 'buy',
    title: 'Buy Stuff'
  }],
};
```

Try [Peter Beverloo's Notification Generator](https://tests.peter.sh/notification-generator/) for some more ideas.

## Summary

You have learnt X, Y and Z. Service worker runs in the background so your app can annoy people when they're not even using it. TODO: fix this summary

Take the next codelab in this series, [Add push functionality](https://), to explore further!
