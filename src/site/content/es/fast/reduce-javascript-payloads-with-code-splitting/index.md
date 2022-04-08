---
layout: post
title: Reducir las cargas útiles de JavaScript con la división de código
authors:
  - houssein
description: |2

  El envío de grandes cargas útiles de JavaScript afecta la velocidad de su sitio

  significativamente. En lugar de enviar todo el JavaScript a su usuario tan pronto como

  se carga la primera página de su aplicación, divida su paquete en

  varias piezas y solo envíe lo necesario al principio.
date: 2018-11-05
codelabs:
  - división-del-código-de-codelab
tags:
  - performance
---

A nadie le gusta esperar. **[Más del 50% de los usuarios abandonan un sitio web si tarda más de 3 segundos en cargarse](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/)** .

El envío de grandes cargas útiles de JavaScript impacta significativamente en la velocidad de su sitio. En lugar de enviar todo el código JavaScript a su usuario tan pronto como se cargue la primera página de su aplicación, divida su paquete en varias partes y envíe al principio solo lo necesario.

## Medición

Lighthouse muestra una auditoría como fallida cuando se tarda una cantidad significativa de tiempo en ejecutar todo el JavaScript en una página.

{% Img src="image/admin/p0Ahh3pzXog3jPdDp6La.png", alt="Una auditoría de Lighthouse fallida que muestra que los scripts tardan demasiado en ejecutarse.", width="797", height="100" %}

Divida el paquete de JavaScript para enviar solo el código necesario para la ruta inicial cuando el usuario carga una aplicación. Esto minimiza la cantidad de script que necesita ser analizado y compilado, resultando en tiempos de carga de página más rápidos.

Los paquetes de módulos populares como[webpack](https://webpack.js.org/guides/code-splitting/), [Parcel](https://parceljs.org/code_splitting.html) y [Rollup](https://rollupjs.org/guide/en#dynamic-import) le permiten dividir sus paquetes mediante [importaciones dinámicas](https://v8.dev/features/dynamic-import). Por ejemplo, considere el siguiente fragmento de código que muestra un ejemplo de una función `someFunction` que se activa al enviar un formulario.

```js
import moduleA from "library";

form.addEventListener("submit", e => {
  e.preventDefault();
  someFunction();
});

const someFunction = () => {
  // uses moduleA
}
```

Aquí, `someFunction` usa un módulo importado de una biblioteca en particular. Si este módulo no se usa en otro lugar, el bloque de código se puede modificar para usar una importación dinámica para recuperarlo solo cuando el usuario envía el formulario.

```js/2-5
form.addEventListener("submit", e => {
  e.preventDefault();
  import('library.moduleA')
    .then(module => module.default) // using the default export
    .then(someFunction())
    .catch(handleError());
});

const someFunction = () => {
    // uses moduleA
}
```

El código dentro del módulo no se incluye en el paquete inicial y ahora se **carga de forma diferida** o se da al usuario solo cuando es necesario tras el envío del formulario. Para un rendimiento de la página aún mejor, [precargue fragmentos críticos para priorizarlos y recuperarlos antes](/preload-critical-assets) .

Aunque el fragmento de código anterior es un ejemplo simple, la carga diferida de dependencias de terceros no es un patrón común en aplicaciones más grandes. Por lo general, las dependencias de terceros se dividen en un paquete del proveedor aparte, que se puede almacenar en caché ya que no se actualizan con tanta frecuencia. Puede leer más sobre cómo [**SplitChunksPlugin**](https://webpack.js.org/plugins/split-chunks-plugin/) puede ayudarlo con esto.

Dividir código a nivel de ruta o componente cuando se usa un framework del lado del cliente es un enfoque más simple para la carga diferida de diferentes partes de su aplicación. Muchos frameworks populares que utilizan webpack ofrecen abstracciones para que la carga diferida sea más fácil que meterse en las configuraciones usted mismo.
