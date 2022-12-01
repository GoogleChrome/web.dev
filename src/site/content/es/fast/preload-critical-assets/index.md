---
layout: post
title: Precarga de activos críticos para mejorar la velocidad de carga
authors:
  - houssein
  - mihajlija
description: |2

  Tan pronto como abre cualquier página web, el navegador solicita un documento HTML de un

  servidor, analiza el contenido del archivo HTML y envía solicitudes por separado

  para cualquier otra referencia externa. La cadena de solicitudes críticas representa la

  orden de los recursos priorizados y recuperados por el navegador.
date: 2018-11-05
updated: 2020-05-27
codelabs:
  - codelab-preload-critical-assets
  - codelab-preload-web-fonts
tags:
  - performance
feedback:
  - api
---

Cuando abre una página web, el navegador solicita el documento HTML de un servidor, analiza su contenido y envía solicitudes separadas para cualquier recurso referenciado. Como desarrollador, ya conoce todos los recursos que su página necesita y cuáles son los más importantes. Puede utilizar ese conocimiento para solicitar los recursos críticos anticipadamente y acelerar el proceso de carga. Esta publicación explica cómo hacer eso con `<link rel="preload">`.

## Cómo funciona la precarga

La precarga es más adecuada para los recursos que el navegador suele descubrir más tarde.

<figure>{% Img src="image/admin/Ad9PLq3DcQt9Ycp63z6O.png", alt="Captura de pantalla del panel de red de Chrome DevTools", width="701", height="509"%}<figcaption> En este ejemplo, la fuente Pacifico se define en la hoja de estilo con una regla <a href="/reduce-webfont-size/#defining-a-font-family-with-@font-face)"><code>@font-face</code></a>. El navegador carga el archivo de fuente solo después de que haya terminado de descargar y analizar la hoja de estilo.</figcaption></figure>

Al precargar un determinado recurso, está informando al navegador que le gustaría recuperar dicho recurso antes de que el navegador lo descubra, porque está seguro de que es importante para la página actual.

<figure>{% Img src="image/admin/PgRbERrxLGfF439yBMeY.png", alt="Captura de pantalla del panel Chrome DevTools Network después de habilitar la precarga", width="701", height="509" %}. En este ejemplo, se realiza la precarga de la fuente Pacifico, por lo que la descarga ocurre en paralelo con la hoja de estilo.</figure>

La cadena de solicitudes críticas representa el orden de los recursos priorizados y buscados por el navegador. Lighthouse identifica los activos que se encuentran en el tercer nivel de esta cadena como descubiertos tardíamente. Puede utilizar la [**auditoría de solicitudes de claves de precarga**](/uses-rel-preload) para identificar cuáles recursos precargar.

{% Img src="image/admin/BPUTHBNZFbeXqb0dVx2f.png", alt="La clave de precarga de Lighthouse solicita auditoría", width="745", height="97" %}

Puede precargar recursos agregando una etiqueta `<link>` con el atributo `rel="preload"` al encabezado de su documento HTML:

```html
<link rel="preload" as="script" href="critical.js">
```

El navegador almacena en caché los recursos precargados para que estén disponibles de inmediato cuando sean necesarios (no ejecuta los scripts ni aplica las hojas de estilo).

{% Aside %} Después de implementar la precarga, muchos sitios, incluidos [Shopify, Financial Times y Treebo, presentaron mejoras de 1 segundo](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf) en métricas centradas en el usuario, como [Time to Interactive: Tiempo de interacción](/tti/) y [First Contentful Paint: Despliegue de la primera entrada](/fcp/). {% endAside %}

Sugerencias de recursos, por ejemplo, [`preconnect`](/preconnect-and-dns-prefetch) y [`prefetch`](/link-prefetch), se ejecutan como el navegador crea conveniente. La `preload`, por otro lado, es obligatoria para el navegador. Los navegadores modernos ya son muy buenos a la hora de priorizar recursos, por eso es importante usar la `preload` con moderación y solo precargar los recursos más críticos.

Las precargas no utilizadas activan una advertencia de consola en Chrome, aproximadamente 3 segundos después del evento de `load`.

{% Img src="image/admin/z4FbCezjXHxaIhq188TU.png", alt="Advertencia de la consola Chrome DevTools sobre recursos precargados no utilizados", width="800", height="228" %}

{% Aside %} [`preload` es compatible](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility) con todos los navegadores modernos. {% endAside %}

## Casos de uso

