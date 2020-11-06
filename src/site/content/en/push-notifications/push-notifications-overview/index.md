---
layout: post
title: Push notifications overview
subhead: An overview of how push notifications work on the web.
description: An overview of how push notifications work on the web.
authors:
  - katejeffreys
  - kaycebasques
date: 2020-11-04
codelabs:
  - send-push-notifications-codelab
  - receive-push-notifications-codelab
  - manage-push-notifications-codelab
tags:
  - notifications
---

## Browser compatibility

See the [Browser compatibility](/push-notifications-guide/#browser-compatibility) section
of the [Push notifications guide](/push-notifications-guide/).

## Why use push notifications?

<!-- TODO(kaycebasques): Trim down this content and make it less dense. -->

Traditionally, web browsers had to initiate the exchange of information between
server and client by making a request. [Web push
technology](https://developer.mozilla.org/en-US/docs/Web/API/Push_API), on the
other hand, lets you configure your server to send notifications when it makes
sense for your app. A push service creates unique URLs for each subscribed
service worker. Sending messages to a service worker's URL raises events on that
service worker, prompting it to display a notification.

Push notifications can help users to get the most out of your app by prompting
them to re-open it and use it based on the latest information.

Notifications present small chunks of information to a user. Web apps can use
notifications to tell users about important, time-sensitive events, or actions
the user needs to take.

The look-and-feel of notifications varies between platforms:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./predicaments-android.png" 
       alt="A notification on Android.">
  <figcaption class="w-figcaption">A notification on Android.</figcaption>
</figure>

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="./predicaments-macbook.png" 
       alt="A notification on macOS.">
  <figcaption class="w-figcaption">A notification on macOS.</figcaption>
</figure>





## How do push notifications work?

The real power of notifications comes from the combination of service workers
and push technology:

*   [Service
    workers](https://developers.google.com/web/fundamentals/primers/service-workers)
    can run in the background and display notifications even when your app isn't
    visible on screen.

*   Push technology lets you configure your server to send notifications when it
    makes sense for your app. A push service creates unique URLs for each
    subscribed service worker. Sending messages to a service worker's URL raises
    events on that service worker, prompting it to display a notification.

In the following example flow, a client registers a service worker and
subscribes to push notifications. Then, the server sends a notification to the
subscription endpoint.

The client and service worker use vanilla JavaScript with no extra libraries.
The server is built with the [`express` npm
package](https://www.npmjs.com/package/express) on
[Node.js](https://nodejs.org/en/), and uses the [`web-push` npm
package](https://www.npmjs.com/package/web-push) to send notifications. To send
information to the server, the client makes a call to a POST URL that the server
has exposed.
