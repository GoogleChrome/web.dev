---
title: Updates to the Web Payments APIs
subhead: Accumulated updates to the Web Payments
authors:
  - rsolomakhin
  - danyao
  - agektmr
date: 2019-06-12
hero: hero.jpg
alt: Transfer money from a phone
description: |
  Since the launch of the Payment Request API in Chrome 53 and the Payment
  Handler API in Chrome 68, there have been quite a few changes made to their
  respective specifications. These changes won't break your working code, but we
  recommend that you look out for them. This post summarizes those updates and
  will continue accumulating those API changes.
tags:
  - post # post is a required tag for the article to show up in the blog.
  - payment
---

Since the launch of the Payment Request API in Chrome 53 and the Payment Handler API in Chrome 68, there have been quite a few changes made to their respective specifications. These changes won't break your working code, but we recommend that you look out for them. This post summarizes those updates and will continue accumulating those API changes.

{% Aside 'note' %} If you want to subscribe to further upcoming changes to
Chrome's Web Payments APIs, please join the [Public Payment Request
Announcements
group](https://groups.google.com/a/chromium.org/forum/#!forum/paymentrequest).

Alternatively, join the [public Web Payments community](https://spectrum.chat/web-payments) for the same updates. You may ask questions there as well.

If you want to check older updates to Chrome, head over to ["Changes in the
Payment Request API" article at Web
Fundamentals](https://developers.google.com/web/updates/2017/01/payment-request-updates).
{% endAside %}

## New method: `hasEnrolledInstrument()`

As of Chrome 74, checking for payment instrument presence has been removed from
`PaymentRequest.canMakePayment()` (see below for more info).
[`PaymentRequest.hasEnrolledInstrument()`](https://w3c.github.io/payment-request/#hasenrolledinstrument-method)
replaces this functionality in Chrome 74+.

[`hasEnrolledInstrument()`](https://chromestatus.com/feature/5646573451083776)
has [consensus from all major
browsers](https://chromestatus.com/feature/5646573451083776). As of June 2019,
both [Webkit](https://bugs.webkit.org/show_bug.cgi?id=197386) and
[Gecko](https://bugzilla.mozilla.org/show_bug.cgi?id=1528663) have tracking bugs
but have not yet implemented the method.

To adapt to the addition of `hasEnrolledInstrument()`, change code that looks
like this:

```js
// Checking for instrument presence.
request.canMakePayment().then(handleInstrumentPresence).catch(handleError);
```

Into code that looks like this:

```js
// Checking for instrument presence.
if (request.hasEnrolledInstrument) {
  // `hasEnrolledInstrument()` available.
  request.hasEnrolledInstrument().then(handleInstrumentPresence).catch(handleError);
} else {
  request.canMakePayment().then(handleInstrumentPresence).catch(handleError);
}
```

## `canMakePayment()` no longer checks for instrument presence

As of Chrome 74, the
[`PaymentRequest.canMakePayment()`](https://w3c.github.io/payment-request/#canmakepayment-method)
method only checks for payment app availability and no longer checks for payment
instrument presence. To check for payment instrument presence in Chrome 74+, use
the new `PaymentRequest.hasEnrolledInstrument()` method.

The change to `canMakePayment()` is bound to the implementation of
`hasEnrolledInstrument()`. As of June 2019, it is implemented in Chrome 74 but
not in any other browsers.

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

`PaymentAddress.languageCode` is removed from shipping addresses and billing
addresses for `basic-card`. The billing addresses of other payment methods (such
as Google Pay) are not affected.

This is implemented [in Chrome 74 and other browsers](https://chromestatus.com/features/4992562146312192).

## `PaymentRequest.show()` now takes optional `detailsPromise`

[This feature](https://w3c.github.io/payment-request/#show-method) allows
merchants to present a payment request UI before the final total is known. The
merchant has 10 seconds to resolve the `detailsPromise` before a timeout. This
feature is intended for a quick server-side roundtrip.

This feature is shipped in Chrome 75 and is available in Safari.

```js
// Not implemented in Chrome 74 and older.
// There’s no way to feature-detect this, so check a few
// older versions of Chrome that you’re seeing hit your servers.
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

## PaymentRequestEvent.changePaymentMethod()

The Payment Handler API feature
[`PaymentRequestEvent.changePaymentMethod()`](https://chromestatus.com/feature/5698314223747072)
allows payment handlers (e.g. Google Pay) to trigger the
[`onpaymentmethodchange`](https://w3c.github.io/payment-request/#dom-paymentmethodchangeevent)
event handler. `changePaymentMethod()` returns a Promise that resolves to a
[merchant
response](https://w3c.github.io/payment-handler/#dom-paymentmethodchangeresponse)
with updated price information (e.g. tax recalculation).

Both `PaymentRequestEvent.changePaymentMethod()` and the `paymentmethodchange`
event are shipped in Chrome 76. Webkit has implemented the
[`paymentmethodchange` event in its Technology
Preview](https://webkit.org/blog/9167/whats-new-in-the-payment-request-api-for-apple-pay/).

Payment handler example:

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

Demo: [https://rsolomakhin.github.io/pr/apps/pmc/](https://rsolomakhin.github.io/pr/apps/pmc/).

## Improved local development

Chrome 76 adds two small improvements for developer productivity. If your local
development environment uses a self-signed certificate, you can now use the
`--ignore-certificate-errors` command line flag to make Chrome allow web
payments APIs in your development environment. If you develop using a local web
server that does not support HTTPS, you can also use the
`--unsafely-treat-insecure-origin-as-secure=<origin>` flag to make Chrome treat
the HTTP origin as HTTPS.
