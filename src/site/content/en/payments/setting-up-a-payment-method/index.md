---
layout: post
title: Setting up a payment method
authors:
  - agektmr
description: |
  A payment transaction using Web Payments starts with a discovery of your
  payment app. Learn how to set up a payment method and get your payment app
  ready for merchants and customers to make payment.
date: 2020-05-01
draft: true
---

When a merchant or a payment service provider (PSP) decides to use a payment app
through the Payment Request API, the app is discovered by the browser through a
URL-based payment method identifier. This article discusses how payment app
discovery works,  and how to configure your payment app to be properly
discovered and invoked by a browser.

If you are new to the concept of Web Payments, how a payment transaction works
through payment apps, please read following articles first:

- Empowering payment apps with Web Payments
- Life of a payment transaction

## How a browser discovers the payment app from a URL-based payment method identifier

![Diagram: How a browser discovers the payment app from a URL-based payment
method identifier](diagram.png)

A `PaymentRequest` object is constructed with a list of [payment method
identifiers](https://www.w3.org/TR/payment-method-id/) that identifies payment
apps a merchant decides to accept. For example, if a merchant uses a payment
method identifier of `https://bobpay.xyz/pay`:

```js
const request = new PaymentRequest([{
  supportedMethods: 'https://bobpay.xyz/pay'
}], details, options);
const result = await request.show();
```

{% Aside %}
Learn how to determine the payment method identifier at [Determine the payment
method identifier](#determine-the-payment-method-identifier).
{% endAside %}

Here's how a browser discovers a payment app just with a URL-based payment
method identifier in 5 steps:

### Step 1. Find the payment method manifest
The browser sends an HTTP `GET` request to the **payment method identifier** URL
and discovers the payment method manifest URL from the HTTP `Link` header with
`rel="payment-method-manifest"` included in the response. For example:

{% Label %}`https://bobpay.xyz/pay`{% endLabel %}

```http
...
Link: <https://bobpay.xyz/payment-manifest.json>; rel="payment-method-manifest"
...
```

{% Aside %}
Learn how to serve the payment method manifest URL at [Serve the payment method
manifest URL](#serve-the-payment-method-manifest-url).
{% endAside %}

### Step 2. Fetch the payment method manifest
The browser fetches the payment method manifest JSON and reads its
`default_applications` field. The field includes a list of links to a [web app
manifest](https://w3c.github.io/manifest/). For example:

{% Label %}`https://bobpay.xyz/payment-manifest.json`{% endLabel %}

```json
"default_applications": ["https://bobpay.xyz/web-app-manifest.json"]
```

{% Aside 'warning' %}
Chrome supports a single default payment app per single payment method as of
Chrome 83.
{% endAside %}

{% Aside %}
Learn how to locate the payment method manifest at [Locate the payment method
manifest](#locate-the-payment-method-manifest).
{% endAside %}

### Step 3. Fetch the web app manifest
The browser then fetches the web app manifest and reads the `name` and `icons`
fields to display the payment app to the user.

{% Label %}`https://bobpay.xyz/web-app-manifest.json`{% endLabel %}

```json
...
"name": "Pay with BobPay",
"icons": [{
  "src": "app-icon.png",
  "sizes": "48x48",
  "type": "image/png"
}],
...
```

{% Aside %}
Learn how to locate a web app manifest at [Locate a web app
manifest](#locate-a-web-app-manifest).
{% endAside %}

### Step 4. Determine the native payment app
Determine the native payment app to launch if the following conditions meet:
* The `related_applications` field is specified in the web app manifest that
  has:
    * The installed app's package id and signature matches, while the minimum
      version (`min_version`) in the web app manifest is less than or equal to
      the version of the installed application.
* The `prefer_related_applications` field is `true`.
* The native payment app is installed that has:
    * An intent filter of `org.chromium.action.PAY` is specified.
    * The payment method identifier is specified as the value of
      `org.chromium.default_payment_method_name` metadata.

{% Label %}`https://bobpay.xyz/web-app-manifest.json`{% endLabel %}

```json
...
"prefer_related_applications": true,
"related_applications": [{
  "platform": "play",
  "id": "xyz.bobpay.app",
  "min_version": "1",
  "fingerprints": [{
    "type": "sha256_cert",
    "value": "92:5A:39:05:C5:B9:EA:BC:71:48:5F:F2:05:0A:1E:57:5F:23:40:E9:E3:87:14:EC:6D:A2:04:21:E0:FD:3B:D1"
  }]
}],
...
```

If the browser has determined the native payment app, the discovery flow is
terminated here. Otherwise continue to the next step.

### Step 5. Determine the web-based payment app
Determine the service worker specified in the web app manifest's `serviceworker`
field.

{% Label %}`https://bobpay.xyz/payment-manifest.json`{% endLabel %}

```json
...
"serviceworker": {
  "src": "payment-handler.js"
}
...
```

Launch the web-based payment app by sending a `paymentrequest` event to the
service worker. Web-based payment apps can be installed just-in-time.

{% Aside %}
Learn more how that works in [When a web-based payment app is installed
just-in-time?](#jit-install).
{% endAside %}

## Determine the payment method identifier {: #determine-the-payment-method-identifier }
A [payment method
identifier](https://w3c.github.io/payment-method-id/#dfn-payment-method-identifiers)
is a URL based string. Payment app developers can pick any URL as a payment
method identifier as long as they have control over it and can serve arbitrary
content. For example: `https://bobpay.xyz/pay`

{% Aside %}
Redirects are allowed up to three times within the
[same-site](https://web.dev/same-site-same-origin/) for a payment method
identifier in Chrome.
{% endAside %}

A merchant can use the payment method identifier as a value for
`supportedMethods` property to indicate it as an accepted payment method.

```js
const request = new PaymentRequest([{
  supportedMethods: 'https://bobpay.xyz/pay'
}], {
  total: {
    label: 'total',
    amount: { value: '10', currency: 'USD' }
  }
});
```

## Serve the payment method manifest URL {: #serve-the-payment-method-manifest-url }
When a payment method identifier is indicated by a website, the browser [sends
an HTTP `GET` request to the
URL](https://w3c.github.io/payment-method-manifest/#accessing). Responds to the
request with a status code of `200 OK` or `204 No Content` plus the URL of the
[payment method manifest](https://w3c.github.io/payment-method-manifest/) as a
`Link` header. For example, if the manifest is at
`https://bobpay.xyz/payment-manifest.json`, the response header would include:

{% Label %}`https://bobpay.xyz/pay`{% endLabel %}

```http
Link: <https://bobpay.xyz/payment-manifest.json>; rel="payment-method-manifest"
```

The URL can be a fully-qualified domain name or a relative path. Inspect
`https://bobpay.xyz/pay/` for network traffic to see an example. You may use a
curl command as well:

```shell
curl --include https://bobpay.xyz/pay
```

{% Aside %}
Learn more about [payment method practices at W3C
documentation](https://github.com/w3c/payment-request-info/wiki/PaymentMethodPractice).
{% endAside %}

## Locate the payment method manifest {: #locate-the-payment-method-manifest }
A payment method manifest is a JSON file that defines which payment app can use
this payment method. A manifest file should look like this.

{% Label %}`https://bobpay.xyz/payment-manifest.json`{% endLabel %}

```json
{
  "default_applications": ["https://bobpay.xyz/manifest.json"],
  "supported_origins": [
    "https://alicepay.friendsofalice.example"
  ]
}
```

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Property name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default_applications</code></td>
        <td>
        An array of URLs that points to web apps manifests where the payment
        apps are hosted. (The URL can be a relative, but only accepts absolute,
        fully-qualified URLs in Chrome 82 or earlier). This array is expected
        to reference the development manifest, production manifest, etc. Chrome
        just-in-time install feature works only when there’s a single item in
        this list, however. 
        </td>
      </tr>
      <tr>
        <td><code>supported_origins</code></td>
        <td>
        An array of URLs that points to origins that may host third-party
        payment apps implementing the same payment method. Note that a payment
        method can be implemented by multiple payment apps.
        </td>
      </tr>
    </tbody>
    <caption>Payment method manifest fields</caption>
  </table>
</div>

## Locate a web app manifest {: #locate-a-web-app-manifest }
Locate a [web app
manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) file on your
server. A web app manifest is used to define a web app as the name suggests.
It's a widely used manifest file to [define a Progressive Web App
(PWA)](/add-manifest/). Typical web app manifest would look like this:

{% Label %}`https://bobpay.xyz/manifest.json`{% endLabel %}

```json
{
  "name": "Pay with Bobpay",
  "short_name": "Bobpay",
  "description": "This is an example of the Payment Handler API.",
  "icons": [
    {
      "src": "images/manifest/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/manifest/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "serviceworker": {
    "src": "service-worker.js",
    "scope": "/",
    "use_cache": false
  },
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3f51b5",
  "background_color": "#3f51b5",
  "related_applications": [
    {
      "platform": "play",
      "id": "com.example.android.samplepay",
      "min_version": "1",
      "fingerprints": [
        {
          "type": "sha256_cert",
          "value": "4C:FC:14:C6:97:DE:66:4E:66:97:50:C0:24:CE:5F:27:00:92:EE:F3:7F:18:B3:DA:77:66:84:CD:9D:E9:D2:CB"
        }
      ]
    }
  ]
}
```

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Property name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="https://developer.mozilla.org/docs/Web/Manifest/name"><code>name</code></a></td>
        <td>
        Used as the payment app name. 
        </td>
      </tr>
      <tr>
        <td><a herf="https://developer.mozilla.org/docs/Web/Manifest/icons"><code>icons</a></td>
        <td>
        Used as the payment app icon. Only Chrome uses these icons; other
        browsers may use them as fallback icons if you don't specify them as
        part of the payment instrument.
        </td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/docs/Web/Manifest/serviceworker"><code>serviceworker</code></a></td>
        <td>
        Used to detect the service worker that runs as the web-based payment
        app. Find more details at <a href="/web-based-payment-apps-developers-guide">
        Web based payment apps developer guide</a>.
        </td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/docs/Web/Manifest/related_applications"><code>related_applications</code></a></td>
        <td>
        Used to detect the native app that acts as the native payment app. Find
        more details at <a href="/android-payment-apps-developers-guide">
        Android payment apps developer guide</a>.
        </td>
      </tr>
      <tr>
        <td><a href="https://developer.mozilla.org/docs/Web/Manifest/preferred_related_applications"><code>prefer_related_applications</code></a></td>
        <td>
        Used to determine which payment app to launch when both a native
        payment app and a web-based payment app are available.
        </td>
      </tr>
    </tbody>
    <caption>Important web app manifest fields</caption>
  </table>
</div>

The web app manifest's `name` property is used as the payment app name, `icons`
property is used as the payment app icon.

## Understanding the special optimizations
### Conditions to launch a payment app directly, skipping the Payment Request UI {: #skip-the-sheet }
When `.show()` method is called, the Payment Request API displays a browser
native UI which we call "Payment Request UI". This UI is designed so that the
user can pick a payment app to pay with, a shipping option and a shipping
address for delivery, and payer's contact information. The payment app the user
picked to pay with is launched only after the "Continue" button is pressed in
the Payment Request UI.



However, serving the Payment Request UI before launching a payment app increases
steps for the user to fulfill a payment. To optimize those steps, the browser
can delegate fulfillment of those information to payment apps and launch a
payment app directly without showing the Payment Request UI when `.show()` is
called.

Here are the conditions:
* `.show()` is triggered with a user gesture (ex. a mouse click)
* There is only a single payment app that:
    * Supports the payment method identifier.
    * Can fulfill all the delegation requirements (ex. shipping address, payer's
      phone number, payer's name, etc).

Meeting those conditions, the payment app can be launched directly.

### When a web-based payment app is installed just-in-time? {: #jit-install }
When the browser determines to use a web-based payment app for the user to pay
with, it can be launched without the user's explicit prior visit to the payment
app website and installing the service worker. The service worker can be
installed just-in-time as the user determines to pay with the payment app. There
are two variations for the installation timing.
* If the Payment Request UI is shown to the user, the app is installed
  just-in-time and launched when the user clicks "Continue".
* If the Payment Request UI is skipped, the payment app is installed
  just-in-time and launched directly.

## Next Steps
Now that you have your payment app discoverable, learn how to develop a native
payment app and a web-based payment app.
* [Android payment app: developer's guide](/android-payment-apps-developers-guide)
* [Web-based payment apps: developer's guide](/web-based-payment-apps-developers-guide)
