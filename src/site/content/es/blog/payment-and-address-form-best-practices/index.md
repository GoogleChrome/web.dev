---
title: Mejores prácticas de formulario de pago y dirección
subhead: Maximice las conversiones ayudando a sus usuarios a llenar los formularios de dirección y pago de la manera más rápida y sencilla posible.
authors:
  - samdutton
scheduled: verdadero
date: 2020-12-09
updated: 2021-11-30
description: Maximice las conversiones ayudando a sus usuarios a llenar los formularios de dirección y pago de la manera más rápida y sencilla posible.
hero: image/admin/dbYeeV2PCRZNY6RRvQd2.jpg
thumbnail: image/admin/jy8z8lRuLmmnyytD5xwl.jpg
alt: Hombre de negocios usando una tarjeta de pago para hacer un pago en una computadora portátil.
tags:
  - blog
  - forms
  - identity
  - layout
  - mobile
  - payments
  - security
  - ux
codelabs:
  - laboratorio-de-código-mejores-prácticas-formulario-pago
  - laboratorio-de-código-mejores-prácticas-formulario-dirección
---

{% YouTube 'xfGKmvvyhdM' %}

Los formularios bien diseñados ayudan a los usuarios y aumentan las tasas de conversión. ¡Una pequeña mejora puede marcar una gran diferencia!

{% Aside 'codelab' %} Si prefiere aprender estas prácticas recomendadas con un tutorial práctico, consulte los dos laboratorios de código para esta publicación:

- [Laboratorio de código de mejores prácticas de formulario de pago](/codelab-payment-form-best-practices)
- [Laboratorio de código de prácticas recomendadas del formulario de direcciones](/codelab-address-form-best-practices) {% endAside %}

A continuación, se muestra un ejemplo de un formulario de pago simple que muestra todas las mejores prácticas:

{% Glitch { id: 'payment-form', path: 'index.html', height: 720 } %}

A continuación, se muestra un ejemplo de un formulario de dirección simple que demuestra todas las mejores prácticas:

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

## Lista de verificación

