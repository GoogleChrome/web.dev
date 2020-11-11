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

Push messages enable you to bring information to the attention of your
users even when they're not using your website. They're called **push**
messages because you can "push" information to your users even when they're
not active. Compare [Push
technology](https://en.wikipedia.org/wiki/Push_technology) with [Pull
technology](https://en.wikipedia.org/wiki/Pull_technology) to understand this
concept further.

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

Push messages and notifications are two separate but complementary technologies.
Push is the technology for sending messages from your server to users even when
they're not actively using your website. Notifications is the technology for
displaying the pushed information on the user's device. It's possible to use
push messaging without notifications, and vice versa. In practice they're
usually used together. A non-technical user probably won't understand the
difference between push messages and notifications.

## Why use push notifications?

* For users, push notifications are a way to receive **timely**, **relevant**,
  and **precise** information.
* For you (a website owner), push notifications are a way to increase user
  engagement.

## How do push notifications work?

At a high-level, the key steps for implementing push notifications are:

1. Adding client logic to ask the user for permission to send push notifications, and
   then sending client identifier information to your server for storage in a database.
1. Adding server logic to push messages to client devices.
1. Adding client logic to receive messages that have been pushed to the device
   and displaying them as notifications.

The rest of this page explains these steps in more detail.

### Get permission to send push notifications

First, your website needs to get the user's permission to send push notifications.
This should be triggered by a user gesture, such as clicking a **Yes** button
next to a `Do you want to receive push notifications?` prompt.

### Subscribe the client to push notifications

After you get permission, your website needs to initiate the process of
subscribing the user to push notifications. This is done through JavaScript,
using the the [Push API][1]. You'll need to provide a public encryption key
during the subscription process, which you'll learn more about later. After
you kick off the subscription process, the browser makes a network request
to a web service known as a push service, which you'll also learn more about later.

Assuming that the subscription was successful, the browser returns a
[`PushSubscription`](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
object. You'll need to store this data long-term.
Usually this is done by sending the information to a server that you control,
and then having the server store it in a database.

![TODO](browser-to-server.svg)

### Send a push message

Your server doesn't actually send the push message directly to a client. A
**push service** does that. A push service is a web service controlled by your
user's browser vendor. When you want to send a push notification to a client you need
to make a web service request to a push service. The web service request that
you send to the push service is known as a **web push protocol request**. The
web push protocol request should include:

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

The push service receives your request, validates it, and routes the push
message to the appropriate client. If the client's browser is offline, the push
service queues the push message until the browser comes online.

Each browser uses whatever push service it wants. You as a website developer
have no control over that. This isn't a problem because the web push protocol
request is [standardized](https://tools.ietf.org/html/draft-ietf-webpush-protocol). 
In other words, you don't have to care which push service the browser vendor is
using. You just need to make sure that your web push protocol request follows the spec.
Among other things, the spec states that the request must include certain headers
and the data must be sent as a stream of bytes.

You do, however, need to make sure that you're sending the web push protocol
request to the correct push service. The `PushSubscription` data that the
browser returned to you during the subscription process provides this
information. A `PushScription` object looks like this:

```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/c1KrmpTuRm…",
  "expirationTime": null,
  "keys": {
    "p256dh": "BGyyVt9FFV…",
    "auth": "R9sidzkcdf…"
  }
}
```

The domain of the `endpoint` is essentially the push service. The path of the
`endpoint` is client identifier information that helps the push service determine
exactly which client to push the message to.

The `keys` are used for encryption, which is explained next.

#### Encrypt the push message

The data that you send to a push service must be encrypted. This prevents
the push service from being to view the data you're sending to the client.
Remember that the browser vendor decides what push service to use, and that
push service could theoretically be unsafe or insecure. Your server must use
the `keys` provided in the `PushSubscription` to encrypt its web push protocol
requests.

#### Sign your web push protocol requests

The push service also needs to verify that any given server that is
requesting to send push messages to a client is the same one that subscribed
the client to push notifications in the first place. The authentication process
roughly works like this:

* Your server needs to generate public and private keys, usually known as the
  **application server keys**. You might also see them called the **VAPID
  keys**. [VAPID](https://tools.ietf.org/html/draft-thomson-webpush-vapid-02) is
  the spec that defines this authentication process. Generating the application
  server keys is actually the first thing you need to do when implementing push
  notifications. It's a one-off task.
* When you subscribe the client to push notifications, you need to provide your
  public key. The push service stores this public key and uses it to
  authenticate web push protocol requests.
* When you send a web push protocol request, you sign some JSON information
  with your private key.
* When the push service receives your web push protocol request, it uses the stored
  public key to authenticate the signed information.

#### Customize the delivery of the push message

The web push protocol request spec also defines parameters that let you
customize how the push service attempts to send the push message to the client.
For example, you can customize:

* The Time-To-Live (TTL) of a message, which defines how long the push service should
  attempt to deliver a message.
* The urgency of the message, which is useful in case the push service is preserving
  the client's battery life by only delivering high-priority messages.
* The topic of a message, which replaces any pending messages of the same topic
  with the latest message.

### Receive and display the pushed messages as notifications

Once you've sent the web push protocol request to the push service, the push service keeps
your request queued until one of the following events happens:

1. The client comes online and the push service delivers the push message.
1. The message expires.

When a client browser receives a pushed message, it decrypts the push message
data and dispatches a `push` event to your [service
worker](/service-workers-cache-storage/#service-workers). A service worker is
basically JavaScript code that can run in the background, even when your website
isn't open or the browser is closed. In your service worker's `push` event
handler you add the logic to display the message as a notification.

![When a push message is sent from a push service to a user's device, your service worker
receives a push event.](https://developers.google.com/web/fundamentals/push-notifications/images/svgs/push-service-to-sw-event.svg)

## Next steps

TODO

[1]: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
[4]: /web/fundamentals/push-notifications
[5]: /web/fundamentals/push-notifications/subscribing-a-user