---
layout: codelab
title: Use a Service Worker to manage notifications
author: katejeffreys
description: |
  In this codelab, learn how to manage notifications with a
  service worker.
date: 2019-10-14
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
glitch: codelab-notifications-service-worker
# Specify which file the glitch should start on.
glitchPath: public/index.js  
related_post: tbd
---

In this codelab, use a service worker to manage notifications. 

## Remix the sample app and view it in a new tab

Notifications are automatically blocked from the embedded Glitch app, so you won't be able to preview the app on this page. Instead, here's what to do:

1.  In the embedded Glitch, click **Remix to Edit**.

1.  Click **Share** and select **Live App**. Then click **Copy**.

1.  Open a new Chrome tab. Paste the live app URL into the URL bar and press **Enter**.

1.  Open DevTools by pressing `CMD + OPTION + i` / `CTRL + SHIFT + i`.

1.  Click on the **Console** tab. Make sure that `Info` is enabled in the levels dropdown next to the
  `Filter` input.

As you work through this codelab, make changes to the code in the embedded Glitch on this page. Refresh the new tab with your live app to see the changes.

## Get familiar with the sample app and starting code

1.  In the DevTools console for your live app, you should see a console message: 

    `TODO: Implement getRegistration()`. 

    This is a message from a function stub that you will implement in this codelab.

1.  In the embedded Glitch, open public/index.js. Take a look at the existing code.

    *   There are four stubs for the functions you will implement: `getRegistration`, `registerServiceWorker`, `unRegisterServiceWorker`, and `sendNotification`.

    *   The `requestPermission` function requests the user's permission to send notifications. If you did the [Get started with notifications codelab](codelab-notifications-get-started), you'll notice that `requestPermission` has been copied over. The only difference is that it now also updates the user interface after resolving the permission request.
    
    *   The `updateUI` function refreshes all of the app's buttons and messages.
    
    *   The `initializePage` function performs feature detection for service worker capability in the browser, and updates the app user interface. 

    *   The script waits until the page has loaded, then initializes it.

1.  In the embedded Glitch, open public/service-worker.js.

    As the name suggests, you'll add code to the app to register this file as a service worker. 

    Although the file is not yet in use by the app, it contains some starting code which will print a message to the console when the service worker is activated.

    In this codelab, you'll add code to public/service-worker.js to handle notifications when the service worker receives them.

## Register the service worker

In this step, you'll write code that will run when the user clicks "Register service worker" in the app UI. This code will register public/service-worker.js as a service worker.

*   In the embedded Glitch editor, open public/index.js. Replace the `registerServiceWorker` function with the following code:

    ```js
    // Use the Service Worker API to register a service worker.
    async function registerServiceWorker() {
      await navigator.serviceWorker.register('./service-worker.js')
      updateUI();
    }
    ```

    Note that `registerServiceWorker` uses the [`async function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) declaration to make handling promises more convenient. This lets you `await` the resolved value of a `Promise`. For example, the function above awaits the outcome of registering a service worker before updating the UI. See [`await` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) for more information.

*   Now that the user can register a service worker, you can get a reference to the service worker registration object. In public/index.js, replace the `getRegistration` function with the following code:

    ```js
    // Get the current service worker registration.
    function getRegistration() {
      return navigator.serviceWorker.getRegistration();
    }
    ```

    The function above uses the Service Worker API to get the current service worker registration, if it exists. It makes getting a reference to the service worker registration a bit more convenient.

*   To complete the service worker registration functionality, add code to unregister the service worker. Replace the `unRegisterServiceWorker` function with the following code:

    ```js
    // Unregister a service worker, then update the UI.
    async function unRegisterServiceWorker() {
      // Get a reference to the service worker registration.
      let registration = await getRegistration();
      // Await the outcome of the unregistration attempt
      // so that the UI update is not superceded by a 
      // returning Promise.
      await registration.unregister();
      updateUI();
    }
    ```

In the tab where you're viewing the live app, reload the page. The **Register service worker** and **Unregister service worker** buttons should now be working.

## Send notifications to the service worker

In this step, you'll write code that will run when the user clicks "Send a notification" in the app UI. This code will create a notification, check that a service worker is registered, and then send the notification to the service worker using its `postMessage` method.

*   In the embedded Glitch editor, open public/index.js. Replace the `sendNotification` function with the following code:

    ```js
    // Create and send a test notification to the service worker.
    async function sendNotification() {
      // Use a random number as part of the notification data
      // (so you can tell the notifications apart during testing!)
      let randy = Math.floor(Math.random() * 100);
      let notification = {
        title: 'Test ' + randy, 
        options: { body: 'Test body ' + randy }
      };
      // Get a reference to the service worker registration.
      let registration = await getRegistration();
      // Check that the service worker registration exists.
      if (registration) {
        // Check that a service worker controller exists before
        // trying to access the postMessage method.
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage(notification);
        } else {
          console.log('No service worker controller found. Try a soft reload.');
        }
      }
    }
    ```

    *   `sendNotification` is an asynchronous function, so you can use `await` to get a reference to the service worker registration.
    
    *   The code above uses the service worker's `postMessage` method to send data from the app to the service worker. See the [MDN documentation on  postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage) for more information. 

    *   The code above checks for the presence of the `navigator.serviceWorker.controller` property before trying to access the `postMessage` function. `navigator.serviceWorker.controller` will be `null` if there is no active service worker, or if the page has been force refreshed (shift + refresh). See the [ServiceWorker controller documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/controller) for more information.

## Handle notifications in the service worker

In this step, you'll write code in the service worker that will handle messages posted to it and display notifications to the user.

*   In the embedded Glitch editor, open public/service-worker.js. Add the following code to the end of the file:

    ```js
    // Show notification when received
    self.addEventListener('message', (event) => {
      let notification = event.data;
      self.registration.showNotification(
        notification.title, 
        notification.options
      ).catch((error) => {
        console.log(error);
      });
    });
    ```

    *   `self` is a reference to the service worker itself.

    *   While the service worker now handles displaying notifications, the main app UI is still responsible for getting notification permission from the user. If permission is not granted, the promise returned by `showNotification` is rejected. The code above uses a `catch` block to avoid an uncaught `Promise` rejection error and handle this error a little more gracefully.

If you got stuck, see [glitch.com/edit/#!/codelab-notifications-service-worker-completed](https://glitch.com/edit/#!/codelab-notifications-service-worker-completed) for the completed code.

Go on to the next codelab: [Build a push notifications server](codelab-notifications-push-server).
