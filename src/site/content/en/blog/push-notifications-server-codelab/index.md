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

## Preliminaries

With the exception of iOS and Android WebView, push notifications work pretty much everywhere these days. There's [some variation](https://developer.mozilla.org/en-US/docs/Web/API/Notification#browser_compatibility) among browsers in the capabilities of notifications, but those differences are outside the scope of this codelab.

Since this codelab shows how to push notifications to multiple subscribed users, you'll need at least two browsers. You can use two different mobile browsers if you want&mdash;say, Chrome and Firefox&mdash;but I like to use one mobile and one desktop. This gives you a look at how the experiences vary.

Finally, there's [a companion article](https://web.dev/push-notifications-overview/#how) that describes how push notifications work. It's worth a read, but I try to give you enough information to understand what's happening. Where I think more depth might be usefu, I link to that article.

[TBD Something about the app stack]

## VAPID keys

To send a push notification, your server sends a message to a push service that routes the message to your subscribed client. The other article [describes the process](https://web.dev/push-notifications-overview/#send), but the main thing you need to know for this codelab is sending to the push service requires a set of credentials, called VAPID keys that you generate. There are [multiple ways to do this](https://www.google.com/search?q=generate+vapid+keys&oq=generate+VAPID+&aqs=chrome.0.0i512j69i57j0i512j0i22i30l4j0i15i22i30l2j0i22i30.4339j0j15&sourceid=chrome&ie=UTF-8), but the simplest is to use the node [web-push](https://www.npmjs.com/package/web-push) module, which you can install globally.

This modules is already installed in the sample code. To generate your VAPID keys:

1. In the 


## Acknowledgements

This codelab owes a huge debt to former colleges. The code user herein in a fork of code originally produced by Kate Jeffreys.