---
layout: post
title: Setting up a payment method
subhead: |
  A payment transaction using Web Payments starts with the discovery of your
  payment app. Learn how to set up a payment method and get your payment app
  ready for merchants and customers to make payments.
authors:
  - agektmr
description: |
  A payment transaction using Web Payments starts with the discovery of your
  payment app. Learn how to set up a payment method and get your payment app
  ready for merchants and customers to make payments.
date: 2020-05-25
updated: 2021-09-14
tags:
  - payments
feedback:
  - api
---

To be used with the Payment Request API, a payment app must be associated with a
payment method identifier. Merchants that want to integrate with a payment app
will use the payment method identifier to indicate that to the browser. This
article discusses how payment app discovery works,  and how to configure your
payment app to be properly discovered and invoked by a browser.

If you are new to the concept of Web Payments or how a payment transaction works
through payment apps, read the following articles first:

- [Empowering payment apps with Web Payments](/empowering-payment-apps-with-web-payments)
- [Life of a payment transaction](/life-of-a-payment-transaction)

{% include 'content/payments/browser-compatibility.njk' %}

## How a browser discovers a payment app

Every payment app needs to provide the following:

- URL-based payment method identifier
- Payment method manifest (except when the payment method identifier is
  provided by a third party)
- Web app manifest

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kvLIMUysDNEG3IfPxKz6.png", alt="Diagram: How a browser discovers the payment app from a URL-based payment method identifier", width="800", height="587" %}
</figure>

The discovery process starts when a merchant initiates a transaction:

