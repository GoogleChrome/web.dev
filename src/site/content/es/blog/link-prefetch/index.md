---
title: Recuperar recursos para acelerar las futuras navegaciones
subhead: |2-

  Obtenga más información sobre el indicador de recursos rel = prefetch y cómo usarlo.
date: 2019-09-12
authors:
  - demianrenzulli
description: |2-

  Obtenga más información sobre el indicador de recursos rel = prefetch y cómo usarlo.
tags:
  - blog
  - performance
codelabs: codelab-two-ways-to-prefetch
feedback:
  - api
---

Las investigaciones muestran que los [tiempos de carga más rápidos dan como resultado tasas de conversión más altas](https://wpostats.com/) y mejores experiencias de usuario. Si tiene una idea de cómo se mueven los usuarios a través de su sitio web y qué páginas probablemente visitarán a continuación, puede mejorar los tiempos de carga de las navegaciones futuras si descarga con anticipación los recursos para esas páginas.

Esta guía explica cómo lograrlo con `<link rel=prefetch>`, un [indicador de recursos](https://www.w3.org/TR/resource-hints/) que le permite implementar la precarga de una manera fácil y eficiente.

## Mejore la navegación con `rel=prefetch`

Agregar `<link rel=prefetch>` a una página web le indica al navegador que descargue páginas enteras, o algunos de los recursos (como scripts o archivos CSS), que el usuario pueda necesitar en el futuro. Esto puede mejorar las estadísticas como [First Contentful Paint](/fcp/) (Primer despliegue del contenido) y [Time to Interactive](/tti/) (Tiempo para interacción) y, a menudo, puede hacer que las navegaciones posteriores parezcan cargarse instantáneamente.

```html
<link rel="prefetch" href="/articles/" as="document">
```

{% Img src="image/admin/djLGrbmj5eovwa6qhlm1.png", alt="Un diagrama que muestra cómo funciona la precarga de enlaces", width="800", height="413" %}

El indicador `prefetch` consume bytes adicionales para los recursos que no se necesitan de inmediato, por lo que esta técnica debe aplicarse con cuidado. Únicamente precargue los recursos cuando esté seguro de que los usuarios los necesitarán. Considere no realizar una precarga cuando los usuarios tengan conexiones lentas. Puede detectar eso con la [API de información de red](/adaptive-serving-based-on-network-quality/).

Hay diferentes formas de determinar qué enlaces precargar. La más simple es precargar el primer enlace o los primeros enlaces de la página actual. También hay bibliotecas que utilizan enfoques más sofisticados, que se explican más adelante en esta publicación.

## Casos de uso

### Precargar las páginas siguientes

Precargue los documentos HTML cuando las páginas siguientes sean predecibles, de modo que cuando se haga clic en un enlace, la página se cargue instantáneamente.

Por ejemplo, en una página de listado de productos, puede precargar la página del producto más popular de la lista. En algunos casos, la siguiente navegación es incluso más fácil de anticipar: en una página de carrito de compras, la probabilidad de que un usuario visite la página de pago suele ser alta, lo que la convierte en un buen candidato para la precarga.

{% Aside %} eBay implementó la precarga de los primeros cinco resultados en una página de búsqueda para acelerar la carga de páginas futuras y observó un impacto positivo en las tasas de conversión. {% endAside %}

### Precargar activos estáticos

Precargue los recursos estáticos, como scripts u hojas de estilo, cuando se puedan predecir las secciones posteriores que el usuario podría visitar. Esto es especialmente útil cuando esos activos se comparten en muchas páginas.

Por ejemplo, Netflix aprovecha el tiempo que los usuarios pasan en las páginas desconectadas para precargar Reaccione, que se utilizará una vez que los usuarios inicien sesión. Gracias a esto, [redujeron el tiempo de interacción en un 30% para futuras navegaciones](https://medium.com/dev-channel/a-netflix-web-performance-case-study-c0bcde26a9d9).

{% Aside 'gotchas' %} En el momento de escribir este artículo, es posible compartir recursos precargados entre páginas alojadas desde diferentes orígenes. Cuando se [envía la caché HTTP de doble clave](https://groups.google.com/a/chromium.org/forum/#!msg/blink-dev/6KKXv1PqPZ0/oguPntMGDgAJ), esto solo funcionará para navegaciones de nivel superior y subrecursos del mismo origen, pero no será posible reutilizar subrecursos precargados entre diferentes orígenes. Esto significa que, si `a.com` precarga el recurso `b.com/library.js`, dicho recurso no estará disponible en la caché de `c.com`. Algunos navegadores, como los basados en WebKit, ya [crean particiones en cachés y almacenamiento HTML5](https://webkit.org/blog/7675/intelligent-tracking-prevention/) para todos los dominios de terceros. {% endAside %}

### Precarga de fragmentos de JavaScript bajo demanda

[La división de código](/reduce-javascript-payloads-with-code-splitting) de sus paquetes de JavaScript le permite cargar inicialmente solo partes de una aplicación y cargar de forma diferida el resto. Si está utilizando esta técnica, puede aplicar la precarga a rutas o componentes que no se necesitan inmediatamente pero que probablemente se solicitarán pronto.

Por ejemplo, si tiene una página que contiene un botón que abre un cuadro de diálogo que contiene un selector de emoji, puede dividirlo en tres partes de JavaScript: inicio, diálogo y selector. El inicio y el diálogo se pueden cargar inicialmente, mientras que el selector se puede cargar a petición. Herramientas como Webpack le permiten indicarle al navegador que busque previamente estos fragmentos a pedido.

## Cómo implementar `rel=prefetch`

La forma más sencilla de implementar `prefetch` es agregar una etiqueta `<link>` `<head>` del documento:

```html
<head>
	...
	<link rel="prefetch" href="/articles/" as="document">
	...
</head>

```

El atributo `as` no es obligatorio, pero se recomienda. Ayuda a que el navegador establezca los encabezados correctos y determine si el recurso ya está en la caché. Los valores de ejemplo para este atributo incluyen: `document`, `script`, `style`, `font`, `image` y [otros](https://developer.mozilla.org/docs/Web/HTML/Element/link#Attributes).

También puede iniciar la precarga a través mediante el encabezado HTTP [`Link`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link):

`Link: </css/style.css>; rel=prefetch`

Una ventaja de especificar un indicador de precarga en el encabezado HTTP es que el navegador no necesita analizar el documento para encontrar el indicador de recursos, lo que puede ofrecer pequeñas mejoras en algunos casos.

{% Aside %}  `prefetch` es compatible con [todos los navegadores modernos excepto Safari](https://caniuse.com/#search=prefetch). Puede implementar una técnica alternativa para Safari con las solicitudes [XHR](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) o con la [API Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API). {% endAside %}

### Precarga de módulos JavaScript con comentarios mágicos de webpack

Webpack le permite precargar scripts para rutas o funcionalidades que razonablemente ciertos usuarios visitarán o usarán pronto.

El siguiente fragmento de código carga de forma diferida una función de clasificación de la biblioteca [lodash](https://lodash.com/) para ordenar un grupo de números que se enviarán mediante un formulario:

```js
form.addEventListener("submit", e => {
	e.preventDefault()
	import('lodash.sortby')
		.then(module => module.default)
		.then(sortInput())
		.catch(err => { alert(err) });
});
```

En lugar de esperar a que se produzca el evento "enviar" para cargar esta funcionalidad, puede precargar este recurso para aumentar las posibilidades de tenerlo disponible en la caché para cuando el usuario envíe el formulario. Webpack permite eso mediante los [comentarios mágicos](https://webpack.js.org/api/module-methods/#magic-comments) dentro de `import()`:

```js/2
form.addEventListener("submit", e => {
   e.preventDefault()
   import(/* webpackPrefetch: true */ 'lodash.sortby')
         .then(module => module.default)
         .then(sortInput())
         .catch(err => { alert(err) });
});
```

Esto le indica a Webpack que inyecte la etiqueta `<link rel="prefetch">` en el documento HTML:

```html
<link rel="prefetch" as="script" href="1.bundle.js">
```

### Precarga inteligente con Quicklink y Guess.js

También puede implementar una precarga más inteligente con bibliotecas que utilizan la `prefetch` bajo el capó:

- [Quicklink](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) utiliza la [API de observador de intersecciones](https://github.com/GoogleChromeLabs/quicklink) para detectar cuándo los enlaces entran en la ventana gráfica y precarga los recursos enlazados durante el [tiempo de inactividad](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback). Bono: ¡Quicklink pesa menos de 1 KB!
- [Guess.js](https://github.com/guess-js) utiliza informes analíticos para crear un modelo predictivo que se utiliza para [precargar de forma inteligente](/predictive-prefetching/) solo lo que el usuario probablemente necesite.

Tanto Quicklink como Guess.js utilizan la [API de información de red](https://developer.mozilla.org/docs/Web/API/Network_Information_API) para evitar la precarga si un usuario está en una red lenta o tiene la función [`Save-Data`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Save-Data) activada.

{% Aside %} Una empresa de vinos, Jabong, implementó la precarga con Quicklink y logró un tiempo de interacción 2,7 s más rápido en las páginas futuras. {% endAside %}

## Precarga debajo del capó

Los indicadores de recursos no son instrucciones obligatorias y depende del navegador decidir si se ejecutan y cuándo.

Puede utilizar la precarga varias veces en la misma página. El navegador pone en cola todas las sugerencias y solicita cada recurso cuando está [inactivo](https://developer.mozilla.org/docs/Web/HTTP/Link_prefetching_FAQ#How_is_browser_idle_time_determined.3F). En Chrome, si una precarga no ha terminado de cargarse y el usuario navega hasta el recurso destinado de precarga, el navegador recoge la carga en curso como navegación (otros proveedores de navegadores pueden implementar esto de manera diferente).

La precarga tiene lugar en la [prioridad "más baja"](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit), por lo que los recursos precargados no compiten por el ancho de banda con los recursos necesarios en la página actual.

Los archivos precargados se almacenan en la [caché HTTP](https://developer.mozilla.org/docs/Web/HTTP/Caching) o en la [memoria caché](https://calendar.perfplanet.com/2016/a-tale-of-four-caches/) (en función de si el recurso se puede almacenar en caché o no), durante un período de tiempo que varía según los navegadores. Por ejemplo, en Chrome, los recursos se mantienen durante cinco minutos, después de los cuales se aplican las reglas normales de control de caché para el recurso.

## Conclusión

El uso de `prefetch` puede mejorar en gran medida los tiempos de carga de futuras navegaciones e incluso hacer que las páginas parezcan cargarse instantáneamente. La técnica `prefetch` es ampliamente compatible con los navegadores modernos, lo que la convierte en una técnica atractiva para mejorar la experiencia de navegación de muchos usuarios. Esta técnica requiere cargar bytes adicionales que podrían no usarse, así que tenga cuidado cuando la use. Hágalo solo cuando sea necesario, e idealmente, solo en redes rápidas.
