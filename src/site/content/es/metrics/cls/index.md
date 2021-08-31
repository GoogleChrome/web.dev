---
layout: post
title: Cumulative Layout Shift (CLS)
authors:
  - philipwalton
  - mihajlija
date: '2019-06-11'
updated: '2021-06-01'
description: |2-

  Esta publicación presenta la métrica Cumulative Layout Shift (CLS) y explica cómo medirlo.
tags:
  - performance
  - metrics
  - web-vitals
---

{% Banner 'caution', 'body' %} **1 de junio de 2021:** la implementación de CLS cambió. Para obtener más información sobre las razones detrás del cambio, consulte [Evolución de la métrica CLS](/evolving-cls) . {% endBanner %}

{% Aside 'key-term' %} Cumulative Layout Shift: Cambio Acumulativo del diseño (CLS)  es una métrica importante centrada en el usuario para medir [la estabilidad visual](/user-centric-performance-metrics/#types-of-metrics) porque ayuda a cuantificar la frecuencia con la que los usuarios experimentan cambios de diseño inesperados; un CLS bajo ayuda a garantizar que la página sea [agradable](/user-centric-performance-metrics/#questions) . {% endAside %}

¿Alguna vez ha leído un artículo en línea cuando algo cambia repentinamente en la página? Sin previo aviso, el texto se mueve y perdiste tu lugar. O incluso peor: estás a punto de pulsar un enlace o un botón, pero en el instante antes de que aterrice su dedo, BOOM, ¡el enlace se mueve y termina haciendo clic en algo más!

Most of the time these kinds of experiences are just annoying, but in some cases, they can cause real damage.

<figure class="w-figure">
  <video autoplay controls loop muted class="w-screenshot" poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png" width="658" height="510">
    <source src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption class="w-figcaption w-figcaption--fullbleed">     A screencast illustrating how layout instability can negatively affect     users.   </figcaption></figure>

El desplazamiento inesperado del contenido de una página generalmente ocurre porque los recursos se cargan de forma asincrónica o los elementos DOM se agregan dinámicamente a la página por encima del contenido actual. El culpable puede ser una imagen o un video con dimensiones desconocidas, una fuente que se muestra más grande o más pequeña que su alternativa, o un anuncio o widget de terceros que cambia de tamaño de forma dinámica.

Lo que provoca que este asunto sea aún más problemático es que el funcionamiento de un sitio en desarrollo suele ser bastante diferente de cómo lo experimentan los usuarios. El contenido personalizado o de terceros con frecuencia no se comporta de la misma manera en el desarrollo que en la producción, las imágenes de prueba a menudo ya están en la caché del navegador del desarrollador y las llamadas a la API que se ejecutan localmente frecuentemente son tan rápidas que el retraso no se nota.

The Cumulative Layout Shift (CLS) metric helps you address this problem by measuring how often it's occurring for real users.

## What is CLS?

CLS es una medida de la ráfaga más grande de las *puntuaciones de cambio* de diseño para cada cambio de diseño [inesperado](/cls/#expected-vs.-unexpected-layout-shifts) que se produce durante toda la vida útil de una página.

Se produce un *cambio de diseño* cada vez que un elemento visible cambia su posición de un fotograma renderizado al siguiente. (Consulte más abajo para obtener más información sobre cómo se calculan las [puntuaciones de cambio de diseño](#layout-shift-score) individuales).

Una ráfaga de cambios de diseño, conocida como [*ventana de sesión*](evolving-cls/#why-a-session-window), es cuando uno o más cambios de diseño individuales ocurren en rápida sucesión con menos de 1 segundo entre cada turno y un máximo de 5 segundos para la duración total de la ventana.

The largest burst is the session window with the maximum cumulative score of all layout shifts within that window.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot" width="658" height="452">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption class="w-figcaption">     Example of session windows. Blue bars represent the scores of each individual layout shift.   </figcaption></figure>

{% Aside 'caution' %} Previously CLS measured the sum total of *all individual layout shift scores* that occurred during the entire lifespan of the page. To see which tools still provide the ability to benchmark against the original implementation, check out [Evolving Cumulative Layout Shift in web tooling](/cls-web-tooling). {% endAside %}

### What is a good CLS score?

Para proporcionar una buena experiencia de usuario, los sitios deben esforzarse por tener una puntuación CLS de **0.1** o menos. Para asegurarse de que está alcanzando este objetivo para la mayoría de sus usuarios, un buen umbral para medir es el **percentil 75** de cargas de página, segmentado en dispositivos móviles y de escritorio.

<picture>
  <source srcset="{{ " image imgix media="(min-width: 640px)" width="400" height="100">   {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="Good CLS values are under 0.1, poor values are greater than 0.25 and anything in between needs improvement", width="400", height="300", class="w-screenshot w-screenshot--filled width-full" %} </source></picture>

{% Aside %} Para obtener más información sobre la investigación y la metodología detrás de esta recomendación, consulte: [Definición de los umbrales de las métricas de Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

## Layout shifts in detail

Los cambios de diseño se definen mediante la [API de inestabilidad de diseño](https://github.com/WICG/layout-instability), que informa las entradas de `layout-shift` cada vez que un elemento visible dentro de la ventana gráfica cambia su posición de inicio (por ejemplo, la parte superior y la posición izquierda en el [modo de escritura](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode) predeterminado) entre dos fotogramas. Estos elementos se consideran *elementos inestables*.

Tenga en cuenta que los cambios de diseño solo ocurren cuando los elementos actuales cambian su posición inicial. Si se agrega un nuevo elemento al DOM o un elemento existente cambia de tamaño, no cuenta como un cambio de diseño, siempre que el cambio no haga que otros elementos visibles cambien su posición inicial.

### Layout shift score

Para calcular la *puntuación de cambio de diseño*, el navegador observa el tamaño de la ventana de visualización y el desplazamiento de los *elementos inestables* en la ventana de visualización entre dos fotogramas renderizados. La puntuación de cambio de diseño es un producto de dos medidas de ese desplazamiento: la *fracción de impacto* y la *fracción de distancia* (ambas se definen a continuación).

```text
layout shift score = impact fraction * distance fraction
```

### Impact fraction

La [fracción de impacto](https://github.com/WICG/layout-instability#Impact-Fraction) mide cómo *los elementos inestables* impactan el área de la ventana de visualización entre dos marcos.

La unión de las áreas visibles de todos *los elementos inestables* para el fotograma anterior *y* el fotograma actual, como una fracción del área total de la ventana de visualización, es la *fracción de impacto* para el fotograma actual.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BbpE9rFQbF8aU6iXN1U6.png", alt="Impact fraction example with one *unstable element*", width="800", height="600", linkTo=true %}

En la imagen de arriba, hay un elemento que ocupa la mitad de la ventana de visualización en un marco. Luego, en el siguiente marco, el elemento se desplaza hacia abajo en un 25% de la altura de la ventana de visualización. El rectángulo punteado rojo indica la unión del área visible del elemento en ambos marcos, que en este caso, es el 75% de la ventana de visualización total, por lo que su *fracción de impacto* es de `0.75`.

### Distance fraction

La otra parte de la ecuación para la puntuación de cambio de diseño mide la distancia de desplazamiento en los elementos inestables, relacionadas con la ventana de visualización. La *fracción de distancia* es la distancia más grande que cualquier *elemento inestable* se ha desplazado en el marco (ya sea de forma horizontal o vertical) dividida por la mayor dimensión de la ventana de visualización (ancho o alto, el que sea mayor).

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASnfpVs2n9winu6mmzdk.png", alt="Distance fraction example with one *unstable element*", width="800", height="600", linkTo=true %}

En el ejemplo anterior, la dimensión más grande de la ventana de visualización es la altura, y el elemento inestable que se desplazó un 25% de la altura de la ventana, lo que hace que la *fracción de distancia sea* 0.25.

So, in this example the *impact fraction* is `0.75` and the *distance fraction* is `0.25`, so the *layout shift score* is `0.75 * 0.25 = 0.1875`.

{% Aside %} Inicialmente, la puntuación de cambio de diseño se calculó solo basado en la *fracción de impacto*. La *fracción de distancia* se introdujo para evitar penalizar excesivamente los casos en los que los elementos grandes se desplazan en una pequeña cantidad. {% endAside %}

The next example illustrates how adding content to an existing element affects the layout shift score:

{% Img src = "image / tcFciHGuF3MxnTr1y5ue01OGLBn2 / xhN81DazXCs8ZawoCj0T.png", alt = "Ejemplo de cambio de diseño con *elementos inestables* y estables y un recorte en la ventana de visualización", width = "800", height = "600", linkTo = true%}

El botón "¡Haz clic en mí!" se adjunta a la parte inferior de la casilla gris con texto negro, lo que empuja el cuadro verde con texto blanco hacia abajo (y parcialmente fuera de la ventana de visualización).

In this example, the gray box changes size, but its start position does not change so it's not an *unstable element*.

El botón "¡Haz clic en mí!" no estaba previamente en el DOM, por lo que su posición de inicio tampoco cambia.

Sin embargo, la posición inicial de la casilla verde cambia, pero como se desplazó parcialmente fuera de la ventana de visualización, el área invisible no se considera al calcular la *fracción de impacto*. La unión de las áreas visibles para la casilla verde en ambos marcos (ilustrada por el rectángulo punteado rojo) es la misma que el área de la casilla verde en el primer marco: 50% de la ventana de visualización. La *fracción de impacto* es `0.5`.

La *fracción de distancia* se ilustra con la flecha violeta. La casilla verde se desplazó hacia abajo en aproximadamente un 14% de la ventana de visualización, por lo que la *fracción de distancia* es `0.14`.

The layout shift score is `0.5 x 0.14 = 0.07`.

This last example illustrates multiple *unstable elements*:

{% Img src = "image / tcFciHGuF3MxnTr1y5ue01OGLBn2 / FdCETo2dLwGmzw0V5lNT.png", alt = "Ejemplo de cambio de diseño con varios *elementos inestables* y estables", ancho = "800", alto = "600", linkTo = true%}

En el primer marco de arriba, hay cuatro resultados de una solicitud de una API para animales, ordenados en orden alfabético. En el segundo marco, se agregan más resultados a la lista ordenada.

El primer elemento de la lista ("Cat") no cambia su posición inicial entre marcos, por lo que es estable. De manera similar, los nuevos elementos agregados a la lista no estaban previamente en el DOM, por lo que sus posiciones iniciales tampoco cambian. Pero los elementos etiquetados como "Perro", "Caballo" y "Cebra" cambian sus posiciones iniciales, lo que los convierte en *elementos inestables* .

Nuevamente, los rectángulos de puntos rojos representan la unión de las áreas que estaban antes y después de estos tres *elementos inestables*, que en este caso es alrededor del 38 % del área de la ventana de visualización (*fracción* de `0.38`).

Las flechas representan las distancias que *los elementos inestables se* desplazaron desde sus posiciones iniciales. El elemento "Cebra", representado por la flecha azul, es el que más se desplazó, aproximadamente un 30% en la altura de la ventana de visualización. Eso hace que la *fracción de distancia* en este ejemplo sea `0.3`.

The layout shift score is `0.38 x 0.3 = 0.1172`.

### Expected vs. unexpected layout shifts

No todos los cambios de diseño son malos. De hecho, muchas aplicaciones web dinámicas cambian con frecuencia la posición inicial de los elementos en sus páginas.

#### User-initiated layout shifts

Un cambio de diseño solo es malo si el usuario no lo espera. Por otro lado, los cambios de diseño que ocurren en respuesta a las interacciones del usuario (hacer clic en un enlace, pulsar un botón, escribir en una casilla de búsqueda y otros casos similares) generalmente son correctos, siempre que el cambio se produzca lo suficientemente cerca de la interacción como para que la relación sea correcta. claro para el usuario.

For example, if a user interaction triggers a network request that may take a while to complete, it's best to create some space right away and show a loading indicator to avoid an unpleasant layout shift when the request completes. If the user doesn't realize something is loading, or doesn't have a sense of when the resource will be ready, they may try to click something else while waiting—something that could move out from under them.

Los cambios de diseño que ocurren después de 500 milisegundos desde que inició la entrada del usuario tendrán la marca [`hadRecentInput`](https://wicg.github.io/layout-instability/#dom-layoutshift-hadrecentinput) configurada, por lo que se pueden excluir de los cálculos.

{% Aside 'caution' %} La marca `hadRecentInput` solo será verdadera para eventos de entrada discretos como pulsar, hacer clic o presionar una tecla. Las interacciones continuas, como desplazamientos, arrastres o dar toques y acercar, no se consideran "entradas recientes". Consulte la [Especificación de inestabilidad de diseños](https://github.com/WICG/layout-instability#recent-input-exclusion) para obtener más información. {% endAside %}

#### Animations and transitions

Las animaciones y las transiciones, cuando se hacen bien, son una excelente manera de actualizar el contenido de la página sin sorprender al usuario. El contenido que cambia abrupta e inesperadamente en la página casi siempre crea una mala experiencia de usuario. Pero el contenido que se mueve de forma gradual y natural de una posición a la siguiente con frecuencia puede ayudar al usuario a comprender mejor lo que está sucediendo y guiarlo entre los cambios de estado.

CSS [`transform`](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) le permite animar elementos sin activar cambios de diseño:

- En vez de cambiar las propiedades de `height` y `width` utilice `transform: scale()`.
- Para desplazar elementos, evite cambiar las `top`, `right`, `bottom` o `left` y en vez de eso utilice `transform: translate()`.

## How to measure CLS

CLS can be measured [in the lab](/user-centric-performance-metrics/#in-the-lab) or [in the field](/user-centric-performance-metrics/#in-the-field), and it's available in the following tools:

{% Aside 'caution' %} Lab tools typically load pages in a synthetic environment and are thus only able to measure layout shifts that occur during page load. As a result, CLS values reported by lab tools for a given page may be less than what real users experience in the field. {% endAside %}

### Field tools

- [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report)
- [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [Search Console (Core Web Vitals report)](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals)

### Lab tools

- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- [WebPageTest](https://webpagetest.org/)

### Measure CLS in JavaScript

Para medir CLS en JavaScript, puede utilizar la [API de inestabilidad de diseño](https://github.com/WICG/layout-instability) . El siguiente ejemplo muestra cómo crear un [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) que atiende las entradas inesperadas de `layout-shift`, las agrupa en sesiones y registra el valor máximo de la sesión cada vez que cambia.

```js
let clsValue = 0;
let clsEntries = [];

let sessionValue = 0;
let sessionEntries = [];

new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // Only count layout shifts without recent user input.
    if (!entry.hadRecentInput) {
      const firstSessionEntry = sessionEntries[0];
      const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

      // If the entry occurred less than 1 second after the previous entry and
      // less than 5 seconds after the first entry in the session, include the
      // entry in the current session. Otherwise, start a new session.
      if (sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }

      // If the current session value is larger than the current CLS value,
      // update CLS and the entries contributing to it.
      if (sessionValue > clsValue) {
        clsValue = sessionValue;
        clsEntries = sessionEntries;

        // Log the updated value (and its entries) to the console.
        console.log('CLS:', clsValue, clsEntries)
      }
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

{% Aside 'warning' %}

Este código muestra la forma básica de calcular y registrar CLS. Sin embargo, medir CLS con precisión de una manera que coincida con lo que se mide en el [Chrome User Experience Report](https://developers.google.com/web/tools/chrome-user-experience-report) (CrUX) es más complicado. Consulte a continuación para obtener más información

{% endAside %}

In most cases, the current CLS value at the time the page is being unloaded is the final CLS value for that page, but there are a few important exceptions:

The following section lists the differences between what the API reports and how the metric is calculated.

#### Differences between the metric and the API

- Si una página se carga en segundo plano, o si está en segundo plano antes de que el navegador describa cualquier contenido, entonces no debería informar ningún valor CLS.
- Si se restaura una página desde la [caché de retroceso/avance](/bfcache/#impact-on-core-web-vitals), su valor CLS debe restablecerse a cero, ya que los usuarios experimentan esto como una visita de una página distinta.
- La API no informa a las entradas `layout-shift` de los cambios que ocurren dentro de los iframes, pero para medir CLS correctamente, debe considerarlos. Los sub-frames pueden utilizar la API para informar a sus `layout-shift` hacia el marco principal para su [incorporación](https://github.com/WICG/layout-instability#cumulative-scores).

In addition to these exceptions, CLS has some added complexity due to the fact that it measures the entire lifespan of a page:

- Los usuarios pueden mantener una pestaña abierta durante *mucho* tiempo, días, semanas, meses. De hecho, es posible que un usuario nunca cierre una pestaña.
- En los sistemas operativos móviles, los navegadores normalmente no ejecutan devoluciones de llamadas de descarga en la página para las pestañas en segundo plano, lo que dificulta informar el valor "final".

Para manejar estos casos, se debe informar CLS cada vez que una página está en segundo plano, además de cada vez que se descarga (el [evento `visibilitychange`](https://developers.google.com/web/updates/2018/07/page-lifecycle-api#event-visibilitychange) cubre ambos escenarios). Y los sistemas de análisis que reciban estos datos deberán calcular el valor CLS final en el backend.

En vez de memorizar y lidiar con todos estos casos usted mismo, los desarrolladores pueden usar la [biblioteca JavaScript de `web-vitals`](https://github.com/GoogleChrome/web-vitals) para medir CLS, que da cuenta de todo lo mencionado anteriormente:

```js
import {getCLS} from 'web-vitals';

// Measure and log CLS in all situations
// where it needs to be reported.
getCLS(console.log);
```

You can refer to [the source code for `getCLS)`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getCLS.ts) for a complete example of how to measure CLS in JavaScript.

{% Aside %} En algunos casos (como los iframes de origen cruzado) no es posible medir CLS en JavaScript. Consulte la sección de [limitaciones](https://github.com/GoogleChrome/web-vitals#limitations) de la biblioteca de `web-vitals` para obtener más información. {% endAside %}

## How to improve CLS

Para la mayoría de los sitios web, puede evitar todos los cambios de diseño inesperados si sigue algunos principios básicos:

- **Siempre incluya atributos de tamaño en sus imágenes y elementos de video, o reserve el espacio requerido con algo como [casillas de relación de aspecto en CSS](https://css-tricks.com/aspect-ratio-boxes/) .** Este enfoque garantiza que el navegador pueda asignar la cantidad correcta de espacio en el documento mientras se carga la imagen. Tenga en cuenta que también puede utilizar la [política de funciones para los medios no desarrollados](https://github.com/w3c/webappsec-feature-policy/blob/master/policies/unsized-media.md) para forzar este comportamiento en los navegadores que son compatibles con políticas de funciones.
- **Nunca inserte contenido por encima del contenido actual, excepto si es una respuesta a la interacción del usuario.** Esto asegura que se esperen los cambios de diseño que se produzcan.
- **Prefer transform animations to animations of properties that trigger layout changes.** Animate transitions in a way that provides context and continuity from state to state.

Para obtener información detallada sobre cómo mejorar CLS, consulte [Optimización de CLS](/optimize-cls/) y [Cambios de diseño de depuración](/debug-layout-shifts) .

## Additional resources

- Google Publisher Tag's guidance on [minimizing layout shift](https://developers.google.com/doubleclick-gpt/guides/minimize-layout-shift)
- [Understanding Cumulative Layout Shift](https://youtu.be/zIJuY-JCjqw) by [Annie Sullivan](https://anniesullie.com/) and [Steve Kobes](https://kobes.ca/) at [#PerfMatters](https://perfmattersconf.com/) (2020)

{% include 'content/metrics/metrics-changelog.njk' %}
