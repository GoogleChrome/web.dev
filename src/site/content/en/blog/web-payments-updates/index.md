---
title: Updates to the Web Payments APIs
subhead: Stay up to date on what's new in Web Payments.
authors:
  - rsolomakhin
  - danyao
  - agektmr
date: 2019-06-13
hero: image/admin/BBvuUcrVtDPtSK0R1x3v.jpg
alt: Transfering money from a phone
description: |
  Since the launch of the Payment Request API in Chrome 53 and the Payment
  Handler API in Chrome 68, there have been quite a few changes made to their
  respective specifications. This post summarizes those updates and will
  continue accumulating those API changes.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - payment
feedback:
  - api
---

Web Payments have been publicly available in browsers since 2016. The core
feature—the [Payment Request API](https://www.w3.org/TR/payment-request/)—is
now available across multiple browsers: Chrome, Safari, Edge and soon Firefox.
If you're new to Web Payments take a look at the ["Web Payments
Overview"](https://developers.google.com/web/fundamentals/payments/?hl=en) to
get started.

Since the launch of the Payment Request API and the [Payment Handler
API](https://w3c.github.io/payment-handler/), there have been quite a few
changes made to their respective specifications. These changes won't break your
working code, but we recommend that you look out for them. This post summarizes
those updates and will continue accumulating those API changes.

{% Aside 'note' %}
If you want to subscribe to further upcoming changes to
Chrome's Web Payments implementation, please join the [Public Payment Request
Announcements
group](https://groups.google.com/a/chromium.org/forum/#!forum/paymentrequest).

Alternatively, join the
[public Web Payments community](https://spectrum.chat/web-payments) for the same
updates. You may ask questions there as well.

If you want to check older updates to Chrome, head over to
["Changes in the Payment Request API" article at Web Fundamentals](https://developers.google.com/web/updates/2017/01/payment-request-updates).
{% endAside %}

## New method: `hasEnrolledInstrument()`

In the previous version of the Payment Request API, `canMakePayment()` was used
to check for the user's presence of the user's payment instrument. In a recent
update to the spec, `canMakePayment()` has been replaced with
[`hasEnrolledInstrument()`](https://w3c.github.io/payment-request/#hasenrolledinstrument-method)
without changing its functionality.

The [`hasEnrolledInstrument()`](https://chromestatus.com/feature/5646573451083776)
method has [consensus from all major browsers](https://chromestatus.com/feature/5646573451083776).
Chrome has implemented it in version 74 and both [Webkit](https://bugs.webkit.org/show_bug.cgi?id=197386)
and [Gecko](https://bugzilla.mozilla.org/show_bug.cgi?id=1528663) have tracking
bugs but have not yet implemented the method as of June 2019.

To use the new `hasEnrolledInstrument()` method, replace code that looks like
this:

```js
// Checking for instrument presence.
request.canMakePayment().then(handleInstrumentPresence).catch(handleError);
```

With code that looks like this:

```js
// Checking for instrument presence.
if (request.hasEnrolledInstrument) {
  // hasEnrolledInstrument() is available.
  request.hasEnrolledInstrument().then(handleInstrumentPresence).catch(handleError);
} else {
  request.canMakePayment().then(handleInstrumentPresence).catch(handleError);
}
```

## `canMakePayment()` no longer checks for instrument presence

Because `hasEnrolledInstrument()` now handles checking for the user's payment
instrument,
[`canMakePayment()`](https://w3c.github.io/payment-request/#canmakepayment-method)
has been updated to only check for payment app availability.

This change to `canMakePayment()` is bound to the implementation of
`hasEnrolledInstrument()`. As of June 2019, it is implemented in Chrome 74 but
not in any other browsers. Be sure to check if the `hasEnrolledInstrument()`
method is available in the user's browser before attempting to use it.

```js
// Checking for payment app availability without checking for instrument presence.
if (request.hasEnrolledInstrument) {
  // `canMakePayment()` behavior change corresponds to
  // `hasEnrolledInstrument()` availability.
  request.canMakePayment().then(handlePaymentAppAvailable).catch(handleError);
} else {
  console.log("Cannot check for payment app availability without checking for instrument presence.");
}
```

## `languageCode` removed from `basic-card` payment method

`PaymentAddress.languageCode` has been removed from the shipping addresses and
billing addresses for `basic-card`. The billing addresses of other payment
methods (such as Google Pay) are not affected.

This change has been implemented [in Chrome 74, Firefox, and Safari](https://chromestatus.com/feature/4992562146312192).

## `PaymentRequest.show()` now takes an optional `detailsPromise`

[`PaymentRequest.show()`](https://w3c.github.io/payment-request/#show-method)
allows a merchant to present a payment request UI before the final total is
known. The merchant has ten seconds to resolve the `detailsPromise` before a
timeout. This feature is intended for a quick server-side roundtrip.

This feature has shipped in Chrome 75 and Safari.

```js
// Not implemented in Chrome 74 and older.
// There's no way to feature-detect this, so check a few
// older versions of Chrome that you're seeing hit your servers.
if (/Chrome\/((6[0-9])|(7[0-4]))/g.exec(navigator.userAgent) !== null) {
  return;
}

// Supported in Chrome 75+.
request.show(new Promise(function(resolveDetailsPromise, rejectDetailsPromise) {
  // Find out the exact total amount and call
  // `resolveDetailsPromise(details)`.
  // Use a 3 second timeout as an example.
  window.setTimeout(function() {
    resolveDetailsPromise(details);
  }, 3000); // 3 seconds.
}))
.then(handleResponse)
.catch(handleError);
```

## `PaymentRequestEvent.changePaymentMethod()`

The Payment Handler API feature
[`PaymentRequestEvent.changePaymentMethod()`](https://chromestatus.com/feature/5698314223747072)
allows payment handlers (e.g., Google Pay) to trigger the
[`onpaymentmethodchange`](https://w3c.github.io/payment-request/#dom-paymentmethodchangeevent)
event handler. `changePaymentMethod()` returns a promise that resolves to a
[merchant
response](https://w3c.github.io/payment-handler/#dom-paymentmethodchangeresponse)
with updated price information (e.g., tax recalculation).

Both `PaymentRequestEvent.changePaymentMethod()` and the `paymentmethodchange`
event are available in Chrome 76 and Webkit has implemented the
[`paymentmethodchange` event in its Technology
Preview](https://webkit.org/blog/9167/whats-new-in-the-payment-request-api-for-apple-pay/).

```js
// In service worker context, `self` is the global object.
self.addEventListener('paymentrequest', (evt) => {
  evt.respondWith(new Promise((confirmPaymentFunction, rejectPaymentFunction) => {
    if (evt.changePaymentMethod === undefined) {
      // Not implemented in this version of Chrome.
      return;
    }
    // Notify merchant that the user selected a different payment method.
    evt.changePaymentMethod('https://paymentapp.com', {country: 'US'})
    .then((responseFromMerchant) => {
      if (responseFromMerchant === null) {
        // Merchant ignored the 'paymentmethodchange' event.
        return;
      }
      handleResponseFromMerchant(responseFromMerchant);
    })
    .catch((error) => {
      handleError(error);
    });
  }));
});
```

Merchant example:

```js
if (request.onpaymentmethodchange === undefined) {
  // Feature not available in this browser.
  return;
}

request.addEventListener('paymentmethodchange', (evt) => {
  evt.updateWith(updateDetailsBasedOnPaymentMethod(evt, paymentDetails));
});
```

{% Aside %}
**Try it yourself**! We've put together [an example so you can experiment with this API](https://rsolomakhin.github.io/pr/apps/pmc/).
{% endAside %}

## Improved local development

Chrome 76 adds two small improvements for developer productivity. If your local
development environment uses a self-signed certificate, you can now use the
`--ignore-certificate-errors` command line flag to make Chrome allow Web
Payments APIs in your development environment. If you develop using a local web
server that does not support HTTPS, you can also use the
`--unsafely-treat-insecure-origin-as-secure=<origin>` flag to make Chrome treat
the HTTP origin as HTTPS.
