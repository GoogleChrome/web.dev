---
layout: post
title: Configurar un método de pago
subhead: |2-

  Una transacción de pago mediante Web Payments comienza con el descubrimiento de tu
  aplicación de pago. Aprende a configurar un método de pago y obtén tu aplicación de pago
  lista para que comerciantes y clientes realicen pagos.
authors:
  - agektmr
description: |2-

  Una transacción de pago mediante Web Payments comienza con el descubrimiento de tu
  aplicación de pago. Aprende a configurar un método de pago y obtén tu aplicación de pago
  lista para que comerciantes y clientes realicen pagos.
date: 2020-05-25
updated: 2021-09-14
tags:
  - payments
feedback:
  - api
---

Para utilizarla con la API de Payment Request, una aplicación de pago debe estar asociada con un identificador de método de pago. Los comerciantes que quieran integrarse con una aplicación de pago utilizarán el identificador del método de pago para indicarlo en el navegador. Este artículo analiza cómo funciona el descubrimiento de aplicaciones de pago y cómo configurar tu aplicación de pago para que un navegador la detecte y la invoque correctamente.

Si eres nuevo al concepto de Web Payments (Pagos en la web) o al concepto de cómo funciona una transacción de pago a través de aplicaciones de pago, primero lee los siguientes artículos:

- [Potenciar las aplicaciones de pago con Web Payments](/empowering-payment-apps-with-web-payments)
- [La vida de una transacción de pago](/life-of-a-payment-transaction)

{% include 'content/payments/browser-compatibility.njk' %}

## Cómo un navegador descubre una aplicación de pago

Cada aplicación de pago debe proporcionar lo siguiente:

- Identificador de método de pago basado en URL
- Manifiesto del método de pago (excepto cuando un tercero proporciona el identificador del método de pago)
- Manifiesto de la aplicación web

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kvLIMUysDNEG3IfPxKz6.png", alt="Diagrama: cómo un navegador descubre la aplicación de pago a partir de un identificador de método de pago basado en URL", width="800", height="587" %}</figure>

El proceso de descubrimiento comienza cuando un comerciante inicia una transacción:

