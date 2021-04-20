---
layout: post
title: Empowering payment apps with Web Payments
subhead: New web standards for frictionless payment experience on the web.
authors:
  - agektmr
description: |
  Web Payments aims to provide frictionless payment experience on the web. Learn how it works, its benefits, and get ready to integrate your payment app with Web Payments.
date: 2020-05-25
updated: 2020-07-16
tags:
  - blog
  - payments
feedback:
  - api
---

One of the key ecosystem drivers for the web are payments. With secure,
seamless, and flexible payment systems, the web can become a sustainable and
profitable platform. The Web Payments standards have the potential to be a key
building block that will enable seamless integration of payment solutions into
merchant checkout flows.

## What is Web Payments?

Web Payments is a series of new standardized payment APIs available in modern
browsers, including [Payment Request
API](https://www.w3.org/TR/payment-request/), [Payment Handler
API](https://www.w3.org/TR/payment-handler/) and [a few
others](https://www.w3.org/Payments/WG/charter-201912.html#scope). These new
browser primitives simplify online payments and enable payment apps to integrate
with browsers easier than ever.

The standards are flexible; they work with various types of payment systems and
are intended to work on any browser on any device, payment method, or payment
service provider. This flexibility enables development simplicity, deployment
consistency, and future compatibility with emerging payment technologies.

Research shows that [long checkout flows lead to cart
abandonment](https://baymard.com/blog/checkout-flow-average-form-fields). With
Web Payments, checkout flow is simplified to a few taps instead of manual entry
of billing data for every purchase. See a demo below of how Google Pay leverages
Web Payments to build a seamless flow. The same can be achieved by any other
payment app:

<figure class="w-figure" style="width:300px; margin:auto;">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">Checkout flow with Google Pay and Web Payments.</a>.
  </figcaption>
</figure>

1. The customer goes to checkout and presses the **GPay** button.

2. The Google Pay app launches *in front of the merchant website*.

3. The customer confirms payment in the Google Pay app after examining the
   details.

4. The merchant verifies the payment and the purchase is approved.

{% include 'content/payments/browser-compatibility.njk' %}

## The benefits of integrating Web Payments in a payment app

By integrating with Web Payments, payment apps can provide better user
experience to customers, have better developer experience, and stricter
security.

### Better user experience

* **In-context payments:** Payments are made in
  [modals](https://material.io/components/sheets-bottom), in context of the
  merchant website, without redirects or pop-up windows.

* **Faster checkout**: Customers can save their payment details securely in
  their browser or a payment app, ready to be used on any supporting merchant site.

* **Streamlined purchase experience:** After completing (or aborting) the
  payment, the customer is on the merchant website exactly where they left off.

### Better developer experience

* **Easy integration:** Web Payments can be extended from an existing platform-specific
  payment app or a web-based payment app.

* **Low integration cost:** Merchants can integrate Web Payments with JavaScript
  and basic level server-side integration.

* **Standards:** The protocol and data format for exchanging information with
  merchants is standardized and doesn't require deep integration.

* **Dynamic price updates:** Merchants can dynamically change the shipping cost
  based on the shipping address selected in the payment app, without deep
  integration.

###  Stricter security

* [Sideloading](https://en.wikipedia.org/wiki/Sideloading) prevention when
  invoking platform-specific payment apps.

* Designed with upcoming security and privacy paradigms in mind.

Using Web Payments also enables payment apps to bring any kind of payment method
to the web such as e-money, cryptocurrency, bank transfers, and more. Web
Payments is designed with sustainability in mind and doesn't put any
restrictions on payment processing and payment methods.

##  Comparing Web Payments to other approaches

Consider the existing approaches to integrating payments on the web:

* **iframes:** Using JavaScript to inject the payment handler's website in an
  iframe and collect the customer's payment credential through a form.

* **Pop-ups:** Using JavaScript to open a pop-up window and collect the
  customer's payment credentials, either through a form or by having the
  customer authenticate and select a payment credential.

* **Redirects:** Merchant redirects the customer to a payment handler's website
  and lets the customer authenticate and select payment credentials. The
  redirect URL is communicated via a server.

* **OAuth:** Merchant lets the customer authenticate and authorize with a
  payment handler's identity via OAuth, select a payment method, shipping
  address etc through in-context iframe UI.

Here's how they compare to Web Payments:

<div class="w-table-wrapper">
  <table>
    <tr>
      <td></td>
      <td>Web Payments</td>
      <td>iframe</td>
      <td>Popup</td>
      <td>Redirect</td>
      <td>OAuth</td>
    </tr>
    <tr>
      <td>In-context payments</td>
      <td>✔</td>
      <td>✔</td>
      <td></td>
      <td>✔*</td>
      <td>✔</td>
    </tr>
    <tr>
      <td>Dynamic price updates</td>
      <td>✔</td>
      <td></td>
      <td></td>
      <td></td>
      <td>✔</td>
    </tr>
    <tr>
      <td>Streamlined purchase experience</td>
      <td>✔</td>
      <td>✔</td>
      <td></td>
      <td></td>
      <td>✔</td>
    </tr>
    <tr>
      <td>Platform-specific app integration</td>
      <td>✔</td>
      <td></td>
      <td></td>
      <td>✔</td>
      <td></td>
    </tr>
    <tr>
      <td>Low integration cost</td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
      <td></td>
    </tr>
    <tr>
      <td>Standards</td>
      <td>✔</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>
</div>

{% Aside %} *Redirecting to a platform-specific payment app can be done in-context with the
merchant website though redirecting to another website completely loses the
context. {% endAside %}

##  Integrating Web Payments in existing apps

You can integrate Web Payments in both platform-specific and web-based payment apps: if the
platform-specific payment app is not installed, the web-based payment app can be used as a
fallback. Customers and merchants can seamlessly send and receive payments
through a payment method of their choice, depending on the environment.

###  Platform-specific payment apps

* Ideal for payment apps that already have a large install base and want to give
  existing users a consistent experience on the web.

* Unlike [Android's "Intent"
  feature](https://developer.android.com/guide/components/intents-filters), Web
  Payments performs signature verification before running the payment app which
  makes malicious payment apps impossible to be sideloaded.

In the video above, Google Pay is a platform-specific payment app.

###  Web based payment apps

* More future proof: typical payment app techniques like redirects or pop-ups
  are based on third party cookies [that may become
  obsolete](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html).
  While it's still hard to foresee the consequences, Web Payments look to the
  web with better privacy and a world without third party cookies.

* The web-based route is ideal for web services that have a large number of
  customers with their card on file.

<figure class="w-figure" style="width:300px; margin:auto;">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/web-based-payment-app.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/web-based-payment-app.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Checkout flow with a web-based payment app.
  </figcaption>
</figure>


##  How does merchant adoption work?

For a payment app to be available on a merchant, the merchant needs to
explicitly adopt it. Technically speaking, the merchant has to specify the
payment app's identifier (payment method identifier) and use the Payment Request
API with it.

We suggest that you provide good documentation in integration guides and SDKs or
libraries to facilitate integration. For example, Google Pay provides [a
developer's guide](https://developers.google.com/pay/api/web/overview).

Working with payment gateways is also a good option as they can help scale your
outreach as well.

##  How much does it cost?

Web Payments is all about standard technology in the browser. Payment apps
adopting it nor activating it on the browser won't charge them any fees by
itself.