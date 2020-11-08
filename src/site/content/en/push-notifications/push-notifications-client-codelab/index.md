---
layout: codelab
title: "Codelab: send push notifications"
authors: 
  - katejeffreys
  - kaycebasques
description: |
  A hands-on tutorial where you use the Notifications API to 
  request notification permissions and send notifications.
date: 2020-11-05
glitch: send-push-notifications-codelab-incomplete
glitch_path: .env
related_post: push-notifications-overview
tags:
  - notifications
---

In this codelab, you'll use basic features of the
[Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API) to:

* Request permission to send notifications
* Send notifications

{% Aside 'gotchas' %}
  If you got stuck, here's the
  [completed code](https://glitch.com/edit/#!/send-push-notifications-codelab-complete).
{% endAside %}

## Setup

{% Instruction 'remix', 'ol' %}
{% Instruction 'preview', 'ol' %}

The [Glitch](https://glitch.com) should open in a new Chrome tab:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" 
       src="live-app.jpg" 
       alt="A screenshot of the app.">
</figure>

{% Aside 'key-term' %}
  We'll refer to the new tab that you just opened as the **live app tab**.
{% endAside %}

## Send a notification

First, you're going to try to send a notification **without** the user's permission
to do so. **This won't work yet**. The goal here is to show you what error gets thrown
in this situation.

{% Instruction 'source', 'ol' %}
1. Open `public/index.js`.
1. Replace `sendNotification()` with the following code:

   ```js
   // Use the Notification constructor to create and send a new Notification.
   function sendNotification() {
     console.log('Attempting to send a notification…');
     const title = 'Title';
     const options = {
       body: 'Body',
       // Other options can go here
     };
     const notification = new Notification(title, options);
   }
   ```

1. Go back to the live app tab and reload the page.
1. Click the **Send a notification** button. You should see
   `Attempting to send a notification…` in the Console. But other than that,
   nothing happens.
1. Add the following code to `sendNotification()`:

   ```js/9-12/
   // Use the Notification constructor to create and send a new Notification.
   function sendNotification() {
     console.log('Attempting to send a notification…');
     const title = 'Title';
     const options = {
       body: 'Body',
       // Other options can go here
     };
     const notification = new Notification(title, options);
     notification.onerror = error => {
       console.error('Notification failed!');
       console.error(error);
     };
   }
   ```
1. Go back to the live code tab, reload the page, and click **Send a notification**
   again. Now you see `Notification failed!` in the Console, followed by the error object.

## Request permission to send notifications

1. Replace `requestPermission()` with the following code.

   ```js
   // Use the Notification API to request permission to send notifications.
   function requestPermission() {
     console.info('Requesting permission…');
     Notification.requestPermission()
       .then(permission => {
         console.info(permission);
         showPermission();
       })
       .catch(error => {
         console.error(error);
       });
   }
   ```

{% Aside 'gotchas' %}
  If you're in an incognito window, nothing will happen. Open a guest
  window or a window associated to a Google profile and try again.
{% endAside %}

{% Aside %}
  If you ever need to reset permissions, click the lock icon to the left of
  the URL in Chrome and use the dropdown menu next to **Notifications**.
{% endAside %}

## Try out the complete app

1. Go back to the live app tab and reload the page.
1. Click **Request permission to send notifications**.
   You should see `Requesting permission…` in the Console.
   A popup should also appear.
1. Click **Allow** in the **Show notifications** popup.
1. Click the **Send a notification** button. You should see
   a notification appear with the text `Title`, `Body`, and the URL
   of your app.

## Next steps

### Try customizing your notification

Recall that when you create a notification, the constructor accepts an `options` object:

```js
const options = {
  body: 'Body',
  // Other options can go here
};
const notification = new Notification(title, options);
```

See [Parameters][parameters] to learn more about how you can customize your
notification. And check out [Notification Generator](https://tests.peter.sh/notification-generator/)
to experiment with all of these options.

### Learn how to receive push notifications with a service worker

[TODO](/receive-push-notifications-codelab/)

### Manage push notifications

[TODO](/manage-push-notifications-codelab/)

[parameters]: https://developer.mozilla.org/en-US/docs/Web/API/notification/Notification#Parameters