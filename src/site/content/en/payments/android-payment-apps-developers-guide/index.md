---
layout: post
title: Android payment app developers guide
subhead: |
  Learn how to adapt your Android payment app to work with Web Payments and provide a better user experience for customers.
authors:
  - yaraki
  - agektmr
date: 2020-05-25
description: |
  Learn how to adapt your Android payment app to work with Web Payments and provide a better user experience for customers.
tags:
  - blog
  - payments
feedback:
  - api
---

The [Payment Request API](https://www.w3.org/TR/payment-request/) brings to the
web a built-in browser-based interface that allows users to enter required payment
information easier than ever before. The API can also invoke platform-specific payment
apps.

<figure class="w-figure" style="width:300px; margin:auto;">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">Checkout flow with platform-specific Google Pay app that uses Web Payments</a>.
  </figcaption>
</figure>

Compared to using just Android Intents, Web Payments allow better integration
with the browser, security, and user experience:

* The payment app is launched as a modal, in context of the merchant website.
* Implementation is supplemental to your existing payment app, enabling you to
  take advantage of your user base.
* The payment app's signature is checked to prevent
  [sideloading](https://en.wikipedia.org/wiki/Sideloading).
* Payment apps can support multiple payment methods.
* Any payment method, such as cryptocurrency, bank transfers, and more, can be
  integrated. Payment apps on Android devices can even integrate methods that
  require access to the hardware chip on the device.

{% Aside %}
To understand how merchants integrate with payment apps, check out [Life of a
payment transaction](/life-of-a-payment-transaction/).
{% endAside%}

It takes four steps to implement Web Payments in an Android payment app:

1. Let merchants discover your payment app.
2. Let a merchant know if a customer has an enrolled instrument (such as credit
   card) that is ready to pay.
3. Let a customer make payment.
4. Verify the caller's signing certificate.

To see Web Payments in action, check out the
[android-web-payment](https://github.com/GoogleChromeLabs/android-web-payment/)
demo.

## Step 1: Let merchants discover your payment app

In order for a merchant to use your payment app, they need to use the [Payment
Request API](https://developer.mozilla.org/docs/Web/API/Payment_Request_API) and
specify the payment method you support using the [payment method
identifier](https://www.w3.org/TR/payment-method-id/).

If you have a payment method identifier that is unique to your payment app, you
can set up your own [payment method
manifest](https://w3c.github.io/payment-method-manifest/) so browsers can
discover your app.

{% Aside %}
To learn how the discovery process works in detail and how to set up a new
payment method check out [Setting up a payment
method](/setting-up-a-payment-method).
{% endAside %}

## Step 2: Let a merchant know if a customer has an enrolled instrument that is ready to pay

The merchant can call `hasEnrolledInstrument()` to [query whether the customer
is able to make a payment](/life-of-a-payment-transaction#ready-to-pay). You can
implement `IS_READY_TO_PAY` as an Android service to answer this query.

### `AndroidManifest.xml`

Declare your service with an intent filter with the action
`org.chromium.intent.action.IS_READY_TO_PAY`.

```xml
<service
  android:name=".SampleIsReadyToPayService"
  android:exported="true">
  <intent-filter>
    <action android:name="org.chromium.intent.action.IS_READY_TO_PAY" />
  </intent-filter>
</service>
```

The `IS_READY_TO_PAY` service is optional. If there's no such intent handler in
the payment app, then the web browser assumes that the app can always make
payments.

### AIDL

The API for the `IS_READY_TO_PAY` service is defined in AIDL. Create two AIDL
files with the following content:

{% Label %}app/src/main/aidl/org/chromium/IsReadyToPayServiceCallback.aidl{% endLabel %}

```kotlin
package org.chromium;
interface IsReadyToPayServiceCallback {
    oneway void handleIsReadyToPay(boolean isReadyToPay);
}
```

{% Label %}app/src/main/aidl/org/chromium/IsReadyToPayService.aidl{% endLabel %}

```kotlin
package org.chromium;
import org.chromium.IsReadyToPayServiceCallback;

interface IsReadyToPayService {
    oneway void isReadyToPay(IsReadyToPayServiceCallback callback);
}
```

### Implementing `IsReadyToPayService`

The simplest implementation of `IsReadyToPayService` is shown in the following
example:

```kotlin
class SampleIsReadyToPayService : Service() {
  private val binder = object : IsReadyToPayService.Stub() {
    override fun isReadyToPay(callback: IsReadyToPayServiceCallback?) {
      callback?.handleIsReadyToPay(true)
    }
  }

  override fun onBind(intent: Intent?): IBinder? {
    return binder
  }
}
```

### Parameters

Pass the following parameters to `onBind` as Intent extras:

* `methodNames`
* `methodData`
* `topLevelOrigin`
* `topLevelCertificateChain`
* `topLevelCertificateChain`
* `paymentRequestOrigin`

```kotlin
override fun onBind(intent: Intent?): IBinder? {
  val extras: Bundle? = intent?.extras
  // …
}
```

#### `methodNames`

The names of the methods being queried. The elements are the keys in the
`methodData` dictionary, and indicate the methods that the payment app supports.

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

A mapping from each entry of `methodNames` to the
[`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying).

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### `topLevelOrigin`

The merchant's origin without the scheme (the scheme-less origin of the
top-level browsing context). For example, `https://mystore.com/checkout` will be
passed as `mystore.com`.

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

The merchant's certificate chain (the certificate chain of the top-level
browsing context). Null for localhost and file on disk, which are both secure
contexts without SSL certificates. The certificate chain is necessary because a
payment app might have different trust requirements for websites.

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
```

Each `Parcelable` is a `Bundle` with a `"certificate"` key and a byte array
value.

```kotlin
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

The schemeless origin of the iframe browsing context that invoked the `new
PaymentRequest(methodData, details, options)` constructor in JavaScript. If the
constructor was invoked from the top-level context, then the value of this
parameter equals the value of `topLevelOrigin` parameter.

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

### Response

The service can send its response via `handleIsReadyToPay(Boolean)` method.

```kotlin
callback?.handleIsReadyToPay(true)
```

### Permission

You can use `Binder.getCallingUid()` to check who the caller is. Note that you
have to do this in the `isReadyToPay` method, not in the `onBind` method.

```kotlin
override fun isReadyToPay(callback: IsReadyToPayServiceCallback?) {
  try {
    val callingPackage = packageManager.getNameForUid(Binder.getCallingUid())
    // …
```

See [Verify the caller's signing certificate](#heading=h.czr8ye23zg2e) about how
to verify that the calling package has the right signature.

## Step 3: Let a customer make payment

The merchant calls `show()` to [launch the payment
app](/life-of-a-payment-transaction#step-4:-the-browser-launches-the-payment-app)
so the customer can make a payment. The payment app is invoked via an Android
intent `PAY` with transaction information in the intent parameters.

The payment app responds with `methodName` and `details`, which are payment app
specific and are opaque to the browser. The browser converts the `details`
string into a JavaScript object for the merchant via JSON deserialization, but
does not enforce any validity beyond that. The browser does not modify the
`details`; that parameter's value is passed directly to the merchant.

### `AndroidManifest.xml`

The activity with the `PAY` intent filter should have a `<meta-data>` tag [that
identifies the default payment method identifier for the
app](/setting-up-a-payment-method).

To support multiple payment methods, add a `<meta-data>` tag with a
`<string-array>` resource.

```xml
<activity
  android:name=".PaymentActivity"
  android:theme="@style/Theme.SamplePay.Dialog">
  <intent-filter>
    <action android:name="org.chromium.intent.action.PAY" />
  </intent-filter>

  <meta-data
    android:name="org.chromium.default_payment_method_name"
    android:value="https://bobpay.xyz/pay" />
  <meta-data
    android:name="org.chromium.payment_method_names"
    android:resource="@array/method_names" />
</activity>
```

The `resource` must be a list of strings, each of which must be a valid,
absolute URL with an HTTPS scheme as shown here.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string-array name="method_names">
        <item>https://alicepay.com/put/optional/path/here</item>
        <item>https://charliepay.com/put/optional/path/here</item>
    </string-array>
</resources>
```

### Parameters

The following parameters are passed to the activity as Intent extras:

* `methodNames`
* `methodData`
* `topLevelOrigin`
* `topLevelCertificateChain`
* `paymentRequestOrigin`
* `total`
* `modifiers`
* `paymentRequestId`

```kotlin
val extras: Bundle? = intent?.extras
```

#### methodNames

The names of the methods being used. The elements are the keys in the
`methodData` dictionary. These are the methods that the payment app supports.

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

A mapping from each of the `methodNames` to the
[`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying).

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### merchantName

The contents of the `<title>` HTML tag of the merchant's checkout page (the
browser's top-level browsing context).

```kotlin
val merchantName: String? = extras.getString("merchantName")
```

#### `topLevelOrigin`

The merchant's origin without the scheme (The scheme-less origin of the
top-level browsing context). For example, `https://mystore.com/checkout` is
passed as `mystore.com`.

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

The merchant's certificate chain (The certificate chain of the top-level
browsing context). Null for localhost and file on disk, which are both secure
contexts without SSL certificates. Each `Parcelable` is a Bundle with a
`certificate` key and a byte array value.

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

The scheme-less origin of the iframe browsing context that invoked the `new
PaymentRequest(methodData, details, options)` constructor in JavaScript. If the
constructor was invoked from the top-level context, then the value of this
parameter equals the value of `topLevelOrigin` parameter.

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

#### `total`

The JSON string representing the total amount of the transaction.

```kotlin
val total: String? = extras.getString("total")
```

Here's an example content of the string:

```kotlin
{"currency":"USD","value":"25.00"}
```

#### `modifiers`

The output of `JSON.stringify(details.modifiers)`, where `details.modifiers`
contain only `supportedMethods` and `total`.

#### `paymentRequestId`

The `PaymentRequest.id` field that "push-payment" apps should associate with the
transaction state. Merchant websites will use this field to query the
"push-payment" apps for the state of transaction out of band.

```kotlin
val paymentRequestId: String? = extras.getString("paymentRequestId")
```

### Response

The activity can send its response back through `setResult` with `RESULT_OK`.

```kotlin
setResult(Activity.RESULT_OK, Intent().apply {
  putExtra("methodName", "https://bobpay.xyz/pay")
  putExtra("details", "{\"token\": \"put-some-data-here\"}")
})
finish()
```

You must specify two parameters as Intent extras:

* `methodName`: The name of the method being used.
* `details`: JSON string containing information necessary for the merchant to
  complete the transaction. If success is `true`, then `details` must be
  constructed in such a way that `JSON.parse(details)` will succeed.

You can pass `RESULT_CANCELED` if the transaction was not completed in the
payment app, for example, if the user failed to type in the correct PIN code for
their account in the payment app. The browser may let the user choose a
different payment app.

```kotlin
setResult(RESULT_CANCELED)
finish()
```

If the activity result of a payment response received from the invoked payment
app is set to `RESULT_OK`, then Chrome will check for non-empty `methodName` and
`details` in its extras. If the validation fails Chrome will return a rejected
promise from `request.show()` with one of the following developer facing error
messages:

```js
'Payment app returned invalid response. Missing field "details".'
'Payment app returned invalid response. Missing field "methodName".'
```

### Permission

The activity can check the caller with its `getCallingPackage()` method.

```kotlin
val caller: String? = callingPackage
```

The final step is to verify the caller's signing certificate to confirm that the
calling package has the right signature.

## Step 4: Verify the caller's signing certificate

You can check the caller's package name with `Binder.getCallingUid()` in
`IS_READY_TO_PAY`, and with `Activity.getCallingPackage()` in `PAY`. In order to
actually verify that the caller is the browser you have in mind, you should
check its signing certificate and make sure that it matches with the correct
value.

If you're targeting API level 28 and above and are integrating with a browser
that has a single signing certificate, you can use
`PackageManager.hasSigningCertificate()`.

```kotlin
val packageName: String = … // The caller's package name
val certificate: ByteArray = … // The correct signing certificate.
val verified = packageManager.hasSigningCertificate(
  callingPackage,
  certificate,
  PackageManager.CERT_INPUT_SHA256
)
```

`PackageManager.hasSigningCertificate()` is preferred for single certificate
browsers, because it correctly handles certificate rotation. (Chrome has a
single signing certificate.) Apps that have multiple signing certificates cannot
rotate them.

If you need to support older API levels 27 and below, or if you need to handle
browsers with multiple signing certificates, you can use
`PackageManager.GET_SIGNATURES`.

```kotlin
val packageName: String = … // The caller's package name
val certificates: Set<ByteArray> = … // The correct set of signing certificates

val packageInfo = getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
val sha256 = MessageDigest.getInstance("SHA-256")
val signatures = packageInfo.signatures.map { sha256.digest(it.toByteArray()) }
val verified = signatures.size == certificates.size &&
    signatures.all { s -> certificates.any { it.contentEquals(s) } }
```
