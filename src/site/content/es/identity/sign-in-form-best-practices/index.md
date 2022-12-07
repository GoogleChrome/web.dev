---
layout: post
title: Mejores prácticas para el formulario de inicio de sesión
subhead: Utilice funciones de navegador multiplataforma para crear formularios de inicio de sesión que sean seguros, accesibles y fáciles de usar.
authors:
  - samdutton
scheduled: cierto
date: 2020-06-29
updated: 2021-09-27
description: Utilice funciones de navegador multiplataforma para crear formularios de inicio de sesión que sean seguros, accesibles y fáciles de usar.
hero: image/admin/pErOjllBUXhnj68qOhfr.jpg
alt: Una persona sosteniendo un teléfono.
tags:
  - forms
  - identity
  - layout
  - mobile
  - security
  - ux
codelabs:
  - codelab-sign-in-form-best-practices
---

{% YouTube 'alGcULGtiv8' %}

Si los usuarios alguna vez necesitan iniciar sesión en su sitio, entonces un buen diseño del formulario de inicio de sesión es fundamental. Esto es especialmente cierto para las personas con conexiones deficientes, en el móvil, con prisa o bajo estrés. Los formularios de inicio de sesión mal diseñados obtienen altas tasas de rebote. Cada rebote podría significar un usuario perdido y descontento, no solo una oportunidad de inicio de sesión perdida.

{% Aside 'codelab' %} Si prefiere aprender estas prácticas recomendadas con un tutorial práctico, consulte el [Laboratorio de códigos de prácticas recomendadas del formulario de inicio de sesión](/codelab-sign-in-form-best-practices/). {% endAside %}

El siguiente es un ejemplo de un formulario de inicio de sesión simple que muestra todas las prácticas recomendadas:

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

## Lista de verificación

