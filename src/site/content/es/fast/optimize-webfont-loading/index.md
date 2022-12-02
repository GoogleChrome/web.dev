---
layout: post
title: Optimice la carga y el renderizado de fuentes web
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: |2-

  Esta publicación explica cómo cargar fuentes web para evitar cambios de diseño y páginas en blanco cuando las fuentes web no están disponibles durante la carga de la página.
tags:
  - performance
  - fonts
feedback:
  - api
---

Una fuente web "completa" que incluye todas las variantes estilísticas, que quizá usted no necesite, además de todos los glifos que pueden no utilizarse, quizá resulte fácilmente en una descarga de varios megabytes. En esta publicación, descubrirá cómo optimizar la carga de fuentes web para que los visitantes solo descarguen lo que usarán.

Para abordar el problema de los archivos grandes que contienen todas las variantes, la regla de CSS `@font-face` está diseñada específicamente para permitirle dividir la familia de fuentes en una colección de recursos. Por ejemplo, subconjuntos Unicode y variantes de estilo distintas.

Dadas estas declaraciones, el navegador determina los subconjuntos y variantes requeridos, además descarga el conjunto mínimo requerido para renderizar el texto, lo cual es muy conveniente. Sin embargo, si no tiene cuidado, también puede crear un cuello de botella en el rendimiento en la ruta crítica de renderización y retrasar la renderización del texto.

### El comportamiento predeterminado

La carga diferida de las fuentes conlleva una implicación oculta importante que puede retrasar la representación del texto: el navegador debe [construir el árbol de renderizado](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction), lo que depende de los árboles DOM y CSSOM, antes de saber qué recursos de fuentes necesita para representar el texto. Como resultado, las solicitudes de fuentes se retrasan mucho después de otros recursos críticos y es posible que el navegador no pueda representar texto hasta que se obtenga el recurso.

{% Img src="image/admin/NgSTa9SirmikQAq1G5fN.png", alt="Ruta crítica de renderizado de fuentes", width="800", height="303" %}

1. El navegador solicita el documento HTML.
2. El navegador comienza a analizar la respuesta HTML y construir el DOM.
3. El navegador descubre CSS, JS y otros recursos, y envía las solicitudes.
4. El navegador construye el CSSOM después de que se recibe todo el contenido de CSS y lo combina con el árbol DOM para construir el árbol de renderizado.
    - Las solicitudes de fuentes se envían después de que el árbol de representación indique qué variantes de fuente se necesitan para renderizar el texto especificado en la página.
5. El navegador realiza el diseño y despliega el contenido en la pantalla.
    - Si la fuente aún no está disponible, es posible que el navegador no renderice los píxeles de texto.
    - Una vez que la fuente está disponible, el navegador despliega los píxeles del texto.

La "carrera" entre el primer despliegue del contenido de la página, que se puede hacer poco después de que se construye el árbol de procesamiento, y la solicitud del recurso de fuente es lo que crea el "problema de texto en blanco" donde el navegador puede representar el diseño de la página pero omite cualquier texto.

Al precargar las fuentes web y usar `font-display` para controlar cómo se comportan los navegadores con las fuentes no disponibles, puede evitar las páginas en blanco y los cambios de diseño debido a la carga de fuentes.

### Cargue previamente sus recursos de fuentes web

