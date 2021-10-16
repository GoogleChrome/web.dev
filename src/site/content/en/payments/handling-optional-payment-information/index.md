---
layout: post
title: Handling optional payment information with a service worker
subhead: |
  How to adapt your web-based payment app to Web Payments and provide a better user experience for customers.
authors:
  - agektmr
date: 2020-08-31
updated: 2021-09-14
description: |
  Once a web-based payment app is registered, it's ready to accept payment requests from merchants. This article teaches you how to orchestrate a payment transaction from a service worker during runtime.
tags:
  - payments
  - service-worker
feedback:
  - api
---

{% Aside 'warning' %}

Shipping and address support in [the Payment Request API is removed from the
specification](https://github.com/w3c/payment-request/pull/955) and is no longer
functional in web-based payment apps.

{% endAside %}

Once [a web-based payment app receives a payment request and initiates a payment
transaction](/orchestrating-payment-transactions), the service worker will act
as the hub for communication between the merchant and the payment app. This post
explains how a payment app can pass information about the payment method,
shipping address, or contact information to the merchant using a service worker.

<figure class="w-figure">
  {% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/4XRuSFGyEE2Cjwrmu0jb.png", alt="Handling optional payment information with a service worker", width="800", height="1344", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Handling optional payment information with a service worker
  </figcaption>
</figure>

## Inform the merchant of a payment method change {: #payment-method-changes }
Payment apps can support multiple payment instruments with different payment methods.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Customer</th>
        <th>Payment Method</th>
        <th>Payment Instrument</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="3">A</td>
        <td>Credit Card Issuer 1</td>
        <td><code>****1234</code></td>
      </tr>
      <tr>
        <td>Credit Card Issuer 1</td>
        <td><code>****4242</code></td>
      </tr>
      <tr>
        <td>Bank X</td>
        <td><code>******123</code></td>
      </tr>
      <tr>
        <td rowspan="2">B</td>
        <td>Credit Card Issuer 2</td>
        <td><code>****5678</code></td>
      </tr>
      <tr>
        <td>Bank X</td>
        <td><code>******456</code></td>
      </tr>
    </tbody>
  </table>
</div>

For example, in the above table, Customer A's web-based wallet has two credit
cards and one bank account registered. In this case, the app is handling three
payment instruments (`****1234`, `****4242`, `******123`) and two payment
methods (Credit Card Issuer 1 and Bank X). On a payment transaction, the payment
app can let the customer pick one of the payment instruments and use it to pay
for the merchant.

<figure class="w-figure" style="width:300px; margin:auto;">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yZYmEL3y1e2cPaLNz34K.png", alt="Payment method picker UI", width="800", height="1600", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Payment method picker UI
  </figcaption>
</figure>

The payment app can let the merchant know which payment method the customer
picked before sending the full payment response. This is useful when the
merchant wants to run a discount campaign for a specific payment method brand,
for example.

With the Payment Handler API, the payment app can send a "payment method change"
event to the merchant via a service worker to notify the new payment method
identifier. The service worker should invoke
`PaymentRequestEvent.changePaymentMethod()` with the new payment method
information.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ogXzkcdinU3RNC9cMzN0.png", alt="Inform the merchant of a payment method change", width="800", height="659", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Inform the merchant of a payment method change
  </figcaption>
</figure>

Payment apps can pass a `methodDetails` object as the optional second argument
for `PaymentRequestEvent.changePaymentMethod()`. This object can contain
arbitrary payment method details required for the merchant to process the change
event.

{% Aside 'warning' %}
Sharing detailed information about a customer with the merchant before the
transaction is finalized is potentially a privacy risk. As a best practice,
payment apps should omit unnecessary details as much as possible.
{% endAside %}

{% Label %}
[payment handler] service-worker.js
{% endLabel %}

```js
…
// Received a message from the frontend
self.addEventListener('message', async e => {
  let details;
  try {
    switch (e.data.type) {
      …
      case 'PAYMENT_METHOD_CHANGED':
        const newMethod = e.data.paymentMethod;
        const newDetails = e.data.methodDetails;
        // Redact or check that no sensitive information is passed in
        // `newDetails`.
        // Notify the merchant of the payment method change
        details =
          await payment_request_event.changePaymentMethod(newMethod, newDetails);
      …
```

When the merchant receives a `paymentmethodchange` event from the Payment
Request API, they can update the payment details and respond with a
[`PaymentDetailsUpdate`](https://w3c.github.io/payment-request/#paymentdetailsupdate-dictionary)
object.

{% Label %}
[merchant]
{% endLabel %}

```js
request.addEventListener('paymentmethodchange', e => {
  if (e.methodName === 'another-pay') {
    // Apply $10 discount for example.
    const discount = {
      label: 'special discount',
      amount: {
        currency: 'USD',
        // The value being string complies the spec
        value: '-10.00'
      }
    };
    let total = 0;
    details.displayItems.push(discount);
    for (let item of details.displayItems) {
     total += parseFloat(item.amount.value);
    }
    // Convert the number back to string
    details.total.amount.value = total.toString();
  }
  // Pass a promise to `updateWith()` and send updated payment details
  e.updateWith(details);
});
```

When the merchant responds, the promise that
[`PaymentRequestEvent.changePaymentMethod()`](https://w3c.github.io/payment-handler/#dom-paymentrequestevent-changepaymentmethod)
returned will resolve with a
[`PaymentRequestDetailsUpdate`](https://w3c.github.io/payment-handler/#the-paymentrequestdetailsupdate)
object.

{% Label %}
[payment handler] service-worker.js
{% endLabel %}

```js
…
        // Notify the merchant of the payment method change
        details = await payment_request_event.changePaymentMethod(newMethod, newDetails);
        // Provided the new payment details,
        // send a message back to the frontend to update the UI
        postMessage('UPDATE_REQUEST', details);
        break;
…
```

Use the object to update the UI on the frontend. See [Reflect the updated
payment details](#reflect-the-updated-payment-details).

## Reflect the updated payment details {: #reflect-the-updated-payment-details }

Once the merchant finishes updating the payment details, the promises returned
from `.changePaymentMethod()`, will resolve with a
[`PaymentRequestDetailsUpdate`](https://w3c.github.io/payment-handler/#the-paymentrequestdetailsupdate)
object. The payment handler can use the result to reflect updated total price in
the UI.

{% Aside %}
 The `PaymentRequestDetailsUpdate` object is passed from the merchant and it
 contains the exact information the merchant put in the `PaymentDetailsUpdate`
 object via the Payment Request API. The best way to ensure that merchants give
 you the information you expect is to provide good developer documentation, or
 provide a JavaScript library to control the information, or both.
{% endAside %}

Merchants may return errors if the payment method is not acceptable. Use the
following properties to reflect the error status:

* **`error`**: Human readable error string. This is the best string to display
  to customers.
* **`paymentMethodErrors`**: Payment-method-specific error object. You can ask
  merchants to provide a structured error, but the Web Payments spec authors
  recommend keeping it a simple string.

## Sample code

Most of sample codes you saw in this document were excerpts from the following
working sample app:

[https://paymenthandler-demo.glitch.me](https://paymenthandler-demo.glitch.me)

{% Label %}
[payment handler] service worker
{% endLabel %}

{% Glitch {
  id: 'paymenthandler-demo',
  path: 'public/service-worker.js',
  previewSize: 0,
  allow: []
} %}

{% Label %}
[payment handler] frontend
{% endLabel %}

{% Glitch {
  id: 'paymenthandler-demo',
  path: 'public/pay.js',
  previewSize: 0,
  allow: []
} %}

To try it out:

1. Go to [https://paymentrequest-demo.glitch.me/](https://paymentrequest-demo.glitch.me/).
2. Go to the bottom of the page.
3. Press **Add a payment button**.
4. Enter `https://paymenthandler-demo.glitch.me` to the **Payment Method Identifier** field.
5. Press **Pay** button next to the field.

## Next steps

In this article, we learned how to handle optional information on the service
worker. The final step for building a web-based payment app is to learn how to
build the frontend.

* Handling payments on the payment frontend (coming soon)
