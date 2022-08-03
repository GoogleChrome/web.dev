---
layout: post
title: Largest Contentful Paint (LCP)
authors:
  - philipwalton
date: 2019-08-08
updated: 2022-07-18
description: Esta publicación presenta la métrica de Largest Contentful Paint (LCP) y explica como medirla
tags:
  - performance
  - metrics
---

{% Aside %} La métrica Largest Contentful Paint: Despliegue del contenido más extenso (LCP) es una métrica importante centrada en el usuario para medir [la velocidad de carga percibida](/user-centric-performance-metrics/#types-of-metrics) porque marca el punto en la línea de tiempo de carga de la página cuando es probable que el contenido principal de la página se haya cargado. Un LCP rápido ayuda a asegurar al usuario que el la página sea [útil](/user-centric-performance-metrics/#questions). {% endAside %}

Históricamente, ha sido un desafío para los desarrolladores web medir qué tan rápido se carga el contenido principal de una página web y es visible para los usuarios.

Las métricas más antiguas como [load: carga](https://developer.mozilla.org/docs/Web/Events/load) o [DOMContentLoaded](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded) no son buenas porque no corresponden necesariamente con lo que el usuario ve en su pantalla. Y las métricas de rendimiento más nuevas y centradas en el usuario, como [First Contentful Paint (FCP),](/fcp/) solo capturan el comienzo de la experiencia de carga. Si una página muestra una pantalla de bienvenida o muestra un indicador de carga, este momento no es muy relevante para el usuario.

En el pasado, recomendamos métricas de rendimiento como [First Meaningful Paint: Primer despliegue significativo (FMP)](/first-meaningful-paint/) y [Speed Index: Índice de velocidad (SI)](/speed-index/) (ambas disponibles en Lighthouse) para ayudar a capturar más de la experiencia de carga después del despliegue inicial, pero estas métricas son complejas y difíciles de explicar, y a menudo incorrectas, lo que significa que todavía no identifican cuándo se carga el contenido principal de la página.

A veces, lo más simple es mejor. Según las discusiones del [Grupo de trabajo sobre el rendimiento de la web W3C](https://www.w3.org/webperf/) y la investigación realizada en Google, descubrimos que una forma más precisa de medir cuándo se carga el contenido principal de una página es observar cuándo se renderizó el elemento más grande.

## ¿Qué es LCP?

La métrica Largest Contentful Paint: Despliegue del contenido más extenso (LCP) reporta el tiempo para renderizar una [imagen o el bloque de texto](#what-elements-are-considered) más grande visible dentro de la ventana de visualización, en relación con el momento en que la página [comenzó a cargarse](https://w3c.github.io/hr-time/#timeorigin-attribute).

  <picture>
    <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
    {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/8ZW8LQsagLih1ZZoOmMR.svg", alt="Los buenos valores de LCP son 2,5 segundos, los valores malos son superiores a 4,0 segundos y cualquier cosa intermedia necesita mejora", width="400", height="300" %}
  </picture>

### ¿Qué es una buena puntuación LCP?

Para brindar una buena experiencia de usuario, los sitios deben esforzarse por tener Largest Contentful Paint de **2.5 segundos** o menos. Para asegurarse de que está alcanzando este objetivo para la mayoría de sus usuarios, un buen umbral para medir es el **percentil 75** para cargar páginas, que se segmenta entre dispositivos móviles y equipos de escritorio.

{% Aside %} Para obtener más información sobre la investigación y la metodología que está detrás de esta recomendación, consulte: [Definición de los umbrales de las métricas de Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

### ¿Qué elementos se consideran?

Como se especifica actualmente en la [API de Largest Contentful Paint](https://wicg.github.io/largest-contentful-paint/), los tipos de elementos considerados para Largest Contentful Paint son:

- `<img>` elementos
- `<image>` elementos dentro de un elemento `<svg>`
- `<video>` elementos (se utiliza la imagen del cartel)
- Un elemento con una imagen de segundo plano que se carga a través de la función [`url()`](https://developer.mozilla.org/docs/Web/CSS/url()) (a diferencia de un [gradiente CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Images/Using_CSS_gradients))
- Elementos a [nivel de bloque](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements) que contienen nodos de texto u otros elementos secundarios de texto con estilos integrados en el código.

Tenga en cuenta que restringir los elementos a este conjunto limitado fue intencional para mantener las cosas sencillas al principio. Es posible que se agreguen elementos adicionales (por ejemplo, `<svg>` , `<video>` ) en el futuro, conforme se realicen más investigaciones.

### ¿Cómo se determina el tamaño de un elemento?

El tamaño del elemento reportado por Largest Contentful Paint normalmente es el tamaño que es visible para el usuario dentro de la ventana de visualización. Si el elemento se extiende fuera de la ventana de visualización, o si alguno de los elementos está recortado o tiene un [desbordamiento](https://developer.mozilla.org/docs/Web/CSS/overflow) no visible, esas porciones no se toman en cuenta en el tamaño del elemento.

Para los elementos de imagen que cambiaron de tamaño de su [tamaño intrínseco](https://developer.mozilla.org/docs/Glossary/Intrinsic_Size), el tamaño que se informa es el tamaño visible o el tamaño intrínseco, el que sea menor. Por ejemplo, las imágenes que se reducen a un tamaño mucho más pequeño que su tamaño intrínseco solo informarán el tamaño en el que se muestran, mientras que las imágenes que se estiran o expanden a un tamaño mayor solo informarán sus tamaños intrínsecos.

Para los elementos de texto, solo se considera el tamaño de sus nodos de texto (el rectángulo más pequeño que abarca todos los nodos de texto).

Para todos los elementos, no se considera ningún margen, relleno o borde aplicado por medio de CSS.

{% Aside %} Determinar qué nodos de texto pertenecen a qué elementos a veces puede ser complicado, especialmente para elementos cuyos elementos secundarios incluyen elementos de estilos integrados en el código y nodos de texto sin formato, pero también elementos a nivel de bloque. El punto clave es que cada nodo de texto pertenece (y solo a) su elemento ancestro de nivel de bloque más cercano. En [términos de especificaciones](https://wicg.github.io/element-timing/#set-of-owned-text-nodes) : cada nodo de texto pertenece al elemento que genera su [bloque contenedor](https://developer.mozilla.org/docs/Web/CSS/Containing_block). {% endAside %}

### ¿Cuándo se reporta largest contentful pain?

Las páginas web a menudo se cargan en etapas y, como resultado, es posible que el elemento más grande de la página cambie.

Para manejar este potencial de cambio, el navegador envía un [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry) del tipo `largest-contentful-paint` que identifica el elemento de contenido más extenso tan pronto como el navegador haya desplegado el primer marco. Pero entonces, después de renderizar los marcos subsiguientes, enviará otra [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry) cada vez que haya cambios en el elemento de contenido más extenso.

Por ejemplo, en una página con texto y una imagen hero, el navegador inicialmente puede renderizar solo el texto, en este momento enviará una entrada `largest-contentful-paint` cuya propiedad `element` probablemente llamará a un `<p>` o `<h1>`. Más adelante, una vez que la imagen hero termine de cargarse, se enviaría una segunda entrada `largest-contentful-paint` y su propiedad `element` podría llamar a `<img>`.

Es importante tener en cuenta que un elemento solo puede considerarse el elemento de contenido más grande una vez que se haya renderizado y sea visible para el usuario. Las imágenes que aún no se han cargado no se consideran "renderizadas". Tampoco los nodos de texto utilizan fuentes web durante el [periodo de bloqueo de fuentes](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#The_font_display_timeline). En tales casos, un elemento más pequeño se puede reportar como el elemento de contenido más extenso, pero tan pronto como el elemento más extenso termine de renderizarse, se reportará por medio de otro objeto `PerformanceEntry`.

Además de las imágenes y fuentes de carga tardía, una página puede agregar nuevos elementos al DOM conforme el nuevo contenido esté disponible. Si alguno de estos nuevos elementos es más grande que el elemento de contenido más extenso anterior, también se reportará un nuevo `PerformanceEntry`.

Si un elemento actualmente tiene el contenido más extenso se elimina de la ventana de visualización (o incluso se elimina del DOM), seguirá siendo el elemento de contenido más extenso a menos que un elemento más extenso se haya renderizado.

{% Aside %} Antes de que llegara Chrome 88, los elementos eliminados no se consideraban como elementos de contenido más extensos, y la eliminación del candidato actual provocaba el envío de una nueva entrada `largest-contentful-paint`. Sin embargo, debido a los populares patrones de interfaz de usuario, como los carruseles de imágenes, que con frecuencia eliminan elementos del DOM, la métrica se actualizó para reflejar con mayor precisión lo que experimentan los usuarios. Consulte el [CHANGELOG](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_11_lcp.md) para obtener más información. {% endAside %}

El navegador dejará de informar de las nuevas entradas en cuanto el usuario interactúe con la página (al pulsar, desplazar o presionar una tecla), ya que en la interacción el usuario normalmente cambia lo que es visible para él (lo cual es especialmente cierto con el desplazamiento).

Con fines de análisis, solo debe reportar el último `PerformanceEntry` enviado a su servicio de análisis.

{% Aside 'caution' %} Dado que los usuarios pueden abrir páginas en una pestaña en segundo plano, es posible que el despliegue de contenido más extenso no ocurra hasta que el usuario enfoque la pestaña, lo que puede ser mucho más tarde que cuando la cargó por primera vez. {% endAside %}

#### Tiempo de carga vs.tiempo de renderizado

Por motivos de seguridad, la marca de tiempo para renderizar imágenes no se expone para las imágenes de origen cruzado que carecen del encabezado [`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin) En cambio, solo se expone su tiempo de carga (ya que esto ya se expone por medio de muchas otras API web).

El siguiente [ejemplo de uso](#measure-lcp-in-javascript) muestra cómo manejar elementos cuyo tiempo de renderizado no está disponible. Pero, cuando sea posible, siempre se recomienda configurar el [`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin), para que sus métricas sean más precisas.

### ¿Cómo se manejan los cambios de tamaño y diseño de los elementos?

Para mantener baja la sobrecarga de rendimiento que calcula y envía nuevas entradas de rendimiento, los cambios en el tamaño o la posición de un elemento no generan nuevos candidatos LCP. Solo se consideran el tamaño y la posición iniciales del elemento en la ventana de visualización.

Esto significa que las imágenes que inicialmente se renderizan fuera y después pasan a la pantalla posiblemente no se reporten. Además, significa que los elementos renderizados inicialmente en la ventana visualización que luego se desplazan hacia abajo, fuera de la vista, seguirán reportando su tamaño inicial en la ventana de visualización.

### Ejemplos

A continuación, se muestran algunos ejemplos de situaciones en las que se presenta Largest Contentful Paint en algunos sitios web populares:

{% Img src="image/admin/bsBm8poY1uQbq7mNvVJm.png", alt="Línea del tiempo de Largest Contentful Paint : Despliegue del contenido más extenso de cnn.com", width="800", height="311" %}

{% Img src="image/admin/xAvLL1u2KFRaqoZZiI71.png", alt="Línea del tiempo de Largest Contentful Paint : Despliegue del contenido más extenso de techcrunch.com", width="800", height="311" %}

En las dos líneas de tiempo anteriores, el elemento más extenso cambia conforme se carga el contenido. En el primer ejemplo, se agrega nuevo contenido al DOM y eso cambia el elemento más extenso. En el segundo ejemplo, el diseño cambia y el contenido que antes era el más grande se elimina de la ventana de visualización.

Si bien a menudo ocurre que el contenido de carga tardía es más grande que el contenido que ya está en la página, ese no es necesariamente el caso. En los dos ejemplos siguientes se muestra que Largest Contentful Paint se presenta antes de que la página se cargue por completo.

{% Img src="image/admin/uJAGswhXK3bE6Vs4I5bP.png", alt="Línea del tiempo de Largest Contentful Paint : Despliegue del contenido más extenso de instagram.com", width="800", height="311" %}

{% Img src="image/admin/e0O2woQjZJ92aYlPOJzT.png", alt="Línea del tiempo de Largest Contentful Paint : Despliegue del contenido más extenso de google.com", width="800", height="311" %}

En el primer ejemplo, el logotipo de Instagram se carga relativamente pronto y sigue siendo el elemento más extenso, incluso cuando se muestran progresivamente otros contenidos. En el ejemplo de la página de resultados de búsqueda de Google, el elemento más grande es un párrafo de texto que se muestra antes de que terminen de cargarse las imágenes o el logotipo. Como todas las imágenes individuales son más pequeñas que este párrafo, sigue siendo el elemento más extenso durante todo el proceso de carga.

{% Aside %} En el primer marco de la línea de tiempo de Instagram, puede notar que el logotipo de la cámara no tiene un recuadro verde a su alrededor. Esto se debe a que es un elemento `<svg>`, y los elementos `<svg>` actualmente no se consideran como candidatos LCP. El primer candidato LCP es el texto del segundo marco. {% endAside %}

## Cómo medir LCP

LCP se puede medir [en el laboratorio](/user-centric-performance-metrics/#in-the-lab) o [en el campo](/user-centric-performance-metrics/#in-the-field) y está disponible en las siguientes herramientas:

### Herramientas de campo

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console (Core Web Vitals Report)](https://support.google.com/webmasters/answer/9205520)
- [Biblioteca JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals)

### Herramientas de laboratorio

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://webpagetest.org/)

### Cómo medir LCP en JavaScript

Para medir LCP en JavaScript, puede utilizar la [API de Largest Contentful Paint](https://wicg.github.io/largest-contentful-paint/). En el siguiente ejemplo se muestra cómo crear un [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) que capte las entradas de `largest-contentful-paint` y las registre en la consola.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});
```

{% Aside 'warning' %}

En este código se muestra cómo registrar las entradas de `largest-contentful-paint` en la consola, pero medir LCP en JavaScript es más complicado. Vea a continuación los detalles:

{% endAside %}

En el ejemplo anterior, cada entrada de `largest-contentful-paint` registrada representa el candidato LCP actual. En general, el `startTime` de la última entrada emitida es el valor LCP, sin embargo, no siempre es así. No todas las entradas de `largest-contentful-paint` son válidas para medir LCP.

En la siguiente sección se enumeran las diferencias entre lo que reporta la API y cómo se calcula la métrica.

#### Diferencias entre la métrica y la API

- La API enviará `largest-contentful-paint` a las páginas cargadas en una pestaña de segundo plano, pero esas páginas deben ignorarse al calcular LCP.
- La API continuará enviando `largest-contentful-paint` después de que una página haya sido puesta en segundo plano, pero esas entradas deben ignorarse al calcular LCP (los elementos solo se pueden considerar si la página estuvo en el primer plano todo el tiempo).
- La API no reporta `largest-contentful-paint` cuando la página se restaura desde la [caché de retroceso/avance](/bfcache/#impact-on-core-web-vitals), pero LCP debe medirse en estos casos, ya que los usuarios las experimentan como visitas de página distintas.
- La API no considera elementos dentro de iframes, pero para medir correctamente LCP debe considerarlos. Los sub-marcos pueden usar la API para reportar sus `largest-contentful-paint` con mayor contenido al marco principal para su incorporación.

En vez de memorizar todas estas diferencias sutiles, los desarrolladores pueden usar la [Biblioteca JavaScript de `web-vitals`](https://github.com/GoogleChrome/web-vitals) para medir LCP, que maneja estas diferencias por usted (cuando sea posible):

```js
import {getLCP} from 'web-vitals';

// Measure and log LCP as soon as it's available.
getLCP(console.log);
```

Puede consultar [el código fuente de `getLCP()`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts) para obtener un ejemplo completo de cómo medir LCP en JavaScript.

{% Aside %} En algunos casos (como los iframes de origen cruzado) no es posible medir LCP en JavaScript. Consulte la sección de [limitaciones](https://github.com/GoogleChrome/web-vitals#limitations) `web-vitals` para obtener más información. {% endAside %}

### ¿Qué sucede si el elemento más extenso no es el más importante?

En algunos casos, el elemento (o elementos) más importantes de la página no es el mismo que el elemento más extenso, y los desarrolladores pueden estar más interesados en medir los tiempos de renderizado de estos otros elementos. Esto es posible utilizando la [API Element Timing](https://wicg.github.io/element-timing/), como se describe en el artículo sobre las [métricas personalizadas](/custom-metrics/#element-timing-api).

## Cómo mejorar LCP

LCP se ve afectado principalmente por cuatro factores:

- Tiempos de respuesta lentos del servidor
- JavaScript y CSS bloquean la renderización
- Tiempos de carga de recursos
- Renderización del lado del cliente

Para profundizar en cómo mejorar LCP, consulte [Optimizar LCP](/optimize-lcp/). Para obtener orientación adicional sobre las técnicas de rendimiento individual que también pueden mejorar LCP, consulte:

- [Aplicar carga instantánea con el patrón PRPL](/apply-instant-loading-with-prpl)
- [Optimización de la ruta de renderización crítica](/critical-rendering-path/)
- [Optimizar su CSS](/fast#optimize-your-css)
- [Optimizar sus imágenes](/fast#optimize-your-images)
- [Optimizar las fuentes web](/fast#optimize-web-fonts)
- [Optimice su JavaScript](/fast#optimize-your-javascript) (para sitios renderizados por el cliente)

## Recursos adicionales

- [Lecciones aprendidas de la supervisión del rendimiento en Chrome](https://youtu.be/ctavZT87syI) por [Annie Sullivan](https://anniesullie.com/) en [performance.now ()](https://perfnow.nl/) (2019)

{% include 'content/metrics/metrics-changelog.njk' %}