- [Utilice elementos HTML significativos](#meaningful-html): `<form>`, `<input>`, `<label>` y `<button>`.
- [Etiquete cada entrada con una `<label>`](#label).
- Utilice los atributos de los elementos para [acceder a las funciones integradas del navegador](#element-attributes): `type`, `name`, `autocomplete`, `required`.
- Otórgueles a los atributos de entrada `name` e `id` valores que no cambien entre cargas de página o implementaciones de sitios web.
- Coloque el inicio de sesión [en su propio elemento &lt;form&gt;](#form).
- [Asegure el envío exitoso del formulario](#submission).
- Utilice [`autocomplete="new-password"`](#new-password) e [`id="new-password"`](#new-password) para ingresar la contraseña en un formulario de registro y para la nueva contraseña en un formulario de restablecimiento de contraseña.
- Utilice [`autocomplete="current-password"`](#current-password) e [`id="current-password"`](#current-password) para ingresar la contraseña de inicio de sesión.
- Proporcione la función [Mostrar contraseña.](#show-password)
- [Utilice `aria-label` y `aria-describedby`](#accessible-password-inputs) para las entradas de contraseñas.
- [No duplique las entradas](#no-double-inputs).
- Diseñe los formularios de manera que el [teclado móvil no oculte las entradas o botones](#keyboard-obstruction).
- Compruebe que los formularios se puedan usar en dispositivos móviles: use [texto legible](#size-text-correctly) y verifique que las entradas y los botones sean lo [suficientemente grandes para funcionar como objetivos táctiles](#tap-targets).
- [Mantenga la marca y el estilo](#general-guidelines) en sus páginas de registro e inicio de sesión.
- [Haga pruebas tanto en el campo como en el laboratorio](#analytics): en su flujo de registro y de inicio de sesión cree análisis de página, análisis de interacción y mediciones de rendimiento centradas en el usuario.
- [Haga pruebas en navegadores y dispositivos](#devices): el comportamiento del formulario varía significativamente entre plataformas.

{% Aside %} Este artículo trata sobre las prácticas recomendadas de frontend. No explica cómo crear servicios de backend para autenticar a los usuarios, almacenar sus credenciales o administrar sus cuentas. Las [12 mejores prácticas para la administración de cuentas de usuario, autorizaciones y contraseñas](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account) describen los principios básicos para ejecutar su propio backend. Si tiene usuarios en diferentes partes del mundo, debe considerar la posibilidad de localizar el uso que hace su sitio de los servicios de identidad de terceros, así como también su contenido.

También hay dos API relativamente nuevas que no se tratan en este artículo, que pueden ayudarlo a crear una mejor experiencia de inicio de sesión:

- [**WebOTP:**](/web-otp/) para enviar códigos de acceso de un solo uso o números PIN a través de SMS a teléfonos móviles. Esto puede permitirles a los usuarios seleccionar un número de teléfono como identificador (¡no es necesario ingresar una dirección de correo electrónico!). Además, también habilita la verificación en dos pasos para el inicio de sesión y los códigos de un solo uso para la confirmación del pago.
- [**Gestión de credenciales**](https://developer.chrome.com/blog/credential-management-api/): para permitir que los desarrolladores almacenen y recuperen las credenciales de contraseña y credenciales federadas mediante programación. {% endAside %}

## Utilice HTML significativo {: #meaningful-html }

Utilice elementos creados para el trabajo: `<form>`, `<label>` y `<button>`. Estos habilitan la funcionalidad incorporada del navegador, mejoran la accesibilidad y agregan significado a su marcado.

### Utilice `<form>` {: #form }

Es posible que tenga la tentación de agrupar las entradas en un `<div>` y manejar el envío de datos de entrada únicamente con JavaScript. Por lo general, es mejor usar un elemento plano [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form) a la antigua. Esto hace que su sitio sea accesible para lectores de pantalla y otros dispositivos de asistencia, habilita una variedad de funciones integradas del navegador, simplifica la creación de un inicio de sesión funcional básico para navegadores más antiguos y aún puede funcionar incluso si JavaScript falla.

{% Aside 'gotchas' %} Un error común es agrupar una página web completa en un solo formulario, pero esto puede causar problemas a los administradores de contraseñas del navegador y a la función autocompletar. Utilice un elemento &lt;form&gt; diferente para cada componente de la interfaz de usuario que necesite un formulario. Por ejemplo, si tiene un inicio de sesión y un espacio de búsqueda en la misma página, debe usar dos elementos de formulario. {% endAside %}

### Utilice `<label>` {: #label }

Para etiquetar una entrada, use un elemento [`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label).

```html
<label for="email">Correo electrónico</label>
<input id="email" …>
```

Dos razones:

- Un toque o clic en una etiqueta mueve el foco hacia su entrada. Asocie una etiqueta con una entrada mediante el atributo `for` de la etiqueta con el atributo `name` o `id` de la entrada.
- Los lectores de pantalla anuncian el texto de la etiqueta cuando la etiqueta o la entrada de la etiqueta se enfocan.

No utilice los marcadores de posición como etiquetas de entrada. Es probable que las personas olviden cuál fue la entrada una vez que hayan comenzado a ingresar texto, especialmente si se distraen ("¿Estaba ingresando una dirección de correo electrónico, un número de teléfono o una identificación de cuenta?"). Hay muchos otros problemas potenciales con los marcadores de posición: consulte [No utilice el atributo de  marcador de posición](https://www.smashingmagazine.com/2018/06/placeholder-attribute/) y [Los marcadores de posición en los campos de formulario son perjudiciales](https://www.nngroup.com/articles/form-design-placeholders/) si no está convencido.

Probablemente sea mejor poner sus etiquetas encima de sus entradas. Esto permite un diseño coherente en dispositivos móviles y de escritorio, además, de acuerdo con la [Investigación de Google sobre la IA](https://ai.googleblog.com/2014/07/simple-is-better-making-your-web-forms.html), permite que los usuarios hagan un escaneo más rápido. Usted obtiene etiquetas y entradas de ancho completo, y no necesita ajustar la etiqueta y el ancho de la entrada para que se ajusten al texto de la etiqueta.

<figure>{% Img src="image/admin/k0ioJa9CqnMI8vyAvQPS.png", alt="Captura de pantalla que muestra la posición de la etiqueta de entrada del formulario en el dispositivo móvil: junto a la entrada y arriba de la entrada", width="500", height="253" %} <figcaption>La etiqueta y el ancho de entrada están limitados cuando ambos están en la misma línea.</figcaption></figure>

Abra el Glitch [posición-de-etiqueta](https://label-position.glitch.me) en un dispositivo móvil para verlo usted mismo.

### Utilice `<button>` {: #button }

Utilice el atributo [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button) para los botones. Los elementos de botón proporcionan un comportamiento accesible y una funcionalidad de envío de formularios incorporada, además se pueden diseñar fácilmente. No tiene sentido usar un `<div>` o algún otro elemento que pretenda ser un botón.

Compruebe que el botón de envío indique lo que hace. Los ejemplos incluyen **Crear una cuenta** o **Iniciar sesión**, pero no **Enviar** o **Iniciar**.

### Asegure el envío correcto del formulario {: #submission }

Ayude a que los administradores de contraseñas a comprendan que se ha enviado un formulario. Hay dos maneras de hacerlo:

- Navegar a una página diferente.
- Emular la navegación con `History.pushState()` o `History.replaceState()` y eliminar el formulario de contraseña.

Con una solicitud `XMLHttpRequest` o `fetch`, verifique que el inicio de sesión se informe correctamente en la respuesta, que se maneje al sacar el formulario del DOM y que se le señale el éxito al usuario.

Considere deshabilitar el botón **Iniciar sesión** una vez que el usuario lo haya tocado o haya hecho clic en él. [Muchos usuarios hacen clic en los botones varias veces](https://baymard.com/blog/users-double-click-online) incluso en sitios que son rápidos y receptivos. Eso ralentiza las interacciones y aumenta la carga del servidor.

Por lo contrario, no desactive el envío de formularios a la espera de la entrada del usuario. Por ejemplo, no deshabilite el botón **Iniciar sesión** si los usuarios no han ingresado su PIN de cliente. Los usuarios pueden pasar por alto algo en el formulario, luego intentarán tocar repetidamente el botón **Iniciar sesión** (deshabilitado) y podrían pensar que no está funcionando. Como mínimo, si debe deshabilitar el envío de formularios, explíquele al usuario lo que falta cuando haga clic en el botón deshabilitado.

{% Aside 'caution' %} El tipo predeterminado para un botón en un formulario es `submit`. Si desea agregar otro botón en un formulario (para **Mostrar la contraseña**, por ejemplo) agregue `type="button"`. De lo contrario, al hacer clic o tocar el botón, se enviará el formulario.

Al presionar la tecla `Enter` mientras cualquier campo del formulario tiene el foco, se simula un clic en el primer botón `submit` del formulario. Si incluye un botón en su formulario antes del botón **Enviar** y no especifica el tipo, ese botón tendrá el tipo predeterminado para los botones en un formulario (`submit`) y recibirá el evento de clic antes de enviar el formulario. Para ver un ejemplo de esto, consulte nuestra [demostración](https://enter-button.glitch.me/): complete el formulario, luego presione `Enter`. {% endAside %}

### No duplique las entradas {: #no-double-inputs }

Algunos sitios obligan a que los usuarios ingresen dos veces los correos electrónicos o contraseñas. Eso podría reducir los errores para algunos usuarios, pero genera un trabajo adicional para *todos* los usuarios y [aumenta las tasas de abandono](https://uxmovement.com/forms/why-the-confirm-password-field-must-die/). Preguntar dos veces tampoco tiene sentido cuando los navegadores completan automáticamente las direcciones de correo electrónico o sugieren contraseñas seguras. Es mejor permitir que los usuarios confirmen su dirección de correo electrónico (deberán hacerlo de todos modos) y facilitarles el restablecimiento de su contraseña si es necesario.

## Aproveche al máximo los atributos de los elementos {: #element-attributes }

¡Aquí es donde realmente ocurre la magia! Los navegadores tienen varias funciones útiles integradas que usan los atributos de los elementos de entrada.

## Mantenga las contraseñas privadas, pero permita que los usuarios las vean si quieren {: #show-password }

Las entradas de contraseñas deben tener el atributo `type="password"` para ocultar el texto de la contraseña y ayudar a que el navegador comprenda que la entrada es para contraseñas. (Tenga en cuenta que los navegadores utilizan [una variedad de técnicas](#autofill) para comprender los roles de entrada y decidir si ofrecer o no la posibilidad de guardar las contraseñas).

Debe agregar un ícono o botón **Mostrar la contraseña** para permitir que los usuarios verifiquen el texto que han ingresado, además no olvide agregar un enlace **¿Olvidó la contraseña?** Consulte [Habilitar la visualización de contraseñas](#password-display).

<figure>{% Img src="image/admin/58suVe0HnSLaJvNjKY53.png", alt="Formulario de inicio de sesión de Google que muestra el ícono Mostrar la contraseña", width="300", height="107" %} <figcaption>Entrada de contraseña desde el formulario de inicio de sesión de Google: con el ícono <strong>Mostrar contraseña</strong> y el enlace <strong>Olvidé la contraseña</strong>.</figcaption></figure>

## Ofrezca el teclado adecuado a los usuarios de dispositivos móviles {: #mobile-keyboards }

Utilice `<input type="email">` para brindarles a los usuarios de dispositivos móviles un teclado adecuado y habilitar la validación básica de direcciones de correo electrónico incorporada mediante el navegador… ¡No se requiere JavaScript!

Si necesita utilizar un número de teléfono en lugar de una dirección de correo electrónico, `<input type="tel">` habilita un teclado telefónico en el móvil. También puede utilizar el atributo `inputmode` cuando sea necesario: `inputmode="numeric"` es ideal para números PIN. Puede encontrar más detalles en [Todo lo que siempre quiso saber sobre el modo de entrada](https://css-tricks.com/everything-you-ever-wanted-to-know-about-inputmode/).

{% Aside 'caution' %} EL atributo `type="number"` agrega una flecha hacia arriba/hacia abajo para incrementar los números. Por lo tanto, no lo use para números que no deben incrementarse, como números de ID y de cuenta. {% endAside %}

### Evite que el teclado móvil obstruya el botón **Iniciar sesión** {: #keyboard-obstruction }

Desafortunadamente, si no tiene cuidado, los teclados móviles pueden cubrir su formulario o, peor aún, obstruir parcialmente el botón **Iniciar sesión**. Los usuarios pueden darse por vencidos antes de darse cuenta de lo que ha sucedido.

<figure>{% Img src="image/admin/rLo5sW9LBpTcJU7KNnb7.png", alt="Dos capturas de pantalla de un formulario de inicio de sesión en un teléfono Android: una que muestra cómo el botón Enviar queda oculto por el teclado del teléfono.", width="400", height="360", class="w-captura de pantalla" %} <figcaption>El botón <b>Iniciar sesión</b>: ahora lo ve, ahora no.</figcaption></figure>

Siempre que sea posible, evite esto al mostrar solo las entradas de correo electrónico, teléfono y contraseña, además del botón **Iniciar sesión** en la parte superior de la página de inicio de sesión. Ponga otro contenido debajo.

<figure>{% Img src="image/admin/0OebKiAP4sTgaXbcbvYx.png", alt="Captura de pantalla de un formulario de inicio de sesión en un teléfono Android: el botón Iniciar sesión no está oculto por el teclado del teléfono.", width="200", height="342" %} <figcaption>El teclado no obstruye el botón <b>Iniciar sesión</b>.</figcaption></figure>

#### Pruebas en una variedad de dispositivos {: #devices }

Deberá realizar pruebas en una variedad de dispositivos para su público objetivo y realizar los ajustes necesarios. BrowserStack permite [realizar pruebas gratuitas para proyectos de código abierto](https://www.browserstack.com/open-source) en una variedad de navegadores y dispositivos reales.

<figure>{% Img src="image/admin/jToMlWgjS3J2WKmjs1hx.png", alt="Capturas de pantalla de un formulario de inicio de sesión en iPhone 7, 8 y 11. En iPhone 7 y 8, el botón Iniciar sesión queda oculto por el teclado del teléfono, pero no en iPhone 11", width="800 ", height=" 522" %} <figcaption> El botón <b>Iniciar sesión</b>: oculto en el iPhone 7 y 8, pero no en el iPhone 11.</figcaption></figure>

#### Considere usar dos páginas {: #two-pages }

Algunos sitios (incluidos Amazon y eBay) evitan el problema al solicitar el correo electrónico, el teléfono y la contraseña en dos páginas. Este enfoque también simplifica la experiencia: el usuario solo tiene la tarea de una cosa a la vez.

<figure>{% Img src="image/admin/CxpObjYZMs0MMFo66f4P.png", alt="Captura de pantalla de un formulario de inicio de sesión en el sitio web de Amazon: correo electrónico, teléfono y contraseña en dos 'páginas' separadas.", width="400", height="385" %} <figcaption>Inicio de sesión en dos etapas: correo electrónico o teléfono, luego contraseña.</figcaption></figure>

Idealmente, esto debería implementarse con un solo elemento &lt;form&gt;. Use JavaScript para mostrar inicialmente solo la entrada de correo electrónico, luego ocúltela y muestre la entrada de contraseña. Si debe obligar a que el usuario navegue a una nueva página entre el ingreso de su correo electrónico y la contraseña, el formulario en la segunda página debe tener un elemento de entrada oculto con el valor del correo electrónico, para ayudar a que los administradores de contraseñas almacenen el valor correcto. Un ejemplo de código se proporciona en [Estilos de formulario de contraseña que Chromium entiende](https://www.chromium.org/developers/design-documents/form-styles-that-chromium-understands).

### Ayude a que los usuarios eviten ingresar de nuevo los datos {: #autofill }

Puede ayudar a que los navegadores almacenen los datos correctamente y que completen automáticamente las entradas, para que los usuarios no tengan que acordarse de ingresar los valores de correo electrónico y contraseña. Esto es particularmente importante en dispositivos móviles y es crucial para las entradas de correo electrónico, que obtienen [tasas altas de abandono](https://www.formisimo.com/blog/conversion-rate-increases-57-with-form-analytics-case-study/).

Hay dos partes en esto:

1. Los atributos `autocomplete`, `name`, `id` y `type` ayudan a que los navegadores comprendan el papel de las entradas, para almacenar datos que luego se pueden usar para llenar automáticamente los campos. Para permitir que los datos se almacenen para llenarlos automáticamente, los navegadores modernos también requieren que las entradas tengan un valor `name` o `id` estable (no generado aleatoriamente en cada carga de página o implementación del sitio) y que estén en un &lt;formulario&gt; con un botón `submit`.

2. El atributo `autocomplete` ayuda a que los navegadores completen automáticamente y de manera correcta las entradas mediante los datos almacenados.

Para las entradas de correo electrónico, use `autocomplete="username"`, ya que los gestores de contraseñas en los navegadores modernos reconocen `username`, aunque debe usar `type="email"`, además quizá desee usar `id="email"` y `name="email"`.

Para las entradas de contraseña, use los valores `autocomplete` e `id` apropiados para ayudar a que los navegadores diferencien entre contraseñas nuevas y actuales.

### Use `autocomplete="new-password"` e `id="new-password"` para una nueva contraseña {: #new-password }

- Use `autocomplete="new-password"` e `id="new-password"` para ingresar la contraseña en un formulario de registro o la nueva contraseña en un formulario de cambio de contraseña.

### Use `autocomplete="current-password"` e `id="current-password"` para una contraseña existente {: #current-password }

- Use `autocomplete="current-password"` e `id="current-password"` para ingresar la contraseña en un formulario de inicio de sesión o para ingresar la contraseña anterior del usuario en un formulario de cambio de contraseña. Esto le indica al navegador que usted desea que use la contraseña actual que tiene almacenada para el sitio.

Para un formulario de registro:

```html
<input type="password" autocomplete="new-password" id="new-password" …>
```

Para inicio de sesión:

```html
<input type="password" autocomplete="current-password" id="current-password" …>
```

{% Aside %} Los navegadores como Chrome pueden usar el administrador de contraseñas del navegador para completar automáticamente los campos en el proceso de inicio de sesión para los usuarios recurrentes. Para que estas características funcionen, el navegador debe tener la capacidad de distinguir cuando un usuario cambia su contraseña.

Específicamente, el formulario para cambiar la contraseña del usuario debe borrarse u ocultarse de la página después de configurar la nueva contraseña. Si el formulario para cambiar la contraseña del usuario permanece completo en la página después de que se haya producido el cambio de contraseña, es posible que el navegador no pueda registrar la actualización. {% endAside %}

### Admita los administradores de contraseñas {: #password-managers }

Los diferentes navegadores manejan el llenado automático del correo electrónico y la sugerencia de contraseñas de manera algo diferente, pero los efectos son muy parecidos. En Safari 11 y versiones superiores en equipos de escritorio, por ejemplo, se muestra el administrador de contraseñas y luego se usa la autenticación biométrica (reconocimiento de huellas dactilares o facial) si está disponible.

<figure>{% Img src="image/admin/UjBRRYaLbX9bh3LDFcAM.png", alt="Capturas de pantalla de tres etapas del proceso de inicio de sesión en Safari en equipos de escritorio: administrador de contraseñas, autenticación biométrica, llenado automático.", width="800", height= "234" %}<figcaption> Inicio de sesión con llenado automático, ¡no es necesario ingresar texto!</figcaption></figure>

En equipos de escritorio, Chrome muestra sugerencias de correo electrónico, muestra el gestor de contraseñas y llena automáticamente la contraseña.

<figure>{% Img src="image/admin/mDm1cstWZB9jJDzMmzgE.png", alt="Capturas de pantalla de cuatro etapas del proceso de inicio de sesión en Chrome en equipos de escritorio: completar el correo electrónico, sugerencia de correo electrónico, administrador de contraseñas, llenado automático durante la selección.", width="800", height="232" %} <figcaption>Flujo de inicio de sesión con llenado automático en Chrome 84.</figcaption></figure>

Los sistemas de llenado automático y de contraseñas del navegador no son sencillos. Los algoritmos para adivinar, almacenar y mostrar los valores no están estandarizados y varían de una plataforma a otra. Por ejemplo, como lo señaló [Hidde de Vries](https://hiddedevries.nl/en/blog/2018-01-13-making-password-managers-play-ball-with-your-login-form): "El gestor de contraseñas de Firefox complementa su heurística con un [sistema de recetas](https://bugzilla.mozilla.org/show_bug.cgi?id=1119454)".

El documento [Llenado automático: lo que los desarrolladores web deben saber, pero no saben](https://cloudfour.com/thinks/autofill-what-web-devs-should-know-but-dont) tiene mucha más información sobre el uso de `name` y `autocomplete`. La [especificación HTML](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#inappropriate-for-the-control) enumera los 59 valores posibles.

{% Aside %} Usted puede ayudar a los gestores de contraseñas mediante el uso de diferentes valores `name` e `id` en los formularios de registro y de inicio de sesión, para el elemento `form` en sí, así como también para cualquier elemento `input`, `select` y `textarea`. {% endAside %}

### Habilite la opción para que el navegador sugiera una contraseña segura {: #password-suggestions }

Los navegadores modernos utilizan la heurística para decidir cuándo mostrar la interfaz de usuario del gestor de contraseñas y sugerir una contraseña segura.

Así es como Safari lo hace en equipos de escritorio.

<figure>{% Img src="image/admin/B1DlZK0CllVjrOUbb5xB.png", alt="Captura de pantalla del administrador de contraseñas de Firefox en el escritorio", width="800", height="229" %} <figcaption> Flujo de sugerencia de contraseñas en Safari.</figcaption></figure>

(La sugerencia de contraseñas únicas y fuertes ha estado disponible en Safari desde la versión 12.0).

La presencia de generadores de contraseñas incorporados en el navegador significa que los usuarios y desarrolladores no necesitan averiguar qué es una "contraseña segura". Dado que los navegadores pueden almacenar contraseñas de forma segura y llenarlas automáticamente según se necesite, no es necesario que los usuarios recuerden o ingresen contraseñas. Alentar a los usuarios a aprovechar los generadores de contraseñas integrados en el navegador también significa que es más probable que utilicen una contraseña única y segura en su sitio, y es menos probable que reutilicen una contraseña que podría verse comprometida en otro lugar.

{% Aside %} La desventaja de este enfoque es que no hay forma de compartir las contraseñas entre plataformas. Por ejemplo, un usuario puede usar Safari en su iPhone y Chrome en su computadora portátil con Windows. {% endAside %}

### Ayude a que los usuarios eviten pasar por alto entradas accidentalmente {: #required-fields }

Agregue el atributo `required` a los campos de correo electrónico y contraseña. Los navegadores modernos solicitan y establecen automáticamente el enfoque en los datos faltantes. ¡No se requiere JavaScript!

<figure>{% Img src="image/admin/n5Nr290upVmQGvlc263U.png", alt="Captura de pantalla de Firefox y Chrome para Android de equipos de escritorio que muestra el mensaje 'Complete este campo' para los datos que faltan.", width="600", height="392" %}<figcaption> Solicitud y enfoque sobre los datos faltantes en Firefox para equipos de escritorio (versión 76) y Chrome para Android (versión 83).</figcaption></figure>

## Diseñe para dedos y pulgares {: #mobile-design }

El tamaño predeterminado del navegador para casi todo lo relacionado con los elementos de entrada y los botones es demasiado pequeño, especialmente en dispositivos móviles. Esto puede parecer obvio, pero es un problema común con los formularios de inicio de sesión en muchos sitios.

### Compruebe que las entradas y los botones sean lo suficientemente grandes {: #tap-targets }

El tamaño y el relleno predeterminados para las entradas y los botones es demasiado pequeño en equipos de escritorio e incluso peor en los móviles.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lJNO6w2dOyp4cYKl5b3y.png", alt="Captura de pantalla de un formulario sin estilo en Chrome para equipos de escritorio y Chrome para Android.", width="800", height="434" %}</figure>

Según la [Guía de accesibilidad de Android](https://support.google.com/accessibility/android/answer/7101858?hl=en-GB), el tamaño objetivo recomendado para los objetos de la pantalla táctil es de 7 a 10 mm. Las pautas de la interfaz de Apple sugieren 48x48 px, y el W3C sugiere [al menos 44x44 píxeles CSS](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html). Sobre esa base, agregue (al menos) alrededor de 15 px de relleno a los elementos de entrada y botones para dispositivos móviles, y alrededor de 10 px en dispositivos de escritorio. Pruebe esto con un dispositivo móvil real y un dedo o pulgar real. Debería estar en capacidad de tocar cómodamente cada una de sus entradas y botones.

La auditoría de Lighthouse [Los objetivos táctiles no tienen el tamaño adecuado](https://developer.chrome.com/docs/lighthouse/seo/http-status-code/) puede ayudarlo a automatizar el proceso de detección de elementos de entrada que son demasiado pequeños.

#### Diseñe para pulgares {: #design-for-thumbs }

Haga una búsqueda por [objetivo táctil](https://www.google.com/search?q=touch+target) y verá muchas imágenes de dedos índices. Sin embargo, en el mundo real, muchas personas usan sus pulgares para interactuar con los teléfonos. Los pulgares son más grandes que los índices y el control es menos preciso. Razón de más para objetivos táctiles de tamaño adecuado.

### Haga que el texto sea lo suficientemente grande {: #size-text-correctly }

Al igual que con el tamaño y el relleno, el tamaño de fuente predeterminado del navegador para los elementos de entrada y los botones es demasiado pequeño, especialmente en dispositivos móviles.

<figure>{% Img src="image/admin/EeIsqWhLbot15p4SYpo2.png", alt="Captura de pantalla de un formulario sin estilo en Chrome en equipos de escritorio y en Android.", width="800", height="494"%} <figcaption>Estilo predeterminado en equipos de escritorio y dispositivos móviles: el texto de entrada es demasiado pequeño como para que muchos usuarios lo puedan leer.</figcaption></figure>

Los navegadores de diferentes plataformas dimensionan las fuentes de manera diferente, por lo que es difícil especificar un tamaño de fuente en particular que funcione bien en todas partes. Una encuesta rápida de sitios web populares muestra tamaños de 13 a 16 píxeles en equipos escritorio: hacer coincidir ese tamaño físico es un buen punto mínimo para el texto en dispositivos móviles.

Esto significa que debe usar un tamaño de píxeles más grande en el dispositivo móvil: un tamaño de `16px` en Chrome para equipos de escritorio es bastante legible, pero incluso con una buena visión es difícil leer `16px` en Chrome para Android. Puede establecer diferentes tamaños de píxeles de fuente para diferentes tamaños de ventana gráfica mediante las [consultas de medios](https://developers.google.com/web/fundamentals/design-and-ux/responsive#apply_media_queries_based_on_viewport_size). Un tamaño de `20px` es adecuado en dispositivos móviles, pero debe probarlo con amigos o colegas que tengan problemas de visión.

La auditoría de Lighthouse [El documento no usa tamaños de fuente legibles](https://developer.chrome.com/docs/lighthouse/seo/font-size/) puede ayudarlo a automatizar el proceso de detección de texto que es demasiado pequeño.

### Proporcione suficiente espacio entre las entradas {: #size-margins-correctly }

Agregue suficiente margen para que las entradas funcionen bien como objetivos táctiles. En otras palabras, apunte a aproximadamente un dedo de ancho de margen.

### Verifique que sus entradas se puedan ver claramente {: #visible-inputs }

El estilo de borde predeterminado para las entradas hace que sean difíciles de ver. Son casi invisibles en algunas plataformas como Chrome para Android.

Además del relleno, agregue un borde: sobre un fondo blanco, una buena regla general es usar `#ccc` o uno más oscuro.

<figure>{% Img src="image/admin/OgDJ5V2N7imHXSBkN4pr.png", alt="Captura de pantalla de un formulario con estilo en Chrome para Android", width="250", height="525" %} <figcaption>Texto legible, bordes de entrada visibles, relleno y márgenes adecuados.</figcaption></figure>

### Utilice las funciones integradas del navegador para advertir sobre valores de entrada inválidos {: #built-in-validation }

Los navegadores tienen funciones integradas para realizar una validación de formulario básica para las entradas con un atributo `type`. Los navegadores advierten cuando se envía un formulario con un valor inválido y enfocan la entrada problemática.

<figure>{% Img src="image/admin/Phf9m5J66lIX9x5brzOL.png", alt="Captura de pantalla de un formulario de inicio de sesión en Chrome para equipos de escritorio que muestra el mensaje del navegador y el foco en un valor de correo electrónico inválido.", width="300", height="290"%} <figcaption>Validación básica incorporada en el navegador.</figcaption></figure>

Puede utilizar el selector CSS `:invalid` para resaltar los datos inválidos. Utilice `:not(:placeholder-shown)` para evitar la selección de entradas sin contenido.

```css
input[type=email]:not(:placeholder-shown):invalid {
  color: red;
  outline-color: red;
}
```

Pruebe diferentes formas de resaltar las entradas con valores inválidos.

## Utilice JavaScript cuando sea necesario {: #javascript }

### Alterne la visualización de contraseñas {: #password-display }

Debe agregar un ícono o botón **Mostrar contraseña** para permitir que los usuarios verifiquen el texto que ingresaron. [La usabilidad se ve afectada](https://www.nngroup.com/articles/stop-password-masking/) cuando los usuarios no pueden ver el texto que ingresaron. Actualmente no hay una forma incorporada de hacer esto, aunque [hay planes de implementación](https://twitter.com/sw12/status/1251191795377156099). Deberá utilizar JavaScript en su lugar.

<figure><img src="./show-password-google.png" width="350" alt="Formulario de inicio de sesión de Google que muestra el icono Mostrar contraseña."> <figcaption>Formulario de inicio de sesión de Google: con el icono <strong>Mostrar contraseña</strong> y el enlace <strong>Olvidé mi contraseña</strong>.</figcaption></figure>

El siguiente código usa un botón de texto para agregar la funcionalidad **Mostrar contraseña**.

HTML:

```html/2
<section>
  <label for="password">Contraseña</label>
  <button id="toggle-password" type="button" aria-label="Muestra la contraseña como texto plano. Advertencia: esto hará que se muestre su contraseña en la pantalla.">Mostrar contraseña</button>
  <input id="password" name="password" type="password" autocomplete="current-password" required>
</section>
```

Éste es el CSS para hacer que el botón luzca como texto sin formato:

```css
button#toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  /* La consulta de medios no se muestra aquí. */
  font-size: var(--mobile-font-size);
  font-weight: 300;
  padding: 0;
  /* Mostrar en la parte superior derecha del contenedor */
  position: absolute;
  top: 0;
  right: 0;
}
```

Y el JavaScript para mostrar la contraseña:

```js
const passwordInput = document.getElementById('password');
const togglePasswordButton = document.getElementById('toggle-password');

togglePasswordButton.addEventListener('click', togglePassword);

function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordButton.textContent = 'Ocultar contraseña';
    togglePasswordButton.setAttribute('aria-label',
      'Oculta la contraseña.');
  } else {
    passwordInput.type = 'password';
    togglePasswordButton.textContent = 'Mostrar contraseña';
    togglePasswordButton.setAttribute('aria-label',
      'Muestra la contraseña como texto plano. ' +
      'Advertencia: esto hará que se muestre su contraseña en la pantalla.');
  }
}
```

Éste es el resultado final:

<figure>{% Img src="image/admin/x4NP9JMf1KI8PapQ9JFh.png", alt="Capturas de pantalla del formulario de inicio de sesión con el 'botón' de texto Mostrar la contraseña, en Safari para Mac y para iPhone 7.", width= "800", height="468" %} <figcaption>Formulario de inicio de sesión con el 'botón' de texto <strong>Mostrar la contraseña</strong> en Safari para Mac y iPhone 7.</figcaption></figure>

### Haga que las entradas de contraseña sean accesibles {: #accessible-password-inputs }

Utilice `aria-describedby` para delinear las reglas de contraseñas al indicarle la ID del elemento que describe las restricciones. Los lectores de pantalla proporcionan el texto de la etiqueta, el tipo de entrada (contraseña) y luego la descripción.

```html
<input type="password" aria-describedby="password-constraints" …>
<div id="password-constraints">Ocho o más caracteres con una combinación de letras, números y símbolos.</div>
```

Cuando agregue la funcionalidad **Mostrar contraseña**, asegúrese de incluir un atributo `aria-label` para advertir que se mostrará la contraseña. De lo contrario, los usuarios pueden revelar las contraseñas inadvertidamente.

```html/1-2
<button id="toggle-password"
        aria-label="Muestra la contraseña como texto plano.
                    Advertencia: esto hará que se muestre su contraseña en la pantalla.">
  Mostrar contraseña
</button>
```

Puede ver ambas funciones ARIA en acción en el siguiente error:

{% Glitch { id: 'sign-in-form', path: 'index.html', height: 480 } %}

El documento [Crear formularios accesibles](https://webaim.org/techniques/forms/) tiene más consejos para ayudar a que los formularios sean accesibles.

### Validar en tiempo real y antes del envío {: #validation }

Los elementos y atributos del formulario HTML tienen funciones integradas para la validación básica, pero también debe usar JavaScript para realizar una validación más sólida durante el ingreso de datos por parte de los usuarios y cuando intentan enviar el formulario.

{% Aside 'warning' %} La validación del lado del cliente ayuda a los usuarios durante el ingreso de datos y puede evitar una carga innecesaria del servidor, pero siempre debe validar y desinfectar los datos en su backend. {% endAside %}

El [paso 5](https://glitch.com/edit/#!/sign-in-form-codelab-5) del laboratorio de códigos del formulario de inicio de sesión usa la [API de validación de restricciones](https://html.spec.whatwg.org/multipage/forms.html#constraints) (que es [ampliamente compatible](https://caniuse.com/#feat=constraint-validation)) para agregar validación personalizada mediante la interfaz de usuario incorporada en el navegador para establecer el enfoque y mostrar los mensajes.

Obtenga más información en: [Use JavaScript para una validación más compleja en tiempo real](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation).

### Análisis y RUM {: #analytics }

"Lo que no se puede medir, no se puede mejorar" es particularmente cierto para los formularios de registro y de inicio de sesión. Necesita establecer metas, medir el éxito, mejorar su sitio y repetir.

Las [pruebas de usabilidad de saldo](https://www.nngroup.com/articles/discount-usability-20-years/) pueden ser útiles para probar cambios, pero necesitará datos del mundo real para comprender realmente la manera en que los usuarios experimentan sus formularios de registro y de inicio de sesión:

- **Análisis de páginas**: vistas de páginas de registro e inicio de sesión, tasas de rebote y salidas.
- **Análisis de interacción**: [embudos de objetivos](https://support.google.com/analytics/answer/6180923?hl=en) (¿dónde abandonan los usuarios su inicio de sesión o flujo de inicio de sesión?) y [eventos](https://developers.google.com/analytics/devguides/collection/gtagjs/events) (¿qué acciones realizan los usuarios al interactuar con sus formularios?).
- **Rendimiento del sitio web**: [mediciones centradas en el usuario](/user-centric-performance-metrics) (¿son sus formularios de registro e inicio de sesión lentos por algún motivo y, de ser así, cuál es la causa?).

Es posible que también desee considerar la implementación de pruebas A/B para probar diferentes enfoques para el registro y el inicio de sesión, además de los lanzamientos escalonados para validar los cambios en un subconjunto de usuarios antes de publicar los cambios para todos los usuarios.

## Directrices generales {: #general-guidelines }

Una interfaz de usuario y una experiencia de usuario bien diseñadas pueden reducir el abandono del formulario de inicio de sesión:

- ¡Evite que los usuarios tengan que buscar el inicio de sesión! Coloque un enlace al formulario de inicio de sesión en la parte superior de la página, utilice un texto fácil de entender como **Iniciar sesión**, **Crear cuenta** o **Registrarse**.
- ¡Manténgalo enfocado! Los formularios de registro no son el lugar para distraer a las personas con ofertas y otras características del sitio.
- Minimice la complejidad del registro. Recopile otros datos del usuario (como direcciones o detalles de tarjetas de crédito) solo cuando los usuarios vean un beneficio claro para proporcionar esos datos.
- Antes de que los usuarios comiencen con su formulario de registro, deje en claro cuál es la propuesta de valor. ¿Cómo se benefician al registrarse? Ofrézcales a los usuarios incentivos concretos para completar el registro.
- Si es posible, permita que los usuarios se identifiquen con un número de teléfono móvil en lugar de una dirección de correo electrónico, ya que es posible que algunos usuarios no utilicen el correo electrónico.
- Facilite a los usuarios el restablecimiento de su contraseña y haga que el enlace "**¿Olvidó su contraseña?**" sea obvio.
- Enlace a los documentos de sus condiciones de servicio y política de privacidad: déjele claro a los usuarios desde el principio cómo protege sus datos.
- Incluya el logotipo y el nombre de su empresa u organización en sus páginas de registro e inicio de sesión, además verifique que el idioma, las fuentes y los estilos coincidan con el resto de su sitio. Algunos formularios no parecen pertenecer al mismo sitio que otro contenido, especialmente si tienen una URL significativamente diferente.

## Siga aprendiendo {: #resources }

- [Cree formas asombrosas](/learn/forms/)
- [Prácticas recomendadas para el diseño de formularios para dispositivos móviles](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [Controles de formulario más capaces](/more-capable-form-controls)
- [Crear formularios accesibles](https://webaim.org/techniques/forms/)
- [Optimización del flujo de inicio de sesión mediante la API de gestión de credenciales](https://developer.chrome.com/blog/credential-management-api/)
- [Verifique los números de teléfono en la web con la API de WebOTP](/web-otp/)

Foto de [Meghan Schiereck](https://unsplash.com/photos/_XFObcM_7KU) en [Unsplash](https://unsplash.com).
