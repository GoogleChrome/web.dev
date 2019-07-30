---
title: Use best practices for e-commerce notifications
subhead: Push notifications can help you engage with your customers. Here's how to do them right. 
authors:
  - katejeffreys
date: 2019-07-30
hero: hero.jpg
alt: A man looking at his phone at sunset. Photo by @brunoreyna on unsplash.com.
description: |
  Learn best practices for implementing push notifications in an e-commerce web app.
tags:
  - post # post is a required tag for the article to show up in the blog.
  - notifications
  - push
  - e-commerce
---

When used effectively, push notifications help your customers to get the most
out of their online shopping experience. 

Targeted, timely, respectful notifications help people to engage more deeply
with your site, and build trust in your brand–leading to satisfied customers
and more repeat shoppers.

With push notifications:

*   Remind a customer about something they need to do–for example, finalize
    their cart, enter their zipcode, or update their credit card.

*   Tell customers about something new–for example, a special deal, a new
    product, or an event in their area.

*   Send a customer some information they are expecting, or have
    requested–for example, you’ve processed or shipped their order, or a
    product they want to know about has come back in stock.

{% Aside %}

The code samples in this article are drawn from a [sample Glitch app](https://glitch.com/~ecommerce-notifications)
that we built to accompany this post. You can also see a [working preview](https://ecommerce-notifications.glitch.me/)
of the app.

{% endAside %}

### Request push notification permissions respectfully

Some sites immediately ask users to permit push notifications. You might see
this design choice on large social networking and e-commerce sites.

However, customers might be less willing to tolerate this behavior from sites
they are not invested in. To build trust and retain customers, implement
notifications in a way that respects the customer and adds to their experience.

{% Aside %}

While the current web platform lets you request notification permissions at
any point in the user journey, this could change. Implement notifications
respectfully to future-proof your app!

{% endAside %}

#### When to prompt a user to permit push notifications

A permission request creates a popup on your customer’s screen that they must
deal with before proceeding. Make sure you don’t interrupt customers mid-way
through performing a task.

Don’t ask for permission:

*   While a customer is making a purchase.

    A popup is likely to jolt someone away from a multi-step task like
    completing a payment.

*   While a customer is actively viewing content.

    A customer who is actively viewing content–for example, scrolling through a
    list of search results, or browsing a category or product page–probably has
    a goal in mind. If a popup appears at the wrong moment, the customer might
    abandon their goal or leave the site altogether.

{% Aside %}

Since mobile devices are such an intimate part of our lives, we are uniquely
connected to them. In particular, mobile users are more likely than desktop
users to be acting on their emotions. You don’t want to interrupt someone who
is making a decision in-the-moment!

{% endAside %}

Do ask for permission:

*   When the value of notifications is obvious.

    For example, an ideal time to prompt the customer for permission to send
    push notifications is immediately after they have completed a purchase and
    might want to receive updates about shipping.

*   When the customer has completed a user journey that has clear followup
    potential.

    Another good time to ask is when a customer has finished doing something
    that precedes a possible later action. For example, a customer who has
    searched for and clicked on a product that is out of stock might want
    to be notified when you get more in.

*   In response to a customer action. 

    Using your app’s own UI, you can make sure that the push notification
    request popup appears when the customer intends to subscribe. This avoids
    situations in which customers block your app from sending notifications.

These techniques also let you maintain consistent site branding, voice, and
tone.

#### Example implementation

Our sample app lets users summon the push notifications popup by indicating
their interest in a product: 

```html
<h2>{{product.name}}</h2>
<p class="price">${{product.price}}</p>
<form action="/{{product.url}}/cart" method="post">
  <button class="add-to-cart">Add to Cart</button>
  <button class="notify">Notify me about this item</button>
</form>
```

[See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/templates/partials/product.hbs:9:0).

They can then enable push notifications:

```html
<div>
  <p>Subscribe to push notifications</p>
  <label class="switch">
    <input 
      id="togglepush" 
      type="checkbox" 
      onclick="window.dispatchEvent(new Event('push-change'));">
    <span class="slider round"></span>
  </label>
</div>
```

[See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/templates/partials/notifications-push.hbs:4:0).

### Send notifications about the right things

Make sure your notifications are **immediately relevant**, **precise**, and
**actionable**.

#### Immediately relevant

Use push notifications to tell customers about things that are 
**uniquely relevant** to that customer, and that **matter right now**. 

Push notifications are great for delivering information about:

*   Blockers to a goal they are trying to achieve. For example:

    *   An item in a customer’s purchase request is out of stock.

    *   A customer’s credit card was declined.

    *   A customer needs to update their shipping address.

*   Time-sensitive actions the customer could take. For example: 

    *  A temporary discount on an item a customer is interested in.

    *   New, limited stock of a popular item that is likely to sell out.

    *   Product pre-releases and early-bird deals.

#### Precise

Notifications should be **short**, **clear**, and **specific**. Tell the
customer exactly what happened, what you want them to do, or what you’re
offering.	

#### Actionable

Notifications should provide clear, specific calls-to-action. To maximize the
likelihood that the customer will take this action, describe it as precisely
as possible. Make sure that buttons and links clearly indicate what they will
do or where they will go. 

### Send notifications at the right time

You respect your customers, and their time. Make sure your push notifications
do too. 

In general, if the information is time-critical, you should notify the customer
straight away so they don’t miss out. However, you don’t want to send
notifications so frequently that customers feel frustrated or overwhelmed.

It’s hard to give specific guidelines for how frequently you should send
notifications to optimize engagement, since each site has unique
considerations. The goal is to strike a balance so that customers are engaging
and re-engaging with your site by following through on actions from your push
notifications.

### Avoid sending obsolete or too-frequent notifications

Frequent notifications will eventually reach a "tipping point", after which
you’ll see a wave of customers unsubscribing. The less you filter notifications
for relevance and timeliness, the sooner this tipping point will occur.

The `ttl` (Time To Live) server header controls how long the app will keep
trying to deliver a notification before abandoning the attempt. Use the `ttl`
header to avoid sending obsolete notifications.

```js
const serverOptions = {
  vapidDetails: {
    subject: VAPID_SUBJECT,
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
  },
  TTL: notification.ttl,
};

webpush.sendNotification(subscription, payload, serverOptions);
```

[See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/server/routes/test-notifications.js:122:0).

In our sample app, users can also configure the types of notifications they 
subscribe to:

```html
<div id="preferences">
  <p>Send push notifications for:</p>
  <div class="notification-type">
    <input id="notifydeals" name="notifydeals" type="checkbox" onChange="window.dispatchEvent(new Event('push-change'))">
    <label for="notifydeals">Special deals</label>
  </div>
  <div class="notification-type">
    <input id="notifyorders" name="notifyorders" type="checkbox" onChange="window.dispatchEvent(new Event('push-change'))">
    <label for="notifyorders">Shipping and orders</label>
  </div>
  <div class="notification-type">
    <input id="notifyproducts" name="notifyproducts" type="checkbox"
      onChange="window.dispatchEvent(new Event('push-change'))">
    <label for="notifyproducts">Product updates</label>
  </div>
</div>
```

[See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/templates/partials/notifications-preferences.hbs:1:0).

### How to implement push notifications for e-commerce

Our example e-commerce app shows one way to implement push notifications
for e-commerce.

The client code:

*   Subscribes the user to notifications.

    ```js
    async function subscribeToPush(registration) {
      let result = {};
      if (registration) {
        result = await registration.pushManager.subscribe({
          'applicationServerKey': urlB64ToUint8Array(VAPID_PUBLIC_KEY),
          'userVisibleOnly': true,
        }).catch((error) => {
          console.log(error);
          return {};
        });
      }
      return result;
    }
    ```
    
    [See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/client/js/notifications.js:107:0).
    
*   Manages the types of notifications the customer will receive.

    ```js
    function getPreferencesFromInputs() {
      let preferences = {};

      const notifydeals = document.querySelector('#notifydeals').checked;
      const notifyorders = document.querySelector('#notifyorders').checked;
      const notifyproducts = document.querySelector('#notifyproducts').checked;

      preferences = {
        notifydeals: notifydeals,
        notifyorders: notifyorders,
        notifyproducts: notifyproducts,
      };
      return preferences;
    }
    ```

    [See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/client/js/notifications.js:156:0).

*   Passes user preferences and subscription details to the server.

    ```js
    const preferences = getCookie('preferences');
      if (!preferences) {
        setCookie('preferences', JSON.stringify({
          notifydeals: true,
          notifyorders: true,
          notifyproducts: true,
        }));
      }
      const registration = await getRegistration();
      const subscription = await getSubscription(registration);
      await updateSubscriptionCookie(subscription);
      sendDataToSW(registration, {
        preferences: JSON.parse(getCookie('preferences')),
      });
    ```
    
    [See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/client/js/notifications.js:180:0).

The server code: 

*   Parses cookies to determine user preferences and get a push 
    subscription endpoint.

    ```js
    if (req.cookies.preferences) {
      preferences = JSON.parse(req.cookies.preferences);
    } else {
      preferences = {
        notifyorders: true,
        notifyproducts: true,
        notifydeals: true,
      };
    }
    if (req.cookies.subscription) {
      subscription = JSON.parse(req.cookies.subscription);
    }
    ```

    [See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/server/routes/notifications.js:28:0).

*   Sends notifications.

    ```js
    webpush.sendNotification(subscription, payload, serverOptions)
    .then((result) => {
      console.log('Success');
      return result;
    })
    .catch((error) => {
      console.log('Failed to send');
      console.log(error);
      return error;
    });
    ```

    [See this code in Glitch](https://glitch.com/edit/#!/ecommerce-notifications?path=src/server/routes/test-notifications.js:131:0).
