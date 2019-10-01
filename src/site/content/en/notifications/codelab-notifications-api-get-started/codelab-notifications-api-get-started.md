---
layout: codelab
title: Get started with the Notifications API
description: |
  In this codelab, learn how to request user permission and send notifications.
date: 2019-10-01
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
glitch: notifications-step-0
# Specify which file the glitch should start on.
glitchPath: public/index.js
related_post: notifications-api-get-started
---

In this codelab, use basic features of the Notifications API to:

* Request permission to send notifications
* Send notifications
* Experiment with notification options 

## Remix the sample app and view it in a new tab

Notifications are automatically blocked from the embedded Glitch app, so you won't be able to preview the app on this page. Instead, here's what to do:

1.  In the embedded Glitch, click **Remix to Edit**. Glitch creates a copy of the project.

2.  Click **Share** and select **Live App**. Then click **Copy**. Glitch copies the URL of your live app to the clipboard.

3.  Open a new Chrome tab. Paste the live app URL into the URL bar and press **Enter**.

As you work through this codelab, make changes to the code in the embedded Glitch on this page. Refresh the new tab with your live app to see the changes.

## Get familiar with the starting app and its code

1.  In the Chrome tab where you're viewing the live app, open **Developer Tools** and make sure the console is displayed. You should see a console message: 

    `Notification permission is default`. 
    
    If you don't know what that means, don't worry; all will soon be revealed.

1.  Click the buttons on the live app: **Request permission to send notifications** and **Send a notification**. 

    The console prints messages from a couple of function stubs: `requestPermission` and `sendNotification`. These are the functions you'll implement in this codelab.

1.  In the embedded Glitch on this page, open public/index.js. Take a look at some important parts of the existing code:

    *   **The `showPermission` function**
    
        The `showPermission` function uses the `Notification` API to display the site's current permission state:

        ```js/3
        // Print current permission state to console;
        // update onscreen message.
        function showPermission() {
          let permission = Notification.permission;
          console.log('Notification permission is ' + permission);
          let p = document.getElementById('permission');
          p.textContent = 'Notification permission is ' + permission;
        }
        ```

        Before requesting permission, the permission state is `default`. In the `default` permission state, a site must request and be granted permission before it can send notifications. 

    *   **The `requestPermission` function**

        ```js
        // Use the Notification API to request permission to send notifications.
        function requestPermission() {
          console.log('TODO: Implement requestPermission()');
        }
        ```
        
        This is a stub. You will implement this function in the next step.

    *   **The `sendNotification` function**

        ```js
        // Use the Notification constructor to create and send a new Notification. 
        function sendNotification() {
          console.log('TODO: Implement sendNotification()');
        }
        ```

        This is a stub. You will implement this function after you have implemented `requestPermission`.

    *   **The `window.onload` event listener**
    
        ```js
        window.onload = () => { showPermission(); };
        ```

        When the page has loaded, the `showPermission` function displays the current permission state in the console and on the page.

## Request permission to send notifications

In this step, you'll add functionality to request the user's permission to send notifications. 

You will use the `Notification.requestPermission()` method to trigger a popup that asks the user to allow or block notifications from your site.

`Notification.requestPermission()` returns a `Promise`. To perform actions after this promise resolves, place them inside the promise's `then()` method.

Replace the `requestPermission` function stub in public/index.js with the following code:

```js
// Use the Notification API to request permission to send notifications.
function requestPermission() {
  Notification.requestPermission()
    .then((permission) => {
      console.log('Promise resolved: ' + permission);
      showPermission();
    })
    .catch((error) => {
      console.log('Promise was rejected');
      console.log(error);
    });
}
```

Reload the Chrome tab with your live app. In the live app, click **Request permission to send notifications**. A popup appears. 

The user can make one of three responses to the permission popup. They can select **Allow**, select **Block**, or dismiss the popup without making a selection.

**If the user clicks Allow:**

*  `Notification.permission` is set to `granted`.

*  The site will be able to display notifications. 

*  Subsequent calls to `Notification.requestPermission` will resolve to `granted` without a popup.

**If the user clicks Block:**

*  `Notification.permission` is set to `denied`.

*  The site will not be able to display notifications to the user.

*  Subsequent calls to `Notification.requestPermission` will resolve to `denied` without a popup.
  
**If the user dismisses the popup:**

*  `Notification.permission` remains `default`.

*  The site will not be able to display notifications to the user.

*  Subsequent calls to `Notification.requestPermission` will produce more popups. However, if the user continues to dismiss the popups, the site will be blocked and `Notification.permission` will be set to `denied`. No more popups will be displayed.

{% Aside %}

Different browsers handle repeated popup dismissals differently, blah blah. At the time of writing, Chrome does X. Spec? 

{% endAside %}

{% Aside %}

To make the notification popup appear again, click the lock icon next to the Chrome URL bar. Chrome displays options to let you reset the site's notification permission setting to its default.

{% endAside %}

## Send a notification

In this step, you'll send a notification to the user.

You will use the `Notification` constructor to create a new notification, and attempt to display it. If the permission state is `granted`, your notification will be displayed. 

Replace the `sendNotification` function stub in index.js with the following code:

```js
// Use the Notification constructor to create and send a new Notification. 
function sendNotification() {
  let title = 'Test';
  let options = {
    body: 'Test body',
    // Other options can go here
  };
  console.log('Creating new notification');
  let notification = new Notification(title, options);
}
```

The `Notification` constructor takes two parameters: `title` and `options`. `options` is an object with properties representing visual settings and data you can include in a notification. See the [MDN documentation on notification parameters](https://developer.mozilla.org/en-US/docs/Web/API/notification/Notification#Parameters) for more information. 

Refresh the Chrome tab with your live app, and try out the **Send notification** button.

## What happens when you send notifications without permission?

In this step, you'll add a couple of lines of code that will let you see what happens when you attempt to display a notification without having the user's permission.

Define your new notification's `onerror` event handler by adding the following code to the end of the `sendNotification` function:

```js
notification.onerror = (event) => { 
  console.log('Could not send notification');
  console.log(event);
};
```

Take a look at the results:

1.  Click the lock icon next to the Chrome URL bar and reset the site's notification permission setting to its default. 

2.  Click **Request permission to send notifications**, and this time, select **Block** from the popup. 

3.  Click **Send notification** and see what happens (probably not much).

4.  Reset the site's notification permissions again. 

5.  Try requesting notification permission and dismissing the popup multiple times. How many times can you dismiss the popup before Chrome blocks the site automatically?

## Experiment with notification options

You have learnt how to request permission and send notifications. You also know what impact user responses will have on your app's ability to display notifications.

Now you can experiment with the many visual and data options available when creating a notification. 

Example:

```js
let title = 'Title';
let options = {
  body: 'body',
  actions: [{
    action: 'shop',
    title: 'Shop'
  },{
    action: 'cart',
    title: 'View Cart'
  }],
  data: { 
    cheese: 'I like cheese',
    pizza: 'Excellent cheese delivery mechanism',
    arbitrary: { 
      faveNumber: 42,
      myBool: true
    }
  }
};
let notification = new Notification(title, options);
```

Try [Peter Beverloo's Notification Generator](https://tests.peter.sh/notification-generator/) for some ideas!

Note that the following `options` fields only work with a Service Worker:

* dskjf
* dklfsjlj
* fsljaf

Take the next codelab in this series, [Handle notifications with a service worker]() to explore further!
