---
layout: post
title: Support payment method change from an Android payment app
subhead: |
  How to update your Android payment app to support payment method change with Web Payments APIs.
authors:
  - sahel
date: 2020-07-17
updated: 2021-09-14
description: |
  Learn how to modify your Android payment app to provide the payment method change when the merchant has requested them via the Payment Request API.
tags:
  - payments
feedback:
  - api
---

{% Aside 'warning' %}

Shipping and address support in [the Payment Request API is removed from the
specification](https://github.com/w3c/payment-request/pull/955) and is no longer
functional in Android payment apps.

{% endAside %}

{% Aside %}
Learn how to implement an [Android payment
app](/android-payment-apps-developers-guide/) in advance.
{% endAside %}

Sometimes the total cost of a transaction increases, such as when the user
chooses a payment method that offers discount. When your app provides the
user-selected payment method, it should be able to notify the merchant about any
changes and show the user the updated payment details (provided by the
merchant).

### AIDL

To notify the merchant about new changes use the `PaymentDetailsUpdateService`
service declared in Chrome's AndroidManifest.xml. To use this service create two
AIDL files with the following content:

{% Label %}app/src/main/aidl/org/chromium/components/payments/IPaymentDetailsUpdateService{% endLabel %}

```kotlin
package org.chromium.components.payments;
import android.os.Bundle;

interface IPaymentDetailsUpdateServiceCallback {
    oneway void updateWith(in Bundle updatedPaymentDetails);

    oneway void paymentDetailsNotUpdated();
}
```

{% Label %}app/src/main/aidl/org/chromium/components/payments/IPaymentDetailsUpdateServiceCallback{% endLabel %}

```kotlin
package org.chromium.components.payments;
import android.os.Bundle;
import org.chromium.components.payments.IPaymentDetailsUpdateServiceCallback;

interface IPaymentDetailsUpdateService {
    oneway void changePaymentMethod(in Bundle paymentHandlerMethodData,
            IPaymentDetailsUpdateServiceCallback callback);
}
```

### Notify the merchant about changes in the user selected payment method

```kotlin
private fun bind() {
    // The action is introduced in Chrome version 92, which supports the service in Chrome
    // and other browsers (e.g., WebLayer).
    val newIntent = Intent("org.chromium.intent.action.UPDATE_PAYMENT_DETAILS")
        .setPackage(callingBrowserPackage)
    if (packageManager.resolveService(newIntent, PackageManager.GET_RESOLVED_FILTER) == null) {
        // Fallback to Chrome-only approach.
        newIntent.setClassName(
            callingBrowserPackage,
            "org.chromium.components.payments.PaymentDetailsUpdateService")
        newIntent.action = IPaymentDetailsUpdateService::class.java.name
    }
    isBound = bindService(newIntent, connection, Context.BIND_AUTO_CREATE)
}

private val connection = object : ServiceConnection {
    override fun onServiceConnected(className: ComponentName, service: IBinder) {
        val service = IPaymentDetailsUpdateService.Stub.asInterface(service)
        try {
            service?.changePaymentMethod(methodData, callback)
        } catch (e: RemoteException) {
            // Handle the remote exception
        }
    }
}
```
The `callingPackageName` used for the service's start intent can have one of the
following values depending on the browser that has initiated the payment
request.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Chrome Channel</th>
        <th>Package Name</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Stable</td>
        <td>
          <code>"com.android.chrome"</code>
        </td>
      </tr>
      <tr>
        <td>Beta</td>
        <td>
          <code>"com.chrome.beta"</code>
        </td>
      </tr>
      <tr>
        <td>Dev</td>
        <td>
          <code>"com.chrome.dev"</code>
        </td>
      </tr>
      <tr>
        <td>Canary</td>
        <td>
          <code>"com.chrome.canary"</code>
        </td>
      </tr>
      <tr>
        <td>Chromium</td>
        <td>
          <code>"org.chromium.chrome"</code>
        </td>
      </tr>
      <tr>
        <td>Google Quick Search Box (a WebLayer embedder)</td>
        <td>
          <code>"com.google.android.googlequicksearchbox"</code>
        </td>
      </tr>
    </tbody>
  </table>
</div>

#### `changePaymentMethod`

Notifies the merchant about changes in the user-selected payment method. The
`paymentHandlerMethodData` bundle contains `methodName` and optional `details`
keys both with string values. Chrome will check for a non-empty bundle with a
non-empty `methodName` and send an `updatePaymentDetails` with one of the
following error messages via `callback.updateWith` if the validation fails.

```json
'Method data required.'
'Method name required.'
```

#### Invalid state error message

If Chrome encounters an invalid state upon receiving any of the change requests
it will call `callback.updateWith` with a redacted `updatePaymentDetails`
bundle. The bundle will only contain the `error` key with `"Invalid state"`. For
example, when Chrome is still waiting for the merchant's response to a previous
change (such as an ongoing change event).

### Receive updated payment details from the merchant

```kotlin
private fun unbind() {
    if (isBound) {
        unbindService(connection)
        isBound = false
    }
}

private val callback: IPaymentDetailsUpdateServiceCallback =
    object : IPaymentDetailsUpdateServiceCallback.Stub() {
        override fun paymentDetailsNotUpdated() {
            // Payment request details have not changed.
            unbind()
        }

        override fun updateWith(updatedPaymentDetails: Bundle) {
            newPaymentDetails = updatedPaymentDetails
            unbind()
        }
    }
```

`updatePaymentDetails` is the bundle equivalent to the
[`PaymentRequestDetailsUpdate`](https://w3c.github.io/payment-handler/#the-paymentrequestdetailsupdate)
[WebIDL](https://www.w3.org/TR/WebIDL-1/) dictionary (after redacting the
`modifiers` field) and contains the following optional keys:

* `total` - A bundle containing `currency`  and `value` keys, both keys have
  string values
* `error` - A string containing a generic error message (e.g. when
* `stringifiedPaymentMethodErrors` - A JSON string representing validation
  errors for the payment method

An absent key means its value has not changed.
