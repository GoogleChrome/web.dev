---
layout: post
title: Push notifications overview
subhead: An overview of how push notifications work on the web.
description: An overview of how push notifications work on the web.
authors:
  - kaycebasques
  - mattgaunt
date: 2020-11-10
codelabs:
  - push-notifications-server-codelab
  - push-notifications-client-codelab
tags:
  - notifications
---

## What are push notifications?

Push notifications enable you to send information to your users when they're not
using your website. That's why they're called **push** notifications;
you can push information to your users when they're not active. See
[Push technology](https://en.wikipedia.org/wiki/Push_technology) and
[Pull technology](https://en.wikipedia.org/wiki/Pull_technology) to learn more
about these conceptual models.

Notifications present small chunks of information to a user. Websites can use
notifications to tell users about important, time-sensitive events, or actions
the user needs to take. The look and feel of notifications varies between platforms:

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

## Why use push notifications?

* For users, push notifications are a way to receive **timely**, **relevant**,
  and **precise** information.
* For you (a website owner), push notifications are a way to increase user engagement
  with your site.

## How do push notifications work?

At a high-level, the key steps for implementing push notifications are:

1. Adding client logic to ask the user permission to send push notifications, and
   then sending client identifier information to your backend for storage in a database.
1. Adding backend logic to trigger the sending of push notifications to client devices.
1. Adding client logic to receive and display push notification events.

The rest of this page explains these steps in more detail.

### Get permission to send push notifications

In the world of web push notifications, opting in to push notifications is
known as **subscribing**.

First, your website needs to get the user's permission to send push notifications.
This should be triggered by a user gesture, such as clicking a **Yes** button
next to a `Do you want to receive push notifications?` prompt.

### Store the client's subscription information

After you get permission, your website needs to get the client's subscription information 
from the browser. The JavaScript interface that provides this information is called
[`PushSubscription`](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription).
A `PushSubscription` contains all the information you need to send a push message to that user.
Essentially you can think of the `PushSubscription` as an ID for the client.
The entire subscription flow is done in JavaScript with the [Push API][1].
When you request `PushSubscription` information, the browser requires you to provide
an application server key. You'll learn more about that in a bit.

Once you get the `PushSubscription` information you need to store it long-term.
Usually this is done by sending the information to a server, and then having the
server store it in a database.

![TODO](browser-to-server.svg)

### Send a push message

Your server doesn't actually send the push message directly to a client. A
**push service** does that. A push service is a web service controlled by your
user's browser. It receives the network request from your server, validates it,
and routes the push notification to the appropriate client. If the client's
browser is offline, the push service queues the push notification until the
browser comes online.

When you want to send a push notification to a client you need to make a web
service request to a push service. The web service request that you send to the
push service is known as a **web push protocol request**. The web push protocol
request should include:

* What data to include in the message.
* What client to send the message to.
* Instructions on how the push service should deliver the message. E.g. you
  can specify that the push service should stop attempting to send the message 
  after 10 minutes.

Normally you make the web push protocol request through a server that you control.
Of course, your server doesn't have to construct the raw web service request
itself. There are libraries that can handle that for you, such as
[web-push](https://www.npmjs.com/package/web-push). But the underlying mechanism is
a web service request over HTTP.

![TODO](server-to-push-service.svg)

Each browser uses whatever push service it wants. You as a website developer
have no control over that. This isn't a problem because the web push protocol
request is [standardized](https://tools.ietf.org/html/draft-ietf-webpush-protocol). 
In other words, you don't have to care which push service the browser vendor is
using. You just need to make sure that your web push protocol request follows the spec.
Among other things, the spec states that the request must include certain headers
and the data must be sent as a stream of bytes.

The browser tells you which push service it's using (and therefore where to send your
web push protocol request) when you get the `PushSubscription` data client-side. 
Here's an example of a `PushSubscription` object:

```json
{
  "endpoint": "https://push-service.com/some-kind-of-unique-id-1234/v2/",
  "keys": {
    "p256dh": "BNcRdreALR…",
    "auth": "tBHItJI5sv…"
  }
}
```

TODO `endpoint`
TODO `keys`

#### Customize the delivery of the push message

The web push protocol request also provides parameters that let you
customize how the push service attempts to send the push message to the client.
For example, you can customize:

* The Time-To-Live (TTL) of a message, which defines how long the push service should
  attempt to deliver a message.
* The urgency of the message, which is useful in case the push service is preserving
  the client's battery life by only delivering high-priority messages.
* The topic of a message, which replaces any pending messages of the same topic
  with the latest message.

#### Encrypt the push message

The data that you send to a push service must be encrypted. This prevents
the push service from being to view the data you're sending to the client.
Remember that the browser vendor decides what push service to use, and that
push service could theoretically be unsafe or insecure.

#### Verify your permission to send push messages

When a push service receives a request from a server to deliver a push notification,
the push service needs to verify that the server actually has permission to send
push notifications to the specified client. 

Creating server authentication keys is actually the first thing you need to
when implementing push notifications. In the world of push notifications
these server authentication keys are usually known as **application server keys**
or **VAPID keys**. [VAPID](https://tools.ietf.org/html/draft-thomson-webpush-vapid-02)
is the spec that defines how the keys must be generated.






### Receive and display the push notification

Once you've sent the web push protocol request to the push service, the push service keeps
your request queued until one of the following events happens:

1. The client comes online and the push service delivers the push message
1. The message expires

When the push service does successfully deliver a message, the client's browser receives the message, 
decrypts the push notification data (if any), and dispatches a `push` event to your website's
[service worker](/service-workers-cache-storage/#service-workers). A service worker is
basically JavaScript code that can run in the background, even when your website isn't open
or the browser is closed. In your service worker's `push` event handler you add the logic
to display the message as a notification.

{% Aside %}
  You can also use the `push` event to do other background tasks (unrelated to notifications),
  such as making analytics calls and caching pages for offline use.
{% endAside %}

![When a push message is sent from a push service to a user's device, your service worker
receives a push event.](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/push-service-to-sw-event.svg)

## Next steps

### Design a user-friendly experience

As you may have experienced yourself, the great risk of push notifications
in general is annoying your users by sending them information that they
don't want or need. Our


[1]: https://developer.mozilla.org/en-US/docs/Web/API/Push_API

[3]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[4]: /web/fundamentals/push-notifications
[5]: /web/fundamentals/push-notifications/subscribing-a-user