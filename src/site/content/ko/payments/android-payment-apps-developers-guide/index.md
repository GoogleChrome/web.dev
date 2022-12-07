---
layout: post
title: Android 결제 앱 개발자 가이드
subhead: 웹 결제가 가능하도록 Android 결제 앱을 변경하여 고객에게 더 나은 사용자 경험을 제공하는 방법을 알아보세요.
authors:
  - yaraki
  - agektmr
date: 2020-05-25
description: 웹 결제가 가능하도록 Android 결제 앱을 변경하여 고객에게 더 나은 사용자 경험을 제공하는 방법을 알아보세요.
tags:
  - blog
  - payments
feedback:
  - api
---

[지불 요청 API](https://www.w3.org/TR/payment-request/)는 사용자가 그 어느 때보다 쉽게 필요한 지불 정보를 입력할 수 있도록 하는 내장 브라우저 기반 인터페이스를 웹에 제공합니다. API는 플랫폼 종속 결제 앱을 호출할 수도 있습니다.

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>웹 결제를 사용하는 플랫폼 종속 구글 페이 앱의 결제 흐름.</figcaption></figure>

Android 인텐트만 사용할 때와 비교해, 웹 결제 사용 시 사용 브라우저, 보안 및 사용자 경험을 더 잘 통합할 수 있습니다.

- 결제 앱은 판매자 웹사이트 환경에서 모달로 출시되었습니다.
- API의 구현은 기존 결제 앱을 보완하여 사용자 기반을 활용할 수 있게 해줍니다.
- [사이드로딩](https://en.wikipedia.org/wiki/Sideloading)을 방지하기 위해 결제 앱의 서명이 확인됩니다.
- 결제 앱은 다양한 결제 방식을 지원할 수 있습니다.
- 암호화폐, 은행 송금 등 모든 결제 수단을 통합할 수 있습니다. Android 기기의 결제 앱은 기기의 하드웨어 칩에 액세스해야 하는 방법을 통합할 수도 있습니다.

{% Aside %} 판매자가 결제 앱과 통합하는 방식을 이해하려면 [지불 거래의 수명](/life-of-a-payment-transaction/)을 확인하세요. {% endAside%}

Android 결제 앱에서 웹 결제를 구현하려면 4단계를 거쳐야 합니다.

1. 판매자가 귀하의 결제 앱을 찾도록 만듭니다.
2. 고객에게 결제할 준비가 된 등록된 수단(예: 신용 카드)이 있는지 판매자에게 알립니다.
3. 고객이 결제하도록 합니다.
4. 발신자의 서명 인증서를 확인합니다.

웹 결제가 실행되는 모습을 보려면 [안드로이드-웹-결제](https://github.com/GoogleChromeLabs/android-web-payment/) 데모를 확인하세요.

## 1단계: 판매자가 결제 앱을 찾도록 만들기

판매자가 결제 앱을 사용하려면 [결제 요청 API](https://developer.mozilla.org/docs/Web/API/Payment_Request_API)를 사용해야 하며, [결제 수단 식별자](https://www.w3.org/TR/payment-method-id/)를 사용하여 지원하는 결제 수단을 지정해야 합니다.

결제 앱에 고유한 결제 방법 식별자가 있는 경우 브라우저에서 앱을 검색할 수 있도록 자체적인 [결제 방식 매니페스트](https://w3c.github.io/payment-method-manifest/)를 설정할 수 있습니다.

{% Aside %} 검색 과정이 어떻게 작동하는지를 자세히 알고 새 결제 방식을 어떻게 설정하는지를 알려면 [결제 방식 설정하기](/setting-up-a-payment-method)를 확인해 보세요. {% endAside %}

## 2단계: 고객에게 결제할 준비가 된 등록된 수단이 있는지 판매자에게 알리기

판매자는 `hasEnrolledInstrument()`를 호출하여 [고객의 결제 가능 여부를 쿼리](/life-of-a-payment-transaction#ready-to-pay)할 수 있습니다. 이 쿼리에 답하기 위해 Android 서비스로 `IS_READY_TO_PAY`를 구현할 수 있습니다.

### `AndroidManifest.xml`

`org.chromium.intent.action.IS_READY_TO_PAY` 액션으로 인텐트 필터를 사용하여 서비스를 선언합니다.

```xml
<service
  android:name=".SampleIsReadyToPayService"
  android:exported="true">
  <intent-filter>
    <action android:name="org.chromium.intent.action.IS_READY_TO_PAY" />
  </intent-filter>
</service>
```

`IS_READY_TO_PAY` 서비스는 선택 사항입니다. 결제 앱에 이러한 인텐트 핸들러가 없으면 웹 브라우저는 앱이 항상 결제할 수 있다고 가정합니다.

### AIDL

`IS_READY_TO_PAY` 서비스를 위한 API는 AIDL에 정의되어 있습니다. 다음 내용으로 두 개의 AIDL 파일을 생성하십시오.

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

### `IsReadyToPayService` 구현하기

`IsReadyToPayService` 의 가장 간단한 구현은 다음 예시에 나타나 있습니다.

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

### 매개변수

다음 매개변수를 인텐트 엑스트라로 `onBind`에 전달:

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

쿼리 중인 메서드의 이름. 그 요소는 `methodData` 사전의 키이며 결제 앱이 지원하는 방식을 나타냅니다.

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

`methodNames`의 각 항목에서 [`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying)로 매핑.

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### `topLevelOrigin`

체계 없는 판매자의 출처(최상위 브라우징 컨텍스트의 체계 없는 출처). 예를 들어 `https://mystore.com/checkout`은 `mystore.com`으로 전달됩니다.

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

판매자의 인증서 체인(최상위 검색 컨텍스트의 인증서 체인). SSL 인증서 없이 안전한 컨텍스트인 로컬 호스트와 디스크에 있는 파일의 경우 null. 인증서 체인이 필요한 이유는 결제 앱이 웹사이트마다 다른 신뢰 요건을 가지고 있을 수 있기 때문입니다.

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
```

각 `Parcelable`은 `"certificate"` 키와 바이트 배열 값이 있는 `Bundle`입니다.

```kotlin
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

JavaScript의 `new PaymentRequest(methodData, details, options)` 생성자를 호출한 iframe 브라우징 컨텍스트의 체계 없는 출처. 만일 해당 생성자가 최상위 컨텍스트에서 호출되었다면, 이 매개 변수의 값은 `topLevelOrigin` 매개 변수의 값과 동일합니다.

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

### 응답

서비스는 `handleIsReadyToPay(Boolean)` 메서드를 통해 응답을 보낼 수 있습니다.

```kotlin
callback?.handleIsReadyToPay(true)
```

### 승인

`Binder.getCallingUid()`를 사용하여 호출자가 누구인지 확인할 수 있습니다. `onBind` 메서드가 아니라 `isReadyToPay` 메서드에서 이 작업을 수행해야 한다는 점에 유의하십시오.

```kotlin
override fun isReadyToPay(callback: IsReadyToPayServiceCallback?) {
  try {
    val callingPackage = packageManager.getNameForUid(Binder.getCallingUid())
    // …
```

호출 패키지에 올바른 서명이 있는지 확인하는 방법에 대해서는 [호출자의 서명 인증서 확인](#heading=h.czr8ye23zg2e)을 참조하십시오.

## 3단계: 고객이 결제하도록 하기

판매자는 `show()`를 호출하여 고객이 결제할 수 있도록 [결제 앱을 시작](/life-of-a-payment-transaction#launch)합니다. 결제 앱은 인텐트 매개 변수에 있는 거래 정보와 함께 Android 인텐트 `PAY`를 통해 호출됩니다.

결제 앱은 결제 앱에 종속되어 있고 브라우저에 노출되지 않는 `methodName` 및 `details`로 응답합니다. 브라우저는 `details` 문자열을 JSON 역직렬화를 통해 판매자의 JavaScript 개체로 변환하지만, 그 이상의 유효성은 적용하지 않습니다. 브라우저는 `details` 수정하지 않으며 해당 매개변수의 값은 판매자에게 직접 전달됩니다.

### `AndroidManifest.xml`

`PAY` 인텐트 필터가 있는 액티비티에는 [앱 용 디폴트 결제 방식 식별기를 확인](/setting-up-a-payment-method)하는 `<meta-data>` 태그가 있습니다.

다양한 지불 방식을 지원하려면 `<string-array>` 리소스와 함께 `<meta-data>` 태그를 추가하십시오.

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

`resource`는 문자열 목록이어야 하며, 각 문자열은 여기에 표시된 것처럼 HTTPS 체계를 사용하는 유효하고 완전한 URL이어야 합니다.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string-array name="method_names">
        <item>https://alicepay.com/put/optional/path/here</item>
        <item>https://charliepay.com/put/optional/path/here</item>
    </string-array>
</resources>
```

### 매개 변수

다음 매개 변수는 인텐트 엑스트라로 액티비티에 전달됩니다.

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

#### 메서드 이름

사용 중인 메서드의 이름. 그 요소는 `methodData` 사전의 키입니다. 결제 앱이 지원하는 메서드입니다.

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

각 `methodNames`에서 [`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying)로 매핑.

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### 판매자 이름

판매자 결제 페이지의 `<title>` HTML 태그의 내용(브라우저의 최상위 브라우징 컨텍스트).

```kotlin
val merchantName: String? = extras.getString("merchantName")
```

#### `topLevelOrigin`

체계가 없는 판매자의 출처(최상위 브라우징 컨텍스트의 체계 없는 출처). 예를 들어 `https://mystore.com/checkout`은 `mystore.com`으로 전달됩니다.

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

판매자의 인증서 체인(최상위 검색 컨텍스트의 인증서 체인). SSL 인증서가 없는 보안 컨텍스트인 localhost 및 디스크의 파일의 경우 Null. 각 `Parcelable`은  `certificate` 키와 바이트 배열 값을 가진 Bundle입니다.

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

JavaScript에서 `new PaymentRequest(methodData, details, options)` 생성자를 호출한 iframe 브라우징 컨텍스트의 체계 없는 출처입니다. 생성자가 최상위 컨텍스트에서 호출된 경우 이 매개변수의 값은 `topLevelOrigin` 매개변수의 값과 같습니다.

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

#### `total`

총 거래 금액을 나타내는 JSON 문자열.

```kotlin
val total: String? = extras.getString("total")
```

다음은 문자열 내용의 예시입니다.

```kotlin
{"currency":"USD","value":"25.00"}
```

#### `modifiers`

`JSON.stringify(details.modifiers)`의 출력, 여기서 `details.modifiers`에는 오직 `supportedMethods` 및 `total`만 포함됩니다.

#### `paymentRequestId`

'푸시 결제' 앱이 거래 상태와 연계되는 `PaymentRequest.id` 필드. 판매자 웹사이트는 대역 외 거래 상태를 위해 이 필드를 사용하여 '푸시 지불' 앱을 쿼리합니다.

```kotlin
val paymentRequestId: String? = extras.getString("paymentRequestId")
```

### 응답

이 액티비티는 `RESULT_OK`와 함께 `setResult`를 통해 응답을 다시 보낼 수 있습니다.

```kotlin
setResult(Activity.RESULT_OK, Intent().apply {
  putExtra("methodName", "https://bobpay.xyz/pay")
  putExtra("details", "{\"token\": \"put-some-data-here\"}")
})
finish()
```

인텐트 엑스트라로 두 개의 매개변수를 지정해야 합니다.

- `methodName` : 사용 중인 메서드의 이름.
- `details` : 판매자가 거래를 완료하는 데 필요한 정보가 포함된 JSON 문자열. 성공이 `true`라면, `JSON.parse(details)`가 성공하는 방식으로 `details`를 구성해야 합니다.

사용자가 결제 앱에서 계정에 대한 올바른 PIN 코드를 입력하지 못한 경우처럼 결제 앱에서 거래가 완료되지 않은 경우, `RESULT_CANCELED`를 전달할 수 있습니다. 브라우저는 사용자에게 다른 결제 앱을 고르도록 할 것입니다.

```kotlin
setResult(RESULT_CANCELED)
finish()
```

호출된 결제 앱에서 수신된 결제 응답의 액티비티 결과가 `RESULT_OK`로 설정된 경우, Chrome은 비어 있지 않은 `methodName` 및 `details`를 엑스트라에서 확인합니다. 유효성 검사가 실패하면 Chrome은 `request.show()`에서 개발자에게 출력되는 다음 오류 메시지 중 하나와 함께 거부된 프로미스를 반환합니다.

```js
'Payment app returned invalid response. Missing field "details".'
'Payment app returned invalid response. Missing field "methodName".'
```

### 승인

이 액티비티는 `getCallingPackage()` 메서드를 사용하여 호출자를 확인할 수 있습니다.

```kotlin
val caller: String? = callingPackage
```

마지막 단계는 호출자의 서명 인증서를 확인하여 호출 패키지에 올바른 서명이 있는지 확인하는 것입니다.

## 4단계: 호출자의 서명 인증서 확인하기

`IS_READY_TO_PAY`의  `Binder.getCallingUid()`와 `PAY`의 `Activity.getCallingPackage()`로 호출자의 패키지 이름을 확인할 수 있습니다. 호출자가 생각하는 그 브라우저가 맞는지 실제로 확인하려면 브라우저의 서명 인증서를 확인하고 올바른 값과 일치하는지 확인해야 합니다.

API level 28 이상을 대상으로 하고 단일 서명 인증서가 있는 브라우저와 통합하는 경우 `PackageManager.hasSigningCertificate()`을 사용할 수 있습니다.

```kotlin
val packageName: String = … // The caller's package name
val certificate: ByteArray = … // The correct signing certificate.
val verified = packageManager.hasSigningCertificate(
  callingPackage,
  certificate,
  PackageManager.CERT_INPUT_SHA256
)
```

`PackageManager.hasSigningCertificate()`는 인증서 로테이션을 올바르게 처리하기 때문에 단일 인증서 브라우저에 선호됩니다. (Chrome에는 단일 서명 인증서가 있습니다.) 여러 서명 인증서가 있는 앱은 인증서를 로테이션할 수 없습니다.

API level 27 이하를 지원해야 하거나 여러 서명 인증서가 있는 브라우저를 처리해야 한다면, `PackageManager.GET_SIGNATURES`를 사용할 수 있습니다.

```kotlin
val packageName: String = … // The caller's package name
val certificates: Set<ByteArray> = … // The correct set of signing certificates

val packageInfo = getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
val sha256 = MessageDigest.getInstance("SHA-256")
val signatures = packageInfo.signatures.map { sha256.digest(it.toByteArray()) }
val verified = signatures.size == certificates.size &&
    signatures.all { s -> certificates.any { it.contentEquals(s) } }
```
