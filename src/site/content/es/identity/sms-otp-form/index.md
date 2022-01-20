---
layout: post
title: Mejores prácticas para formularios SMS OTP
subhead: Aprenda a optimizar su formulario SMS OTP y mejorar la experiencia del usuario.
authors:
  - agektmr
date: 2020-12-09
updated: 2020-12-09
hero: image/admin/J3XT84NDBPLlsRN0PhLl.jpg
alt: Un letrero de burbuja de chat de neón.
description: Pedirle a un usuario que proporcione una OTP (contraseña de un solo uso) enviada a través de un SMS es una forma común de confirmar el número de teléfono de un usuario. Esta publicación le proporciona las mejores prácticas para crear un formulario OTP de SMS con una excelente experiencia de usuario.
tags:
  - identity
  - security
  - forms
---

{% YouTube 'sU4MpWYrGSI' %}

Pedirle a un usuario que proporcione la OTP (contraseña de un solo uso) entregada a través de SMS, es una forma común de confirmar el número de teléfono de un usuario. Hay algunos casos de uso para SMS OTP:

- **Autenticación en dos pasos.** Además del nombre de usuario y la contraseña, el SMS OTP se puede utilizar como una fuerte señal de que la cuenta es propiedad de la persona que recibió el SMS OTP.
- **Verificación del número de teléfono.** Algunos servicios utilizan un número de teléfono como identificador principal del usuario. En tales servicios, los usuarios pueden ingresar su número de teléfono y la OTP recibida a través de un SMS para probar su identidad. A veces se combina con un PIN para constituir una autenticación en dos pasos.
- **Recuperación de Cuenta.** Cuando un usuario pierde el acceso a su cuenta, debe haber una forma de recuperarla. Enviar un correo electrónico a su dirección de correo electrónico registrada o un SMS OTP a su número de teléfono son métodos comunes de recuperación de cuentas.
- **Confirmación de pago.** En los sistemas de pago, algunos bancos o emisores de tarjetas de crédito solicitan autenticación adicional al pagador por razones de seguridad. El SMS OTP se usa comúnmente para ese propósito.

Esta publicación explica las mejores prácticas para crear un formulario SMS OTP para los casos de uso anteriores.