Si existe una alta probabilidad de que su página necesite una fuente web específica alojada en una URL que conoce de antemano, puede aprovechar [la priorización de recursos](https://developers.google.com/web/fundamentals/performance/resource-prioritization). El uso de `<link rel="preload">` activará una solicitud de una fuente web al principio de la ruta crítica de renderización, sin tener que esperar a que se cree el CSSOM.

### Personalice el retraso de la renderización del texto

Si bien la precarga hace que sea más probable que una fuente web esté disponible cuando se procesa el contenido de una página, no ofrece garantías. Aún debe considerar cómo se comportan los navegadores al renderizar el texto que usa una `font-family` que aún no está disponible.

En la publicación [Evite el texto invisible durante la carga de fuentes](/avoid-invisible-text/), puede ver que el comportamiento predeterminado del navegador no es consistente. Sin embargo, puede indicarles a los navegadores modernos cómo quiere que se comporten mediante [`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display).

De manera similar a los comportamientos de tiempo de espera de fuentes existentes que implementan algunos navegadores, `font-display` segmenta la vida útil de una descarga de fuentes en tres períodos principales:

1. El primer período es el **período del bloqueo de la fuente**. Durante este período, si el tipo de fuente no está cargado, cualquier elemento que intente usarlo debe renderizar con una fuente alternativa invisible. Si el tipo de fuente se carga correctamente durante el período de bloqueo, el tipo de letra se utiliza normalmente.
2. El **período de intercambio de la fuente** ocurre inmediatamente después del período de bloqueo de la fuente. Durante este período, si el tipo de fuente no está cargado, cualquier elemento que intente utilizarla debe renderizar con un tipo de fuente alternativo. Si el tipo de fuente se carga correctamente durante el período de intercambio, la fuente se utiliza normalmente.
3. El **período de falla de la fuente** ocurre inmediatamente después del período de intercambio de fuente. Si el tipo de fuente aún no se ha cargado cuando comienza este período, se marca como una carga fallida, lo que provoca una alternancia normal de la fuente. De lo contrario, la fuente se utiliza normalmente.

Comprender estos períodos significa que puede usar `font-display` para decidir cómo se debe representar su fuente en función de si se descargó o cuándo.

Para trabajar con la propiedad `font-display`, agréguela a sus reglas `@font-face`:

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  font-display: auto; /* o block, swap, fallback, optional */
  src: local('Awesome Font'),
       url('/fonts/awesome-l.woff2') format('woff2'), /* se precargará */
       url('/fonts/awesome-l.woff') format('woff'),
       url('/fonts/awesome-l.ttf') format('truetype'),
       url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Glifos latinos */
}
```

`font-display` actualmente admite el siguiente rango de valores:

- `auto`
- `block`
- `swap`
- `fallback`
- `optional`

Para obtener más información sobre la precarga de fuentes y la propiedad `font-display`, consulte las siguientes publicaciones:

- [Evite el texto invisible durante la carga de fuentes](/avoid-invisible-text/)
- [Controle el rendimiento de las fuentes mediante la visualización de fuentes](https://developers.google.com/web/updates/2016/02/font-display)
- [Evite cambios de diseño y destellos de texto invisible (FOIT) mediante la precarga de fuentes opcionales](/preload-optional-fonts/)

### La API de carga de fuentes

Si los usa en conjunto, `<link rel="preload">` y el CSS `font-display` le brindan un gran control sobre la carga y el renderizado de las fuentes, sin agregar demasiada sobrecarga. Pero si necesita personalizaciones adicionales y está dispuesto a incurrir en la sobrecarga introducida por ejecutar JavaScript, existe otra opción.

La [API de carga de fuentes](https://www.w3.org/TR/css-font-loading/) proporciona una interfaz de secuencias de comandos para definir y manipular fuentes CSS, realizar un seguimiento de su progreso de descarga y anular su comportamiento predeterminado de carga diferida. Por ejemplo, si está seguro de que se requiere una variante de fuente en particular, puede definirla y decirle al navegador que inicie una búsqueda inmediata del recurso de fuente:

```javascript
var font = new FontFace("Awesome Font", "url(/fonts/awesome.woff2)", {
  style: 'normal', unicodeRange: 'U+000-5FF', weight: '400'
});

// no espere el árbol de renderizado, ¡inicie una búsqueda inmediata!
font.load().then(function() {
  // aplica la fuente (lo que puede volver a renderizar el texto y provocar un reajuste de página)
  // después de que la fuente haya terminado de descargarse
  document.fonts.add(font);
  document.body.style.fontFamily = "Awesome Font, serif";

  // O... por defecto el contenido está oculto
  // y se renderiza después de que la fuente esté disponible
  var content = document.getElementById("content");
  content.style.visibility = "visible";

  // O... aplique su propia estrategia de renderizado aquí...
});
```

Además, debido a que puede verificar el estado de la fuente (mediante [`check()`](https://www.w3.org/TR/css-font-loading/#font-face-set-check)) y rastrear su progreso de descarga, también puede definir una estrategia personalizada para renderizar el texto en sus páginas:

- Puede mantener toda la renderización del texto hasta que la fuente esté disponible.
- Puede implementar un tiempo de espera personalizado para cada fuente.
- Puede usar la fuente alternativa para desbloquear el renderizado e inyectar un nuevo estilo que use la fuente deseada después de que la fuente esté disponible.

Lo mejor de todo es que también puede mezclar y combinar las estrategias anteriores para diferentes contenidos de la página. Por ejemplo, puede retrasar el renderizado del texto en algunas secciones hasta que la fuente esté disponible, puede usar una fuente alternativa y luego volver a renderizar una vez finalizada la descarga de la fuente.

{% Aside %} La API de carga de fuentes [no está disponible en navegadores más antiguos](http://caniuse.com/#feat=font-loading). Considere usar el [polyfill FontLoader](https://github.com/bramstein/fontloader) o la [biblioteca WebFontloader](https://github.com/typekit/webfontloader) para brindar una funcionalidad similar, aunque con una sobrecarga aún mayor debido a una dependencia adicional de JavaScript. {% endAside %}

### El almacenamiento adecuado en caché es imprescindible

Por lo general, los recursos de fuentes son recursos estáticos que no se actualizan con frecuencia. Como resultado, son ideales para una caducidad máxima prolongada: asegúrese de especificar tanto un [encabezado ETag condicional](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#validating-cached-responses-with-etags) como una [política óptima de control de caché](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control) para todos los recursos de fuentes.

Si su aplicación web utiliza un [service worker](https://developer.chrome.com/docs/workbox/service-worker-overview/), es apropiado brindar recursos de fuentes con una [estrategia de caché primero](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-then-network) para la mayoría de los casos de uso.

No debe almacenar fuentes mediante [`localStorage`](https://developer.mozilla.org/docs/Web/API/Window/localStorage) o [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API). Cada una de ellas tiene su propio conjunto de problemas de rendimiento. La caché HTTP del navegador proporciona el mejor y más sólido mecanismo para brindarle recursos de fuentes al navegador.

## Lista de verificación de carga de fuentes web

- **Personalice la carga y el procesamiento de fuentes mediante `<link rel="preload">`, `font-display` o la API de carga de fuentes:** el comportamiento predeterminado de carga diferida puede provocar un retraso en la renderización del texto. Estas características de la plataforma web le permiten anular este comportamiento para fuentes particulares y especificar estrategias personalizadas de renderizado y tiempo de espera para diferentes contenidos de la página.
- **Especifique las políticas óptimas de revalidación y almacenamiento en caché:** las fuentes son recursos estáticos que se actualizan con poca frecuencia. Compruebe que sus servidores proporcionen una marca de tiempo de antigüedad máxima y de larga duración, además de un token de revalidación para permitir la reutilización eficiente de fuentes entre diferentes páginas. Si usa un service worker, una estrategia de caché primero es apropiada.

## Pruebas automatizadas para el comportamiento de carga de fuentes web con Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) puede ayudar a automatizar el proceso de asegurar que está siguiendo las prácticas recomendables de optimización de fuentes web.

Las siguientes auditorías pueden ayudarlo a asegurar que sus páginas sigan continuamente las mejores prácticas de optimización de fuentes web a lo largo del tiempo:

- [Precargar las solicitudes de claves](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/)
- [Utilizar una política de caché ineficiente en activos estáticos](https://developer.chrome.com/docs/lighthouse/performance/uses-long-cache-ttl/)
- [Todo el texto permanece visible durante las cargas de fuentes web](https://developer.chrome.com/docs/lighthouse/performance/font-display/)
