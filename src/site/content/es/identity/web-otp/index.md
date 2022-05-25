---
layout: post
title: Verificación de los números de teléfono en la web con la API de WebOTP
subhead: Ayuda a los usuarios con las OTP recibidas a través de SMS
authors:
  - agektmr
date: 2019-10-07
updated: 2021-06-04
hero: image/admin/iVHsQYbBj8qNYZeSZKwK.png
alt: Un dibujo de una mujer que usa un OTP para iniciar sesión en una aplicación web.
description: |2-

  Encontrar, memorizar y escribir los OTP enviados por SMS es incomodo. El API de WebOTP simplifica el flujo de trabajo de OTP para los usuarios.
tags:
  - identity
  - capabilities
feedback:
  - api
---

{% Aside 'gotchas' %} Si deseas obtener más información sobre las mejores prácticas generales de los formularios SMS OTP, incluido con la API de WebOTP, consulta [las mejores prácticas para los formularios SMS OTP](/sms-otp-form). {% endAside %}

## ¿Qué es la API de WebOTP?

En estos días, la mayoría de las personas en el mundo poseen un dispositivo móvil y los desarrolladores suelen usar números de teléfono como un identificador para los usuarios de sus servicios.

Existe una variedad de formas de verificar los números de teléfono, pero una de las más comunes es una contraseña de un solo uso (OTP) generada aleatoriamente y enviada por SMS. Enviar este código al servidor del desarrollador demuestra el control del número de teléfono.

Esta idea ya está implementada en muchos escenarios y se utiliza para distintas cosas:

- **Número de teléfono como identificador del usuario.** Al suscribirse a un nuevo servicio, algunos sitios web solicitan un número de teléfono en lugar de una dirección de correo electrónico y lo utilizan como identificador de cuenta.
- **Verificación de dos pasos.** Al iniciar sesión, un sitio web solicita un código de un solo uso enviado por SMS además de una contraseña u otro factor de conocimiento para mayor seguridad.
- **Confirmación de pago.** Cuando un usuario realiza un pago, solicitar un código único enviado por SMS puede ayudar a verificar la intención de la persona.

