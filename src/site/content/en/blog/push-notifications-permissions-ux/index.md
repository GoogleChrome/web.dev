---
layout: post
title: Permission UX
authors:
  - mattgaunt
date: 2016-06-30
updated: 2019-06-06
tags:
  - notifications
---

The natural step after getting a `PushSubscription` and saving it our server is
to trigger a push message, but there is one thing I flagrantly glossed over. The
user experience when asking for permission from the user to send them push
messages.

Sadly, very few sites give much consideration to how they ask their user for
permission, so let's take a brief aside to look at both good and bad UX.

## Common patterns

There have been a few common patterns emerging that should guide and help you when
deciding what is best for your users and use case.

### Value proposition

Ask users to subscribe to push at a time when the benefit is obvious.

For example, a user has just bought an item on an online store and finished the
checkout flow. The site can then offer updates on the delivery status.

There are a range of situations where this approach works:

- A particular item is out of stock, would you like to be notified when it's next available?
- This breaking news story will be regularly updated, would you like to be notified as the
  story develops?
- You're the highest bidder, would you like to be notified if you are outbid?

These are all points where the user has invested in your service and there
is a clear value proposition for them to enable push notifications.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/LC9ub0f2q77XwKpBM8Hu.png", alt="Owen Campbell-Moore's example of good UX for push.", width="800", height="1352" %}

created a mock of a hypothetical airline
website to demonstrate this approach.

After the user has booked a flight it asks if the user would like notifications of flight
delays.

Note that this is a custom UI from the website.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/Kt3PPi4trxkE6K85DtgR.png", alt="Owen Campbell-Moore's example of good UX for the permission prompt.", width="800", height="1352" %}

Another nice touch to Owen's demo is that if the user clicks to enable
notifications, the site adds a semi-transparent overlay on the entire page when
it shows the permission prompt. This draws the users attention to the
permission prompt.

The alternative to this example, the **bad UX** for asking permission, is to request
permission as soon as a user lands on the airline's site.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/mgcQQkVIletBpXFUrmGX.png", alt="Owen Campbell-Moore's example of bad UX for push.", width="800", height="1371" %}

This approach provides no context as to why notifications are needed or
useful to the user. The user is also blocked from achieving their original
task (i.e. book a flight) by this permission prompt.

### Double Permission

You may feel that your site has a clear use case for push messaging and as
a result want to ask the user for permission as soon as possible.

For example instant messaging and email clients. Showing a message for a
new message or email is an established user experience across a range of
platforms.

For these category of apps, it's worth considering the double permission
pattern.

First show a fake permission prompt that your website controls, consisting
of buttons to allow or ignore the permission request. If the user clicks
allow, request permission, triggering the real browser permission prompt.

With this approach you display a custom permission prompt in your web app
which asks the user to enable notifications. By doing this the user can
chose enable or disable without your website running the risk of being
permanently blocked. If the user selects enable on the custom UI, display
the actual permission prompt, otherwise hide your custom pop-up and ask
some other time.

A good example of this is . They show a prompt at
the top of their page once you've signed in asking if you'd like to enable notifications.

### Settings Panel

You can move notifications into a settings panel, giving users an easy way
to enable and disable push messaging, without the need of cluttering your
web app's UI.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/l4PARykO7nv9Z5ogOR6D.png", alt="When you first load the page, there is no prompt.", width="800", height="1388" %}

A good example of this is .
When you first load up the Google I/O site, you aren't asked to do anything,
the user is left to explore the site.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/eLcOvHOUA2L5hRpa2AHO.png", alt="The settings panel on Google IO's web app for push messaging.", width="800", height="1388" %}

After a few visits, clicking the menu item on the right reveals a settings
panel allowing the user to set up and manage notifications.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/oYEbRCEdXeUOrHOY2fCa.png", alt="Google IO's web app displaying the permission prompt.", width="800", height="1388" %}

Clicking on the checkbox displays the permission prompt. No hidden surprises.

After the permission has been granted, the checkbox is checked and the user
is good to go. The great thing about this UI is that users can enable and
disable notifications from one location on the website.

### Passive approach

One of the easiest ways to offer push to a user is to have a button
or toggle switch that enables / disables push messages in a location
on the page that is consistent throughout a site.

This doesn't drive users to enable push notifications, but offers a
reliable and easy way for users to opt in and out of engaging with your
website. For sites like blogs that might have some regular viewers as well
as high bounce rates, this is a solid option as it targets regular viewers
without annoying drive-by visitors.

On my personal site, I have a toggle switch for push messaging in the footer.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/ErFqMyTCspoGislhKxLX.png", alt="Example of Gauntface.com push notification toggle in
footer", width="800", height="483" %}

It's fairly out of the way, but for regular visitors it should get enough
attention from readers wanting to get updates. One-time visitors are
completely unaffected.

If the user subscribes to push messaging, the state of the toggle switch
changes and maintains state throughout the site.

{% Img src="image/C47gYyWYVMMhDmtYSLOWazuyePF2/lLVT0jG2MY1DvLJZzkeu.png", alt="Example of Gauntface.com with notifications
enabled", width="800", height="483" %}

### The bad UX

Those are some of the common practices I've noticed on the web. Sadly, there is one very common
bad practice.

The worst thing you can do is to show the permission dialog to users as soon as they
land on your site.

They have zero context on why they are being asked for a permission, they may
not even know what your website is for, what it does or what it offers. Blocking
permissions at this point out of frustration is not uncommon, this pop-up is
getting in the way of what they are trying to do.

Remember, if the user _blocks_ the permission request, your web app can't ask for permission
again. To get permission after being blocked, the user has to change the permission in the
browser's UI and doing so is not easy, obvious or fun for the user.

No matter what, don't ask for permission as soon as the user opens your site, consider some
other UI or approach that has an incentive for the user to grant permission.

### Offer a way out

In addition to considering the UX to subscribe a user to push, **please** consider how a user
should unsubscribe or opt out of push messaging.

The number of sites that ask for permission as soon as the page loads and then
offer no UI for disabling push notifications is astounding.

Your site should explain to your users how they can disable push. If you don't, users are
likely to take the nuclear option and block permission permanently.

## Where to go next

* [Web Push Notification Overview](/push-notifications-overview/)
* [How Push Works](/push-notifications-how-push-works/)
* [Subscribing a User](/push-notifications-subscribing-a-user/)
* Permission UX
* [Sending Messages with Web Push Libraries](/sending-messages-with-web-push-libraries/)
* [Web Push Protocol](/push-notifications-web-push-protocol/)
* [Handling Push Events](/push-notifications-handling-messages/)
* [Displaying a Notification](/push-notifications-display-a-notification/)
* [Notification Behavior](/push-notifications-notification-behaviour/)
* [Common Notification Patterns](/push-notifications-common-notification-patterns/)
* [Push Notifications FAQ](/push-notifications-faq/)
* [Common Issues and Reporting Bugs](/push-notifications-common-issues-and-reporting-bugs/)

### Code labs

* [Build a push notification client](/push-notifications-client-codelab/)
* [Build a push notification server](/push-notifications-server-codelab/)