1. The browser sends a request to the [payment method
   identifier](https://w3c.github.io/payment-method-manifest/) URL and fetches
   the [payment method
   manifest](https://w3c.github.io/payment-method-manifest/).
2. The browser determines the [web app
   manifest](https://developer.mozilla.org/docs/Web/Manifest) URL from the
   payment method manifest and fetches the web app manifest.
3. The browser determines whether to launch the OS payment app or the
   web-based payment app from the web app manifest.

The next sections explain in detail how to set up your own payment method so
that browsers can discover it.

## Step 1: Provide the payment method identifier

A [payment method
identifier](https://w3c.github.io/payment-method-id/#dfn-payment-method-identifiers)
is a URL-based string. For example, Google Pay's identifier is
`https://google.com/pay`. Payment app developers can pick any URL as a payment
method identifier as long as they have control over it and can serve arbitrary
content. In this article, we'll use
[`https://bobbucks.dev/pay`](https://bobbucks.dev/pay) as the payment method
identifier.

{% Aside %}
Payment apps can support third party payment methods as well.
{% endAside %}

### How merchants use the payment method identifier

A `PaymentRequest` object is constructed with a list of [payment method
identifiers](https://www.w3.org/TR/payment-method-id/) that identifies payment
apps a merchant decides to accept. Payment method identifiers are set as a value
for the `supportedMethods` property. For example:

{% Label %}[merchant] requests payment:{% endLabel %}

```js
const request = new PaymentRequest([{
  supportedMethods: 'https://bobbucks.dev/pay'
}], {
  total: {
    label: 'total',
    amount: { value: '10', currency: 'USD' }
  }
});
```

{% Aside %}
Redirects are allowed up to three times within the same-site for a payment
method identifier in Chrome.
{% endAside %}

## Step 2: Serve the payment method manifest

A [payment method manifest](https://w3c.github.io/payment-method-manifest/) is a
JSON file that defines which payment app can use this payment method.

### Provide the payment method manifest
When a merchant initiates a payment transaction, [the browser sends an HTTP
`GET` request to the payment method identifier URL](https://w3c.github.io/payment-method-manifest/#accessing).
The server responds with the payment method
manifest body.

A payment method manifest has two fields, `default_applications` and
`supported_origins`.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Property name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default_applications</code> (required)</td>
        <td>
        An array of URLs that points to web app manifests where the payment
        apps are hosted. (The URL can be a relative). This array is expected
        to reference the development manifest, production manifest, etc.
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

A payment method manifest file should look like this:

{% Label %}[payment handler] /payment-manifest.json:{% endLabel %}

```json
{
  "default_applications": ["https://bobbucks.dev/manifest.json"],
  "supported_origins": [
    "https://alicepay.friendsofalice.example"
  ]
}
```

When the browser reads the `default_applications` field, it finds a list of
links to [web app manifests](https://w3c.github.io/manifest/) of supported
payment apps.

{% Aside %}
Chrome supports a single default payment app per single payment method as of Chrome 83.
{% endAside %}

### Optionally route the browser to find the payment method manifest in another location
The payment method identifier URL can optionally respond with a `Link` header
that points to another URL where the browser can fetch the payment method
manifest. This is useful when a payment method manifest is hosted at a different
server or when the payment app is served by a third party.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5YDqz1ppLkjHd9HYgXYH.png", alt="How a browser discovers the payment app from a URL-based payment method identifier with redirects", width="800", height="698" %}

Configure the payment method server to respond with a HTTP `Link` header with
the `rel="payment-method-manifest"` attribute and the [payment method
manifest](https://w3c.github.io/payment-method-manifest/) URL.

For example, if the manifest is at `https://bobbucks.dev/payment-manifest.json`,
the response header would include:

```http
Link: <https://bobbucks.dev/payment-manifest.json>; rel="payment-method-manifest"
```

The URL can be a fully-qualified domain name or a relative path. Inspect
`https://bobbucks.dev/pay/` for network traffic to see an example. You may use a
`curl` command as well:

```shell
curl --include https://bobbucks.dev/pay
```

{% Aside %}
Learn more about [payment method practices at W3C
documentation](https://github.com/w3c/payment-request-info/wiki/PaymentMethodPractice).
{% endAside %}

## Step 3: Serve a web app manifest

A [web app manifest](https://developer.mozilla.org/docs/Web/Manifest) is
used to define a web app as the name suggests. It's a widely used manifest file
to [define a Progressive Web App (PWA)](/add-manifest/).

Typical web app manifest would look like this:

{% Label %}[payment handler] /manifest.json:{% endLabel %}

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

The information described in a web app manifest is also used to define how a
payment app appears in the Payment Request UI.

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Property name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <code><a href="https://developer.mozilla.org/docs/Web/Manifest/name">name</a></code> (required)
        </td>
        <td>
        Used as the payment app name.
        </td>
      </tr>
      <tr>
        <td>
          <code><a href="https://developer.mozilla.org/docs/Web/Manifest/icons">icons</a></code> (required)
        </td>
        <td>
        Used as the payment app icon. Only Chrome uses these icons; other
        browsers may use them as fallback icons if you don't specify them as
        part of the payment instrument.
        </td>
      </tr>
      <tr>
        <td>
          <code><a href="https://developer.mozilla.org/docs/Web/API/Service_Worker_API">serviceworker</a></code>
        </td>
        <td>
        Used to detect the service worker that runs as the web-based payment
        app.
        </td>
      </tr>
      <tr>
        <td><code>serviceworker.src</code></td>
        <td>
        The URL to download the service worker script from.
        </td>
      </tr>
      <tr>
        <td><code>serviceworker.scope</code></td>
        <td>
        A string representing a URL that defines a service worker's
        registration scope.
        </td>
      </tr>
      <tr>
        <td><code>serviceworker.use_cache</code></td>
        <td>
        The URL to download the service worker script from.
        </td>
      </tr>
      <tr>
        <td>
          <code><a href="https://developer.mozilla.org/docs/Web/Manifest/related_applications">related_applications</a></code>
        </td>
        <td>
        Used to detect the app that acts as the OS-provided payment app.
        Find more details at <a href="/android-payment-apps-developers-guide/">Android
        payment apps developer guide</a>.
        </td>
      </tr>
      <tr>
        <td>
          <code><a href="https://developer.mozilla.org/docs/Web/Manifest/prefer_related_applications">prefer_related_applications</a></code>
        </td>
        <td>
        Used to determine which payment app to launch when both an OS-provided payment app and a web-based payment app are available.
        </td>
      </tr>
    </tbody>
    <caption>Important web app manifest fields</caption>
  </table>
</div>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lyP2t7T5R5bVzqh0LUTx.png", alt="Payment app with an icon.", width="800", height="237" %}
  <figcaption>
    Payment app label and icon.
  </figcaption>
</figure>

The web app manifest's `name` property is used as the payment app name, `icons`
property is used as the payment app icon.

## How Chrome determines which payment app to launch
### Launching the platform-specific payment app

To launch the platform-specific payment app, the following conditions must be met:

- The `related_applications` field is specified in the web app manifest and:
    - The installed app's package ID and signature match, while the minimum
      version (`min_version`) in the web app manifest is less than or equal to
      the version of the installed application.
- The `prefer_related_applications` field is `true`.
- The platform-specific payment app is installed and has:
    - An intent filter of `org.chromium.action.PAY`.
    - A payment method identifier specified as the value for the `org.chromium.default_payment_method_name` property.

Check out the [Android payment apps: developer's guide](/android-payment-apps-developers-guide/)
for more details about how to set these up.

{% Label %}[payment handler] /manifest.json{% endLabel %}

```json
"prefer_related_applications": true,
"related_applications": [{
  "platform": "play",
  "id": "xyz.bobpay.app",
  "min_version": "1",
  "fingerprints": [{
    "type": "sha256_cert",
    "value": "92:5A:39:05:C5:B9:EA:BC:71:48:5F:F2:05:0A:1E:57:5F:23:40:E9:E3:87:14:EC:6D:A2:04:21:E0:FD:3B:D1"
  }]
}]
```

If the browser has determined that the platform-specific payment app is available, the
discovery flow is terminated here. Otherwise it continues to the next step --
launching the web-based payment app.

### Launching the web-based payment app
The web-based payment app should be specified in the web app manifest's `serviceworker` field.

{% Label %}[payment handler] /manifest.json:{% endLabel %}

```json
"serviceworker": {
  "src": "payment-handler.js"
}
```

The browser launches the web-based payment app by sending a `paymentrequest`
event to the service worker. The service worker doesn't have to be registered in
advance. [It can be registered just-in-time](#jit-register).


## Understanding the special optimizations

### How browsers can skip the Payment Request UI and launch a payment app directly

In Chrome, when `show()` method of `PaymentRequest` is called, the Payment
Request API displays a browser-provided UI called the "Payment Request UI". This
UI allows users to choose a payment app. After pressing the **Continue** button
in the Payment Request UI, the selected payment app is launched.

<figure>
  {% Video
    src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/VOKIj5Tqfi2bNPCjtkyi.mp4", autoplay="true", loop="true", muted="true"
  %}
  <figcaption>
    Payment Request UI intervenes before launching the payment app.
  </figcaption>
</figure>

Showing the Payment Request UI before launching a payment app increases the
number of steps needed for a user to fulfill a payment. To optimize the process,
the browser can delegate fulfillment of that information to payment apps and
launch a payment app directly without showing the Payment Request UI when
`show()` is called.

<figure>
  {% Video
    src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/8T37CEyLisAjwW39dRwB.mp4", autoplay="true", loop="true", muted="true"
  %}
  <figcaption>
    Skip the Payment Request UI and launch the payment app directly.
  </figcaption>
</figure>

To launch a payment app directly, the following conditions must be met:
- `show()` is triggered with a user gesture (for example, a mouse click).
- There is only a single payment app that:
    - Supports the requested payment method identifier.

{% Aside %}
Safari currently only supports Apple Pay so it always launches the app directly,
skipping the Payment Request UI.
{% endAside %}

### When is a web-based payment app registered just-in-time (JIT)? {: #jit-register}

Web-based payment apps can be launched without the user's explicit prior visit
to the payment app website and registering the service worker. The service
worker can be registered just-in-time when the user chooses to pay with the
web-based payment app. There are two variations for the registration timing:

- If the Payment Request UI is shown to the user, the app is registered
  just-in-time and launched when the user clicks **Continue**.
- If the Payment Request UI is skipped, the payment app is registered
  just-in-time and launched directly. Skipping the Payment Request UI to launch
  a just-in-time registered app requires a user gesture, which prevents
  unexpected registration of cross-origin service workers.

{% Aside %}
While a single payment method identifier can support multiple payment apps,
JIT-registration happens only when the payment method manifest points to a
single payment app.
{% endAside %}

## Next Steps
Now that you have your payment app discoverable, learn how to develop a platform-specific
payment app and a web-based payment app.

- [Android payment apps: developer's guide](/android-payment-apps-developers-guide)
- [Web based payment apps developer guide](/web-based-payment-apps-overview)