- [Utilice elementos HTML significativos](#meaningful-html) : `<form>` , `<input>` , `<label>` y `<button>` .
- [Etiquete cada campo de formulario con una `<label>`](#html-label) .
- Utilice los atributos de los elementos HTML para [acceder a las funciones integradas del navegador](#html-attributes) , en particular, [`type`](#type-attribute) y [`autocomplete`](#autocomplete-attribute) con los valores adecuados.
- Evite usar `type="number"` para números que no necesiten incrementarse, como los números de tarjetas de pago. Utilice `type="text"` y [`inputmode="numeric"`](#inputmode-attribute) en su lugar.
- Si un [valor de autocompletar apropiado](#autocomplete-attribute) está disponible para una `input` , `select` o `textarea`, debe usarlo.
- Para ayudar a los navegadores a completar automáticamente los formularios, asigne [valores estables](#stable-name-id) a los atributos   de entrada `name` e `id` que no cambien entre cargas de página o implementaciones de sitios web.
- [Deshabilite los botones de envío](#disable-submit) una vez que los haya tocado o hecho clic.
- [Valide los](#validate) datos durante el ingreso, no solo al enviar el formulario.
- Haga que la opción [pagar como invitado](#guest-checkout) sea la predeterminada y simplifique la creación de la cuenta una vez que se complete el pago.
- Muestre el [progreso a través del proceso de pago](#checkout-progress) en pasos claros con claras llamadas a la acción.
- [Limite los posibles puntos de salida del proceso de pago](#reduce-checkout-exits) eliminando el desorden y las distracciones.
- [Muestre los detalles completos del pedido](#checkout-details) al finalizar la compra y haga fácil hacer ajustes al pedido.
- [No pida datos que no necesite](#unneeded-data) .
- [Pida nombres con un solo campo de entrada](#single-name-input) a menos que tenga una buena razón para no hacerlo.
- [No exija caracteres exclusivamente latinos](#unicode-matching) para los nombres y los nombres de usuario.
- [Permita una variedad de formatos de dirección](#address-variety) .
- Considere usar un [solo campo `textarea` para la dirección](#address-textarea) .
- Utilice la función de [autocompletar para la dirección de facturación](#billing-address) .
- [Internacionalice y localice](#internationalization-localization) cuando sea necesario.
- Considere evitar [la búsqueda de direcciones de códigos postales](#postal-code-address-lookup) .
- Utilice [los valores de autocompletado de tarjetas de pago adecuados](#payment-form-autocomplete) .
- Utilice un [único campo de entrada para los números de tarjetas de pago](#single-number-input) .
- [Evite el uso de elementos personalizados](#avoid-custom-elements) si rompen la experiencia de autocompletar.
- [Haga pruebas tanto en vivo como en el laboratorio](#analytics-rum): análisis de páginas, análisis de interacciones y medición del rendimiento del usuario real.
- [Pruebe en una variedad de navegadores, dispositivos y plataformas](#test-platforms) .

{% Aside %} Este artículo trata sobre las mejores prácticas de frontend para formularios de dirección y pago. No explica cómo implementar transacciones en su sitio. Para obtener más información sobre cómo agregar funciones de pago a su sitio web, consulte [Pagos web](/payments). {% endAside %}

## Utilice HTML significativo {: #meaningful-html}

Utilice los elementos y atributos creados específicamente para cada caso:

- `<form>`, `<input>`, `<label>` y `<button>`
- `type`, `autocomplete` e `inputmode`

Estos habilitan las funcionalidades incorporadas del navegador, mejoran la accesibilidad y agregan significado a su código.

### Utilice los elementos HTML adecuadamente {: #html-elements}

#### Ponga su formulario en un &lt;form&gt; {: #html-form}

Es posible que tenga la tentación de no molestarse en envolver sus `<input>` en un `<form>` y de manejar el envío de datos únicamente con JavaScript.

¡No lo hagas!

Un `<form>` HTML le brinda acceso a un poderoso conjunto de funciones integradas en todos los navegadores modernos y puede ayudar a que su sitio sea accesible para lectores de pantalla y otros dispositivos de asistencia. Un `<form>` también simplifica la creación de funciones básicas para navegadores más antiguos con soporte de JavaScript limitado y para habilitar el envío de formularios incluso si hay un problema con su código, y para la pequeña cantidad de usuarios que sí deshabilitan JavaScript.

Si tiene más de un componente de página para la entrada del usuario, asegúrese de poner cada uno en su propio elemento `<form>` Por ejemplo, si tiene la búsqueda y el registro en la misma página, coloque cada uno en su propio `<form>` .

#### Use `<label>` para etiquetar elementos {: #html-label}

Para etiquetar una `<input>`, `<select>` o `<textarea>`, use una [`<label>`](https://developer.mozilla.org/docs/Web/HTML/Element/label).

Asocie una etiqueta con una entrada dando al atributo `for` de la etiqueta el mismo valor que el `id` de la entrada.

```html
<label for="address-line1">Address line 1</label>
<input id="address-line1" …>
```

Use una sola etiqueta para una sola entrada: no intente etiquetar varias entradas con una sola etiqueta. Los navegadores y lectores de pantalla trabajan mejor así. Un toque o clic en una etiqueta mueve el enfoque a la entrada con la que está asociada, y los lectores de pantalla anuncian el texto de la *etiqueta* cuando reciben el foco la etiqueta o la *entrada* de la etiqueta.

{% Aside 'caution' %} No utilice [marcadores](https://www.smashingmagazine.com/2018/06/placeholder-attribute/) de posición por sí solos en lugar de etiquetas. Una vez que comienza a ingresar texto en una entrada, el marcador de posición se oculta, por lo que puede ser fácil olvidar para qué sirve la entrada. Lo mismo ocurre si usa el marcador de posición para mostrar el formato correcto para valores como fechas. Esto puede ser especialmente problemático para los usuarios de teléfonos, especialmente si están distraídos o estresados. {% endAside %}

#### Haga que los botones sean útiles {: #html-button}

Utilice [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button) para los botones. También puede usar `<input type="submit">`, pero no use un `div` o algún otro elemento aleatorio para actuar como botón. Los elementos de botón brindan un comportamiento accesible, funcionalidad de envío de formularios incorporada y se pueden diseñar fácilmente.

Asigne a cada botón de envío de formulario un valor que indique lo que hace. Para cada paso hacia el pago, use una llamada a la acción descriptiva que muestre el progreso y haga que el siguiente paso sea obvio. Por ejemplo, etiquete el botón Enviar en el formulario de dirección de entrega **Continuar con el pago en** lugar de **Continuar** o **Guardar** .

{: #disable-submit}

Considere deshabilitar un botón de envío una vez que el usuario lo haya tocado o hecho clic, especialmente cuando el usuario está realizando un pago o un pedido. Muchos usuarios hacen clic en los botones repetidamente, incluso si funcionan bien. Eso puede estropear el pago y aumentar la carga del servidor.

Por otro lado, no desactive un botón de envío esperando una entrada completa y válida del usuario. Por ejemplo, no deje un botón **Guardar dirección** deshabilitado porque falta algun dato o no es válida. Eso no ayuda al usuario; quizá siga tocando o haciendo clic en el botón y asuma que no funciona. En cambio, si los usuarios intentan enviar un formulario con datos no válidos, explíqueles qué salió mal y qué hacer para solucionarlo. Esto es particularmente importante en dispositivos móviles, donde la entrada de datos es más difícil y es posible que los datos del formulario faltantes o no válidos no sean visibles en la pantalla del usuario en el momento en que intenta enviarlo.

{% Aside 'caution' %} El tipo predeterminado para un botón en un formulario es `submit`. Si desea agregar otro botón en un formulario (para **Mostrar contraseña**, por ejemplo) agregue `type="button"`. De lo contrario, al hacer clic o tocar el botón, se enviará el formulario.

Al presionar `Enter` mientras cualquier campo del formulario tiene el foco, se simula un clic en el primer `submit` del formulario. Si incluye un botón en su formulario antes del botón **Enviar** y no especifica el tipo, ese botón tendrá el tipo predeterminado para los botones en un formulario (`submit`) y recibirá el evento de clic antes de enviar el formulario. Para ver un ejemplo de esto, vea nuestra [demostración](https://enter-button.glitch.me/): complete el formulario, luego presione `Enter`. {% endAside %}

### Aproveche al máximo los atributos HTML {: #html-attribute}

#### Facilite a los usuarios el ingreso de datos

{: #type-attribute}

Utilice el [atributo](https://developer.mozilla.org/docs/Web/HTML/Element/input/email) `type` apropiado de la entrada para proporcionar el teclado correcto en el dispositivo móvil y habilitar la validación básica incorporada por parte del navegador.

Por ejemplo, use `type="email"` para direcciones de correo electrónico y `type="tel"` para números de teléfono.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bi7J9Z1TLP4IsQLyhbQm.jpg", alt="Dos capturas de pantalla de teléfonos Android, que muestran un teclado apropiado para ingresar una dirección de correo electrónico (usando type = email) y para ingresar un número de teléfono (con type = tel ). ", width="800", height="683" %}<figcaption> Teclados apropiados para correo electrónico y teléfono.</figcaption></figure>

{: #inputmode-attribute}

{% Aside 'warning' %} El uso de type="number" agrega una flecha hacia arriba/hacia abajo para incrementar los números, lo que no tiene sentido para datos como el teléfono, la tarjeta de pago o los números de cuenta.

Para números como estos, establezca `type="text"` (u omita el atributo, ya que el predeterminado es `text`). Para números de teléfono, use `type="tel"` para obtener el teclado apropiado en el móvil. Para otros números, use `inputmode="numeric"` para obtener un teclado numérico en el móvil.

Algunos sitios todavía usan `type="tel"` para los números de tarjetas de pago para garantizar que los usuarios de dispositivos móviles obtengan el teclado correcto. Sin embargo, `inputmode` es [ampliamente compatible ahora](https://caniuse.com/input-inputmode), por lo que no debería tener que hacerlo, pero verifique  las especificaciones de los navegadores de sus usuarios. {% endAside %}

{: #avoid-custom-elements}

Para las fechas, intente evitar el uso de elementos `select` personalizados. Interfieren con la experiencia de autocompletar si no se implementan correctamente y no funcionan en navegadores más antiguos. Para números como el año de nacimiento, considere usar un elemento `input` en lugar de un `select`, ya que ingresar dígitos manualmente puede ser más fácil y menos propenso a errores que seleccionar de una lista desplegable larga, especialmente en dispositivos móviles. Utilice `inputmode="numeric"` para asegurarse de que el teclado del dispositivo móvil sea el correcto y agregue sugerencias de validación y formato con texto o un marcador de posición para asegurarse de que el usuario ingrese los datos en el formato adecuado.

{% Aside %} El elemento [`datalist`](https://developer.mozilla.org/docs/Web/HTML/Element/datalist) permite al usuario seleccionar entre una lista de opciones disponibles y proporciona sugerencias de coincidencias según el usuario introduce texto. Pruebe `datalist` para entradas de `text`, `range` y `color` en [simpl.info/datalist](https://simpl.info/datalist). Para el ingreso del año de nacimiento, puede comparar un `select` con un `input` y un `datalist` en [datalist-select.glitch.me](https://datalist-select.glitch.me). {% endAside %}

#### Utilice la función de autocompletar para mejorar la accesibilidad y ayudar a los usuarios a evitar volver a ingresar datos {: #autocomplete-attribute}

El uso apropiado de `autocomplete` permite a los navegadores ayudar a los usuarios almacenando datos de forma segura y autocompletando valores de `input` , `select` y `textarea` Esto es particularmente importante en dispositivos móviles y crucial para evitar [altas tasas de abandono de formularios](https://www.zuko.io/blog/8-surprising-insights-from-zukos-benchmarking-data) . Autocompletar también ofrece [múltiples beneficios de accesibilidad](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html) .

Si un valor de autocompletar apropiado está disponible para un campo de formulario, debe usarlo. [Los documentos web de MDN](https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete) tienen una lista completa de valores y explicaciones sobre cómo usarlos correctamente.

{: #stable-name-id

{% Aside %} Además de usar los valores de autocompletar apropiados, ayude a los navegadores a autocompletar formularios dando [valores estables](#stable-name-id) que no cambien entre cargas de página o implementaciones de sitios web a los atributos `name` e `id` de los campos de formulario. {% endAside %}

{: #billing-address}

De forma predeterminada, configure la dirección de facturación para que sea la misma que la dirección de entrega. Reduzca el desorden visual proporcionando un enlace para editar la dirección de facturación (o utilice [elementos de `summary` y `details`](https://simpl.info/details/) ) en lugar de mostrar la dirección de facturación en un formulario.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TIan7TU8goyoOXwLPYyd.png", alt="Ejemplo de página de pago que muestra el enlace para cambiar la dirección de facturación.", width="800", height="250" %}<figcaption> Agregue un enlace para revisar la facturación.</figcaption></figure>

Use los valores de autocompletar apropiados para la dirección de facturación, tal como lo hace para la dirección de envío, para que el usuario no tenga que ingresar datos más de una vez. Agregue una palabra de prefijo para autocompletar atributos si tiene diferentes valores para entradas con el mismo nombre en diferentes secciones.

```html
<input autocomplete="shipping address-line-1" ...>
...
<input autocomplete="billing address-line-1" ...>
```

#### Ayude a los usuarios a ingresar los datos correctos {: #validation}

Trate de evitar "regañar" a los clientes porque "hicieron algo mal". En su lugar, ayude a los usuarios a completar formularios de manera más rápida y sencilla ayudándolos a solucionar los problemas a medida que ocurren. A través del proceso de pago, los clientes intentan darle dinero a su empresa por un producto o servicio; ¡su trabajo es ayudarlos, no castigarlos!

Puede agregar [atributos de restricción](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation#Intrinsic_and_basic_constraints) a los elementos de formulario para especificar valores aceptables, incluidos `min`, `max` y `pattern`. El [estado](https://developer.mozilla.org/docs/Web/API/ValidityState) de validez del elemento se establece automáticamente dependiendo de si el valor del elemento es válido, al igual que las pseudo clases CSS `:valid` y `:invalid` que se pueden usar para dar estilo a elementos con valores válidos o no válidos.

Por ejemplo, el siguiente código HTML especifica el ingreso de un año de nacimiento entre 1900 y 2020. El uso de `type="number"` restringe los valores de entrada solo a números, dentro del rango especificado por `min` y `max`. Si intenta ingresar un número fuera del rango, la entrada se configurará como un estado no válido.

{% Glitch { id: 'constraints', path: 'index.html', height: 170 } %}

El siguiente ejemplo usa `pattern="[\d ]{10,30}"` para garantizar un número de tarjeta de pago válido, al la vez que permite espacios:

{% Glitch { id: 'payment-card-input', path: 'index.html', height: 170 } %}

Los navegadores modernos también realizan una validación básica para las entradas con el tipo `email` o `url` .

{% Glitch { id: 'type-validation', path: 'index.html', height: 250 } %}

{% Aside %} Agregue el atributo `multiple` a una entrada con `type="email"` para habilitar la validación incorporada para múltiples direcciones de correo electrónico separadas por comas en una sola entrada. {% endAside %}

Al enviar el formulario, los navegadores establecen automáticamente el foco en los campos con valores obligatorios problemáticos o faltantes. ¡No se requiere JavaScript!

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mPyN7THWJNRQIiBezq6l.png", alt="Captura de pantalla de un formulario de inicio de sesión en Chrome en computadora de escritorio que muestra el indicador del navegador y el foco para un valor de correo electrónico no válido.", width="500", height="483" %}<figcaption> Validación básica incorporada por el navegador.</figcaption></figure>

Valide en línea y dele retroalimentación al usuario a medida que ingresa los datos, en lugar de mandar una lista de errores cuando haga clic en el botón Enviar. Si necesita validar los datos en su servidor después del envío del formulario, enumere todos los problemas que se encuentren y resalte claramente todos los campos del formulario con valores no válidos, además de mostrar un mensaje en línea junto a cada campo problemático que explique lo que debe solucionarse. Verifique los registros del servidor y los datos analíticos para detectar errores comunes; es posible que deba rediseñar su formulario.

También debe usar JavaScript para realizar una validación más sólida mientras los usuarios ingresan datos y envían formularios. Utilice la [API de validación de restricciones](https://html.spec.whatwg.org/multipage/forms.html#constraints) (que es [ampliamente compatible](https://caniuse.com/#feat=constraint-validation)) para agregar una validación personalizada mediante la interfaz de usuario del navegador incorporada para establecer el enfoque y mostrar mensajes.

Obtenga más información en [Use JavaScript para una validación en tiempo real más compleja](https://developers.google.com/web/fundamentals/design-and-ux/input/forms#use_javascript_for_more_complex_real-time_validation).

{% Aside 'warning' %} Incluso con la validación del lado del cliente y las restricciones de entrada de datos, debe asegurarse de que su back-end maneje de forma segura la entrada y salida de datos de los usuarios. Nunca confíe en la entrada del usuario: podría ser maliciosa. Más información en la [hoja de trucos de validación de entrada de OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html). {% endAside %}

#### Ayude a los usuarios a no pasar por alto datos obligatorios {: #required}

Utilice el [atributo `required`](https://developer.mozilla.org/docs/Web/HTML/Attributes/required) en las entradas de valores obligatorios.

Cuando se envía un formulario, [los navegadores modernos](https://caniuse.com/mdn-api_htmlinputelement_required) automáticamente solicitan y enfocan los campos `required` con datos faltantes, y puede usar la [pseudo-clase `:required`](https://caniuse.com/?search=required) para resaltar los campos obligatorios. ¡No se requiere JavaScript!

Agregue un asterisco a la etiqueta en cada campo obligatorio y una nota al comienzo del formulario para explicar qué significa el asterisco.

## Simplifique el pago {: #checkout-forms}

### ¡Cuidado con la brecha del comercio móvil! {: #m-commerce-gap}

Imagine que sus usuarios tienen una *cantidad máxima de fatiga*. Si se lo termina, sus usuarios se irán.

Necesita reducir la fricción y mantener el enfoque, especialmente en dispositivos móviles. Muchos sitios obtienen más *tráfico* en dispositivos móviles, pero más *conversiones* en computadoras de escritorio, un fenómeno conocido como [brecha de comercio móvil](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs). Es posible que los clientes simplemente prefieran completar una compra en las computadoras de escritorio, pero las tasas de conversión móviles más bajas también son el resultado de una mala experiencia del usuario. Su trabajo consiste en *minimizar* las conversiones perdidas en dispositivos móviles y *maximizar* las conversiones ganadas en computadoras de escritorio. [Las investigaciones han demostrado](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs) que existe una gran oportunidad para brindar una mejor experiencia de formulario móvil.

Sobre todo, es más probable que los usuarios abandonen formularios que parecen largos, complejos y sin direcciónclara. Esto es especialmente cierto cuando los usuarios están en pantallas más pequeñas, distraídos o con prisa. Solicite la menor cantidad de datos posible.

### Haga que el pago como invitado sea la opción predeterminada {: #guest-checkout}

Para una tienda en línea, la forma más sencilla de reducir la fricción en formularios es hacer que el pago como invitado sea la opción predeterminada. No obligue a los usuarios a crear una cuenta antes de realizar una compra. No permitir el pago por parte de los invitados se cita como una de las principales razones para el abandono del carrito de compras.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a7OQLnCRb0FZglj07N7z.png", alt="Razones para el abandono del carrito de la compra durante el proceso de pago.", width="800", height="503" %}<figcaption> De <a href="https://baymard.com/checkout-usability">baymard.com/checkout-usability</a></figcaption></figure>

Puede ofrecer el registro de la cuenta después del pago. En ese momento, ya tiene la mayoría de los datos que necesita para configurar una cuenta, por lo que la creación de la cuenta debe ser rápida y fácil para el usuario.

{% Aside 'gotchas' %} Si ofrece el registro después de finalizar la compra, asegúrese de que la compra que acaba de realizar el usuario esté vinculada a su cuenta recién creada. {% endAside %}

### Muestre el progreso de la compra {: #checkout-progress}

Puede hacer que su proceso de pago se sienta menos complejo mostrando el progreso y dejando en claro lo que debe hacerse a continuación. El siguiente video muestra cómo el minorista británico [johnlewis.com](https://www.johnlewis.com) lo logra.

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/6gIb1yWrIMZFiv775B2y.mp4", controls=true, autoplay=true, muted=true, poster="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ViftAUUUHr4TDXNec0Ch.png", playsinline=true %}<figcaption> Muestre el progreso de la compra.</figcaption></figure>

¡Necesita mantener el impulso! Para cada paso hacia el pago, use títulos de página y valores de botones descriptivos que aclaren lo que se debe hacer ahora y el siguiente paso en la compra.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/address-form-save.mp4" type="video/mp4">
   </source></video>
  <figcaption>Asigne nombres significativos a los botones de formulario que muestren lo que sigue.</figcaption></figure>

Utilice el atributo `enterkeyhint` en las entradas del formulario para configurar la etiqueta de la tecla de entrada del teclado móvil. Por ejemplo, use `enterkeyhint="anterior"` y `enterkeyhint="siguiente"` dentro de un formulario de varias páginas, `enterkeyhint="listo"` para la entrada final en el formulario y `enterkeyhint="buscar"` para una entrada de búsqueda.

<figure>{% Img  src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QoY8Oynpw0CqjPACtCdG.png", alt="Dos capturas de pantalla de un formulario de dirección en Android que muestran cómo el atributo de entrada enterkeyhint cambia el ícono de la tecla Enter.", width="800", height="684" %}<figcaption> Botones Enter clave en Android: 'siguiente' y 'listo'.</figcaption></figure>

El atributo `enterkeyhint` [es compatible con Android e iOS](https://caniuse.com/mdn-html_global_attributes_enterkeyhint) . Puede obtener más información en el [explicador de enterkeyhint](https://github.com/dtapuska/enterkeyhint) .

{: #checkout-details}

Facilite a los usuarios ir y venir dentro del proceso de pago, para hacer ajustes fácilmente a su pedido, incluso cuando se encuentran en el último paso de pago. Muestre todos los detalles del pedido, no solo un resumen limitado. Permita a los usuarios ajustar fácilmente las cantidades de artículos desde la página de pago. Su prioridad en este proceso es evitar interrumpir el progreso hacia la conversión.

### Elimine las distracciones {: #reduce-checkout-exits}

Limite los posibles puntos de salida eliminando el desorden visual y las distracciones, como las promociones de productos. Muchos minoristas exitosos incluso eliminan las opciones de navegación y búsqueda en el proceso de pago.

<figure>{% Img  src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UR97R2LqJ5MRkL5H4V0U.png", alt="Dos capturas de pantalla en dispositivos móviles que muestran el progreso a través de la compra en johnlewis.com. Se eliminan las distracciones de búsqueda, navegación y otras.", width="800", height="683" %}<figcaption> Búsqueda, navegación y otras distracciones eliminadas en el proceso de pago.</figcaption></figure>

Mantenga el proceso enfocado. ¡Este no es el momento de tentar a los usuarios a hacer otra cosa!

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/lKJwd5e2smBfDjNxV22N.jpg", alt="Captura de pantalla de página de pago en móvil que muestra una promoción de ETIQUETAS GRATUITAS que distrae al usuario.", width="350", height="735" %}<figcaption> No distraiga a los clientes de completar su compra.</figcaption></figure>

Para los usuarios recurrentes, puede simplificar aún más el proceso de pago al ocultar los datos que no necesitan ver. Por ejemplo: muestre la dirección de entrega en texto sin formato (no en un formulario) y permita que los usuarios la cambien a través de un enlace.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xEAYOeEFYhOZLaB2aeCY.png", alt="Captura de pantalla de la sección 'Revisar pedido' de la página de pago, que muestra el texto sin formato, con enlaces para cambiar la dirección de entrega, la forma de pago y la dirección de facturación, que no se muestran.", width="450", height="219" %}<figcaption> Ocultar datos que los clientes no necesitan ver.</figcaption></figure>

## Facilite la introducción del nombre y la dirección {: #address-forms}

### Solicite solo los datos que necesita {: #unneeded-data}

Antes de comenzar a codificar los formularios de nombre y dirección, asegúrese de comprender qué datos se requieren. ¡No pida datos que no necesita! La forma más sencilla de reducir la complejidad del formulario es eliminar los campos innecesarios. Eso también es bueno para la privacidad del cliente y puede reducir el costo de back-end y la responsabilidad de datos.

### Use una sola entrada para ingresar el nombre {: #single-name-input}

Permita que sus usuarios ingresen su nombre en un solo campo, a menos que tenga una buena razón para almacenar por separado los nombres de pila, apellidos, honoríficos u otras partes del nombre. El uso de la entrada única para el nombre hace que los formularios sean menos complejos, permite cortar y pegar y simplifica el autocompletado.

En particular, a menos que tenga una buena razón para no hacerlo, no se moleste en agregar una entrada separada para un prefijo o título (como Sra., Dr. o Lord). Los usuarios pueden escribir eso con su nombre si así lo desean. Además, el `honorific-prefix` actualmente no funciona en la mayoría de los navegadores, por lo que agregar un campo para el prefijo del nombre o el título interferirá en la experiencia de autocompletar del formulario de dirección para la mayoría de los usuarios.

### Habilite el autocompletado de nombres

Use `name` para un nombre completo:

```html
<input autocomplete="name" ...>
```

Si realmente tiene una buena razón para dividir las partes del nombre, asegúrese de usar los valores de autocompletar apropiados:

- `honorific-prefix`
- `given-name`
- `nickname`
- `additional-name-initial`
- `additional-name`
- `family-name`
- `honorific-suffix`

### Permita nombres internacionales {: #unicode-matching}

Es posible que desee validar sus entradas de nombre o restringir los caracteres permitidos para los datos del nombre. Sin embargo, debe ser lo menos restrictivo posible con los alfabetos. ¡Es de mala educación decirle a alguien que su nombre es "inválido"!

Para la validación, evite el uso de expresiones regulares que solo coincidan con caracteres latinos. El uso de solo alfabeto latino excluye a los usuarios con nombres o direcciones que incluyen caracteres que no están en dicho alfabeto. En su lugar, permita la coincidencia de letras Unicode y asegúrese de que su back-end admita Unicode de forma segura como entrada y salida. Los navegadores modernos son compatibles con el uso de Unicode en expresiones regulares.

{% Compare 'worse' %}

```html
<!-- Names with non-Latin characters (such as Françoise or Jörg) are 'invalid'. -->
<input pattern="[\w \-]+" ...>
```

{% endCompare %}

{% Compare 'better' %}

```html
<!-- Accepts Unicode letters. -->
<input pattern="[\p{L} \-]+" ...>
```

{% endCompare %}

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/unicode-letter-matching.mp4" type="video/mp4">
   </source></video>
  <figcaption>Coincidencia de letras Unicode en comparación con la coincidencia de letras solo latinas.</figcaption></figure>

{% Aside %} Puede obtener más información sobre [internacionalización y localización a](#internationalization-localization) continuación, pero asegúrese de que sus formularios funcionen para nombres en todas las regiones donde tiene usuarios. Por ejemplo, para los nombres japoneses, debería considerar tener un campo para los nombres fonéticos. Esto ayuda al personal de atención al cliente a decir el nombre del cliente en las llamadas telefónicas. {% endAside %}

### Permita una variedad de formatos de dirección {: #address-variety}

Cuando diseñe un formulario de dirección, tenga en cuenta la asombrosa variedad de formatos de dirección, incluso dentro de un solo país. Tenga cuidado de no hacer suposiciones sobre direcciones "normales". (¡Eche un vistazo a las [rarezas de las direcciones del Reino Unido! ¡](http://www.paulplowman.com/stuff/uk-address-oddities/) Si no está convencido!)

#### Flexibilice los formularios de direcciones {:#flexible-address}

No obligue a los usuarios a intentar incluir su dirección en campos de formulario que no encajen.

Por ejemplo, no insista en un número de casa y el nombre de la calle en entradas separadas, ya que muchas direcciones no usan ese formato y los datos incompletos pueden interrumpir el autocompletado del navegador.

Tenga especial cuidado con campos de dirección `required`. Por ejemplo, las direcciones en las grandes ciudades del Reino Unido no tienen un condado, pero muchos sitios todavía obligan a los usuarios a ingresar uno.

El uso de dos líneas flexibles para la dirección puede funcionar lo suficientemente bien para una variedad de formatos de direcciones.

```html
<input autocomplete="address-line-1" id="address-line1" ...>
<input autocomplete="address-line-2" id="address-line2" ...>
```

Agregue etiquetas para que coincidan:

```html/0-2,5-7
<label for="address-line-1">
Address line 1 (or company name)
</label>
<input autocomplete="address-line-1" id="address-line1" ...>

<label for="address-line-2">
Address line 2 (optional)
</label>
<input autocomplete="address-line-2" id="address-line2" ...>
```

Puede probar esto remezclando y editando la demostración incrustada a continuación.

{% Aside 'caution' %} Las investigaciones muestran que la [**línea de dirección 2** puede ser problemática para los usuarios](https://baymard.com/blog/address-line-2). Tenga esto en cuenta al diseñar formularios de direcciones: debe considerar alternativas, como usar un solo `textarea` (ver más abajo) u otras opciones. {% endAside %}

#### Considere usar un solo textarea para la dirección {: #address-textarea}

La opción más flexible para las direcciones es proporcionar un solo `textarea`.

El `textarea` se adapta a cualquier formato de dirección y es excelente para cortar y pegar, pero tenga en cuenta que es posible que no se ajuste a sus requisitos de datos y que los usuarios extrañen el autocompletado si anteriormente solo usaban formularios con `address-line1` y `address-line2`.

Para un textarea, use `street-address` como el valor de autocompletado.

Aquí hay un ejemplo de un formulario que demuestra el uso de un solo `textarea` para la dirección:

{% Glitch { id: 'address-form', path: 'index.html', height: 980 } %}

#### Internacionalice y localice sus formularios de direcciones {: #internationalization-localization}

Es especialmente importante que los formularios de direcciones consideren la [internacionalización y la localización](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites/), según la ubicación de los usuarios.

Tenga en cuenta que el nombre de las partes de la dirección varía, así como los formatos de dirección, incluso dentro del mismo idioma.

```text
    ZIP code: US
 Postal code: Canada
    Postcode: UK
     Eircode: Ireland
         PIN: India
```

Puede ser irritante o desconcertante que se le presente un formulario que no se ajuste a su dirección o que no use las palabras que espera.

Es posible que su sitio necesite personalizar formularios de direcciones [para múltiples configuraciones regionales](https://www.smashingmagazine.com/2020/11/internationalization-localization-static-sites#determining-user-s-language-and-region), pero el uso de técnicas para maximizar la flexibilidad de los formularios (como se describe anteriormente) puede ser adecuado. Si no localiza sus formularios de dirección, asegúrese de comprender las prioridades clave para hacer frente a una variedad de formatos de dirección:

- Evite ser demasiado específico sobre las partes de la dirección, como insistir en el nombre de la calle o el número de la casa.
- Siempre que sea posible, evite hacer que los campos sean `required`. Por ejemplo, las direcciones en muchos países no tienen un código postal y las direcciones rurales pueden no tener un nombre de calle o camino.
- Utilice nombres inclusivos: 'País/región' no 'País'; 'ZIP/código postal' no 'ZIP'.

¡Sea flexible! El [ejemplo de formulario de dirección simple anterior](#address-textarea) se puede adaptar para que funcione "lo suficientemente bien" para muchas configuraciones regionales.

#### Considere evitar la búsqueda de direcciones de código postal {: #postal-code-address-lookup}

Algunos sitios web utilizan un servicio para buscar direcciones según el código postal o ZIP. Esto puede ser sensato para algunos casos de uso, pero debe tener en cuenta las posibles desventajas.

La sugerencia de dirección de código postal no funciona para todos los países y, en algunas regiones, los códigos postales pueden incluir una gran cantidad de direcciones potenciales.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/long-list-of-addresses.mp4" type="video/mp4">
   </source></video>
  <figcaption>¡Los códigos postales pueden incluir muchas direcciones!</figcaption></figure>

Es difícil para los usuarios seleccionar de una larga lista de direcciones, especialmente en dispositivos móviles si están apurados o estresados. Puede ser más fácil y menos propenso a errores permitir que los usuarios aprovechen la función de autocompletar e ingresen su dirección completa con un solo toque o clic.

<figure>
   <video controls autoplay loop muted>
     <source src="https://samdutton.com/full-name-autofill.mp4" type="video/mp4">
   </source></video>
  <figcaption>Usar una sola entrada para el nombre permite el ingreso de direcciones con un solo toque (un clic).</figcaption></figure>

## Simplifique los formularios de pago {: #general-guidelines}

Los formularios de pago son la parte más crítica del proceso de pago. El diseño deficiente del formulario de pago es una [causa común de abandono del carrito de compras](https://www.comscore.com/Insights/Presentations-and-Whitepapers/2017/Mobiles-Hierarchy-of-Needs). El [diablo está en los detalles](https://en.wikipedia.org/wiki/The_devil_is_in_the_detail#cite_note-Titelman-1): los pequeños fallos pueden hacer que los usuarios abandonen una compra, especialmente en dispositivos móviles. Su trabajo consiste en diseñar formularios para que sea lo más fácil posible para los usuarios ingresar datos.

### Ayude a los usuarios a evitar volver a ingresar datos de pago {: #payment-form-autocomplete}

Asegúrese de agregar los valores de `autocomplete` apropiados en los formularios de tarjetas de pago, incluido el número de la tarjeta de pago, el nombre en la tarjeta y el mes y año de vencimiento:

- `cc-number`
- `cc-name`
- `cc-exp-month`
- `cc-exp-year`

Esto permite que los navegadores ayuden a los usuarios almacenando de forma segura los detalles de la tarjeta de pago e ingresando correctamente los datos del formulario. Sin el autocompletado, es más probable que los usuarios mantengan un registro físico de los detalles de la tarjeta de pago o los almacenen de manera insegura en su dispositivo.

{% Aside 'caution' %} No agregue un selector para el tipo de tarjeta de pago, ya que esto siempre se puede inferir del número de la tarjeta de pago. {% endAside %}

### Evite el uso de elementos personalizados para las fechas de las tarjetas de pago

Si no se diseñan correctamente, [los elementos personalizados](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) pueden romper el flujo de pago al interrumpir el autocompletado y no funcionarán en navegadores más antiguos. Si todos los demás detalles de la tarjeta de pago están disponibles en la función de autocompletar, pero un usuario se ve obligado a buscar su tarjeta de pago física para buscar una fecha de vencimiento porque la función de autocompletar no funcionó para un elemento personalizado, es probable que pierda una venta. En su lugar, considere utilizar elementos HTML estándar y modifíquelos posteriormente.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1LIQm2Jt5PHxN0I7tni3.jpg", alt="Captura de pantalla de un formulario de pago que muestra elementos personalizados para la fecha de vencimiento de la tarjeta que interrumpen el llenado automático.", width="800", height="916" %}<figcaption> Autocompletar llenó todos los campos, ¡excepto la fecha de vencimiento!</figcaption></figure>

### Utilice una única entrada para la tarjeta de pago y los números de teléfono {: #single-number-input}

Para tarjetas de pago y números de teléfono, use una sola entrada: no divida el número en partes. Eso hace que sea más fácil para los usuarios ingresar datos, simplifica la validación y permite que los navegadores aporten el llenado automático. Considere hacer lo mismo con otros datos numéricos como PIN y códigos bancarios.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7cUwamPstwSQTlbmQ4CT.jpg", alt="Captura de pantalla de un formulario de pago que muestra un campo de tarjeta de crédito dividido en cuatro elementos de entrada.", width="800", height="833" %}<figcaption> No utilice varias entradas para un número de tarjeta de crédito.</figcaption></figure>

### Valide con cuidado {: #validate}

Debe validar la entrada de datos tanto en tiempo real como antes de enviar el formulario. Una forma de hacerlo es agregando un atributo `pattern` a la entrada de una tarjeta de pago. Si el usuario intenta enviar el formulario de pago con un valor no válido, el navegador muestra un mensaje de advertencia y se centra en la entrada. ¡No se requiere JavaScript!

{% Glitch { id: 'payment-card-input', path: 'index.html', height: 170 } %}

Sin embargo, la expresión regular de su `pattern` debe ser lo suficientemente flexible para manejar [el rango de longitudes de números de tarjetas de pago](https://github.com/jaemok/credit-card-input/blob/master/creditcard.js#L35): de 14 dígitos (o posiblemente menos) a 20 (o más). Puede obtener más información sobre la estructuración de números de tarjetas de pago en [LDAPwiki](https://ldapwiki.com/wiki/Bank%20Card%20Number) .

Permita que los usuarios incluyan espacios cuando ingresen un nuevo número de tarjeta de pago, ya que así es como se muestran los números en las tarjetas físicas. Eso es más amigable para el usuario (no tendrá que decirles que "hicieron algo mal"), es menos probable que interrumpa el flujo de conversión y es sencillo eliminar los espacios en los números antes de procesar.

{% Aside %} Es posible que desee utilizar un código de acceso de un solo uso para verificar la identidad o el pago. Sin embargo, pedir a los usuarios que ingresen manualmente un código o que lo copien desde un correo electrónico o un mensaje de texto SMS es propenso a errores y una fuente de fricción. Conozca mejores formas de habilitar códigos de acceso de un solo uso en  [mejores prácticas para formulario de OTP SMS](/sms-otp-form). {% endAside %}

## Haga pruebas en una variedad de dispositivos, plataformas, navegadores y versiones {: #test-platform}

Es particularmente importante probar la dirección y los formularios de pago en las plataformas más comunes para sus usuarios, ya que la funcionalidad y la apariencia de los elementos del formulario pueden variar, y las diferencias en el tamaño de la ventana gráfica pueden generar un posicionamiento problemático. BrowserStack permite [realizar pruebas gratuitas para proyectos de código abierto](https://www.browserstack.com/open-source) en una variedad de dispositivos y navegadores.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Uk7WhpDMuHtvjmWlFnJE.jpg", alt="Capturas de pantalla de un formulario de pago, payment-form.glitch.me, en iPhone 7 y 11. El botón de pago completo se muestra en el iPhone 11 pero no se muestra en el iPhone 7", width="800", height="707" %}<figcaption> La misma página en iPhone 7 y iPhone 11.<br> Reduzca el relleno de las ventanas gráficas móviles más pequeñas para asegurarse de que el botón <strong>Completar pago</strong> no esté oculto.</figcaption></figure>

## Implemente analíticas y RUM {: #analytics-rum}

Probar la usabilidad y el rendimiento localmente puede ser útil, pero necesita datos del mundo real para comprender correctamente cómo los usuarios experimentan sus formularios de pago y dirección.

Para eso, necesita analíticas y monitoreo de usuarios reales (Real User Monitoring, RUM): datos sobre la experiencia de los usuarios reales, como cuánto tardan en cargarse las páginas de pago o cuánto tarda en completarse el pago:

- **Analítica de página**: vistas de página, tasas de rebote y salidas para cada página con un formulario.
- **Analítica de interacción**: los [embudos de metas](https://support.google.com/analytics/answer/6180923?hl=en) y los [eventos](https://developers.google.com/analytics/devguides/collection/gtagjs/events) indican dónde los usuarios abandonan su flujo de pago y qué acciones toman al interactuar con sus formularios.
- **Rendimiento del sitio web**: las [métricas centradas en el usuario](/user-centric-performance-metrics) pueden indicarle si sus páginas de pago tardan en cargarse y, de ser así, cuál es la causa.

Las analíticas de la página y de la interacción y la medición del rendimiento del usuario real se vuelven especialmente valiosos cuando se combinan con los registros del servidor, los datos de conversión y las pruebas A/B, lo que le permite responder preguntas como si los códigos de descuento aumentan los ingresos o si un cambio en el diseño del formulario aumenta las conversiones.

Eso, a su vez, le brinda una base sólida para priorizar el esfuerzo, realizar cambios y recompensar el éxito.

## Siga aprendiendo {: #resources}

- [Mejores prácticas para el formulario de inicio de sesión](/sign-in-form-best-practices)
- [Mejores prácticas del formulario de registro](/sign-up-form-best-practices)
- [Verifique los números de teléfono en la web con la API de WebOTP](/web-otp)
- [Cree formularios asombrosos](/learn/forms/)
- [Mejores prácticas para el diseño de formularios móviles](https://www.smashingmagazine.com/2018/08/best-practices-for-mobile-form-design/)
- [Controles de formulario más capaces](/more-capable-form-controls)
- [Crear formularios accesibles](https://webaim.org/techniques/forms/)
- [Optimización del flujo de registro mediante la API de gestión de credenciales](https://developer.chrome.com/blog/credential-management-api/)
- [La Guía compulsiva de direcciones postales de Frank](http://www.columbia.edu/~fdc/postal/) proporciona enlaces útiles y una guía extensa para formatos de direcciones en más de 200 países.
- [Listas de países](http://www.countries-list.info/Download-List) tiene una herramienta para descargar códigos y nombres de países en varios idiomas, en varios formatos.

Foto de [@rupixen](https://unsplash.com/@rupixen) en [Unsplash](https://unsplash.com/photos/Q59HmzK38eQ) .
