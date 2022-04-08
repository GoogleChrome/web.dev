---
title: |2-

  Enlace audaz donde nadie ha enlazado antes: Fragmentos de texto
subhead: Los fragmentos de texto le permiten especificar un fragmento de texto en el fragmento de URL. Al navegar a una URL con un fragmento de texto de este tipo, el navegador puede enfatizarlo o comunicárselo al usuario.
authors:
  - thomassteiner
date: 2020-06-17
updated: 2021-05-17
hero: image/admin/Y4NLEbOwgTWdMNoxRYXw.jpg
alt: ''
description: Los fragmentos de texto le permiten especificar un fragmento de texto en el fragmento de URL. Al navegar a una URL con un fragmento de texto de este tipo, el navegador puede enfatizar o resaltárselo al usuario.
tags:
  - blog
  - capabilities
feedback:
  - api
---

## Identificadores de fragmentos

Chrome 80 fue un gran lanzamiento. Contenía una serie de características muy esperadas, como [módulos ECMAScript en Web Workers](/module-workers/), [coalescencia nula](https://v8.dev/features/nullish-coalescing), [encadenamiento opcional](https://v8.dev/features/optional-chaining) y más. El lanzamiento se anunció, como de costumbre, a través de una [publicación de blog](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html) en el blog de Chromium. Puede ver un extracto de la publicación del blog en la captura de pantalla a continuación.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/egsW6tkKWYI8IHE6JyMZ.png", alt="", width="400", height="628" %} <figcaption>Publicación del blog de Chromium con cuadros rojos alrededor de los elementos con un atributo <code>id</code>.</figcaption></figure>

Probablemente se esté preguntando qué significan todos los recuadros rojos. Son el resultado de ejecutar el siguiente fragmento en DevTools. Destaca todos los elementos que tienen un atributo `id`.

```js
document.querySelectorAll('[id]').forEach((el) => {
  el.style.border = 'solid 2px red';
});
```

Puedo colocar un enlace profundo a cualquier elemento resaltado con un cuadro rojo gracias al [identificador de fragmento](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Identifying_resources_on_the_Web#Fragment) que luego uso en el [hash](https://developer.mozilla.org/docs/Web/API/URL/hash) de la URL de la página. Suponiendo que quisiera hacer un enlace profundo al cuadro *Denos su opinión en nuestros [foros de productos](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)* al lado, podría hacerlo si creo a mano la URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#HTML1&lt;/mark&gt;</code></a>. Como puede ver en el panel Elementos de las Herramientas de desarrollo, el elemento en cuestión tiene una `id` con el valor `HTML1`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/whVXhhrYwA55S3i4J3l5.png", alt="", width= "600", height= "97 "%} <figcaption>Herramienta de desarrollo que muestra la <code>id</code> de un elemento.</figcaption></figure>

Si analizo esta URL con el constructor `URL()` de JavaScript, se revelan los diferentes componentes. Observe la propiedad `hash` con el valor `#HTML1`.

```js/3
new URL('https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1');
/* Crea un nuevo objeto `URL`
URL {
  hash: "#HTML1"
  host: "blog.chromium.org"
  hostname: "blog.chromium.org"
  href: "https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1"
  origin: "https://blog.chromium.org"
  password: ""
  pathname: "/2019/12/chrome-80-content-indexing-es-modules.html"
  port: ""
  protocol: "https:"
  search: ""
  searchParams: URLSearchParams {}
  username: ""
}
*/
```

Sin embargo, el hecho de tener que abrir las Herramientas de desarrollo para encontrar la `id` de un elemento dice mucho sobre la probabilidad de que esta sección en particular de la página estuviera destinada a estar enlazada por el autor de la publicación del blog.

¿Qué pasa si quiero hacer un enlace a algo sin una `id`? Digamos que quiero enlazar al encabezado *Módulos ECMAScript en Web Workers*. Como puede ver en la captura de pantalla a continuación, el `<h1>` en cuestión no tiene una `id`, lo que significa que no hay forma de que pueda enlazarlo a este encabezado. Este es el problema que resuelven los fragmentos de texto.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1g4rTS1q5LKHEHnDoF9o.png", alt="", width="600", height="71" %} <figcaption> Herramientas de desarrollo que muestran un encabezado sin <code>id</code>.</figcaption></figure>

## Fragmentos de texto

La propuesta de [Fragmentos de texto](https://wicg.github.io/ScrollToTextFragment/) agrega soporte para especificar un fragmento de texto en el hash de la URL. Al navegar a una URL con un fragmento de texto de este tipo, el agente de usuario puede enfatizarlo o llamar la atención del usuario.

### Compatibilidad del navegador

La función Fragmentos de texto es compatible con la versión 80 y posteriores de los navegadores basados en Chromium. En el momento de escribir este artículo, Safari y Firefox no han manifestado públicamente la intención de implementar la función. Consulte los [Enlaces relacionados](#related-links) para obtener sugerencias sobre las discusiones de Safari y Firefox.

{% Aside 'success' %} Estos enlaces solían no funcionar cuando se mostraban a través de [redireccionamientos del lado del cliente](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Alternative_way_of_specifying_redirections) que utilizan algunos servicios comunes como Twitter. Este problema se rastreó como [crbug.com/1055455](https://crbug.com/1055455) y ahora se solucionó. Los [redireccionamientos HTTP](https://developer.mozilla.org/docs/Web/HTTP/Redirections#Principle) regulares siempre funcionaron bien. {% endAside %}

Por [razones de seguridad](#security), la función requiere que los enlaces se abran en un contexto [`noopener`](https://developer.mozilla.org/docs/Web/HTML/Link_types/noopener). Por lo tanto, asegúrese de incluir [`rel="noopener"`](https://developer.mozilla.org/docs/Web/HTML/Element/a#attr-rel) en su marcado de anclaje `<a>` o agregue [`noopener`](https://developer.mozilla.org/docs/Web/API/Window/open#noopener) a su lista `Window.open()` de características de funcionalidad de ventana.

### `textStart`

En su forma más simple, la sintaxis de los Fragmentos de texto es la siguiente: El símbolo de hash `#` seguido de `:~:text=` y finalmente `textStart`, que representa el [texto codificado en porcentaje](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) al que se quiere enlazar.

```bash
#:~:text=textStart
```

Por ejemplo, digamos que quiero enlazar al encabezado *Módulos ECMAScript en Web Workers* en la [publicación del blog que anuncia las características en Chrome 80](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html), la URL en este caso sería:

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules%20in%20Web%20Workers&lt;/mark&gt;</code></a>

Se enfatiza el fragmento de texto <mark class="highlight-line highlight-line-active">de esta manera</mark>. Si hace clic en el enlace en un navegador compatible como Chrome, el fragmento de texto se resalta y se desplaza a la vista:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/D3jwPrJlvN3FmJo3pADt.png", alt="", width="400", height="208" %} <figcaption> El fragmento de texto se desplazó a la vista y se resaltó.</figcaption></figure>

### `textStart` y `textEnd`

Ahora, ¿qué pasa si quiero enlazar a toda la *sección* titulada *Módulos ECMAScript en Web Workers*, no solo a su título? La codificación porcentual de todo el texto de la sección haría que la URL resultante fuera impracticablemente larga.

Afortunadamente, existe una forma mejor. En lugar de todo el texto, puedo enmarcar el texto deseado mediante la sintaxis `textStart,textEnd`. Por lo tanto, especifico un par de palabras de codificación porcentual en el comienzo del texto deseado y un par de palabras de codificación porcentual al final del texto deseado, separadas por una coma `,`.

Eso se ve de la siguiente manera:

<a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules%20in%20Web%20Workers,ES%20Modules%20in%20Web%20Workers.&lt;/mark&gt;</code></a>.

Para `textStart`, tengo `ECMAScript%20Modules%20in%20Web%20Workers`, luego una coma `,` seguida de `ES%20Modules%20in%20Web%20Workers.` como `textEnd`. Cuando se hace clic en un navegador compatible como Chrome, toda la sección se resalta y se desplaza a la vista:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/2yTYmKnjHTnqXkcmHF1F.png", alt="", width="400", height="343" %} <figcaption>El fragmento de texto se desplazó a la vista y se resaltó.</figcaption></figure>

Ahora puede que se pregunte acerca de mi elección de `textStart` y `textEnd`. En realidad, la URL un poco más corta <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript%20Modules,Web%20Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript%20Modules,Web%20Workers.&lt;/mark&gt;</code></a> con solo dos palabras en cada lado también habría funcionado. Compare `textStart` y `textEnd` con los valores anteriores.

Si doy un paso más y ahora uso solo una palabra tanto para `textStart` como para `textEnd`, verá que estoy en problemas. La URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=ECMAScript,Workers."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=ECMAScript,Workers.&lt;/mark&gt;</code></a> es aún más corta ahora, pero el fragmento de texto resaltado ya no es el deseado originalmente. El resaltado se detiene en la primera aparición de la palabra `Workers.`, lo cual es correcto, pero no lo que pretendía resaltar. El problema es que la sección deseada no está identificada de forma única por los valores `textStart` y `textEnd`:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/GGbbtHBpsoFyubnISyZw.png", alt="", width="400", height="342" %} <figcaption>El fragmento de texto no deseado se desplazó a la vista y se resaltó.</figcaption></figure>

### `prefix-` y `-suffix`

Usar valores suficientemente largos para `textStart` y `textEnd` es una solución para obtener un enlace único. En algunas situaciones, sin embargo, esto no es posible. Como una nota al margen, ¿por qué elegí la publicación del blog de lanzamiento de Chrome 80 como mi ejemplo? La respuesta es que en esta versión se introdujeron los Fragmentos de texto:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/yA1p3CijeDbTRwMys9Hq.png", alt="Texto de la publicación del blog: Fragmentos de texto en URL. Los usuarios o autores ahora pueden enlazar a una parte específica de una página mediante un fragmento de texto proporcionado en una URL. Cuando la página está cargada, el navegador resalta el texto y desplaza el fragmento a la vista. Por ejemplo, la siguiente URL carga una página wiki para 'Gato' y se desplaza hasta el contenido listado en el parámetro `text`.", width="800", height="200" %} <figcaption>Extracto de la publicación del blog del anuncio de Fragmentos de texto.</figcaption></figure>

Observe cómo en la captura de pantalla de arriba la palabra "text" aparece cuatro veces. La cuarta aparición está escrita en una fuente de código verde. Si quisiera enlazar a esta palabra en particular, establecería `textStart` en `text`. Dado que la palabra "text" es, bueno, sólo una palabra, no puede haber un `textEnd`. ¿Ahora qué? La URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=text"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=text&lt;/mark&gt;</code></a> coincide con la primera aparición de la palabra "Text" que ya está en el encabezado:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nXxCskUwdCxwxejPSSZW.png", alt="", width="800", height="209" %} <figcaption>Fragmento de texto que coincide con la primera aparición de "Text".</figcaption></figure>

{% Aside 'caution' %} Tenga en cuenta que la coincidencia de fragmentos de texto no distingue entre mayúsculas y minúsculas. {% endAside %}

Por suerte, hay una solución. En casos como este, puedo especificar un `prefix​-` y un `-suffix`. La palabra antes de la fuente de código verde "text" es "the", y la palabra después es "parameter". Ninguna de las otras tres apariciones de la palabra "text" tiene las mismas palabras circundantes. Armado con este conocimiento, puedo modificar la URL anterior y agregar el `prefix-` y el `-suffix`. Al igual que los otros parámetros, también deben estar codificados en porcentaje y pueden contener más de una palabra. <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=the-,text,-parameter"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=the-,text,-parameter&lt;/mark&gt;</code></a>. Para permitir que el analizador identifique claramente el `prefix-` y el `-suffix`, deben separarse del `textStart` y del `textEnd` opcional con un guión `-`.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/J3L5BVSMmzGY6xdkabP6.png", alt="", width="800", height="203" %} <figcaption>Fragmento de texto que coincide con la aparición deseada de "text".</figcaption></figure>

### La sintaxis completa

La sintaxis completa de los fragmentos de texto se muestra a continuación. (Los corchetes indican un parámetro opcional). Los valores de todos los parámetros deben estar codificados en porcentaje. Esto es especialmente importante para los caracteres de guión `-`, ampersand `&` y coma `,`, para que no se interpreten como parte de la sintaxis de la directiva de texto.

```bash
#:~:text=[prefix-,]textStart[,textEnd][,-suffix]
```

Cada uno de los argumentos `prefix-`, `textStart`, `textEnd` y `-suffix` sólo concordará con el texto dentro de un solo [elemento en bloque](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements#Elements), pero los rangos `textStart,textEnd` completos *pueden* abarcar varios bloques. Por ejemplo `:~:text=The quick,lazy dog` no concordará en el siguiente ejemplo, porque la cadena de inicio "La rápida" no aparece dentro de un elemento único e ininterrumpido a nivel de bloque:

```html
<div>
  La
  <div></div>
  rápida zorra marrón
</div>
<div>saltó sobre el perro perezoso</div>
```

Sin embargo, concuerda en este ejemplo:

```html
<div>La rápida zorra marrón</div>
<div>saltó sobre el perro perezoso</div>
```

### Creación de URL de fragmentos de texto con una extensión de navegador

Crear URL de fragmentos de texto a mano es tedioso, especialmente cuando se trata de asegurar que sean únicas. Si realmente lo desea, la especificación tiene algunos consejos y enumera los [pasos exactos para generar URL de fragmentos de texto](https://wicg.github.io/ScrollToTextFragment/#generating-text-fragment-directives). Proporcionamos una extensión de navegador de código abierto llamada [Enlace a fragmento de texto](https://github.com/GoogleChromeLabs/link-to-text-fragment) que le permite enlazar a cualquier texto seleccionándolo y luego hacer clic en "Copiar el enlace al texto seleccionado" en el menú contextual. Esta extensión está disponible para los siguientes navegadores:

- [Enlace a fragmento de texto para Google Chrome](https://chrome.google.com/webstore/detail/link-to-text-fragment/pbcodcjpfjdpcineamnnmbkkmkdpajjg)
- [Enlace a fragmento de texto para Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/link-to-text-fragment/pmdldpbcbobaamgkpkghjigngamlolag)
- [Enlace a fragmento de texto para Mozilla Firefox](https://addons.mozilla.org/firefox/addon/link-to-text-fragment/)
- [Enlace a fragmento de texto para Apple Safari](https://apps.apple.com/app/link-to-text-fragment/id1532224396)

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASLtFCPoHvyTKrAtKAv4.png", alt="", width="800", height="500" %} <figcaption>Enlace a la extensión del navegador <a href="https://github.com/GoogleChromeLabs/link-to-text-fragment">Fragmento de texto</a>.</figcaption></figure>

### Varios fragmentos de texto en una URL

Tenga en cuenta que pueden aparecer varios fragmentos de texto en una URL. Los fragmentos de texto particulares deben estar separados por un carácter `&`. Éste es un enlace de ejemplo con tres fragmentos de texto: <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet"><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=Text%20URL%20Fragments&amp;text=text,-parameter&amp;text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%25%20of%20a%20cat's%20diet&lt;mark class="highlight-line highlight-line-active"&gt;</code></a>.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ffsq7aoSoVd9q6r5cquY.png", alt="", width="800", height="324" %} <figcaption>Tres fragmentos de texto en una URL.</figcaption></figure>

### Mezcla de elementos y fragmentos de texto

Los fragmentos de elementos tradicionales se pueden combinar con fragmentos de texto. Está perfectamente bien tener ambos en la misma URL, por ejemplo, para proporcionar un respaldo significativo en caso de que cambie el texto original de la página, de modo que el fragmento de texto ya no coincida. La URL <a href="https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums."><code>https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html&lt;mark class="highlight-line highlight-line-active"&gt;#HTML1:~:text=Give%20us%20feedback%20in%20our%20Product%20Forums.&lt;/mark&gt;</code></a> que enlaza a la sección *Denos su opinión en nuestros [foros de productos](http://support.google.com/bin/static.py?hl=en&page=portal_groups.cs)* contiene tanto un fragmento de elemento (`HTML1`) como un fragmento `text=Give%20us%20feedback%20in%20our%20Product%20Forums.`):

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/JRKCM6Ihrq8sgRZRiymr.png", alt="", width="237", height="121" %} <figcaption>Enlace con fragmento de elemento y fragmento de texto.</figcaption></figure>

### La directiva de fragmentos

Hay un elemento de la sintaxis que aún no he explicado: la directiva de fragmentos `:~:`. Para evitar problemas de compatibilidad con los fragmentos de elementos de URL existentes, como se muestra arriba, la [especificación de Fragmentos de texto](https://wicg.github.io/ScrollToTextFragment/) introduce la directiva de fragmentos. La directiva de fragmentos es una parte del fragmento de URL delimitado por la secuencia de código `:~:`. Está reservada para las instrucciones del agente de usuario, como `text=` y se elimina de la URL durante la carga para que los scripts de autor no puedan interactuar directamente con ella. Las instrucciones del agente de usuario también se denominan *directivas*. En el caso concreto, `text=` se llama por lo tanto una *directiva de texto*.

### Detección de características

Para detectar la compatibilidad, pruebe la propiedad de solo lectura `fragmentDirective` en `document`. La directiva de fragmentos es un mecanismo para que las URL especifiquen instrucciones dirigidas al navegador en lugar de al documento. Está destinada a evitar la interacción directa con el script del autor, de modo que se puedan agregar futuras instrucciones del agente de usuario sin temor a introducir cambios importantes en el contenido existente. Un ejemplo potencial de tales adiciones futuras podrían ser las sugerencias de traducción.

```js
if ('fragmentDirective' in document) {
  // Se admiten los fragmentos de texto.
}
```

{% Aside %} Desde Chrome 80 hasta Chrome 85, la propiedad `fragmentDirective` se definió en `Location.prototype`. Para obtener detalles sobre este cambio, consulte [WICG/scroll-to-text-fragment # 130](https://github.com/WICG/scroll-to-text-fragment/issues/130). {% endAside %}

La detección de características está destinada principalmente a los casos en los que los enlaces se generan dinámicamente (por ejemplo, mediante motores de búsqueda) para evitar enviar enlaces de fragmentos de texto a navegadores que no los admitan.

### Aplicar estilo a fragmentos de texto

De forma predeterminada, los navegadores aplican el estilo a los fragmentos de texto de la misma manera que le aplican estilo a [`mark`](https://developer.mozilla.org/docs/Web/HTML/Element/mark) (normalmente negro sobre amarillo, los [colores del sistema](https://developer.mozilla.org/docs/Web/CSS/color_value#system_colors) CSS para `mark`). La hoja de estilo del agente de usuario contiene CSS que luce así:

```css
:root::target-text {
  color: MarkText;
  background: Mark;
}
```

Como puede ver, el navegador expone un pseudo selector [`::target-text`](https://drafts.csswg.org/css-pseudo/#selectordef-target-text) que puede usar para personalizar el resaltado aplicado. Por ejemplo, puede diseñar sus fragmentos de texto para que sean texto negro sobre un fondo rojo. Como siempre, asegúrese de [verificar el contraste de color](https://developer.chrome.com/docs/devtools/accessibility/reference/#contrast) para que su estilo sobrepuesto no cause problemas de accesibilidad y compruebe que el resaltado realmente se destaque visualmente del resto del contenido.

```css
:root::target-text {
  color: black;
  background-color: red;
}
```

### Capacidad de aplicar polyfill

A la función Fragmentos de texto se le pueden aplicar polyfills hasta cierto punto. Proporcionamos un [polyfill](https://github.com/GoogleChromeLabs/text-fragments-polyfill), que la [extensión](https://github.com/GoogleChromeLabs/link-to-text-fragment) usa internamente, para los navegadores que no brindan soporte integrado para fragmentos de texto donde la funcionalidad se implementa en JavaScript.

### Generación de enlaces de fragmentos de texto programáticos

El [polyfill](https://github.com/GoogleChromeLabs/text-fragments-polyfill) contiene un archivo `fragment-generation-utils.js` que puede importar y usar para generar enlaces de fragmentos de texto. Esto se describe en el ejemplo de código a continuación:

```js
const { generateFragment } = await import('https://unpkg.com/text-fragments-polyfill/dist/fragment-generation-utils.js');
const result = generateFragment(window.getSelection());
if (result.status === 0) {
  let url = `${location.origin}${location.pathname}${location.search}`;
  const fragment = result.fragment;
  const prefix = fragment.prefix ?
    `${encodeURIComponent(fragment.prefix)}-,` :
    '';
  const suffix = fragment.suffix ?
    `,-${encodeURIComponent(fragment.suffix)}` :
    '';
  const textStart = encodeURIComponent(fragment.textStart);
  const textEnd = fragment.textEnd ?
    `,${encodeURIComponent(fragment.textEnd)}` :
    '';
  url += `#:~:text=${prefix}${textStart}${textEnd}${suffix}`;
  console.log(url);
}
```

### Obtención de fragmentos de texto con fines analíticos

Muchos sitios utilizan el fragmento para enrutar, por lo que los navegadores eliminan los fragmentos de texto para no romper esas páginas. Existe una [necesidad reconocida](https://github.com/WICG/scroll-to-text-fragment/issues/128) de exponer los enlaces de fragmentos de texto a las páginas, por ejemplo, con fines analíticos, pero la solución propuesta aún no se ha implementado. Como solución alternativa por ahora, puede utilizar el código siguiente para extraer la información deseada.

```js
new URL(performance.getEntries().find(({ type }) => type === 'navigate').name).hash;
```

### Seguridad

Las directivas de fragmentos de texto se invocan solo en navegaciones completas (que no son de la misma página) que son el resultado de [la activación de un usuario](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation). Además, las navegaciones que se originan en un origen diferente al del destino requerirán que la navegación se lleve a cabo en un contexto [`noopener`](https://html.spec.whatwg.org/multipage/links.html#link-type-noopener), de modo que se sepa que la página de destino está suficientemente aislada. Las directivas de fragmentos de texto solo se aplican al marco principal. Esto significa que no se buscará texto dentro de los iframes y la navegación iframe no invocará un fragmento de texto.

### Privacidad

Es importante que las implementaciones de la especificación de Fragmentos de texto no filtren si un fragmento de texto se encontró en una página o no. Si bien los fragmentos de elementos están completamente bajo el control del autor de la página original, cualquiera puede crear fragmentos de texto. Recuerde cómo en mi ejemplo anterior no había forma de enlazar el encabezado *Módulos ECMAScript en Web Workers*, ya que el `<h1>` no tenía una `id`, pero, ¿cómo podría cualquiera, incluyéndome a mí, simplemente enlazar a cualquier lugar al crear cuidadosamente el fragmento de texto?

Imagine que ejecuté una red publicitaria malvada `evil-ads.example.com`. Además, imagine que en uno de mis iframes publicitarios creé dinámicamente un iframe de origen cruzado oculto para `dating.example.com` con una URL de fragmento de texto <code>dating.example.com&lt;mark class="highlight-line highlight-line-active"&gt;#:~:text=Log%20Out&lt;/mark&gt;</code> una vez que el usuario interactúa con el anuncio. Si se encuentra el texto "Cerrar sesión", sé que la víctima está actualmente conectada a `dating.example.com`, lo que podría usar para crear perfiles de usuario. Dado que una implementación ingenua de Fragmentos de texto podría decidir que una coincidencia exitosa debería causar un cambio de enfoque, en `evil-ads.example.com` yo podría escuchar el evento `blur` y así saber cuándo ocurrió una coincidencia. En Chrome, hemos implementado Fragmentos de texto de tal manera que el escenario anterior no puede suceder.

Otro ataque podría ser explotar el tráfico de la red en función de la posición de desplazamiento. Supongamos que tengo acceso a los registros de tráfico de la red de mi víctima, como administrador de la intranet de una empresa. Ahora imagine que existiera un documento extenso de recursos humanos *Qué hacer si sufre de…* y luego una lista de condiciones como *agotamiento*, *ansiedad*, etc. Podría colocar un píxel de seguimiento al lado de cada elemento de la lista. Si luego determino que cargar el documento temporalmente ocurre simultáneamente con la carga del píxel de seguimiento junto a, digamos, el elemento *agotamiento*, entonces puedo, como administrador de la intranet, determinar que un empleado ha hecho clic en un enlace de fragmento de texto con `:~:text=burn%20out` que el empleado pudo haber asumido que era confidencial y no visible para nadie. Dado que este ejemplo es algo artificial para empezar y dado que su explotación requiere que se cumplan condiciones previas *muy* específicas, el equipo de seguridad de Chrome evaluó el riesgo de implementar el desplazamiento en la navegación para que sea manejable. Otros agentes de usuario pueden decidir mostrar un elemento de interfaz de usuario de desplazamiento manual en su lugar.

Para los sitios que desean darse de baja, Chromium admite un valor de encabezado de [Política de documento](https://wicg.github.io/document-policy/) que ellos pueden enviar para que los agentes de usuario no procesen las URL de fragmentos de texto.

```bash
Document-Policy: force-load-at-top
```

## Deshabilitar los fragmentos de texto

La forma más fácil de deshabilitar la función es mediante el uso de una extensión que pueda inyectar encabezados de respuesta HTTP, por ejemplo, [ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj) (no un producto de Google), para insertar un encabezado de respuesta (*no* de solicitud) de la siguiente manera:

```bash
Document-Policy: force-load-at-top
```

Otra forma más complicada de optar por no participar es mediante la configuración empresarial [`ScrollToTextFragmentEnabled`](https://cloud.google.com/docs/chrome-enterprise/policies/?policy=ScrollToTextFragmentEnabled). Para hacer esto en macOS, pegue el siguiente comando en la terminal.

```bash
defaults write com.google.Chrome ScrollToTextFragmentEnabled -bool false
```

En Windows, siga la documentación del sitio de asistencia de la [Ayuda empresarial de Google Chrome.](https://support.google.com/chrome/a/answer/9131254?hl=en)

{% Aside 'warning' %} Intente esto solo cuando sepa lo que está haciendo. {% endAside %}

## Fragmentos de texto en la búsqueda web

Para algunas búsquedas, el motor de búsqueda de Google proporciona una respuesta rápida o un resumen con un fragmento de contenido de un sitio web relevante. Es más probable que estos *fragmentos destacados* aparezcan cuando una búsqueda tenga la forma de una pregunta. Al hacer clic en un fragmento destacado, el usuario se dirige directamente al texto del fragmento destacado en la página web de origen. Esto funciona gracias a las URL de fragmentos de texto creadas automáticamente.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/KbZgnGxZOOymLxYPZyGH.png", alt="", width="800", height="451" %} <figcaption>Página de resultados del motor de búsqueda de Google que muestra un fragmento destacado. La barra de estado muestra la URL de los fragmentos de texto.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4Q7zk9xBnb2uw8GRaLnU.png", alt="", width="800", height="451" %} <figcaption>Después de hacer clic, se muestra la sección correspondiente de la página.</figcaption></figure>

## Conclusión

Las URL de fragmentos de texto son una característica poderosa para enlazar a texto arbitrario en páginas web. La comunidad académica puede utilizarlas para proporcionar enlaces de referencias o citas de gran precisión. Los motores de búsqueda pueden usarlas para hacer enlaces profundos a resultados de texto en las páginas. Los sitios de redes sociales pueden usarlas para permitir que los usuarios compartan pasajes específicos de una página web en lugar de capturas de pantalla inaccesibles. Espero que empiece a [utilizar las URL de fragmentos de texto](https://blog.chromium.org/2019/12/chrome-80-content-indexing-es-modules.html#:~:text=Text%20URL%20Fragments&text=text,-parameter&text=:~:text=On%20islands,%20birds%20can%20contribute%20as%20much%20as%2060%%20of%20a%20cat's%20diet) y las encuentre tan útiles como yo. Asegúrese de instalar la extensión del navegador [Enlace a fragmentos de teto](https://github.com/GoogleChromeLabs/link-to-text-fragment).

## Enlaces relacionados

- [Borrador de especificaciones](https://wicg.github.io/scroll-to-text-fragment/)
- [Revisión TAG](https://github.com/w3ctag/design-reviews/issues/392)
- [Entrada de estado de la plataforma de Chrome](https://chromestatus.com/feature/4733392803332096)
- [Error de seguimiento de Chrome](https://crbug.com/919204)
- [Hilo de Intención de envío](https://groups.google.com/a/chromium.org/d/topic/blink-dev/zlLSxQ9BA8Y/discussion)
- [Hilo de WebKit-Dev](https://lists.webkit.org/pipermail/webkit-dev/2019-December/030978.html)
- [Hilo de posición de estándares de Mozilla](https://github.com/mozilla/standards-positions/issues/194)

## Agradecimientos

Los fragmentos de texto fueron implementados y especificados por [Nick Burris](https://github.com/nickburris) y [David Bokan](https://github.com/bokand), con contribuciones de [Grant Wang](https://github.com/grantjwang). Gracias a [Joe Medley](https://github.com/jpmedley) por la revisión exhaustiva de este artículo. Imagen hero de [Greg Rakozy](https://unsplash.com/@grakozy) en [Unsplash](https://unsplash.com/photos/oMpAz-DN-9I).
