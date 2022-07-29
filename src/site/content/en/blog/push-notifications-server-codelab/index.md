---
layout: codelab
title: "Codelab: Build a push notification server"
authors: 
  - joemedley
description: >
  learn to manage push scriptions and send push protocol requets to
  a push service.
date: 2022-08-15
glitch: push-notifications-server-demo-incomplete
related_post: push-notifications-overview
tags:
  - notifications
  - progressive-web-apps
  - mobile
  - network
  - capabilities
---

{% Aside 'important' %}
This code lab isn't broken. Security requirements just mean you need to remix it first.
{% Instruction 'remix', 'ol' %}
{% endAside %}

This codelab will teach you the following things:

* Managing push notification subscriptions from a client; that is, how to subscribe and unsubscribe a user.
* Sending push notifications to a single user.
* Sending push notifications to multiple subscribed users.

With the exception of iOS and Android WebView, push notifications work pretty much everywhere these days. There's [some variation](https://developer.mozilla.org/en-US/docs/Web/API/Notification#browser_compatibility) among browsers in the capabilities of notifications, but those differences are outside the scope of this codelab.

## Preliminaries

Since this codelab shows how to push notifications to multiple subscribed users, you'll need at least two browsers. You can use two different mobile browsers if you want&mdash;say, Chrome and Firefox&mdash;but I like to use one mobile and one desktop. This gives you a look at how the experiences vary.

Finally, there's [a companion article](https://web.dev/push-notifications-overview/#how) that describes how push notifications work. It's worth a read, but I try to give you enough information to understand what's happening. Where I think more depth might be usefu, I link to that article.

[TBD Something about the app stack]

## Generate application server keys

To send a push notification, your server sends a message to a push service that routes the message to your subscribed client. The other article [describes the process](https://web.dev/push-notifications-overview/#send), but the main thing you need to know for this codelab is sending to the push service requires a set of credentials, called application server keys, or VAPID keys, that you generate. There are [multiple ways to do this](https://www.google.com/search?q=generate+vapid+keys&oq=generate+VAPID+&aqs=chrome.0.0i512j69i57j0i512j0i22i30l4j0i15i22i30l2j0i22i30.4339j0j15&sourceid=chrome&ie=UTF-8), but the simplest is to use the node [web-push](https://www.npmjs.com/package/web-push) module.

This modules is already installed in the sample code. To generate your VAPID keys:

1. In the Glitch code editor, click **Terminal**. At the time of writing, it's on the bottom of the editor. A black terminal window appears.

1. Type the following:

   `npx web-push generate-vapid-keys`

   VAPID public and private keys will be generated and printed to the screen.

1. In the editor's navigation pane, click `.env`. The `server.js` file, which I describe shortly, reads from this file. Your own app will need to read your keys a different way.

1. Copy the public and private keys to the appropriate locations. 

1. For the `VAPID_SUBJECT` field enter:

   `mailto:test@test.test`

   Calling this field the subject field is a bit misleading. It's a [contact URI](https://datatracker.ietf.org/doc/html/draft-thomson-webpush-vapid-02#section-2.1) that may be used by the push server to contact your application server. It can be either `mailto` or an `https` URI.

1. Open `public/index.js`.

1. At the top, add the public key where it says `VAPID_PUBLIC_KEY_VALUE_HERE`.

## 

## Acknowledgements

This codelab owes a huge debt to former colleges. In particular, the server code used herein in a fork of code originally produced for an earlier cocelab by Kate Jeffreys.
