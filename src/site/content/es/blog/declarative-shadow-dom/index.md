---
title: Declarative Shadow DOM
subhead: |2

  Una nueva forma de implementar y utilizar Shadow DOM directamente en HTML.
date: 2020-09-30
updated: 2021-04-14
hero: image/admin/IIPe5m8edvp0XMPpzrz9.jpg
alt: cúpula de sombra decorativa
authors:
  - developit
  - masonfreed
description: Declarative Shadow DOM es una nueva forma de implementar y usar Shadow DOM directamente en HTML.
tags:
  - blog
  - dom
  - html
  - javascript
  - layout
  - rendering
feedback:
  - api
---

{% Aside %} Declarative Shadow DOM es una función de plataforma web propuesta sobre la que el equipo de Chrome está buscando retroalimentación. Pruébela usando la [bandera experimental](#detection-support) o con [polyfill](#polyfill). {% endAside %}

[Shadow DOM](/shadowdom-v1/) es uno de los tres estándares de Web Components (componentes web), completado por [plantillas HTML](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots) y [elementos personalizados](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements). Shadow DOM proporciona una forma de aplicar el alcance de los estilos CSS a un subárbol DOM específico y aislar ese subárbol del resto del documento. El elemento de `<slot>` nos da una forma de controlar dónde se deben insertar los elementos secundarios de un elemento personalizado dentro de su Shadow Tree. Estas características combinadas permiten un sistema para construir componentes autónomos y reutilizables que se integran perfectamente en aplicaciones existentes como un elemento HTML incorporado.

Hasta ahora, la única forma de usar Shadow DOM era construir una shadow root (raíz de sombra) usando JavaScript:

```js
const host = document.getElementById('host');
const shadowRoot = host.attachShadow({mode: 'open'});
shadowRoot.innerHTML = '<h1>Hello Shadow DOM</h1>';
```

Una API imperativa como esta funciona bien para la representación del lado del cliente: los mismos módulos de JavaScript que definen nuestros elementos personalizados también crean sus Shadow Roots y establecen su contenido. Sin embargo, muchas aplicaciones web necesitan representar contenido del lado del servidor o un HTML estático en el momento de la compilación. Esto puede ser una parte importante para brindar una experiencia razonable a los visitantes que pueden no ser capaces de ejecutar JavaScript.

Las justificaciones para la [renderización del lado del servidor](/rendering-on-the-web/) (SSR) varían de un proyecto a otro. Algunos sitios web deben proporcionar HTML renderizado por un servidor completamente funcional para cumplir con las pautas de accesibilidad, otros optan por ofrecer una experiencia básica sin JavaScript como una forma de garantizar un buen rendimiento en conexiones o dispositivos lentos.

Históricamente, ha sido difícil usar Shadow DOM en combinación con la renderización del lado del servidor porque no había una forma incorporada de expresar Shadow Roots en el HTML generado por el servidor. También hay implicaciones de rendimiento al adjuntar Shadow Roots a elementos DOM que ya se han renderizado sin ellos. Esto puede provocar un cambio de diseño después de que la página se haya cargado, o mostrar temporalmente un destello de contenido sin estilo ("FOUC") mientras se cargan las hojas de estilo de Shadow Root.

[Declarative Shadow DOM](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md) (DSD) elimina esta limitación, llevando Shadow DOM al servidor.

## Construyendo una Declarative Shadow Root {: #building }

Una Declarative Shadow Root es un element `<template>` con un atributo de `shadowroot`:

```html
<host-element>
  <template shadowroot="open">
    <slot></slot>
  </template>
  <h2>Light content</h2>
</host-element>
```

Un elemento de plantilla con el `shadowroot` es detectado por el analizador HTML y aplicado inmediatamente como el shadow root de su elemento primario. La carga del marcado puro del HTML del ejemplo anterior da como resultado el siguiente árbol DOM:

```html
<host-element>
  #shadow-root (open)
  <slot>
    ↳
    <h2>Light content</h2>
  </slot>
</host-element>
```

{% Aside %} Esta muestra de código sigue las convenciones del panel de Elementos de Chrome DevTools para mostrar contenido de Shadow DOM. Por ejemplo, el carácter `↳` representa contenido Light DOM que está en la ranura. {% endAside %}

Esto nos brinda los beneficios de la encapsulación y la proyección de ranuras de Shadow DOM en un HTML estático. No se necesita JavaScript para producir el árbol completo, incluido el Shadow Root.

## Serialización {: #serialization }

Además de introducir la nueva sintaxis de `<template>` para crear shadow roots y adjuntarlas a elementos, Declarative Shadow Dom también incluye una nueva API para obtener el contenido HTML de un elemento. El nuevo método de `getInnerHTML()` funciona como `.innerHTML`, pero proporciona una opción para controlar si las raíces ocultas deben incluirse en el HTML que fue devuelto:

```js
const html = element.getInnerHTML({includeShadowRoots: true});
`<host-element>
  <template shadowroot="open"><slot></slot></template>
  <h2>Light content</h2>
</host-element>`;
```

Pasar la opción de `includeShadowRoots:true` serializa todo el subárbol de un elemento, **incluidas sus shadow roots**. Las shadow roots incluidas se serializan utilizando la sintaxis de `<template shadowroot>`.

Para preservar la semántica de encapsulación, las [closed shadow roots (raíces de sombras cerradas)](https://developer.mozilla.org/docs/Web/API/ShadowRoot/mode) dentro de un elemento no se serializarán de forma predeterminada. Para incluir closed shadow roots en el HTML serializado, se puede pasar una matriz de referencias a esas shadow roots a través de una nueva opción de `closedRoots`:

```js
const html = element.getInnerHTML({
  includeShadowRoots: true,
  closedRoots: [shadowRoot1, shadowRoot2, ...]
});
```

Al serializar el HTML dentro de un elemento, cualquier closed shadow roots que esté presente en la matriz de `closedRoots` se serializará utilizando la misma sintaxis de plantilla que las open shadow roots (raíces de sombras abiertas):

```html
<host-element>
  <template shadowroot="closed">
    <slot></slot>
  </template>
  <h2>Light content</h2>
</host-element>
```

Serialized closed shadow roots se indican mediante un atributo de `shadowroot` con un valor de `closed`.

## Hidratación de componentes {: #hydration }

El Declarative Shadow DOM se puede usar por sí solo como una forma para encapsular estilos o personalizar la ubicación de los elementos secundarios, pero es más poderoso cuando se usa con elementos personalizados. Los componentes creados con elementos personalizados se actualizan automáticamente a partir de un HTML estático. Con la introducción de Declarative Shadow DOM, ahora es posible que un elemento personalizado tenga una shadow root antes de que se actualice.

Un elemento personalizado que se actualiza desde el HTML que incluye una Declarative Shadow Root ya tendrá esa shadow root adjunta. Esto significa que el elemento tendrá una `shadowRoot` ya disponible cuando se instancia, sin que su código se cree explícitamente. Es mejor verificar `this.shadowRoot` para cualquier shadow root existente en el constructor de tu elemento. Si ya existe un valor, el HTML de este componente ya incluye a una Declarative Shadow Root. Si el valor es nulo, no había ninguna Declarative Shadow Root presente en el HTML o el navegador no es compatible con Declarative Shadow DOM.

```html
<menu-toggle>
  <template shadowroot="open">
    <button>
      <slot></slot>
    </button>
  </template>
  Open Menu
</menu-toggle>

<script>
  class MenuToggle extends HTMLElement {
    constructor() {
      super();

      // Detecta si ya existe algún contenido SSR:
      if (this.shadowRoot) {
        // ¡La Declarative Shadow Root existe!
        // conecta los oyentes de eventos, referencias , etc.:
        const button = this.shadowRoot.firstElementChild;
        button.addEventListener('click', toggle);
      } else {
        // La Declarative Shadow Root no existe.
        // Crear una nueva shadow root y llénala:
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `<button><slot></slot></button>`;
        shadow.firstChild.addEventListener('click', toggle);
      }
    }
  }

  customElements.define('menu-toggle', MenuToggle);
</script>
```

Los elementos personalizados han existido por un tiempo y hasta ahora no había ninguna razón para buscar una shadow root existente antes de crear una mediante `attachShadow()`. El Declarative Shadow DOM incluye un pequeño cambio que permite que los componentes existentes funcionen a pesar de esto: llamar al método `attachShadow()` en un elemento con una **Declarative** Shadow Root **no** arrojará un error. En cambio, la Declarative Shadow Root se vacía y se devuelve. Esto permite que los componentes más antiguos no creados para Declarative Shadow DOM sigan funcionando, ya que las declarative roots se conservan hasta que se crea un reemplazo imperativo.

Para elementos personalizados recién creados, una nueva [propiedad ElementInternals.shadowRoot](https://github.com/w3c/webcomponents/issues/871) proporciona una forma explícita de obtener una referencia a la Declarative Shadow Root existente de un elemento, tanto abierta como cerrada. Esto se puede usar para verificar y usar cualquier Declarative Shadow Root, y utilizar a `attachShadow()` como respaldo en los casos en que no se proporcionó una.

```js
class MenuToggle extends HTMLElement {
  constructor() {
    super();

    const internals = this.attachInternals();

    // Checa si existe una Declarative Shadow Root:
    let shadow = internals.shadowRoot;
    if (!shadow) {
      // no hubo una. Crea una nueva Shadow Root:
      shadow = this.attachShadow({mode: 'open'});
      shadow.innerHTML = `<button><slot></slot></button>`;
    }

    // en cualquier caso, pegamos al oyente de eventos:
    shadow.firstChild.addEventListener('click', toggle);
  }
}
customElements.define('menu-toggle', MenuToggle);
```

## Una sombra por raíz {: #shadow-per-root }

Una Declarative Shadow Root solo está asociada con su elemento primario. Esto significa que las shadow roots siempre se colocan con su elemento asociado. Esta decisión de diseño garantiza que las shadow roots se puedan transmitir como el resto de un documento HTML. También es conveniente para la creación y la generación, ya que agregar una shadow root a un elemento no requiere mantener un registro de shadow roots existentes.

La compensación de asociar shadow roots con su elemento primario es que no es posible inicializar varios elementos desde la misma Declarative Shadow Root `<template>`. Sin embargo, es poco probable que esto importe en la mayoría de los casos en los que se utiliza el Declarative Shadow DOM, ya que el contenido de cada shadow root rara vez es idéntico. Si bien el HTML renderizado por el servidor a menudo contiene estructuras de elementos repetidos, su contenido generalmente es diferente: ligeras variaciones en el texto, los atributos, etc. Debido a que el contenido de una Declarative Shadow Root serializada es completamente estático, actualizar varios elementos de una sola Declarative Shadow Root solo funcionaría si los elementos resultaran ser idénticos. Finalmente, el impacto de las shadow root similares repetidas en el tamaño de transferencia de la red es relativamente pequeño debido a los efectos de la compresión.

En el futuro, podría ser posible volver a visitar las shadow roots compartidas. Si el DOM obtiene compatibilidad para [plantillas integradas](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md), las Declarative Shadow Roots podrían tratarse como plantillas que se instancian para construir la raíz de sombra para un elemento dado. El diseño actual de Declarative Shadow DOM permite que esta posibilidad exista en el futuro al limitar la asociación de shadow root a un solo elemento.

## El tiempo lo es todo {: #timing }

Asociar las Declarative Shadow Roots directamente con su elemento primario simplifica el proceso de actualización y para unirlas a ese elemento. Las Shadow Roots declarativas se detectan durante el análisis de HTML y se adjuntan inmediatamente cuando se encuentra su etiqueta `</template>` de **cierre**.

```html
<div id="el">
  <script>
    el.shadowRoot; // null
  </script>

  <template shadowroot="open">
    <!-- shadow realm -->
  </template>

  <script>
    el.shadowRoot; // ShadowRoot
  </script>
</div>
```

Antes de ser adjuntado, el contenido de un `<template>` con el `shadowroot` es un Innert Document Fragment (Fragmento de Documento inerte) y no es accesible a través de la propiedad de `.content` como una plantilla estándar. Esta medida de seguridad evita que JavaScript pueda obtener una referencia a shadow roots cerradas. Como resultado, el contenido de una shadow roots declarativa no se procesa hasta que se analiza su etiqueta de `</template>`.

```html
<div>
  <template id="shadow" shadowroot="open">
    shadow realm
    <script>
      shadow.content; // null
    </script>
  </template>
</div>
```

## Solo analizador {: #parser-only }

Declarative Shadow DOM es una característica del analizador HTML. Esto significa que una Declarative Shadow Root solo se analizará y se adjuntará a las `<template>` con un atributo `shadowroot` que estén presentes durante el análisis del HTML. En otras palabras, las raíces declarativas de sombra se pueden construir durante el análisis HTML inicial:

```html
<some-element>
  <template shadowroot="open">
    shadow root content for some-element
  </template>
</some-element>
```

Establecer el atributo `shadowroot` de un `<template>` no hace nada, y la plantilla sigue siendo un elemento de plantilla normal:

```js
const div = document.createElement('div');
const template = document.createElement('template');
template.setAttribute('shadowroot', 'open'); // esto no hace nada
div.appendChild(template);
div.shadowRoot; // vació
```

Para evitar algunas consideraciones de seguridad importantes, las Declarative Shadow Roots tampoco se pueden crear utilizando API de análisis de fragmentos como `innerHTML` o `insertAdjacentHTML()`. La única forma de analizar un HTML con Declarative Shadow Roots aplicado es pasar una nueva opción de `includeShadowRoots` a `DOMParser`:

```html
<script>
  const html = `
    <div>
      <template shadowroot="open"></template>
    </div>
  `;
  const div = document.createElement('div');
  div.innerHTML = html; // No hay shadow root
  const fragment = new DOMParser().parseFromString(html, 'text/html', {
    includeShadowRoots: true
  }); // Aquí si hay shadow root
</script>
```

## Renderización del servidor con estilo {: #styling }

Las hojas de estilo en línea y las externas son totalmente compatibles dentro de Declarative Shadow Roots utilizando las etiquetas de `<style>` y `<link>`:

```html
<nineties-button>
  <template shadowroot="open">
    <style>
      button {
        color: seagreen;
      }
    </style>
    <link rel="stylesheet" href="/comicsans.css" />
    <button>
      <slot></slot>
    </button>
  </template>
  I'm Blue
</nineties-button>
```

Los estilos especificados de esta manera también están altamente optimizados: si la misma hoja de estilo está presente en múltiples Declarative Shadow Roots, solo se carga y se analiza una vez. El navegador utiliza una `CSSStyleSheet` de respaldo única que es compartida por todas las shadow roots, lo que elimina la sobrecarga de memoria duplicada.

[Constructable Stylesheets (Las hojas de estilo construibles)](https://developers.google.com/web/updates/2019/02/constructable-stylesheets) no son compatibles con Declarative Shadow DOM. Esto se debe a que actualmente no hay forma de serializar hojas de estilo construibles en HTML, y no hay forma de hacer referencia a ellas cuando se `adoptedStyleSheets` hojas de estilo adoptadas.

## Evitando el destello de contenido sin estilo {: #fouc }

Un problema potencial en los navegadores que aún no son compatibles con Declarative Shadow DOM es evitar el "flash de contenido sin estilo" (FOUC), donde el contenido sin procesar se muestra para los elementos personalizados que aún no se han actualizado. Antes de Declarative Shadow DOM, una técnica común para evitar el FOUC era aplicar una regla de estilo de `display:none` a los elementos personalizados que aún no se han cargado, ya que estos no tenían su shadow root adjunta y poblada. De esta forma, el contenido no se muestra hasta que esté "listo":

```html
<style>
  x-foo:not(:defined) > * {
    display: none;
  }
</style>
```

Con la introducción de Declarative Shadow DOM, los elementos personalizados se pueden renderizar o crear en el HTML de modo que su shadow content esté en su lugar y listo antes de que se cargue la implementación del componente del lado del cliente:

```html
<x-foo>
  <template shadowroot="open">
    <style>h2 { color: blue; }</style>
    <h2>shadow content</h2>
  </template>
</x-foo>
```

En este caso, la regla de `display:none` "FOUC" evitaría que se muestre el contenido de la declarative shadow root. Sin embargo, eliminar esa regla haría que los navegadores sin soporte de Declarative Shadow DOM mostraran contenido incorrecto o sin estilo hasta que el [polyfill](#polyfill) de Declarative Shadow DOM cargue y convierta la plantilla de shadow root en una shadow root real.

Afortunadamente, esto se puede resolver en CSS modificando la regla de estilo FOUC. En los navegadores que permiten Declarative Shadow DOM, el elemento `<template shadowroot>` se convierte inmediatamente en una shadow root, sin dejar ningún elemento `<template>` en el árbol DOM. Los navegadores que no permiten Declarative Shadow DOM conservan el elemento `<template>`, que podemos usar para evitar FOUC:

```html
<style>
  x-foo:not(:defined) > template[shadowroot] ~ *  {
    display: none;
  }
</style>
```

En vez de ocultar el elemento personalizado que aún no ha sido definido, la regla revisada de "FOUC" esconde sus *elementos secundarios* cuando siguen un elemento `<template shadowroot>`. Una vez que se define el elemento personalizado, la regla ya no coincide. La regla se ignora en los navegadores que permiten Declarative Shadow DOM porque el elemento secundario de `<template shadowroot>` se elimina durante el análisis de HTML.

## Detección de funciones y compatibilidad con el navegador {: #deployment-support }

El Declarative Shadow DOM está disponible en Chrome 90 y Edge 91. También se puede habilitar usando la bandera de **Experimental Web Platform Features** en Chrome 85. Navega a `about://flags/#enable-experimental-web-platform-features` para encontrar esa configuración.

Como nueva API de plataforma web, Declarative Shadow DOM aún no tiene un soporte generalizado en todos los navegadores. La compatibilidad del navegador se puede detectar comprobando la existencia de una `shadowroot` en el prototipo de `HTMLTemplateElement`:

```js
function supportsDeclarativeShadowDOM() {
  return HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot');
}
```

## Polyfill {: #polyfill }

La construcción de un polyfill simplificado para Declarative Shadow DOM es relativamente sencillo, ya que un polyfill no necesita replicar perfectamente la semántica de tiempo o las características de solo analizador de las que se ocupa una implementación de navegador. Para hacer un polyfill a Declarative Shadow DOM, podemos escanear el DOM para encontrar todos los elementos `<template shadowroot>`, luego convertirlos en Shadow Roots adjuntos en su elemento primario. Este proceso se puede realizar una vez que el documento está listo o se puede activar por eventos más específicos, como los ciclos de vida de los elementos personalizados.

```js
document.querySelectorAll('template[shadowroot]').forEach(template => {
  const mode = template.getAttribute('shadowroot');
  const shadowRoot = template.parentNode.attachShadow({ mode });
  shadowRoot.appendChild(template.content);
  template.remove();
});
```

## Lectura adicional {: #further-reading }

- [Explicador con alternativas y análisis de desempeño](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md)
- [Chromestatus para Declarative Shadow DOM](https://www.chromestatus.com/feature/5191745052606464)
- [Intent to Prototype](https://groups.google.com/a/chromium.org/g/blink-dev/c/nJDc-1s3R9U/m/uCJKsEqpAwAJ)