1. El navegador envía una solicitud a la [URL del identificador del método de pago](https://w3c.github.io/payment-method-manifest/) y obtiene el [manifiesto del método de pago](https://w3c.github.io/payment-method-manifest/).
2. El navegador determina la [URL del manifiesto de la aplicación web](https://developer.mozilla.org/docs/Web/Manifest) a partir del manifiesto del método de pago y obtiene el manifiesto de la aplicación web.
3. El navegador determina si se debe iniciar la aplicación de pago del sistema operativo o la aplicación de pago basada en la web desde el manifiesto de la aplicación web.

Las siguientes secciones explican en detalle cómo configurar tu propio método de pago para que los navegadores puedan descubrirlo.

## Paso 1: Proporciona el identificador del método de pago

Un [identificador de método de pago](https://w3c.github.io/payment-method-id/#dfn-payment-method-identifiers) es una cadena basada en URL. Por ejemplo, el identificador de Google Pay es `https://google.com/pay`. Los desarrolladores de aplicaciones de pago pueden elegir cualquier URL como identificador de método de pago siempre que tengan control sobre ella y puedan ofrecer contenido arbitrario. En este artículo, usaremos [`https://bobbucks.dev/pay`](https://bobbucks.dev/pay) como identificador del método de pago.

{% Aside %} Las aplicaciones de pago también pueden admitir métodos de pago de terceros. {% endAside %}

### Cómo utilizan los comerciantes el identificador de método de pago

Un objeto `PaymentRequest` se construye con una lista de [identificadores de métodos de pago](https://www.w3.org/TR/payment-method-id/) que identifica las aplicaciones de pago que un comerciante decide aceptar. Los identificadores de método de pago se establecen como un valor para la propiedad `supportedMethods`. Por ejemplo:

{% Label %}[merchant] solicita el pago: {% endLabel %}

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

{% Aside %} Se permiten redirecciones hasta tres veces dentro del mismo sitio para un identificador de método de pago en Chrome. {% endAside %}

## Paso 2: Sirve el manifiesto del método de pago

Un [manifiesto de método de pago](https://w3c.github.io/payment-method-manifest/) es un archivo JSON que define qué aplicación de pago puede utilizar este método de pago.

### Proporciona el manifiesto del método de pago

Cuando un comerciante inicia una transacción de pago, [el navegador envía una consulta HTTP `GET` a la URL del identificador del método de pago](https://w3c.github.io/payment-method-manifest/#accessing). El servidor responde con el cuerpo del manifiesto del método de pago.

Un manifiesto de método de pago tiene dos campos, `default_applications` y `supported_origins`.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Nombre de la propiedad</th>
        <th>Descripción</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>default_applications</code> (obligatorio)</td>
        <td>Una matriz de URL que apunta a los manifiestos de aplicaciones web donde se alojan las aplicaciones de pago (La URL puede ser relativa). Se espera que esta matriz haga referencia al manifiesto de desarrollo, manifiesto de producción, etc.</td>
      </tr>
      <tr>
        <td><code>supported_origins</code></td>
        <td>Una matriz de URL que apunta a los orígenes que pueden albergar aplicaciones de pago de terceros que implementan el mismo método de pago. Ten en cuenta un método de pago puede ser implementado por múltiples aplicaciones.</td>
      </tr>
    </tbody>
    <caption>Campos del manifiesto del método de pago</caption>
  </table>
</div>

Un archivo de manifiesto de método de pago debería parecerse similar al siguiente:

{% Label %}[payment handler] /payment-manifest.json:{% endLabel %}

```json
{
  "default_applications": ["https://bobbucks.dev/manifest.json"],
  "supported_origins": [
    "https://alicepay.friendsofalice.example"
  ]
}
```

Cuando el navegador lee el campo de `default_applications`, encuentra una lista de enlaces a [los manifiestos de aplicaciones web de las aplicaciones](https://w3c.github.io/manifest/) de pago compatibles.

{% Aside %} Chrome permite a una única aplicación de pago predeterminada por método de pago único a partir de Chrome 83. {% endAside %}

### De manera opcional, dirige el navegador para encontrar el manifiesto del método de pago en otra ubicación

La URL del identificador del método de pago puede responder opcionalmente con una cabecera `Link` que apunta a otra URL la cual el navegador puede obtener el manifiesto del método de pago. Esto es útil cuando un manifiesto de método de pago está alojado en un servidor diferente o cuando la aplicación de pago es servida por un tercero.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5YDqz1ppLkjHd9HYgXYH.png", alt="Cómo un navegador descubre la aplicación de pago a partir de un identificador de método de pago basado en URL con redireccionamientos", width="800", height="698" %}

Configura el servidor del método de pago para que responda con una cabecera `Link` con el atributo `rel="payment-method-manifest"` y la URL del [manifiesto del método de pago](https://w3c.github.io/payment-method-manifest/).

Por ejemplo, si el manifiesto está en `https://bobbucks.dev/payment-manifest.json`, la cabecera de respuesta incluiría:

```http
Link: <https://bobbucks.dev/payment-manifest.json>; rel="payment-method-manifest"
```

La URL puede ser un nombre de dominio completo o una ruta relativa. Para ver un ejemplo del tráfico de red, inspecciona `https://bobbucks.dev/pay/`. También puedes usar un comando `curl`, por ejemplo:

```shell
curl --include https://bobbucks.dev/pay
```

{% Aside %} Obtén más información sobre [las prácticas de métodos de pago en la documentación de W3C](https://github.com/w3c/payment-request-info/wiki/PaymentMethodPractice). {% endAside %}

## Paso 3: entregar un manifiesto de aplicación web

Un [manifiesto de aplicación web](https://developer.mozilla.org/docs/Web/Manifest) se utiliza para definir una aplicación web, como el nombre sugiere. Es un archivo de manifiesto muy utilizado para [definir una aplicación web progresiva (PWA)](/add-manifest/).

El manifiesto típico de una aplicación web se vería así:

{% Label %}[payment handler] /manifest.json:{% endLabel %}

```json
{
  "name": "Pago con Bobpay",
  "short_name": "Bobpay",
  "description": "Ejemplo de la API de Payment Handler.",
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

La información descrita en un manifiesto de aplicación web también se utiliza para definir cómo aparece una aplicación de pago en la IU de Payment Request.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Nombre de la propiedad</th>
        <th>Descripción</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code><a href="https://developer.mozilla.org/docs/Web/Manifest/name">name</a></code> (obligatorio)</td>
        <td>Se utiliza como nombre de la aplicación de pago.</td>
      </tr>
      <tr>
        <td>
<code><a href="https://developer.mozilla.org/docs/Web/Manifest/icons">icons</a></code> (obligatorio)</td>
        <td>Se utiliza como icono de la aplicación de pago. Solo Chrome usa estos íconos; otros navegadores pueden usarlos como íconos de respaldo si no los especifica como parte del instrumento de pago.</td>
      </tr>
      <tr>
        <td>
          <code><a href="https://developer.mozilla.org/docs/Web/API/Service_Worker_API">serviceworker</a></code>
        </td>
        <td>Se usa para detectar el service worker que se ejecuta como la aplicación de pago basada en web.</td>
      </tr>
      <tr>
        <td><code>serviceworker.src</code></td>
        <td>La URL para descargar el script del service worker.</td>
      </tr>
      <tr>
        <td><code>serviceworker.scope</code></td>
        <td>Una cadena que representa una URL que define el alcance de registro de un service worker.</td>
      </tr>
      <tr>
        <td><code>serviceworker.use_cache</code></td>
        <td>La URL para descargar el script del service worker.</td>
      </tr>
      <tr>
        <td>
          <code><a href="https://developer.mozilla.org/docs/Web/Manifest/related_applications">related_applications</a></code>
        </td>
        <td>Se utiliza para detectar la aplicación que actúa como la aplicación de pago proporcionada por el sistema operativo. Encuentra más detalles en la <a href="/android-payment-apps-developers-guide/">guía para desarrolladores de aplicaciones de pago de Android</a>.</td>
      </tr>
      <tr>
        <td>
          <code><a href="https://developer.mozilla.org/docs/Web/Manifest/prefer_related_applications">prefer_related_applications</a></code>
        </td>
        <td>Se utiliza para determinar qué aplicación de pago iniciar cuando están disponibles la aplicación de pago proporcionada por el sistema operativo y la aplicación de pago basada en la web.</td>
      </tr>
    </tbody>
    <caption>Campos importantes del manifiesto de la aplicación web</caption>
  </table>
</div>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lyP2t7T5R5bVzqh0LUTx.png", alt="Aplicación de pago con un ícono", width="800", height="237" %}<figcaption> Etiqueta e ícono de la aplicación de pago.</figcaption></figure>

La propiedad `name` del manifiesto de la aplicación web se usa como el nombre de la aplicación de pago, la propiedad `icons` se usa como el icono de la aplicación de pago.

## Cómo determina Chrome qué aplicación de pago lanzar

### Lanzamiento de la aplicación de pago específica de la plataforma

Para iniciar la aplicación de pago específica de la plataforma, se deben cumplir las siguientes condiciones:

- El campo `related_applications` se especifica en el manifiesto de la aplicación web y:
    - El ID del paquete de la aplicación instalada y la firma coinciden, mientras que la versión mínima (`min_version`) en el manifiesto de la aplicación web es menor o igual que la versión de la aplicación instalada.
- El campo `prefer_related_applications` es `true`.
- La aplicación de pago específica de la plataforma está instalada y tiene:
    - Un filtro de intención de `org.chromium.action.PAY`.
    - Un identificador de método de pago especificado como el valor de la propiedad `org.chromium.default_payment_method_name`.

Consulta las [Aplicaciones de pago de Android: guía para desarrolladores](/android-payment-apps-developers-guide/) para obtener más detalles sobre cómo configurarlas.

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

Si el navegador ha determinado que la aplicación de pago específica de la plataforma está disponible, el flujo de descubrimiento finaliza aquí. De lo contrario, continúa con el siguiente paso: lanzamiento de la aplicación de pago basada en la web.

### Lanzamiento de la aplicación de pago basada en web

La aplicación de pago basada en web debe especificarse en el campo `serviceworker` del manifiesto web.

{% Label %}[payment handler] /manifest.json:{% endLabel %}

```json
"serviceworker": {
  "src": "payment-handler.js"
}
```

El navegador inicia la aplicación de pago basada en la web enviando un evento `paymentrequest` al service worker. El service worker no tiene que estar registrado con anticipación. [Puede registrarse justo a tiempo](#jit-register).

## Comprender las optimizaciones especiales

### Cómo los navegadores pueden omitir la IU de Payment Request e iniciar una aplicación de pago directamente

En Chrome, cuando se llama al método `show()` de  `PaymentRequest`, la API de Payment Request muestra una IU proporcionada por el navegador llamada "IU de Payment Request". Esta interfaz de usuario permite a los usuarios elegir una aplicación de pago. Después de presionar el botón de **Continue (Continuar)** en la IU de Payment Request, se inicia la aplicación de pago seleccionada.

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/payments/without-skip-the-sheet.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/without-skip-the-sheet.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>La IU de Payment Request interviene antes de iniciar la aplicación de pago.</figcaption></figure>

Mostrar la IU de Payment Request antes de iniciar una aplicación de pago aumenta la cantidad de pasos necesarios para que un usuario complete un pago. Para optimizar el proceso, el navegador puede delegar el cumplimiento de esa información a las aplicaciones de pago e iniciar una aplicación de pago directamente sin mostrar la IU de Payment Request cuando se llama a `show()`.

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/payments/skip-the-sheet.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/payments/skip-the-sheet.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>Omite la IU de Payment Request e inicia la aplicación de pago directamente.</figcaption></figure>

Para iniciar una aplicación de pago directamente, se deben cumplir las siguientes condiciones:

- `show()` se dispara con un gesto del usuario (por ejemplo, un clic del ratón).
- Existe una única aplicación de pago que:
    - Admite el identificador de método de pago solicitado.

{% Aside %} Safari actualmente solo es compatible con Apple Pay, por lo que siempre inicia la aplicación directamente, omitiendo la IU de Payment Request. {% endAside %}

### ¿Cuándo se registra una aplicación de pago de justo a tiempo (JIT) basada en la web? {: # jit-register}

Las aplicaciones de pago basadas en la web se pueden iniciar sin que el usuario visite previamente el sitio web de la aplicación de pago y no registre al service worker. El service worker puede registrarse justo a tiempo cuando el usuario elige pagar con la aplicación de pago basada en la web. Hay dos variaciones para el tiempo de registro:

- Si se muestra al usuario la IU de Payment Request, la aplicación se registra justo a tiempo y se inicia cuando el usuario hace clic en **Continuar**.
- Si se omite la IU de Payment Request, la aplicación de pago se registra justo a tiempo y se inicia directamente. Omitir la IU de Payment Request para iniciar una aplicación registrada justo a tiempo requiere un gesto del usuario, lo que evita el registro inesperado de los service workers de origen cruzado.

{% Aside %} Si bien un único identificador de método de pago puede admitir varias aplicaciones de pago, el registro JIT solo ocurre cuando el manifiesto del método de pago apunta a una única aplicación de pago. {% endAside %}

## Próximos pasos

Ahora que tienes tu aplicación de pago visible, aprende a desarrollar una aplicación de pago específica para una plataforma y una aplicación de pago basada en la web.

- [Aplicaciones de pago de Android: guía para desarrolladores](/android-payment-apps-developers-guide)
- [Guía para desarrolladores de aplicaciones de pago basadas en la web](/web-based-payment-apps-overview)