{% Aside 'caution' %} Si bien esta publicación analiza las mejores prácticas de un formulario SMS OTP, tenga en cuenta que el SMS OTP no es el método más seguro de autenticación en sí mismo porque los números de teléfono se pueden reciclar y, a veces, secuestrar. Y [el concepto de OTP en sí mismo no es resistente al phishing](https://youtu.be/kGGMgEfSzMw?t=1133).

Si busca una seguridad mejor, considere usar [WebAuthn](https://www.w3.org/TR/webauthn-2/). Obtenga más información al respecto en la charla "[Novedades en el registro y el inicio de sesión](https://goo.gle/webauthn-video)" del Chrome Dev Summit 2019 y cree una experiencia de reautenticación utilizando un sensor biométrico con el laboratorio de código ["Cree su primera aplicación WebAuthn"](https://goo.gle/WebAuthnReauthCodelab). {% endAside %}

## Lista de Verificación

Para proporcionar la mejor experiencia de usuario con SMS OTP, siga estos pasos:

- Utilice el elemento `<input>` con:
    - `type="text"`
    - `inputmode="numeric"`
    - `autocomplete="one-time-code"`
- Utilice `@BOUND_DOMAIN #OTP_CODE` como la última línea del mensaje SMS OTP.
- Utilice la [API de WebOTP](/web-otp/).

## Use el elemento `<input>`

El uso de un formulario con un elemento `<input>` es la mejor y la más importante práctica que puede seguir, ya que funciona en todos los navegadores. Incluso si otras sugerencias de esta publicación no funcionan en algún navegador, el usuario aún podrá ingresar y enviar la OTP manualmente.

```html
<form action="/verify-otp" method="POST">
  <input type="text"
         inputmode="numeric"
         autocomplete="one-time-code"
         pattern="\d{6}"
         required>
</form>
```

Las siguientes son algunas ideas para garantizar que un campo de entrada saque el máximo partido a la funcionalidad del navegador.

### `type="text"`

Dado que las OTP suelen ser números de cinco o seis dígitos, el uso de `type="number"` para un campo de entrada puede parecer intuitivo porque cambia el teclado móvil a números únicamente. Esto no se recomienda porque el navegador espera que un campo de entrada sea un número contable en lugar de una secuencia de varios números, lo que puede provocar un comportamiento inesperado. El uso de `type="number"` hace que los botones de "hacia arriba" y "hacia abajo" se muestren al lado del campo de entrada; presionar estos botones aumenta o disminuye el número y puede eliminar los ceros precedentes.

En su lugar, utilice `type="text"`. Esto no convertirá el teclado móvil solo en números, pero está bien porque el siguiente consejo para usar `inputmode="numeric"` hace ese trabajo.

### `inputmode="numeric"`

Utilice [`inputmode="numeric"`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode) para cambiar el teclado del móvil a números únicamente.

Algunos sitios web usan `type="tel"` para los campos de entrada de OTP, ya que también convierte el teclado del teléfono solo en números (incluyendo `*` y `#`) cuando está enfocado. Este truco se usó en el pasado cuando `inputmode="numeric"` no era ampliamente compatible. Desde que <a href="https://github.com/mdn/browser-compat-data/pull/6782" data-md-type="link">Firefox comenzó a admitir `inputmode="numeric"`</a>, no es necesario utilizar el truco `type="tel"`.

### `autocomplete="one-time-code"`

El atributo [`autocomplete`](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete) permite a los desarrolladores especificar qué permiso tiene el navegador para proporcionar asistencia de autocompletar, así como informar al navegador sobre el tipo de información que se espera en el campo.

Con `autocomplete="one-time-code"` cada vez que un usuario recibe un mensaje SMS mientras un formulario está abierto, el sistema operativo analizará la OTP en el SMS de forma heurística y el teclado sugerirá la OTP para que el usuario ingrese. Solo funciona en Safari 12 y versiones posteriores en iOS, iPadOS y macOS, pero recomendamos encarecidamente su uso, porque es una forma fácil de mejorar la experiencia de SMS OTP en esas plataformas.

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/ios-safari.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>`autocomplete =" one-time-code "` en acción.</figcaption></figure>

`autocomplete="one-time-code"` mejora la experiencia del usuario, pero puede hacer más si se [asegura de que el mensaje SMS cumpla con el formato de mensaje vinculado al origen](#format).

{% Aside %} Atributos opcionales:

- [`pattern`](https://developer.mozilla.org/docs/Web/HTML/Attributes/pattern) especifica el formato que debe coincidir con la OTP ingresada. Utilice expresiones regulares para especificar el patrón coincidente, por ejemplo, `\d{6}` restringe la OTP a una cadena de seis dígitos. Obtenga más información sobre el atributo `pattern` en [Use JavaScript para una validación en tiempo real más compleja] (https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation)

- [`required`](https://developer.mozilla.org/docs/Web/HTML/Attributes/required) indica que un campo es obligatorio.

Para conocer las mejores prácticas de formularios más generales, el artículo [Las mejores prácticas de formularios de inicio de sesión](/authors/samdutton/) de [Sam Dutton](/authors/samdutton/) es un excelente punto de partida. {% endAside %}

## Formatee el texto del SMS {: #format}

Mejore la experiencia del usuario de ingresar a una OTP al alinearse con la especificación de [los códigos únicos vinculados al origen entregados a través de SMS](https://wicg.github.io/sms-one-time-codes/).

La regla de formato es simple: Termine el mensaje SMS con el dominio del receptor precedido por `@` y la OTP precedida por `#`.

Por ejemplo:

```text
Your OTP is 123456

@web-otp.glitch.me #123456
```

El uso de un formato estándar para los mensajes OTP hace que la extracción de códigos de ellos sea más fácil y confiable. Asociar los códigos OTP con sitios web dificulta que los los usuarios sean engañados para que proporcionen un código a sitios maliciosos.

{% Aside %} Las reglas precisas son:

- El mensaje comienza con texto legible por humanos (opcional) que contiene una cadena alfanumérica de cuatro a diez caracteres con al menos un número, dejando la última línea para la URL y la OTP.
- La parte del dominio de la URL del sitio web que invocó la API debe estar precedida por `@`.
- La URL debe contener un signo de almohadilla ("`#`") seguido de la OTP.

Asegúrese de que la cantidad de caracteres no exceda los 140 en total.

Para obtener más información sobre las reglas específicas de Chrome, lea la sección [Formatear el mensaje SMS de la publicación API de WebOTP](/web-otp/#format). {% endAside %}

El uso de este formato ofrece algunos beneficios:

- La OTP estará vinculada al dominio. Si el usuario está en dominios distintos al especificado en el mensaje SMS, la sugerencia de OTP no aparecerá. Esto también reduce el riesgo de ataques de phishing y posibles secuestros de cuentas.
- El navegador ahora podrá extraer la OTP de manera confiable sin depender de heurísticas misteriosas y escabrosas.

Cuando un sitio web usa `autocomplete="one-time-code"`, Safari con iOS 14 o posterior, sugerirá la OTP siguiendo las reglas anteriores.

{% Aside %} Si el usuario está en una computadora con macOS Big Sur con la misma cuenta de iCloud configurada que en iOS, la OTP recibida en el dispositivo iOS también estará disponible en el Safari de escritorio.

Para obtener más información sobre otros beneficios y matices de la disponibilidad en las plataformas de Apple, lea [Mejorar la seguridad del código entregado por SMS con códigos vinculados al dominio](https://developer.apple.com/news/?id=z0i801mg). {% endAside %}

Este formato de mensaje SMS también beneficia a otros navegadores además de Safari. Chrome, Opera y Vivaldi en Android también admiten la regla de códigos de un solo uso vinculados al origen con la API de WebOTP, aunque no a través de `autocomplete="one-time-code"`.

## Utilizar la API de WebOTP

[La API de WebOTP](https://wicg.github.io/web-otp/) proporciona acceso a la OTP recibida en un mensaje SMS. Al llamar a [`navigator.credentials.get()`](https://developer.mozilla.org/docs/Web/API/CredentialsContainer/get) con el tipo `otp` (`OTPCredential`) donde `transport` incluye `sms`, el sitio web esperará a que se entregue un SMS que cumpla con los códigos de un solo uso vinculados al origen y se le otorgue acceso por parte del usuario. Una vez que la OTP se pasa a JavaScript, el sitio web puede usarla en un formulario o enviarla directamente al servidor.

{% Aside 'caution' %} La API de WebOTP requiere un origen seguro (HTTPS). {% endAside %}

```js
navigator.credentials.get({
  otp: {transport:['sms']}
})
.then(otp => input.value = otp.code);
```

<figure style="width:300px; margin:auto;">
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/sms-otp-form/android-chrome.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>API de WebOTP en acción.</figcaption></figure>

Aprenda a usar con detalle la API de WebOTP en [Verificar números de teléfono en la web con la API de WebOTP](/web-otp/) o copie y pegue el siguiente fragmento. (Asegúrese de que el elemento `<form>` tenga los atributos `method` y `action` establecidos correctamente).

```js
// Feature detection
if ('OTPCredential' in window) {
  window.addEventListener('DOMContentLoaded', e => {
    const input = document.querySelector('input[autocomplete="one-time-code"]');
    if (!input) return;
    // Cancel the WebOTP API if the form is submitted manually.
    const ac = new AbortController();
    const form = input.closest('form');
    if (form) {
      form.addEventListener('submit', e => {
        // Cancel the WebOTP API.
        ac.abort();
      });
    }
    // Invoke the WebOTP API
    navigator.credentials.get({
      otp: { transport:['sms'] },
      signal: ac.signal
    }).then(otp => {
      input.value = otp.code;
      // Automatically submit the form when an OTP is obtained.
      if (form) form.submit();
    }).catch(err => {
      console.log(err);
    });
  });
}
```

Foto de [Jason Leung](https://unsplash.com/photos/mZNRsYE9Qi4) en [Unsplash](https://unsplash.com).
