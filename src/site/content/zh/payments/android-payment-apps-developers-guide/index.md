---
layout: post
title: Android 支付应用开发者指南
subhead: 了解如何调整 Android 支付应用以与 Web Payments 配合使用，并为客户提供更好的用户体验。
authors:
  - yaraki
  - agektmr
date: 2020-05-25
description: 了解如何调整 Android 支付应用以与 Web Payments 配合使用，并为客户提供更好的用户体验。
tags:
  - blog
  - payments
feedback:
  - api
---

[Payment Request API](https://www.w3.org/TR/payment-request/) 为 web 带来了一个基于浏览器的内置界面，允许用户比以往更轻松地输入所需的支付信息。该 API 还可以调用特定于平台的支付应用。

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>使用 Web Payments 的特定于平台的 Google 支付应用的结账流程。</figcaption></figure>

与仅使用 Android Intents 相比，Web Payments 可以更好地与浏览器、安全性和用户体验集成：

- 在商家网站的上下文中，支付应用作为模式启动。
- 实现是对现有支付应用的有益补充，使您能够充分利用用户群。
- 检查支付应用的签名以防止[旁加载](https://en.wikipedia.org/wiki/Sideloading)。
- 支付应用可以支持多种支付方式。
- 可以集成任意支付方式，例如加密货币、银行转账等。 Android 设备上的支付应用甚至可以集成需要访问设备硬件芯片的支付方法。

{% Aside %}要了解商家如何与支付应用集成，请查看[支付交易的生命周期](/life-of-a-payment-transaction/)。 {% endAside%}

在 Android 支付应用中实现 Web Payments 需要四个步骤：

1. 让商家发现您的支付应用。
2. 让商家知道客户是否有可以付款的注册工具（例如信用卡）。
3. 让客户付款。
4. 验证调用者的签名证书。

要查看 Web Payments 的实际效果，请查看 [android-web-payment](https://github.com/GoogleChromeLabs/android-web-payment/) 演示。

## 第 1 步：让商家发现您的支付应用

为了让商家使用您的支付应用，他们需要使用 [Payment Request API](https://developer.mozilla.org/docs/Web/API/Payment_Request_API) 并使用[支付方式标识符](https://www.w3.org/TR/payment-method-id/)指定您支持的支付方式。

如果您的支付应用使用唯一的付款方式标识符，那么您可以设置自己的[付款方式清单](https://w3c.github.io/payment-method-manifest/)，以便浏览器可以发现您的应用。

{% Aside %}要了解详细发现过程的工作原理以及如何设置新的付款方式，请查看[设置付款方式](/setting-up-a-payment-method)。 {% endAside %}

## 第 2 步：让商家知道客户是否有可以付款的注册工具

商户可以调用`hasEnrolledInstrument()`[查询客户是否可以付款](/life-of-a-payment-transaction#ready-to-pay)。您可以将`IS_READY_TO_PAY`作为 Android 服务实现来回答此查询。

### `AndroidManifest.xml`

使用带有`org.chromium.intent.action.IS_READY_TO_PAY`操作的意图过滤器声明您的服务。

```xml
<service
  android:name=".SampleIsReadyToPayService"
  android:exported="true">
  <intent-filter>
    <action android:name="org.chromium.intent.action.IS_READY_TO_PAY" />
  </intent-filter>
</service>
```

`IS_READY_TO_PAY`服务是可选项。如果支付应用中没有此类意图处理程序，那么 Web 浏览器会假定该应用始终可以进行支付。

### AIDL

`IS_READY_TO_PAY`服务的 API 在 AIDL 中定义。创建两个 AIDL 文件，其内容如下：

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

### 实现`IsReadyToPayService`

下面是`IsReadyToPayService`的最简单实现示例：

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

### 参数

请将以下参数作为 Intent extras 传递给`onBind`：

- `methodNames`
- `methodData`
- `topLevelOrigin`
- `topLevelCertificateChain`
- `topLevelCertificateChain`
- `paymentRequestOrigin`

```kotlin
override fun onBind(intent: Intent?): IBinder? {
  val extras: Bundle? = intent?.extras
  // …
}
```

#### `methodNames`

被查询的方法的名称。元素是`methodData`字典中的键，表明了支付应用支持的方法。

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

`methodNames`中每一项到[`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying)的映射。

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### `topLevelOrigin`

没有方案的商户来源（顶级浏览上下文的无方案来源）。例如，`https://mystore.com/checkout`将作为`mystore.com`传递。

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

商家的证书链（顶级浏览上下文的证书链）。对于本地主机和磁盘上的文件（均是没有 SSL 证书的安全上下文），要设为 null。证书链是必要的，因为支付应用可能对不同网站有不同的信任要求。

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
```

每个`Parcelable`都是一个带有`"certificate"`键和字节数组值的`Bundle`

```kotlin
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

在 JavaScript 中调用`new PaymentRequest(methodData, details, options)`构造函数的 iframe 浏览上下文的无方案起源。如果该构造函数是从顶级上下文调用的，那么此参数的值等于`topLevelOrigin`参数的值。

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

### 响应

该服务可以通过`handleIsReadyToPay(Boolean)`方法发送它的响应。

```kotlin
callback?.handleIsReadyToPay(true)
```

### 权限

您可以使用`Binder.getCallingUid()`来检查调用方是谁。请注意，您必须在`isReadyToPay`方法、而不是在`onBind`方法中执行此操作。

```kotlin
override fun isReadyToPay(callback: IsReadyToPayServiceCallback?) {
  try {
    val callingPackage = packageManager.getNameForUid(Binder.getCallingUid())
    // …
```

有关如何验证调用包是否具有正确签名的信息，请参阅[验证调用方的签名证书](#heading=h.czr8ye23zg2e)。

## 第 3 步：让客户付款

商家调用`show()` [启动支付应用，](/life-of-a-payment-transaction#launch)以便客户进行支付。支付应用通过 Android Intent `PAY`调用，并在 Intent 参数中包含交易信息。

支付应用使用`methodName`和`details`响应，这两个响应是支付应用特定的并且对浏览器不透明。浏览器会通过 JSON 反序列化将`details`字符串转换为商家的 JavaScript 对象，但除此之外并不会强制执行任何有效性。浏览器不会修改`details`；该参数的值将直接传递给商家。

### `AndroidManifest.xml`

使用了`PAY`意图过滤器的活动应该具有`<meta-data>`标记，用于[标识应用的默认付款方式标识符](/setting-up-a-payment-method)。

要支持多种支付方式，请添加带有`<string-array>`资源的`<meta-data>`标签。

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

`resource`必须是字符串列表，每个字符串都必须是一个有效的绝对 URL，使用 HTTPS 方案，如下所示。

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string-array name="method_names">
        <item>https://alicepay.com/put/optional/path/here</item>
        <item>https://charliepay.com/put/optional/path/here</item>
    </string-array>
</resources>
```

### 参数

以下参数将作为 Intent extras 传递给活动：

- `methodNames`
- `methodData`
- `topLevelOrigin`
- `topLevelCertificateChain`
- `paymentRequestOrigin`
- `total`
- `modifiers`
- `paymentRequestId`

```kotlin
val extras: Bundle? = intent?.extras
```

#### methodNames

正在使用的方法的名称。这些元素是`methodData`字典中的键。这些是支付应用支持的方法。

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

从每个`methodNames`到[`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying)的映射。

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### merchantName

商家结帐页面（浏览器的顶级浏览上下文）`<title>` HTML 标记的内容。

```kotlin
val merchantName: String? = extras.getString("merchantName")
```

#### `topLevelOrigin`

没有方案的商家来源（顶级浏览上下文的无方案来源）。例如， `https://mystore.com/checkout`会作为`mystore.com`传递。

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

商家的证书链（顶级浏览上下文的证书链）。对于本地主机和磁盘上的文件（均是没有 SSL 证书的安全上下文），要设为 null。每个`Parcelable`都是一个带有`certificate`键和字节数组值的 Bundle。

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

在 JavaScript 中调用`new PaymentRequest(methodData, details, options)`构造函数的 iframe 浏览上下文的无方案起源。如果该构造函数是从顶级上下文调用的，那么此参数的值等于`topLevelOrigin`参数的值。

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

#### `total`

表示交易总额的 JSON 字符串。

```kotlin
val total: String? = extras.getString("total")
```

这是字符串的示例内容：

```kotlin
{"currency":"USD","value":"25.00"}
```

#### `modifiers`

`JSON.stringify(details.modifiers)`的输出，其中`details.modifiers`仅包含`supportedMethods`和`total` 。

#### `paymentRequestId`

“推送支付”应用程序应与交易状态关联的`PaymentRequest.id`。商家网站将使用此字段查询“推送支付”应用的带外交易状态。

```kotlin
val paymentRequestId: String? = extras.getString("paymentRequestId")
```

### 响应

活动可以通过带有`RESULT_OK`的`setResult`发回它的响应。

```kotlin
setResult(Activity.RESULT_OK, Intent().apply {
  putExtra("methodName", "https://bobpay.xyz/pay")
  putExtra("details", "{\"token\": \"put-some-data-here\"}")
})
finish()
```

您必须将两个参数指定为 Intent extras：

- `methodName`：正在使用的方法的名称。
- `details`：包含商家用于完成交易所需的 JSON 字符串。如果交易成功，那么字符串是`true`，接着`details`的构建方式需要保证`JSON.parse(details)`会成功。

如果交易未在支付应用中完成，您可以传递`RESULT_CANCELED`，例如，如果用户未能在支付应用中输入正确的帐户 PIN 码。浏览器可以让用户选择不同的支付应用。

```kotlin
setResult(RESULT_CANCELED)
finish()
```

如果从被调用的支付应用收到的支付响应的活动结果设置为`RESULT_OK`，那么 Chrome 将检查非空的`methodName`和附加信息中的`details`。如果验证失败，Chrome 将从`request.show()`返回一个被拒绝的 promise，并带有以下开发人员将看到的的错误消息之一：

```js
'Payment app returned invalid response. Missing field "details".'
'Payment app returned invalid response. Missing field "methodName".'
```

### 权限

活动可以使用它的`getCallingPackage()`方法检查调用者。

```kotlin
val caller: String? = callingPackage
```

最后一步是验证调用者的签名证书，以确认调用包具有正确的签名。

## 第 4 步：验证调用者的签名证书

您可以通过`IS_READY_TO_PAY`中的`Binder.getCallingUid()`，以及`PAY`中的`Activity.getCallingPackage()`来检查调用者的包名称。为了确认调用者是您心目中的浏览器，应该检查其签名证书并确保它与正确的值匹配。

如果您的目标是 API 级别 28 及更高级别，并且正在与具有单个签名证书的浏览器集成，则可以使用`PackageManager.hasSigningCertificate()` 。

```kotlin
val packageName: String = … // The caller's package name
val certificate: ByteArray = … // The correct signing certificate.
val verified = packageManager.hasSigningCertificate(
  callingPackage,
  certificate,
  PackageManager.CERT_INPUT_SHA256
)
```

`PackageManager.hasSigningCertificate()`是单证书浏览器的首选，因为它可以正确处理证书轮换。（Chrome 具有单个签名证书。）具有多个签名证书的应用无法轮换它们。

如果您需要支持较旧的 API 级别 27 级更低级，或者需要处理具有多个签名证书的浏览器，则可以使用`PackageManager.GET_SIGNATURES` 。

```kotlin
val packageName: String = … // The caller's package name
val certificates: Set<ByteArray> = … // The correct set of signing certificates

val packageInfo = getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
val sha256 = MessageDigest.getInstance("SHA-256")
val signatures = packageInfo.signatures.map { sha256.digest(it.toByteArray()) }
val verified = signatures.size == certificates.size &&
    signatures.all { s -> certificates.any { it.contentEquals(s) } }
```