El proceso actual crea fricciones para los usuarios. Encontrar un OTP dentro de un mensaje SMS, para luego copiarlo y pegarlo en el formulario es incomodo, lo que reduce las tasas de conversión en los recorridos críticos del usuario. Aliviar este problema ha sido una de las mayores solicitudes de muchos grandes desarrolladores web, Android tiene [una API que hace exactamente esto](https://developers.google.com/identity/sms-retriever/). Lo mismo ocurre con [iOS](https://developer.apple.com/documentation/security/password_autofill/about_the_password_autofill_workflow) y [Safari](https://developer.apple.com/documentation/security/password_autofill/enabling_password_autofill_on_an_html_input_element).

La API de WebOTP permite que tu aplicación reciba mensajes con formato especial vinculados al dominio de tu aplicación. A partir de esto, puedes obtener un OTP mediante programación a partir de un mensaje SMS y verificar un número de teléfono para el usuario de una manera más sencilla.

{% Aside 'warning' %} Los atacantes pueden falsificar los SMS y con eso secuestrar el número de teléfono de una persona. Los operadores también pueden reciclar números de teléfono para nuevos usuarios después de cerrar una cuenta. Si bien SMS OTP es útil para verificar un número de teléfono para los casos de uso anteriores, recomendamos usar formas de autenticación adicionales y más fuertes (como múltiples factores y la [API de Autenticación web](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API) para establecer nuevas sesiones para estos usuarios. {% endAside %}

## Míralo en acción

Supongamos que un usuario quiere verificar su número de teléfono con un sitio web. El sitio web envía un mensaje de texto al usuario por SMS y el usuario ingresa el OTP desde el mensaje para verificar la propiedad del número de teléfono.

Con la API de WebOTP, estos pasos son tan fáciles como un toque para el usuario, como se demostró en el video. Cuando llega el mensaje de texto, aparece una hoja inferior y le pide al usuario que verifique su número de teléfono. Después de hacer clic en el botón de **Verificar** en la hoja inferior, el navegador pega el OTP en el formulario y el formulario se envía sin que el usuario tenga que presionar **Continuar**.

<video autoplay loop muted playsinline>
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.mp4" type="video/mp4">
  <source src="https://storage.googleapis.com/web-dev-assets/web-otp/demo.webm" type="video/webm"></source></source></video>

Todo el proceso está explicado en la imagen a continuación.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GrFHzEg98jxCOguAQwHe.png", alt="", width="494", height="391" %} <figcaption> Diagrama de API de WebOTP</figcaption></figure>

Utiliza la [demostración](https://web-otp.glitch.me). No solicita tu número de teléfono ni envía un SMS a tu dispositivo, pero puedes enviar uno desde otro dispositivo copiando el texto que se muestra en la demostración. Esto funciona porque no importa quién sea el remitente cuando se usa la API de WebOTP.

1. Ve a [https://web-otp.glitch.me](https://web-otp.glitch.me) en Chrome 84 o posterior en un dispositivo Android.
2. Envía a tu teléfono el siguiente mensaje de texto SMS desde el otro teléfono.

```text
Tu OTP es: 123456.

@web-otp.glitch.me #12345
```

¿Recibiste el SMS y viste el mensaje para ingresar el código en el área de entrada? Así es como funciona la API de WebOTP para los usuarios.

{% Aside 'gotchas' %}

Si no aparece el cuadro de diálogo, consulta [las preguntas frecuentes](#no-dialog).

{% endAside %}

El uso de la API de WebOTP consta de tres partes:

- Una etiqueta `<input>` anotada correctamente
- JavaScript en tu aplicación web
- Mensaje de texto con formato enviado por SMS.

Cubriré la parte de `<input>` primero.

## Anotar una etiqueta de `<input>`

WebOTP en sí mismo funciona sin ninguna anotación HTML, pero para la compatibilidad entre navegadores, te recomiendo que agregues `autocomplete="one-time-code"` a la etiqueta de `<input>` donde espera que el usuario ingrese una OTP.

Esto permite que Safari 14 o posterior sugiera que el usuario complete automáticamente el `<input>` con una OTP cuando reciba un SMS con el formato descrito en [Formatear el mensaje SMS](#format) aunque no sea compatible con WebOTP.

{% Label %} HTML {% endLabel %}

```html
<form>
  <input autocomplete="one-time-code" required/>
  <input type="submit">
</form>
```

## Utiliza la API de WebOTP

Debido a que WebOTP es simple, basta con copiar y pegar el siguiente código. De todos modos, te guiaré a través de lo que está sucediendo.

{% Label %} JavaScript {% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

### Detección de características

La detección de características es la misma que para muchas otras API. Escuchar el evento de`DOMContentLoaded` hará que se espere a que el árbol DOM esté listo para realizar consultas.

{% Label %} JavaScript {% endLabel %}

```js
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    …
    const form = input.closest('form');
    …
  });
}
```

{% Aside 'caution' %}

La API de WebOTP requiere un origen seguro (HTTPS). La detección de funciones en un sitio web HTTP fallará.

{% endAside %}

### Procesar la OTP

La API de WebOTP es bastante simple. Utiliza [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get) para obtener la OTP. WebOTP agrega una nueva opción `otp` a ese método. Solo tiene una propiedad: `transport`, cuyo valor debe ser una matriz con la cadena `'sms'`.

{% Label %} JavaScript {% endLabel %}

```js/1-2
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
    …
```

Esto activa el flujo de permisos del navegador cuando llega un mensaje SMS. Si el permiso es concedido, la promesa devuelta se resuelve con un objeto `OTPCredential`.

{% Label %} Contenido del `OTPCredential` obtenido {% endLabel %}

```json
{
  code: "123456" // OTP obtenido
  type: "otp"  // el 'type' siempre debe de ser otp
}
```

A continuación, pasa el valor del OTP al campo de `<input>`. Enviar el formulario directamente eliminará el paso que requiere que el usuario toque un botón.

{% Label %} JavaScript {% endLabel %}

```js/5-6
    …
    navigator.credentials.get({
      otp: { transport:['sms'] }
      …
    }).then(otp => {
      input.value = otp.code;
      if (form) form.submit();
    }).catch(err => {
      console.error(err);
    });
    …
```

### Anulando el mensaje {: #aborting }

En caso de que el usuario ingrese manualmente un OTP y envíe el formulario, puedes cancelar la llamada de `get()` utilizando una instancia de `AbortController` [en el objeto de `options`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get#Parameters).

{% Label %} JavaScript {% endLabel %}

```js/1,5,11
    …
    const ac = new AbortController();
    …
    if (form) {
      form.addEventListener('submit', e => {
        ac.abort();
      });
    }
    …
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
    …
```

## Formatee el mensaje SMS {: #format }

La API en sí debería parecer lo suficientemente simple, pero hay algunas cosas que debes saber antes de usarla. El mensaje debe enviarse después de `navigator.credentials.get()` haya sido llamado y debe recibirse en el dispositivo donde se llamó a `get()`. Finalmente, el mensaje debe cumplir con el siguiente formato:

- El mensaje comienza con texto (opcional) legible por humanos que contiene una cadena alfanumérica de cuatro a diez caracteres con al menos un número dejando la última línea para la URL y el OTP.
- La parte del dominio de la URL del sitio web que invocó la API debe estar precedida por `@`.
- La URL debe contener un signo de almohadilla ('`#`') seguido del OTP.

Por ejemplo:

```text
Tu OTP es: 123456.

@www.example.com #123456
```

Aquí hay unos malos ejemplos:

Ejemplo de texto SMS con formato incorrecto | ¿Por qué esto no funcionará?
--- | ---
`Aquí está tu codigo para @example.com #123456` | El `@` es esperado que sea el primer carácter de la última linea.
`Tu codigo para @example.com es #123456` | El `@` es esperado que sea el primer carácter de la última linea.
`Tu código de verificación es 123456`<br><br>`@example.com\t#123456` | Se espera un solo espacio entre `@host` y `#code`.
`Tu código de verificación es 123456`<br><br>`@example.com`<code>  </code>`#123456` | Se espera un solo espacio entre `@host` y `#code`.
`Tu código de verificación es 123456`<br><br>`@ftp://example.com #123456` | No se puede incluir el esquema de URL.
`Tu código de verificación es 123456`<br><br>`@https://example.com #123456` | No se puede incluir el esquema de URL.
`Tu código de verificación es 123456`<br><br>`@example.com:8080 #123456` | No se puede incluir el puerto.
`Tu código de verificación es 123456`<br><br>`@example.com/foobar #123456` | No se puede incluir la ruta.
`Tu código de verificación es 123456`<br><br>`@example .com #123456` | Sin espacios en blanco en el dominio.
`Tu código de verificación es 123456`<br><br>`@domain-forbiden-chars-#%/:<>?@[] #123456` | No debe de haber [caracteres prohibidos](https://url.spec.whatwg.org/#forbidden-host-code-point) en el dominio.
`@example.com #123456`<br><br>`Mambo Jumbo` | El `@host` y `#code` deben de estar en la última linea.
`@example.com #123456`<br><br>`App hash #oudf08lkjsdf834` | El `@host` y `#code` deben de estar en la última linea.
`Tu código de verificación es 123456`<br><br>`@example.com 123456` | Falta el `#`.
`Tu código de verificación es 123456`<br><br>`example.com #123456` | Falta el `@`.
`Hola mamá, ¿recibiste mi último mensaje?` | Falta `@` y `#`.

## Demostraciones

Prueba varios mensajes con la siguiente demostración: [https://web-otp.glitch.me](https://web-otp.glitch.me)

También puedes bifurcarlo y crear tu versión: [https://glitch.com/edit/#!/web-otp](https://glitch.com/edit/#!/web-otp) .

{% Glitch { id: 'web-otp', path: 'views/index.html', previewSize: 0, allow: [] } %}

## Utiliza WebOTP desde un iframe de origen cruzado

Introducir un SMS OTP en un iframe de origen cruzado se suele utilizar para la confirmación del pago, especialmente con 3D Secure. Con el formato común para admitir iframes de origen cruzado, la API de WebOTP ofrece OTP vinculadas a orígenes anidados. Por ejemplo:

- Por ejemplo, un usuario visita la `shop.example` para comprar un par de zapatos con una tarjeta de crédito.
- Después de ingresar el número de la tarjeta de crédito, el proveedor de pago integrado muestra un formulario del `bank.example` dentro de un iframe que le pide al usuario que verifique su número de teléfono para un pago rápido.
- `bank.example` envía un SMS que contiene un OTP al usuario para que pueda ingresar y verificar su identidad.

Para usar la API de WebOTP desde dentro de un iframe de origen cruzado, debes hacer dos cosas:

- Anotar el origen del marco superior como el del iframe en el mensaje de texto SMS.
- Configurar la política de permisos para permitir que el iframe de origen cruzado reciba OTP del usuario directamente.

<figure>{% Video src="video/YLflGBAPWecgtKJLqCJHSzHqe2J2/Ba3OSkSsB4NwFkHGOuvc.mp4", autoplay="true", controls="true", loop="true", muted="true", preload="auto", width="300", height="600" %} <figcaption> El API de WebOTP dentro de un iframe en acción.</figcaption></figure>

Puedes probar la demostración en [https://web-otp-iframe-demo.stackblitz.io](https://web-otp-iframe-demo.stackblitz.io).

### Anotar los orígenes vinculados al mensaje de texto SMS

Cuando se llama a la API de WebOTP desde dentro de un iframe, el mensaje de texto SMS debe incluir el origen del marco superior precedido por `@` y seguido de la OTP precedida por `#` y el origen del iframe precedido por `@` en la última línea.

```text
Tu código de verificación es 123456

@shop.example #123456 @bank.exmple
```

### Configurar la política de permisos

Para usar WebOTP en un iframe de origen cruzado, el incrustador debe otorgar acceso a esta API a través de la [política de permisos](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/) de otp-credentials para evitar comportamientos no deseados. De manera general, existen dos formas de lograr este objetivo:

{% Label %} a través de la cabecera HTTP: {% endLabel %}

```http
Permissions-Policy: otp-credentials=(self "https://bank.example")
```

{% Label %} a través del iframe del atributo `allow`:{% endLabel %}

```html
<iframe src="https://bank.example/…" allow="otp-credentials"></iframe>
```

Consulta [más ejemplos sobre cómo especificar una política de permisos](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/).

{% Aside %}

Por el momento, Chrome solo admite llamadas a la API de WebOTP desde iframes de origen cruzado que **no tengan más de un** origen único en su cadena antecesora. En los siguientes escenarios:

- `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `b.com`
- `a.com` -&gt; `a.com` -&gt; `b.com`
- `a.com` -&gt; `b.com` -&gt; `c.com`

utilizar WebOTP en `b.com` es compatible pero usarlo en `c.com` no lo es.

Ten en cuenta que el siguiente escenario tampoco es compatible debido a la falta de demanda y las complejidades de UX.

- `a.com` -&gt; `b.com` -&gt; `a.com` (llama a la API de WebOTP)

{% endAside %}

## Preguntas frecuentes

### El cuadro de diálogo no aparece aunque estoy enviando un mensaje con el formato correcto. ¿Qué hice mal? {: #no-dialog }

Hay un par de peculiaridades al probar la API:

- Si el número de teléfono del remitente está incluido en la lista de contactos del destinatario, esta API no se activará debido al diseño de la subyacente [API de Consentimiento del usuario de SMS](https://developers.google.com/identity/sms-retriever/user-consent/request#2_start_listening_for_incoming_messages).
- Si estas utilizando un perfil de trabajo en tu dispositivo Android y WebOTP no funciona, intenta instalar y utilizar Chrome en tu perfil personal (es decir, el mismo perfil en el que recibes los mensajes SMS).

Vuelve a consultar [el formato](#format) para ver si el formato de tu SMS está correcto.

### ¿Esta API es compatible entre diferentes navegadores?

Chromium y WebKit acordaron el [formato de mensaje de texto SMS](https://wicg.github.io/sms-one-time-codes) y [Apple anunció el soporte de Safari para él](https://developer.apple.com/news/?id=z0i801mg) a partir de iOS 14 y macOS Big Sur. Aunque Safari no es compatible con la API de JavaScript de WebOTP, al anotar el elemento de `input` con `autocomplete=["one-time-code"]`, el teclado predeterminado sugiere automáticamente que ingrese el OTP si el mensaje SMS cumple con el formato.

### ¿Es seguro utilizar SMS como una forma de autenticación?

Si bien SMS OTP es útil para verificar un número de teléfono cuando se proporciona el número por primera vez, la verificación del número de teléfono a través de SMS debe usarse con cuidado para la reautenticación, ya que los operadores pueden secuestrar y reciclar los números de teléfono. WebOTP es un mecanismo conveniente de recuperación y restablecimiento, pero los servicios deben combinarlo con factores adicionales, como un desafío de conocimiento, o utilizar la [API de Autenticación web](https://developer.mozilla.org/docs/Web/API/Web_Authentication_API) para una autenticación sólida.

### ¿Dónde informo los errores en la implementación de Chrome?

¿Encontraste un error con la implementación de Chrome?

- Envianos un mensaje con el error a [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESMS). Incluye todos los detalles que puedas, instrucciones simples para reproducir y configure **Componentes** en `Blink>WebOTP`.

### ¿Cómo puedo mejorar esta función?

¿Te encuentras pensando en utilizar la API de WebOTP? Tu apoyo público nos ayuda a priorizar las funciones y mostrar a otros proveedores de navegadores lo importante que es brindarles compatibilidad. Envía un tweet a [@ChromiumDev](https://twitter.com/chromiumdev) usando el hashtag [`#WebOTP`](https://twitter.com/search?q=%23WebOTP&src=typed_query&f=live) y déjanos saber saber dónde y cómo lo estas usando.

{% Aside %} Encuentra más preguntas en [la sección de preguntas frecuentes del explicador](https://github.com/WICG/WebOTP/blob/master/FAQ.md). {% endAside %}
