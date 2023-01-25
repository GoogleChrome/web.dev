---
layout: post
title: Guía para desarrolladores de aplicaciones de pago en Android
subhead: Aprenda a adaptar su aplicación de pago en Android para que funcione con pagos web y le brinde una mejor experiencia de usuario a los clientes.
authors:
  - yaraki
  - agektmr
date: 2020-05-25
description: Aprenda a adaptar su aplicación de pago en Android para que funcione con pagos web y le brinde una mejor experiencia de usuario a los clientes.
tags:
  - blog
  - payments
feedback:
  - api
---

La [API de solicitud de pago](https://www.w3.org/TR/payment-request/) le aporta a la web una interfaz integrada basada en el navegador que permite que los usuarios ingresen la información de pago requerida de manera más fácil que nunca. La API también puede invocar aplicaciones de pago específicas de la plataforma.

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/native-payment-app.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Flujo de pago con la aplicación Google Pay específica de la plataforma que utiliza pagos web.</figcaption></figure>

En comparación con el uso solo de los intentos Android, los pagos web permiten una mejor integración con el navegador, la seguridad y la experiencia del usuario:

- La aplicación de pago se lanza como modal, en el contexto del sitio web del comerciante.
- La implementación es complementaria a su aplicación de pago existente, lo que le permite aprovechar su base de usuarios.
- Se verifica la firma de la aplicación de pago para evitar [transferencias](https://en.wikipedia.org/wiki/Sideloading).
- Las aplicaciones de pago pueden admitir varios métodos de pago.
- Se puede integrar cualquier método de pago, como criptomonedas, transferencias bancarias y más. Las aplicaciones de pago en dispositivos Android pueden incluso integrar métodos que requieren acceso al chip de hardware en el dispositivo.

{% Aside %} Para comprender cómo los comerciantes se integran con las aplicaciones de pago, consulte el documento [Duración de una transacción de pago](/life-of-a-payment-transaction/). {% endAside%}

Se necesitan cuatro pasos para implementar los pagos web en una aplicación de pago Android:

1. Dejar que los comerciantes descubran su aplicación de pago.
2. Informarle a un comerciante si un cliente tiene un instrumento registrado (como una tarjeta de crédito) que está listo para el pago.
3. Dejar que el cliente realice el pago.
4. Verificar el certificado de firma de la persona que llama.

Para ver los pagos web en acción, consulte la demostración de [pagos web de Android](https://github.com/GoogleChromeLabs/android-web-payment/).

## Paso 1: permitir que los comerciantes descubran su aplicación de pago

Para que un comerciante utilice su aplicación de pago, debe utilizar la [API de solicitud de pago](https://developer.mozilla.org/docs/Web/API/Payment_Request_API) y especificar el método de pago que admite mediante el [identificador del método de pago](https://www.w3.org/TR/payment-method-id/).

Si tiene un identificador de método de pago exclusivo para su aplicación de pago, puede configurar su propio [manifiesto de método de pago](https://w3c.github.io/payment-method-manifest/) para que los navegadores puedan descubrir su aplicación.

{% Aside %} Para saber cómo funciona el proceso de descubrimiento en detalle y cómo configurar un nuevo método de pago, consulte [Configuración de un método de pago](/setting-up-a-payment-method). {% endAside %}

## Paso 2: informarle a un comerciante si un cliente tiene un instrumento registrado que está listo para el pago

El comerciante puede invocar a `hasEnrolledInstrument()` para [consultar si el cliente puede realizar un pago](/life-of-a-payment-transaction#ready-to-pay). Usted puede implementar `IS_READY_TO_PAY` como un servicio de Android para responder a dicha consulta.

### `AndroidManifest.xml`

Declare su servicio con un filtro de intención con la acción `org.chromium.intent.action.IS_READY_TO_PAY`.

```xml
<service
  android:name=".SampleIsReadyToPayService"
  android:exported="true">
  <intent-filter>
    <action android:name="org.chromium.intent.action.IS_READY_TO_PAY" />
  </intent-filter>
</service>
```

El servicio `IS_READY_TO_PAY` es opcional. Si no existe tal controlador de intención en la aplicación de pago, entonces el navegador web asume que la aplicación siempre puede realizar pagos.

### AIDL

La API para el servicio `IS_READY_TO_PAY` se define en AIDL. Cree dos archivos AIDL con el siguiente contenido:

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

### Implementación de `IsReadyToPayService`

La implementación más simple de `IsReadyToPayService` se muestra en el siguiente ejemplo:

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

### Parámetros

Pásele los siguientes parámetros a `onBind` como adicionales de intención:

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

Estos son los nombres de los métodos que se consultan. Los elementos son las claves en el diccionario `methodData` e indican los métodos que admite la aplicación de pago.

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

Es un mapeo de cada entrada del parámetro `methodNames` en el parámetro [`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying).

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### `topLevelOrigin`

Es el origen del comerciante sin el esquema (el origen sin esquema del contexto de navegación de nivel superior). Por ejemplo, `https://mystore.com/checkout` se pasará como `mystore.com`.

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

Es la cadena de certificados del comerciante (la cadena de certificados del contexto de navegación de nivel superior). Tiene valor nulo para localhost y archivo en disco, que son contextos seguros sin certificados SSL. La cadena de certificados es necesaria porque una aplicación de pago puede tener diferentes requisitos de confianza para los sitios web.

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
```

Cada `Parcelable` es un `Bundle` con una clave `"certificate"` y un valor de matriz de bytes.

```kotlin
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

Es el origen sin esquema del contexto de navegación del iframe que invocó al constructor `new PaymentRequest(methodData, details, options)` en JavaScript. Si el constructor fue invocado desde el contexto de nivel superior, entonces el valor de este parámetro es igual al valor del parámetro `topLevelOrigin`.

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

### Respuesta

El servicio puede enviar su respuesta a través del método `handleIsReadyToPay(Boolean)`.

```kotlin
callback?.handleIsReadyToPay(true)
```

### Permisos

Puede utilizar `Binder.getCallingUid()` para comprobar quién hizo la invocación. Tenga en cuenta que debe hacer esto en el método `isReadyToPay`, no en el método `onBind`.

```kotlin
override fun isReadyToPay(callback: IsReadyToPayServiceCallback?) {
  try {
    val callingPackage = packageManager.getNameForUid(Binder.getCallingUid())
    // …
```

Consulte [Verificar el certificado de firma de quien hizo la invocación](#heading=h.czr8ye23zg2e) para saber cómo verificar que el paquete que hace la invocación tenga la firma correcta.

## Paso 3: dejar que un cliente realice el pago

El comerciante invoca a `show()` para [iniciar la aplicación de pago](/life-of-a-payment-transaction#launch) para que el cliente pueda realizar un pago. La aplicación de pago se invoca a través de un intento `PAY` de Android con información de la transacción en los parámetros de intención.

La aplicación de pago responde con el nombre del `methodName` y la cadena `details`, que son específicos de la aplicación de pago y son opacos para el navegador. El navegador convierte la cadena `details` en un objeto JavaScript para el comerciante a través de la deserialización JSON, pero no aplica ninguna validez más allá de eso. El navegador no modifica los `details`; el valor de ese parámetro se le pasa directamente al comerciante.

### `AndroidManifest.xml`

La actividad con el filtro de intención `PAY` debe tener una etiqueta `<meta-data>`[que identifique el identificador de método de pago predeterminado para la aplicación](/setting-up-a-payment-method).

Para admitir varios métodos de pago, agregue una etiqueta `<meta-data>` con un recurso `<string-array>`.

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

El parámetro `resource` debe ser una lista de cadenas, cada una de las cuales debe ser una URL absoluta válida con un esquema HTTPS como se muestra a continuación.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string-array name="method_names">
        <item>https://alicepay.com/put/optional/path/here</item>
        <item>https://charliepay.com/put/optional/path/here</item>
    </string-array>
</resources>
```

### Parámetros

Los siguientes parámetros se pasan a la actividad como extras de intención:

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

Contiene los nombres de los métodos que se utilizan. Los elementos son las claves en el diccionario `methodData`. Estos son los métodos que admite la aplicación de pago.

```kotlin
val methodNames: List<String>? = extras.getStringArrayList("methodNames")
```

#### `methodData`

Es un mapeo de cada uno de los `methodNames` hacia el [`methodData`](https://w3c.github.io/payment-request/#declaring-multiple-ways-of-paying).

```kotlin
val methodData: Bundle? = extras.getBundle("methodData")
```

#### merchantName

El contenido de la etiqueta HTML `<title>` de la página de pago del comerciante (el contexto de navegación de nivel superior del navegador).

```kotlin
val merchantName: String? = extras.getString("merchantName")
```

#### `topLevelOrigin`

Es el origen del comerciante sin el esquema (El origen sin esquema del contexto de navegación de nivel superior). Por ejemplo, `https://mystore.com/checkout` se pasa como `mystore.com`.

```kotlin
val topLevelOrigin: String? = extras.getString("topLevelOrigin")
```

#### `topLevelCertificateChain`

Es la cadena de certificados del comerciante (la cadena de certificados del contexto de navegación de nivel superior). Tiene un valor nulo para localhost y archivo en disco, que son contextos seguros sin certificados SSL. Cada `Parcelable` es un paquete con una clave `certificate` y un valor de matriz de bytes.

```kotlin
val topLevelCertificateChain: Array<Parcelable>? =
    extras.getParcelableArray("topLevelCertificateChain")
val list: List<ByteArray>? = topLevelCertificateChain?.mapNotNull { p ->
  (p as Bundle).getByteArray("certificate")
}
```

#### `paymentRequestOrigin`

Es el origen sin esquema del contexto de navegación del iframe que invocó al constructor `new PaymentRequest(methodData, details, options)` en JavaScript. Si el constructor fue invocado desde el contexto de nivel superior, entonces el valor de este parámetro es igual al valor del parámetro `topLevelOrigin`.

```kotlin
val paymentRequestOrigin: String? = extras.getString("paymentRequestOrigin")
```

#### `total`

Es la cadena JSON que representa el monto total de la transacción.

```kotlin
val total: String? = extras.getString("total")
```

Éste es un ejemplo de contenido de la cadena:

```kotlin
{"currency":"USD","value":"25.00"}
```

#### `modifiers`

Es la salida de `JSON.stringify(details.modifiers)`, donde `details.modifiers` contiene solamente `supportedMethods` y `total`.

#### `paymentRequestId`

Es el campo `PaymentRequest.id` que las aplicaciones de "pago automático" deben asociar con el estado de la transacción. Los sitios web de los comerciantes utilizarán este campo para consultar las aplicaciones de "pago automático" para conocer el estado de la transacción fuera de banda.

```kotlin
val paymentRequestId: String? = extras.getString("paymentRequestId")
```

### Respuesta

La actividad puede enviar su respuesta a través de `setResult` con `RESULT_OK`.

```kotlin
setResult(Activity.RESULT_OK, Intent().apply {
  putExtra("methodName", "https://bobpay.xyz/pay")
  putExtra("details", "{\"token\": \"put-some-data-here\"}")
})
finish()
```

Debe especificar dos parámetros como extras de intención:

- `methodName`: es el nombre del método que se está utilizando.
- `details`: es la cadena JSON que contiene la información necesaria para que el comerciante complete la transacción. Si el éxito es `true`, entonces el parámetro `details` debe construirse de tal manera que `JSON.parse(details)` tenga éxito.

Puede pasar el parámetro `RESULT_CANCELED` si la transacción no se completó en la aplicación de pago, por ejemplo, si el usuario no ingresó el código PIN correcto para su cuenta en la aplicación de pago. El navegador puede permitir al usuario elegir una aplicación de pago diferente.

```kotlin
setResult(RESULT_CANCELED)
finish()
```

Si el resultado de la actividad de una respuesta de pago recibida de la aplicación de pago invocada se establece en `RESULT_OK`, Chrome comprobará que los parámetros `methodName` y `details` no estén vacíos en sus extras. Si la validación falla, Chrome devolverá una promesa rechazada desde `request.show()` con uno de los siguientes mensajes de error que se le muestran al desarrollador:

```js
'Payment app returned invalid response. Missing field "details".'
'Payment app returned invalid response. Missing field "methodName".'
```

### Permisos

La actividad puede verificar a quien invoca con su método `getCallingPackage()`.

```kotlin
val caller: String? = callingPackage
```

El último paso es verificar el certificado de firma de quien invoca para confirmar que el paquete que invoca tiene la firma correcta.

## Paso 4: verificar el certificado de firma de quien invoca

Puede verificar el nombre del paquete de quien invoca con `Binder.getCallingUid()` en `IS_READY_TO_PAY` y con `Activity.getCallingPackage()` en `PAY`. Para verificar realmente que quien invoca sea el navegador que tiene en mente, debe verificar su certificado de firma y comprobar que coincida con el valor correcto.

Si tiene como objetivo el nivel de API 28 y superiores, y se está integrando con un navegador que tiene un solo certificado de firma, puede usar `PackageManager.hasSigningCertificate()`.

```kotlin
val packageName: String = … // The caller's package name
val certificate: ByteArray = … // The correct signing certificate.
val verified = packageManager.hasSigningCertificate(
  callingPackage,
  certificate,
  PackageManager.CERT_INPUT_SHA256
)
```

`PackageManager.hasSigningCertificate()` se prefiere para navegadores de certificados únicos, ya que maneja correctamente la rotación de certificados. (Chrome tiene un solo certificado de firma). Las aplicaciones que tienen varios certificados de firma no pueden rotarlos.

Si necesita admitir niveles de API anteriores 27 e inferiores, o si necesita manejar navegadores con varios certificados de firma, puede usar `PackageManager.GET_SIGNATURES`.

```kotlin
val packageName: String = … // The caller's package name
val certificates: Set<ByteArray> = … // The correct set of signing certificates

val packageInfo = getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
val sha256 = MessageDigest.getInstance("SHA-256")
val signatures = packageInfo.signatures.map { sha256.digest(it.toByteArray()) }
val verified = signatures.size == certificates.size &&
    signatures.all { s -> certificates.any { it.contentEquals(s) } }
```
