---
layout: post
title: Providing shipping and contact information from Android payment app
subhead: |
  How to update your Android payment app to provide shipping address and payer's contact information with Web Payments APIs.
authors:
  - sahel
date: 2020-07-17
description: |
  Learn how to modify your Android payment app to provide the user's selected shipping address as well as contact information when the merchant has requested them via the Payment Request API.
tags:
  - payments
---

Entering shipping address and contact information through a web form can be a
cumbersome experience for customers. It can cause errors and lower conversion
rate.

That's why the Payment Request API supports a feature to request shipping
address and contact information. This provides multiple benefits:

* Users can pick the right address with just a few taps.    
* The address is always returned in [the standardized
  format](https://w3c.github.io/payment-request/#paymentaddress-interface).    
* Submitting an incorrect address is less likely.

Some browsers can provide address data form their autofill storage and make it
available through the browser's native UI. This functionality can also be
deferred to a payment app to offer a more unified payment experience. This is
called "delegation".

Whenever possible, Chrome delegates the collection of customer's shipping
address and contact information to the invoked Android payment app. The
delegation reduces the friction during checkout because user's installed payment
apps usually have more accurate information about their shipping address and
contact details.

{% Aside %}
Learn how to implement an Android native payment app in advance.
{% endAside %}

To add delegation support to an already existing Android native payment app,
implement the following four steps:

1.  Declare supported delegations.
2.  Parse `PAY` intent extras for required payment options.
3.  Provide required information in payment response.
4.  [Optional] Support dynamic flow:
    1.  Notify the merchant about changes in the user selected payment method,
        shipping address, or shipping option.
    2.  Receive updated payment details from the merchant (for example, the
        adjusted total amount based on the selected shipping option's cost).

## Declare supported delegations

The browser needs to know the list of additional information that your payment
app can provide so it can delegate the collection of that information to your
app. Declare the supported delegations as a `<meta-data>` in your app's
[AndroidManifest.xml](/android-payment-apps-overview/#androidmanifest.xml-2).

```xml
<activity
  android:name=".PaymentActivity"
  ...
  <meta-data
    android:name="org.chromium.payment_supported_delegations"
    android:resource="@array/supported_delegations" />
</activity>
```

The `resource` must be a list of strings chosen from the following valid values: 

```json
[ "payerName", "payerEmail", "payerPhone", "shippingAddress" ]
```

The following example can only provide a shipping address and the payer's email
address.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string-array name="supported_delegations">
    <item>payerEmail</item>
    <item>shippingAddress</item>
  </string-array>
</resources>
```

## Parse `PAY` intent extras for required payment options

The merchant can specify additional required information using the
[`paymentOptions`](https://www.w3.org/TR/payment-request/#paymentoptions-dictionary)
dictionary. Chrome will provide the list of required options that your app can
provide by passing the following parameters to the `PAY` activity as [Intent
extras](/android-payment-apps-overview/#parameters-2).

### `paymentOptions`

The subset of merchant specified payment options for which your app has declared
delegation support.

```kotlin
val paymentOptions: Bundle? = extras.getBundle("paymentOptions")
val requestPayerName: Boolean? = paymentOptions?.getBoolean("requestPayerName")
val requestPayerPhone: Boolean? = paymentOptions?.getBoolean("requestPayerPhone")
val requestPayerEmail: Boolean? = paymentOptions?.getBoolean("requestPayerEmail")
val requestShipping: Boolean? = paymentOptions?.getBoolean("requestShipping")
val shippingType: String? = paymentOptions.getString("shippingType")
```

It can include the following parameters:

* `requestPayerName` - The boolean indicating whether or not the payer's name
  is required.
* `requestPayerPhone` - The boolean indicating whether or not the payer's phone
  is required.
* `requestPayerEmail` - The boolean indicating whether or not the payer's email
  is required.
* `requestShipping` - The boolean indicating whether or not shipping information
  is required.
* `shippingType` - The string showing the type of shipping. Shipping type can be
  `"shipping"`, `"delivery"`, or `"pickup"`. Your app can use this hint in its
  UI when asking for the user's address or choice of shipping options.

### `shippingOptions` {: #shipping-options }

The parcelable array of merchant specified shipping options. This parameter will
only exist when `paymentOptions.requestShipping == true`.

```kotlin
val shippingOptions: List<ShippingOption>? =
    extras.getParcelableArray("shippingOptions")?.mapNotNull {
        p -> from(p as Bundle)
    }
```

Each shipping option is a `Bundle` with the following keys.

* `id`: The shipping option identifier.
* `label`: The shipping option label shown to the user.
* `amount`: The shipping cost bundle containing `currency` and `value` keys with
  string values.
    * `currency` shows the currency of the shipping cost, as an
      [ISO4217](https://www.iso.org/iso-4217-currency-codes.html) well-formed
      3-letter alphabet code
    * `value` shows the value of the shipping cost, as a [valid decimal monetary
      value](https://w3c.github.io/payment-request/#dfn-valid-decimal-monetary-value)
* `selected`: Whether or not the shipping option should be selected when the
  payment app displays the shipping options.

All keys other than the `selected` have string values. `selected` has a boolean
value.

```kotlin
val id: String = bundle.getString("id")
val label: String = bundle.getString("label")
val amount: Bundle = bundle.getBundle("amount")
val selected: Boolean = bundle.getBoolean("selected", false)
```

## Provide required information in payment response

Your app should include the required additional information in its response to
the `PAY`  activity.

To do so the following parameters must be specified as Intent extras:

* `payerName`: The payer's full name. This should be a non-empty string when
  `paymentOptions.requestPayerName` is true.
* `payerPhone`: The payer's phone number. This should be a non-empty string when
  `paymentOptions.requestPayerPhone` is true.
* `payerEmail`: The payer's email address. This should be a non-empty string
  when `paymentOptions.requestPayerEmail` is true.
* `shippingAddress`: The user provided shipping address. This should be a
  non-empty bundle when `paymentOptions.requestShipping` is true. The bundle
  should have the following keys which represent different parts in a [physical
  address](https://www.w3.org/TR/payment-request/#physical-addresses). {: #shipping-address}
    * `city`
    * `countryCode`
    * `dependentLocality`
    * `organization`
    * `phone`
    * `postalCode`
    * `recipient`
    * `region`
    * `sortingCode`
    All keys other than the `addressLine` have string values.
      The `addressLine` is an array of strings.
* `shippingOptionId`: The identifier of the user selected shipping option. This
  should be a non-empty string when `paymentOptions.requestShipping` is true.

###  Payment response validation

If the activity result of a payment response received from the invoked payment
app is set to `RESULT_OK`, then Chrome will check for required additional
information in its extras. If the validation fails Chrome will return a rejected
promise from `request.show()` with one of the following developer facing error
messages:

```json
'Payment app returned invalid response. Missing field "payerEmail".'
'Payment app returned invalid response. Missing field "payerName".'
'Payment app returned invalid response. Missing field "payerPhone".'
'Payment app returned invalid shipping address in response.'
'... is not a valid CLDR country code, should be 2 upper case letters [A-Z]'
'Payment app returned invalid response. Missing field "shipping option".'
```

Below is an example of a valid response:

```kotlin
fun Intent.populateRequestedPaymentOptions() {
    if (requestPayerName) {
        putExtra("payerName", "John Smith")
    }
    if (requestPayerPhone) {
        putExtra("payerPhone", "4169158200")
    }
    if (requestPayerEmail) {
        putExtra("payerEmail", "john.smith@gmail.com")
    }
    if(requestShipping) {
        val address: Bundle = Bundle()
        address.putString("countryCode", "CA")
        val addressLines: Array<String> =
                arrayOf<String>("111 Richmond st. West")
        address.putStringArray("addressLines", addressLines)
        address.putString("region", "Ontario")
        address.putString("city", "Toronto")
        address.putString("postalCode", "M5H2G4")
        address.putString("recipient", "John Smith")
        address.putString("phone", "4169158200")
        putExtra("shippingAddress", address)
        putExtra("shippingOptionId", "standard")
    }
}
```

## Optional: Support dynamic flow

Sometimes the total cost of a transaction increases when the user chooses the
express shipping option; or when the list of available shipping options or their
prices changes when the user chooses an international shipping address. When
your app provides the user selected shipping address or option, it should be
able to notify the merchant about any shipping address or option changes and
show the user the updated payment details (provided by the merchant).

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

    oneway void changeShippingOption(in String shippingOptionId,
            IPaymentDetailsUpdateServiceCallback callback);

    oneway void changeShippingAddress(in Bundle shippingAddress,
            IPaymentDetailsUpdateServiceCallback callback);
}
```

### Notify the merchant about changes in the user selected payment method, shipping address, or shipping option

```kotlin
private fun bind() {
    val intent = Intent()
    intent.setClassName(
        "org.chromium.chrome",
        "org.chromium.components.payments.PaymentDetailsUpdateService")
    intent.action = IPaymentDetailsUpdateService::class.java.name
    isBound = bindService(intent, mConnection, Context.BIND_AUTO_CREATE)
}

private val mConnection = object : ServiceConnection {
    override fun onServiceConnected(className: ComponentName, service: IBinder) {
        val service = IPaymentDetailsUpdateService.Stub.asInterface(service)
        try {
            if (isOptionChange) {
                service?.changeShippingOption(mSelectedOptionId, mCallback)
            } else (isAddressChange) {
                service?.changeShippingAddress(mSelectedAddress, mCallback)
            } else {
                service?.changePaymentMethod(mMethodData, mCallback)
            }
        } catch (e: RemoteException) {
            // Handle the remote exception
        }
    }
}
```

#### `changePaymentMethod`

Notifies the merchant about changes in user selected payment method. The
`paymentHandlerMethodData` bundle contains `methodName` and optional `details`
keys both with string values. Chrome will check for a non-empty bundle with a
non-empty `methodName` and send an `updatePaymentDetails` with one of the
following error messages via `callback.updateWith` if the validation fails.

```json
'Method data required.'
'Method name required.'
```

#### `changeShippingOption`

Notifies the merchant about changes in user selected shipping option.
`shippingOptionId` should be the identifier of one of the merchant specified
shipping options. Chrome will check for a non-empty `shippingOptionId` and send
an `updatePaymentDetails` with the following error message via
`callback.updateWith` if the validation fails.

```json
'Shipping option identifier required.'
```

#### `changeShippingAddress`

Notifies the merchant about changes in user provided shipping address. Chrome
will check for a non-empty `shippingAddress` bundle with a valid `countryCode`
and send an `updatePaymentDetails` with the following error message via
`callback.updateWith` if the validation fails.

```json
'Payment app returned invalid shipping address in response.'
```

#### Invalid state error message

If Chrome encounters an invalid state upon receiving any of the change requests
it will call `callback.updateWith` with a redacted `updatePaymentDetails`
bundle. The bundle will only contain the `error` key with `"Invalid state"`.
Examples of an invalid state are:

* When Chrome is still waiting for the merchant's response to a previous change
  (such as an ongoing change event).
* The payment app provided shipping option identifier does not belong to any of
  the merchant specified shipping options.

### Receive for the updated payment details from the merchant

```kotlin
private fun unbind() {
    if (isBound) {
        unbindService(mConnection)
        isBound = false
    }
}

private val mCallback: IPaymentDetailsUpdateServiceCallback =
    object : IPaymentDetailsUpdateServiceCallback.Stub() {
        override fun paymentDetailsNotUpdated() {
            // Payment request details have not changed.
            unbind()
        }

        override fun updateWith(updatedPaymentDetails: Bundle) {
            mUpdatedPaymentDetails = updatedPaymentDetails
            unbind()
        }
    }
```

`updatePaymentDetails` is the bundle equivalent to the
[`PaymentRequestDetailsUpdate`](https://w3c.github.io/payment-handler/#the-paymentrequestdetailsupdate)
WebIDL dictionary (after redacting the `modifiers` field) and contains the
following optional keys:

* `total` - A bundle containing `currency`  and `value` keys, both keys have
  string values
* `shippingOptions` - The parcelable array of [shipping
  options](#shipping-options)
* `error` - A string containing a generic error message (e.g. when
  changeShippingOption does not provide a valid shipping option identifier)
* `stringifiedPaymentMethodErrors` - A JSON string representing validation
  errors for the payment method
* `addressErrors` - A bundle with optional keys identical to [shipping
  address](#shipping-address) and string values. Each key represents a
  validation error related to its corresponding part of the shipping address.

An absent key means its value has not changed.