{% Aside 'caution' %} Al momento de escribir este artículo, Chrome tiene un [error](https://bugs.chromium.org/p/chromium/issues/detail?id=788757) abierto para las solicitudes precargadas que se recuperan antes de otros recursos de mayor prioridad. Hasta que esto se resuelva, tenga cuidado de cómo los recursos precargados pueden "saltar la cola" y ser solicitados antes de lo debido. {% endAside %}

### Precarga de recursos definidos en CSS

Las fuentes definidas con las reglas de [`@font-face`](/reduce-webfont-size/#defining-a-font-family-with-@font-face) o las imágenes de fondo definidas en archivos CSS no se descubren hasta que el navegador descarga y analiza los archivos CSS correspondientes. La precarga de estos recursos garantiza que se obtengan antes de que se descarguen los archivos CSS.

### Precarga de archivos CSS

Si está utilizando el [enfoque CSS crítico](/extract-critical-css), dividirás el CSS en dos partes. El CSS crítico requerido para representar el contenido de la mitad superior de la página está incluido en la `<head>` del documento y el CSS no crítico generalmente se carga de forma diferida con JavaScript. Esperar a que JavaScript se ejecute antes de cargar CSS no crítico puede causar retrasos en la representación cuando los usuarios se desplazan, por lo que es una buena idea usar `<link rel="preload">` para iniciar la descarga de modo anticipado.

### Precarga de archivos JavaScript

Debido a que los navegadores no ejecutan archivos precargados, la precarga es útil para separar la obtención de la [ejecución](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/), lo que puede mejorar métricas como Time to Interactive. La precarga funciona mejor si [divide](/reduce-javascript-payloads-with-code-splitting) sus paquetes de JavaScript y solo precarga fragmentos críticos.

## Cómo implementar rel=preload

La forma más sencilla de implementar la `preload` es agregar una etiqueta `<link>` a la `<head>` del documento:

```html
<head>
  <link rel="preload" as="script" href="critical.js">
</head>
```

Suministrar el atributo `as` ayuda al navegador a establecer la prioridad del recurso precargado de acuerdo con el tipo, establecer los encabezados correctos y determinar si el recurso ya existe en la caché. Los valores aceptados para este atributo incluyen: `script`, `style`, `font`, `image` y [otros](https://developer.mozilla.org/docs/Web/HTML/Element/link#Attributes).

{% Aside %} Eche un vistazo al documento  de [Programación y prioridades de recursos de Chrome](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit) para obtener más información sobre cómo el navegador prioriza los diferentes tipos de recursos. {% endAside %}

{% Aside 'caution' %} Omitir el atributo `as` o introducir un valor no válido equivale a una [solicitud XHR,](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) donde el navegador no sabe lo que está buscando, por lo que no puede determinar la prioridad correcta. También puede hacer que algunos recursos, como los scripts, se recuperen dos veces. {% endAside %}

Algunos tipos de recursos, como las fuentes, se cargan en [modo anónimo](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements). Para estos recursos, debe establecer el atributo `crossorigin` con la `preload`:

```html
<link rel="preload" href="ComicSans.woff2" as="font" type="font/woff2" crossorigin>
```

{% Aside 'caution' %} Las fuentes precargadas sin el atributo `crossorigin` se recuperarán dos veces. {% endAside %}

Los elementos `<link>` también admiten un [atributo de `type`](https://developer.mozilla.org/docs/Web/HTML/Element/link#attr-type), que contiene el [tipo MIME](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types) del recurso vinculado. Los navegadores usan el valor del `type` para asegurarse de que los recursos se carguen previamente solo si el tipo de archivo es compatible. Si un navegador no admite el tipo de recurso especificado, ignorará el `<link rel="preload">`.

{% Aside 'codelab' %} [Mejore el rendimiento de una página mediante la precarga de fuentes web](/codelab-preload-web-fonts). {% endAside %}

También puede precargar cualquier tipo de recurso a través del [encabezado `Link`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link) HTTP:

`Link: </css/style.css>; rel="preload"; as="style"`

Una ventaja de especificar la `preload` en el encabezado HTTP es que el navegador no necesita analizar el documento para descubrirlo, lo que puede ofrecer pequeñas mejoras en algunos casos.

### Precarga de módulos JavaScript con webpack

Si está utilizando un paquete de módulos que crea archivos de compilación de su aplicación, debe verificar si admite la inyección de etiquetas de precarga. Con la versión 4.6.0 o posterior del [webpack](https://webpack.js.org/), la precarga es compatible mediante el uso de [magic comments](https://webpack.js.org/api/module-methods/#magic-comments) dentro de `import()`:

```js
import(_/* webpackPreload: true */_ "CriticalChunk")
```

Si está utilizando una versión anterior de webpack, utilice un complemento de terceros como [preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin).

## Conclusión

Para mejorar la velocidad de la página, utilice la precarga en los recursos importantes que el navegador descubre tardíamente. Precargar todos los recursos sería contraproducente, así que use la `preload` con moderación y [mida el impacto en el mundo real](/fast#measure-performance-in-the-field).
