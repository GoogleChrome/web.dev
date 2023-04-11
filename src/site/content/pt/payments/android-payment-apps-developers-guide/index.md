---
layout: post
title: Guia para desenvolvedores de aplicativos de pagamento Android
subhead: |2-

  Aprenda como adaptar seu aplicativo de pagamento Android para funcionar com o Web Payments e oferecer uma melhor experiência de usuário aos clientes.
authors:
  - yaraki
  - agektmr
date: 2020-05-25
description: |2-

  Aprenda como adaptar seu aplicativo de pagamento Android para funcionar com o Web Payments e oferecer uma melhor experiência de usuário aos clientes.
tags:
  - blog
  - payments
feedback:
  - api
---

A [API Payment Request](https://www.w3.org/TR/payment-request/) traz para a web uma interface baseada em navegador embutida que permite aos usuários inserir as informações de pagamento necessárias de um jeito mais fácil do que nunca. A API também pode invocar aplicativos de pagamento específicos da plataforma.

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Fluxo de checkout com o aplicativo Google Pay específico da plataforma que usa Web Payments.</figcaption></figure>

Comparado ao uso apenas de Android Intents, o Web Payments permite uma melhor integração com o navegador, segurança e experiência do usuário:

- O aplicativo de pagamento é lançado como modal, no contexto do site do comerciante.
- A implementação é complementar ao seu aplicativo de pagamento existente, permitindo que você tire proveito de sua base de usuários.
- A assinatura do aplicativo de pagamento é verificada para evitar o [sideload](https://en.wikipedia.org/wiki/Sideloading).
- Os aplicativos de pagamento podem oferecer suporte a vários métodos de pagamento.
- É possível integrar qualquer método de pagamento, como criptomoeda, transferências bancárias e muito mais. Os aplicativos de pagamento em dispositivos Android podem até mesmo integrar métodos que requerem acesso ao chip de hardware do dispositivo.

{% Aside %} Para entender como os comerciantes se integram aos aplicativos de pagamento, consulte [Vida de uma transação de pagamento](/life-of-a-payment-transaction/). {% endAside%}

São quatro etapas para implementar o Web Payments em um aplicativo de pagamento Android:

1. Deixe os comerciantes descobrirem seu aplicativo de pagamento.
2. Informe um comerciante se um cliente possui um instrumento inscrito (como um cartão de crédito) que está pronto para pagar.
3. Permita que um cliente faça o pagamento.
4. Verifique o certificado de assinatura do chamador.

Para ver o Web Payments em ação, confira a demonstração do [android-web-payment](https://github.com/GoogleChromeLabs/android-web-payment/).

## Etapa 1: Deixe que os comerciantes descubram seu aplicativo de pagamento

Para que um comerciante use seu aplicativo de pagamento, ele precisa usar a [API Payment Request](https://developer.mozilla.org/docs/Web/API/Payment_Request_API) e especificar a forma de pagamento que você aceita usando o [identificador da forma de pagamento](https://www.w3.org/TR/payment-method-id/).

Se você tiver um identificador de método de pagamento exclusivo para seu aplicativo de pagamento, poderá configurar seu próprio [manifesto de método de pagamento](https://w3c.github.io/payment-method-manifest/) para que os navegadores possam descobrir seu aplicativo.

{% Aside %} Para saber como funciona o processo de descoberta em detalhes e como configurar uma nova forma de pagamento, consulte [Configurando uma forma de pagamento](/setting-up-a-payment-method). {% endAside %}

## Etapa 2: Informe um comerciante se um cliente possui um instrumento inscrito que está pronto para pagar

O comerciante pode chamar `hasEnrolledInstrument()` para [perguntar se o cliente pode fazer um pagamento](/life-of-a-payment-transaction#ready-to-pay). Você pode implementar `IS_READY_TO_PAY` como um serviço Android para responder a esta consulta.

### `AndroidManifest.xml`

Declare seu serviço com um filtro de intent com a ação `org.chromium.intent.action.IS_READY_TO_PAY` .

```xml
<service
  android:name=".SampleIsReadyToPayService"
  android:exported="true">
  <intent-filter>
    <action android:name="org.chromium.intent.action.IS_READY_TO_PAY" />
  </intent-filter>
</service>
```

O `IS_READY_TO_PAY` é opcional. Se não houver um gerenciador de intent no aplicativo de pagamento, o navegador da Web pressupõe que o aplicativo sempre pode fazer pagamentos.

### AIDL

A API para o `IS_READY_TO_PAY` é definida em AIDL. Crie dois arquivos AIDL com o seguinte conteúdo:

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

### Implementando `IsReadyToPayService`

A implementação mais simples de `IsReadyToPayService` é mostrada no exemplo a seguir:

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

### Parâmetros

Passe os seguintes parâmetros para `onBind` como extras de Intent:

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

Os nomes dos métodos que estão sendo consultados. Os elementos são as chaves no `methodData` e indicam os métodos que o aplicativo de pagamento suporta.

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

Um mapeamento de cada entrada de `methodNames` ao [`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying).

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### `topLevelOrigin`

A origem do comerciante sem o esquema (a origem sem esquema do contexto de navegação de nível superior). Por exemplo, `https://mystore.com/checkout` será passado como `mystore.com`.

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

A cadeia de certificados do comerciante (a cadeia de certificados do contexto de navegação de nível superior). Nulo para localhost e arquivo em disco, que são contextos seguros sem certificados SSL. A cadeia de certificação é necessária porque um aplicativo de pagamento pode ter diferentes requisitos de confiança para sites.

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
```

Cada `Parcelable` é um `Bundle` com uma `"certificate"` e um valor de matriz de bytes.

```kotlin
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

A origem sem esquema do contexto de navegação do iframe que invocou o `new PaymentRequest(methodData, details, options)` em JavaScript. Se o construtor foi chamado a partir do contexto de nível superior, o valor desse parâmetro é igual ao valor do parâmetro `topLevelOrigin`

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

### Resposta

O serviço pode enviar sua resposta por meio do método `handleIsReadyToPay(Boolean)`

```kotlin
callback?.handleIsReadyToPay(true)
```

### Permissão

Você pode usar `Binder.getCallingUid()` para verificar quem é o chamador. Observe que você deve fazer isso no método `isReadyToPay`, não no método `onBind`

```kotlin
override fun isReadyToPay(callback: IsReadyToPayServiceCallback?) {
  try {
    val callingPackage = packageManager.getNameForUid(Binder.getCallingUid())
    // …
```

Consulte [Verificar o certificado de assinatura do chamador](#heading=h.czr8ye23zg2e) para saber como verificar se o pacote de chamada tem a assinatura correta.

## Etapa 3: Permita que um cliente faça o pagamento

O comerciante chama `show()` para [iniciar o aplicativo de pagamento](/life-of-a-payment-transaction#launch) para que o cliente possa fazer um pagamento. Invoca-se o aplicativo de pagamento por meio de uma intenção Android `PAY` com informações de transação nos parâmetros de intenção.

O aplicativo de pagamento responde com `methodName` e `details`, que são específicos do aplicativo de pagamento e invisíveis ao navegador. O navegador converte a string `details` em um objeto JavaScript para o comerciante por meio da desserialização JSON, mas não impõe nenhuma validade além disso. O navegador não modifica os `details`; o valor desse parâmetro passa diretamente para o comerciante.

### `AndroidManifest.xml`

A atividade com o filtro de intenção `PAY` deve ter uma tag `<meta-data>` [que identifica o identificador da forma de pagamento padrão do aplicativo](/setting-up-a-payment-method).

Para oferecer suporte a vários métodos de pagamento, adicione uma `<meta-data>` com um recurso `<string-array>`.

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

O `resource` deve ser uma lista de strings, cada uma das quais deve ser um URL válido e absoluto com um esquema HTTPS, conforme aqui mostrado.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string-array name="method_names">
        <item>https://alicepay.com/put/optional/path/here</item>
        <item>https://charliepay.com/put/optional/path/here</item>
    </string-array>
</resources>
```

### Parâmetros

Os seguintes parâmetros são passados para a atividade como extras de Intent:

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

Os nomes dos métodos usados. Os elementos são as chaves no dicionário `methodData` Esses são os métodos que o aplicativo de pagamento suporta.

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

Um mapeamento a partir de cada um dos `methodNames` para o [`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying) .

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### merchantName

O conteúdo da `<title>` da página de checkout do comerciante (o contexto de navegação de nível superior do navegador).

```kotlin
val merchantName: String? = extras.getString("merchantName")
```

#### `topLevelOrigin`

A origem do comerciante sem o esquema (A origem sem esquema do contexto de navegação de nível superior). Por exemplo, `https://mystore.com/checkout` é passado como `mystore.com`.

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

A cadeia de certificados do comerciante (a cadeia de certificados do contexto de navegação de nível superior). Nulo para localhost e arquivo em disco, que são contextos seguros sem certificados SSL. Cada `Parcelable` é um Bundle com uma `certificate` e um valor de matriz de bytes.

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

A origem sem esquema do contexto de navegação do iframe que invocou o `new PaymentRequest(methodData, details, options)` em JavaScript. Se o construtor foi chamado a partir do contexto de nível superior, o valor desse parâmetro é igual ao valor do parâmetro `topLevelOrigin`.

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

#### `total`

A string JSON que representa o valor total da transação.

```kotlin
val total: String? = extras.getString("total")
```

Aqui está um exemplo de conteúdo da string:

```kotlin
{"currency":"USD","value":"25.00"}
```

#### `modifiers`

A saída de `JSON.stringify(details.modifiers)` , em que `details.modifiers` contém apenas `supportedMethods` e `total`.

#### `paymentRequestId`

O `PaymentRequest.id` que os aplicativos de "pagamento push" devem associar ao estado da transação. Os sites de comerciantes usarão este campo para consultar os aplicativos de "pagamento automático" para o estado da transação fora da banda.

```kotlin
val paymentRequestId: String? = extras.getString("paymentRequestId")
```

### Resposta

A atividade pode enviar sua resposta de volta por `setResult` com `RESULT_OK`.

```kotlin
setResult(Activity.RESULT_OK, Intent().apply {
  putExtra("methodName", "https://bobpay.xyz/pay")
  putExtra("details", "{\"token\": \"put-some-data-here\"}")
})
finish()
```

Você deve especificar dois parâmetros como extras de Intent:

- `methodName`: o nome do método usado.
- `details`: string JSON contendo as informações necessárias para o comerciante concluir a transação. Se o sucesso for `true`, os `details` devem ser construídos de forma que `JSON.parse(details)` seja bem-sucedido.

Você pode passar `RESULT_CANCELED` se a transação não foi concluída no aplicativo de pagamento, por exemplo, se o usuário não conseguiu digitar o código PIN correto para sua conta no aplicativo de pagamento. O navegador pode permitir que o usuário escolha um aplicativo de pagamento diferente.

```kotlin
setResult(RESULT_CANCELED)
finish()
```

Se o resultado da atividade de uma resposta a pagamento recebida do aplicativo de pagamento for definida como `RESULT_OK`, então o Chrome irá verificar se há `methodName` e `details` não vazios em seus extras. Se a validação falhar, o Chrome retornará uma promessa rejeitada de `request.show()` com uma das seguintes mensagens de erro para o desenvolvedor:

```js
'Payment app returned invalid response. Missing field "details".'
'Payment app returned invalid response. Missing field "methodName".'
```

### Permissão

A atividade pode verificar o chamador com seu método `getCallingPackage()`

```kotlin
val caller: String? = callingPackage
```

A etapa final é verificar o certificado de assinatura do chamador para confirmar se o pacote de chamada tem a assinatura correta.

## Etapa 4: verificar o certificado de assinatura do autor da chamada

Você pode verificar o nome do pacote do chamador com `Binder.getCallingUid()` em `IS_READY_TO_PAY` e com `Activity.getCallingPackage()` em `PAY`. Para realmente verificar se o chamador é o navegador que você tem em mente, verifique o certificado de assinatura e certifique-se de que corresponde ao valor correto.

Se você tem como objetivo a API de nível 28 e superior e está se integrando a um navegador que tem um único certificado de assinatura, você pode usar `PackageManager.hasSigningCertificate()` .

```kotlin
val packageName: String = … // O nome do pacote do chamador
val certificate: ByteArray = … // O certificado de assinatura correto.
val verified = packageManager.hasSigningCertificate(
  callingPackage,
  certificate,
  PackageManager.CERT_INPUT_SHA256
)
```

`PackageManager.hasSigningCertificate()` é o preferido para navegadores de certificado único, porque lida corretamente com a rotação de certificados. (O Chrome tem um único certificado de assinatura.) Aplicativos que possuem vários certificados de assinatura não podem girá-los.

Se você precisar oferecer suporte a níveis de API mais antigos 27 e abaixo, ou se precisar lidar com navegadores com vários certificados de assinatura, você pode usar `PackageManager.GET_SIGNATURES`.

```kotlin
val packageName: String = … // The caller's package name
val certificates: Set<ByteArray> = … // The correct set of signing certificates

val packageInfo = getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
val sha256 = MessageDigest.getInstance("SHA-256")
val signatures = packageInfo.signatures.map { sha256.digest(it.toByteArray()) }
val verified = signatures.size == certificates.size &&
    signatures.all { s -> certificates.any { it.contentEquals(s) } }
```
