---
layout: post
title: Cómo eliminar el JavaScript que no se utiliza
description: |2-

  Conozca cómo superar la auditoría "Eliminar el JavaScript que no se utiliza" de Lighthouse.
web_lighthouse:
  - "\t\nunused-javascript"
date: 2020-07-07
---

El JavaScript que no se utiliza puede reducir la velocidad de carga de la página:

- Si el JavaScript es [para bloquear la renderización](/critical-rendering-path-adding-interactivity-with-javascript/), el navegador debe descargar, analizar, compilar y evaluar el script antes de que pueda proceder con el resto del trabajo que se necesita para renderizar la página.
- Incluso si el JavaScript es asíncrono (es decir, no bloquea la renderización), el código compite por el ancho de banda con otros recursos mientras se descarga, lo cual tiene implicaciones muy importantes para el rendimiento. Asimismo, enviar el código que no se utiliza mediante la red es un derroche para los usuarios de dispositivos móviles que no disponen de planes de datos ilimitados.

## Cómo falla la auditoría del JavaScript que no se utiliza

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) etiqueta cada archivo de JavaScript con más de 20 kibibytes de código sin utilizar:

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jYbX7CFrcOaaqMHaHa6f.jpg", alt="Una captura de pantalla de la auditoría", width="800", height="332" %} <figcaption> Haga clic en el valor de la columna <b>URL</b> para abrir el código fuente del script en una nueva pestaña. </figcaption></figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Cómo eliminar el JavaScript que no se utiliza

### Detectar el JavaScript que no se utiliza

La [pestaña Cobertura](https://developer.chrome.com/docs/devtools/coverage/) en Chrome DevTools puede darle un análisis línea por línea del código que no se utiliza.

La clase [`Coverage`](https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage) de Puppeteer puede ayudarle a automatizar el proceso para detectar códigos que no se utilizan y extraer el código utilizado.

### Cómo crear una herramienta de respaldo para eliminar el código que no se utiliza

Consulte las siguientes pruebas de [Tooling.Report](https://tooling.report) para determinar si su compactador es compatible con las funciones que hacen más sencillo evitar o eliminar el código sin utilizar:

- [Dividir el código](https://bundlers.tooling.report/code-splitting/)
- [Eliminar códigos que no se utilizan](https://bundlers.tooling.report/transformations/dead-code/)
- [Código de importación que no se utiliza](https://bundlers.tooling.report/transformations/dead-code-dynamic/)

## Indicaciones específicas para cada categoría

### Angular

Si utiliza Angular CLI, incluya mapas de origen para crear su producción e [inspeccionar sus paquetes](https://angular.io/guide/deployment#inspect-the-bundles).

### Drupal

Considere la posibilidad de eliminar los activos de JavaScript que no se utilicen y adjunte solo las bibliotecas de Drupal necesarias para la página o el componente correspondiente de una página. Consulte la sección [Cómo definir una biblioteca](https://www.drupal.org/docs/8/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-module#library) para obtener más información.

### Joomla

Considere la posibilidad de reducir, o cambiar, el número de [extensiones de Joomla](https://extensions.joomla.org/) que cargan el JavaScript y no se utilizan en su página.

### Magento

Desactive la [compactación de JavaScript](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/js-bundling.html) incorporada en Magento.

### React

Si no renderiza el lado del servidor, [divida sus paquetes de JavaScript](/code-splitting-suspense/) con `React.lazy()`. De lo contrario, divida el código mediante una biblioteca de terceros como [loadable-components](https://www.smooth-code.com/open-source/loadable-components/docs/getting-started/).

### Vue

Si no renderiza en el lado del servidor y utiliza el enrutador [Vue](https://next.router.vuejs.org), divida los paquetes por [rutas de carga diferida](https://next.router.vuejs.org/guide/advanced/lazy-loading.html).

### WordPress

Considere la posibilidad de reducir, o cambiar, el número de [complementos de Joomla](https://wordpress.org/plugins/) que cargan el JavaScript y no se utilizan en su página.

## Recursos

- [Código fuente para **Eliminar el código que no se utiliza** en la auditoría](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unused-javascript.js)
- [Eliminar el código que no se utiliza](/remove-unused-code/)
- [Agregar interactividad con JavaScript](/critical-rendering-path-adding-interactivity-with-javascript/)
- [Dividir el código](https://bundlers.tooling.report/code-splitting/)
- [Eliminar códigos inactivos](https://bundlers.tooling.report/transformations/dead-code/)
- [Código importado inactivo](https://bundlers.tooling.report/transformations/dead-code-dynamic/)
- [Encontrar el código de JavaScript y CSS que no se utiliza con la pestaña Cobertura en Chrome DevTools](https://developer.chrome.com/docs/devtools/coverage/)
- [clase: `Coverage`](https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage)
