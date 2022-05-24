---
layout: post
title: requestAutocomplete
subhead: Take my money, not my time
authors:
  - jakearchibald
date: 2013-10-03
updated: 2014-05-12
tags:
  - blog
---

## Introduction

I like the web. All in all, I think it’s a pretty good idea. As such, I get into a lot of web vs native debates. It doesn’t take long for the other person to start talking about the ease of payments through native systems. My usual response is to drop a smoke bomb and run out of the room laughing maniacally, because it’s not an argument I can win.
**Shopping cart abandonment on the mobile web [can be as high as 97%](http://seewhy.com/blog/2012/10/10/97-shopping-cart-abandonment-rate-mobile-devices-concern-you/)**. Imagine that in the real world. Imagine 97% of people in a supermarket, with a cart brimming full of things that they want, flipping their cart over and walking out.
Now, some of those people are just pricing stuff up and never had an intention to buy, but the horrific user experience of buying on the web is a significant contributor. We’re hitting users with a tax on their sanity.
Think of a pleasurable payment experience you had on the web, especially on mobile. It’s an app store, right? Or at least a similar closed system that already has your payment information.
This is a problem. It requires sites to commit to a particular payment provider that the user must already have an account with and be logged into, or to commit to a platform that requires users to be logged into a particular payment provider, such as an app storexs that require you to code solely for that platform. If you don’t do one of these things, the user is doomed to tap away at their screen or keyboard until all their finger-skin is gone, or they give up.
We need to fix that.

## requestAutocomplete

{% Aside %}
There is even more up to date forms tutorials on our new [Web Fundamentals](https://developers.google.com/web/fundamentals/documentation/user-input/form-input/) site as well as
more in depth information about [requestAutocomplete](https://developers.google.com/web/fundamentals/documentation/user-input/form-input/use-request-auto-complete).
{% endAside %}  

In a world of WebGL, WebRTC and other fancy web APIs that start with “Web”, `requestAutocomplete` is rather unglamorous. However, it’s a superhero in beige clothing. A tiny, boring API that can stick a stake through the heart of the web payments time-vampire.

{% YouTube id="VQO8hMqyn00" %}

Rather than the site relying on a particular payment provider, it requests payment details from the browser, which stores them on the user’s behalf.
Chrome's version of requestAutocomplete() also integrates with Google Wallet for **US users only (currently)**. [Give it a try on our test site](https://googledrive.com/host/0B28BnxIvH5DueUxvWVNsQXd5dU0/).

## form.requestAutocomplete

Form elements carry a single new method, requestAutocomplete, which asks the browser to populate the form. The browser will display a dialog to the user asking for permission and allowing the user to select which details they’d like to provide.
You can’t call this whenever you want, it needs to be called during the execution of particular interaction events such as mouse up/down, click, key and touch events. This is a deliberate security restriction.

```js
button.addEventListener('click', function(event) {
  form.requestAutocomplete();
  event.preventDefault();
});

// TODO: listen for autocomplete events on the form
```

{% Aside %}
If you’re adding events using a JavaScript library, be aware that some will redispatch events in a way that loses the link with the original interaction, meaning your call to requestAutocomplete will fail the security check. If this happens to you, use `addEventListener` directly as above.
{% endAside %}

Before we look at the events, we need to make sure the browser understands your form fields…

## Form requirements

Back when the internet was in black and white, Internet Explorer 5 adopted a new attribute, `autocomplete`, on form input elements. It could be set to “off” to stop the browser offering suggestions, and that was it. [This API was extended](http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#autofilling-form-controls:-the-autocomplete-attribute) so you can specify the expected content of the field without modifying the “name” attribute, and this is what `requestAutocomplete` uses to link form fields to user data.

```html
<input name="fullname" autocomplete="name">
```

As a specification, `requestAutocomplete` isn’t payments-specific, but Chrome’s current implementation pretty much is. In future, expect browsers to be able to deal with other kinds of data, hopefully things like login details and password generator, passport information, and even uploading an avatar.

Currently in Chrome, `requestAutocomplete` recognises the following:

### Payment

- email
- cc-name - name on card
- cc-number - card number
- cc-exp-month - card expiry month as two digits
- cc-exp-year - card expiry year as four digits
- cc-csc - 3-4 digit card security code

```html
<input type="email" autocomplete="email" name="email">
<input type="text" autocomplete="cc-name" name="card-name">
<input type="text" autocomplete="cc-number" name="card-num">
<input type="text" autocomplete="cc-exp-month" name="card-exp-month">
<input type="text" autocomplete="cc-exp-year" name="card-exp-year">
<input type="text" autocomplete="cc-csc" name="card-csc">
```

The “name” attributes I’ve used above are examples only, there’s no requirement to use particular values. If you’re going to reuse this form for users without `requestAutocomplete`, which is the ideal, you’ll want to add labels, layout and basic HTML5 validation.

You’re not restricted to input elements either, you can use any form input type. For example, you could use `<select>` for the card expiry fields.

{% Aside %}
Because requestAutocomplete is only geared toward payments for now, it requires you include **at least one credit card related field** in your <form> and only works on **SSL-encrypted pages**. To help developers get their code working faster, Chrome logs the exact reason why requestAutocomplete failed to the developer console.
{% endAside %}

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/HFav7zwKOyLsiPiZ0hnH.png", alt="Detailed console message.", width="660", height="210" %}
  <figcaption>Detailed console message</figcaption>
</figure>

### Address

- name - full name. Taking a full name as a single field is far better than multiple fields. Multiple fields such as first-name and last-name show a Western bias and may not make sense to other cultures, also it’s easier to type into a single field

- tel - full telephone number including country code, can alternatively be broken down into
    - tel-country-code - e.g. +44
    - tel-national - the rest

- street-address - full address with components comma-separated, can be broken down into
      - address-line1
      - address-line2 - may be empty
  
- locality - city/town

- region - State code, county or canton

- postal-code - Postal code, post code, ZIP code

- country


The above should be used in combination with:
- billing
- shipping

```html
<input type="text" autocomplete="billing name" required name="billing-name">
<input type="tel" autocomplete="billing tel" required name="billling-tel">
<input type="text" autocomplete="billing address-line1" required name="billing-address1">
<input type="text" autocomplete="billing address-line2" required name="billing-address2">
<input type="text" autocomplete="billing locality" required name="billing-locality">
<input type="text" autocomplete="billing region" required name="billing-region">
<input type="text" autocomplete="billing postal-code" required name="billing-postal-code">
<select autocomplete="billing country" required name="billing-country">
  <option value="US">United States</option>
  …
</select>

<input type="text" autocomplete="shipping name" name="shipping-name">
…
```

Once again, the name attributes are examples, you can use whatever you want.
Obviously not all forms should request a shipping address, e.g. don’t ask me where I’d like my hotel room delivered, it’s current location is often the selling point.
Right, so we’ve got our form, and we know how to request `autocompletion`. But…

## When should requestAutocomplete be called?

Ideally you want to show the `requestAutocomplete` dialog instead of loading the page that displays the checkout form. If all goes well, the user shouldn’t see the form at all.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/oIHHfYrtRxxZrs55sDD7.svg", alt="Payments Flow", width="620", height="907" %}
</figure>

A common pattern is to have a cart page with a “checkout” button that takes you to the payment details form. In this situation you want to load your billing form on the cart page, but hide it from the user, and call `requestAutocomplete` on it when the user hits the “checkout” button. Remember, you’ll need to serve your cart page via SSL to avoid the Skeletor warning.
To begin, we should hide our checkout button so the user can’t click it until we’re ready, but we only want to do this for users with JavaScript. So, in the head of your page:

```html
<script>document.documentElement.className += ' js';</script>
```

And in your CSS:

```css
.js #checkout-button,
#checkout-form.for-autocomplete {
  display: none;
}
```

We need to include the billing form on our cart page. This can go anywhere, the CSS above makes sure it isn’t visible to the user.

```html
<form id="checkout-form" class="for-autocomplete" action="/checkout" method="post">
  …fields for payment, billing address &amp; shipping if relevant…
</form>
```

Now our JavaScript can start setting everything up:

```js
function enhanceForm() {
  var button = document.getElementById('checkout-button');
  var form = document.getElementById('checkout-form');

  // show the checkout button
  button.style.display = 'block';

  // exit early if there's no requestAutocomplete support
  if (!form.requestAutocomplete) {
    // be sure to show the checkout button so users can
    // access the basic payment form!
    return;
  }

  button.addEventListener('click', function(event) {
    form.requestAutocomplete();
    event.preventDefault();
  });

  // TODO: listen for autocomplete events on the form
}
```

You would call `enhanceForm` on the cart page, sometime after your checkout form and button.
Browsers that support `requestAutocomplete` will get the fancy new fast experience, other browsers will fall back to your normal payment form.
For bonus points, you may want to load the form HTML via XHR as part of `enhanceForm`. This means you can load the form only in browsers that support `requestAutocomplete`, and you don’t need to remember to add the form to each page you may call `enhanceForm` from. This is how the [demo site](https://googledrive.com/host/0B28BnxIvH5DueUxvWVNsQXd5dU0/) works.

## You’ve called requestAutocomplete, what now?

The autocomplete process is asynchronous, `requestAutocomplete` returns straight away. To find out how that went, we listen to a couple of new events:

```js
form.addEventListener('autocomplete', function() {
  // hurrah! You got all the data you needed
});

form.addEventListener('autocompleteerror', function(event) {
  if (event.reason == 'invalid') {
    // the form was populated, but it failed html5 validation
    // eg, the data didn't match one of your pattern attributes
  }
  else if (event.reason == 'cancel') {
    // the user aborted the process
  }
  else if (event.reason == 'disabled') {
    // the browser supports requestAutocomplete, but it's not
    // available at this time. Eg, it wasn't called from an
    // interaction event or the page is insecure
  }
});
```

If everything worked, you can do whatever you want with the data, the simplest thing to do would be to submit the form. The server can then validate the data and give the user a confirmation page including delivery cost.
If the data is invalid, you could show the form and highlight the fields the user needs to amend. Alternatively, you could just submit the form and let your regular server-side validation take over.
If the user cancelled the process, you don’t really need to do anything. If the feature is disabled, send the user to the regular form.
So in most cases, your listeners will look a lot like…

```js
form.addEventListener('autocomplete', function() {
  form.submit();
});

form.addEventListener('autocompleteerror', function(event) {
  if (event.reason == 'invalid') {
    form.submit();
  }
  else if (event.reason != 'cancel') {
    window.location = '/checkout-page/';
  }
});
```

## Where does the browser store my data?

The specification doesn’t dictate where data is stored, allowing browsers to innovate.
If you’re logged into Chrome, you get the option to store details in Google Wallet, making them accessible on other devices you’re logged into. If you store your details in Wallet, your real card number won’t be dealt out by `requestAutocomplete`, increasing security.
If you aren’t logged into Chrome, or choose not to use Google Wallet, your details are optionally stored locally in the browser for reuse.
This is the state of things now, but in future Chrome and other browsers may adopt additional payment providers.

## Making payments easy

It’s kinda ridiculous that users have to enter their payment information again and again whenever they want to make a purchase. Things get easier when a site stores your payment details, I’m slightly uneasy about how many sites store my card details. This is a perfect problem for web standards to solve.
`requestAutocomplete` can bring one-click payments to the whole of the web, without service or platform lock-in, and about time too!

## Bonus round: Handling multi-page forms

It’s much better to call `requestAutocomplete` once and collect all the data you need. If you can’t modify your server to receive all this data at once, that’s ok, grab the data out of the completed form and submit it however works best for you.
You can use this [nifty little function](https://gist.github.com/jakearchibald/5774636) to capture all the currently supported data as a simple object, without having to create a form yourself. Once you have the data, you can transform into whatever format your server needs, and post it in multiple steps.

```js
checkoutButton.addEventListener('click', function() {
  requestUserData({
    billing: true,
    shipping: true
  }, function(response) {
    if (response.err == 'cancel') {
      // exit silently
      return;
    }
    if (response.err) {
      // fall back to normal form
      window.location.href = '/normal-checkout-form/';
      return;
    }

    // the rest is just made-up pseudo code as an example
    postToServer(data.shipping).then(function() {
      return postToServer(data.billing);
    }).then(function() {
      return postToServer(data.cc);
    }).catch(function() {
      // handle error
    });
  });
});
```