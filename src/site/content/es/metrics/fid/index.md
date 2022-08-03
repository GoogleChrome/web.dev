---
layout: post
title: First Input Delay (FID)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: Esta publicación presenta la métrica First Input Delay (FID) y explica como medirla
tags:
  - performance
  - metrics
---

{% Aside %} First Input Delay: Demora de la primera entrada (FID) es una métrica importante centrada en el usuario ya que mide la [capacidad de respuesta de la carga](/user-centric-performance-metrics/#types-of-metrics) porque cuantifica la experiencia que sienten los usuarios cuando intentan interactuar con páginas que no responden, una FID baja ayuda a garantizar que la página sea [utilizable](/user-centric-performance-metrics/#questions) . {% endAside %}

Todos sabemos lo importante que es causar una buena primera impresión. Es importante cuando se conoce a gente nueva, y también es importante cuando se desarrollan experiencias en la web.

En la web, una buena primera impresión puede marcar la diferencia entre que alguien se convierta en un usuario leal o que se vaya y nunca regrese. La pregunta es, ¿qué es lo que da una buena impresión y cómo se puede medir qué tipo de impresión está causando en los usuarios?

En la Web, las primeras impresiones pueden tomar muchas formas diferentes: tenemos las primeras impresiones del diseño y el atractivo visual de un sitio, así como las primeras impresiones de su velocidad y capacidad de respuesta.

Si bien es difícil medir el gusto de los usuarios por el diseño de un sitio con API web, ¡no lo es medir su velocidad y capacidad de respuesta!

La primera impresión que tienen los usuarios de la rapidez con la que se carga su sitio se puede medir con [First Contentful Paint (FCP)](/fcp/). Pero la rapidez con la que su sitio puede pintar pixeles en la pantalla es solo una parte de la historia. ¡La capacidad de respuesta de su sitio es igualmente importante cuando los usuarios intentan interactuar con esos pixeles!

La métrica First Input Delay (FID) ayuda a medir la primera impresión de su usuario sobre la interactividad y capacidad de respuesta de su sitio.

## ¿Qué es FID?

FID mide el tiempo desde que un usuario interactúa por primera vez con una página (es decir, cuando hace clic en un enlace, pulsa un botón o utiliza un control personalizado impulsado por JavaScript) hasta el momento en que el navegador puede comenzar a procesar controladores de eventos como respuesta a esa interacción.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="Los valores de fid correctos son 2,5 segundos, los valores deficientes son superiores a 4,0 segundos y cualquier valor intermedio debe mejorarse", width="400", height="300" %}
</picture>

### ¿Qué es una buena puntuación FID?

Para proporcionar una buena experiencia de usuario, los sitios deben esforzarse por tener una First Input Delay de **100 milisegundos** o menos. Para asegurarse de que está alcanzando este objetivo para la mayoría de sus usuarios, un buen umbral para medir es el **percentil 75** de cargas de página, segmentado en dispositivos móviles y de escritorio.

{% Aside %} Para obtener más información sobre la investigación y la metodología que está detrás de esta recomendación, consulte: [Definición de los umbrales para las métricas de Core Web Vitals](/defining-core-web-vitals-thresholds/) {% endAside %}

## FID en detalle

Como desarrolladores que escriben código el cual responde a eventos, con frecuencia asumimos que nuestro código se ejecutará inmediatamente, tan pronto como suceda el evento. Pero como usuarios, a menudo todos hemos experimentado lo contrario: cargamos una página web en nuestro teléfono, intentamos interactuar con ella y luego nos sentimos frustrados cuando no sucedía nada.

En general, la demora de la entrada (también conocida como latencia de la entrada) ocurre porque el subproceso principal del navegador está ocupado haciendo otra cosa, por lo que no puede (todavía) responder al usuario. Una razón común por la que esto puede suceder es que el navegador está ocupado analizando y ejecutando un archivo JavaScript grande, que carga su aplicación. Mientras hace eso, no puede ejecutar ningún detector de eventos porque el JavaScript que está cargando podría indicarle que haga otra cosa.

{% Aside 'gotchas' %} FID solo mide la "demora" en el procesamiento de eventos. No mide el tiempo de procesamiento de eventos per se, ni el tiempo que tarda el navegador en actualizar la interfaz de usuario después de que se ejecuten los controladores de eventos. Si bien este tiempo afecta la experiencia del usuario, cuando se incluye como parte de FID incentivaría a los desarrolladores a que respondan a los eventos de forma asincrónica, lo que mejoraría la métrica pero probablemente empeoraría la experiencia. Consulte [Por qué solo se considera la demora de la entrada](#why-only-consider-the-input-delay) más abajo para obtener más información. {% endAside %}

Considere la siguiente línea de tiempo para cargar una página web normal:

{% Img src="image/admin/9tm3f6pwlHMqNKuFvaP0.svg", alt="Ejemplo de seguimiento de carga de páginas", width="800", height="260", linkTo=true %}

En la visualización anterior se muestra una página que realiza un par de solicitudes de red para recursos (probablemente archivos CSS y JS) y, una vez que se terminan de descargar esos recursos, se procesan en el subproceso principal.

Esto da como resultado periodos en los que el subproceso principal momentáneamente está ocupado, lo que se indica mediante los bloques de [tareas](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) de color beige.

Los retrasos prolongados en la primera entrada normalmente suceden entre el [First Contentful Paint: Primer despliegue de contenido (FCP)](/fcp/) y el [Time to Interactive: Momento para interactuar (TTI)](/tti/) porque la página procesó parte de su contenido, pero aún no es interactiva de forma confiable. Para ilustrar cómo puede suceder esto, se agregaron FCP y TTI a la línea de tiempo:

{% Img src="image/admin/24Y3T5sWNuZD9fKhkuER.svg", alt="Ejemplo de seguimiento de carga de páginas con FCP y TTI", width="800", height="340", linkTo=true %}

Es posible que haya notado que hay una buena cantidad de tiempo (que incluye tres [tareas largas](/custom-metrics/#long-tasks-api) ) entre FCP y TTI, si un usuario intenta interactuar con la página durante ese tiempo (por ejemplo, haga clic en un enlace), habrá una demora entre el momento en que el se recibe un clic y cuando el subproceso principal puede responder.

Considere lo que sucedería si un usuario intenta interactuar con la página cuando está cerca de que inicie de la tarea más larga:

{% Img src="image/admin/krOoeuQ4TWCbt9t6v5Wf.svg", alt="Ejemplo de seguimiento de carga de páginas con FCP, TTI y FID", width="800", height="380", linkTo=true %}

Debido a que la entrada se produce mientras el navegador ejecuta una tarea, debe esperar hasta que la tarea se complete antes de que pueda responder a la entrada. El tiempo que debe esperar es el valor de FID para este usuario en esta página.

{% Aside %} En este ejemplo, el usuario simplemente interactuó con la página al inicio del periodo de mayor actividad del subproceso principal. Si el usuario hubiera interactuado con la página un momento antes (durante el periodo de inactividad), el navegador podría haber respondido de inmediato. Esta variación en el retraso de la entrada subraya la importancia de observar la distribución de los valores de FID cuando se hacen informes sobre la métrica. Puede obtener más información esto en la siguiente sección sobre análisis e informes de datos FID. {% endAside %}

### ¿Qué sucede si una interacción no tiene un detector de eventos?

FID mide la delta entre el momento en que se recibe un evento de entrada y el siguiente momento en que el subproceso principal está inactivo. Esto significa que FID se mide **incluso en los casos en que no se registró un detector de eventos.** La razón se debe a que muchas interacciones de los usuarios no requieren de un detector de eventos, pero *se* requiere que el subproceso principal esté inactivo para que se pueda ejecutar.

Por ejemplo, todos los siguientes elementos HTML deben esperar a que se completen las tareas en curso en el subproceso principal antes de responder a las interacciones del usuario:

- Campos de texto, casillas de verificación y botones de opción (`<input>`, `<textarea>`)
- Seleccionar menús desplegables ( `<select>` )
- Enlaces (`<a>`)

### ¿Por qué se debe considerar solo la primera entrada?

Si bien un retraso de cualquier entrada puede provocar una mala experiencia del usuario, principalmente recomendamos que mida la demora de la primera entrada por algunas razones:

- La primera demora en la entrada será la primera impresión del usuario sobre la capacidad de respuesta de su sitio, y las primeras impresiones son críticas para dar forma a nuestra impresión general de la calidad y confiabilidad de un sitio.
- Los mayores problemas de interactividad que vemos en la web hoy en día ocurren cuando carga una página. Por lo tanto, creemos que centrarse inicialmente en mejorar la primera interacción del usuario del sitio tendrá el mayor impacto en la mejora de la interactividad general de la web.
- Las soluciones recomendadas sobre cómo los sitios deben corregir las grandes demoras en la primera entrada (división de código, carga de menos JavaScript por adelantado, etc.) no son necesariamente las mismas soluciones para corregir retrasos lentos en la entrada después que se cargue la página. Al separar estas métricas, podremos proporcionar normas de rendimiento más específicas para los desarrolladores web.

### ¿Qué cuenta como primera entrada?

FID es una métrica que mide la capacidad de respuesta de una página durante la carga. Como tal, solo se enfoca en eventos de entrada para acciones discretas como dar clics, pulsar y presionar teclas.

Otras interacciones, como el desplazamiento y el acercamiento, son acciones continuas y tienen restricciones de rendimiento completamente diferentes (además, los navegadores con frecuencia pueden ocultar su latencia cuando se ejecutan en un subproceso separado).

Para decirlo de otra manera, FID se centra en la R (capacidad de respuesta) en el [modelo de rendimiento de RAIL](/rail/), mientras que el desplazamiento y el acercamiento se relacionan más con A (animación), y sus cualidades de rendimiento deben evaluarse por separado.

### ¿Qué sucede si un usuario nunca interactúa con su sitio?

No todos los usuarios interactuarán con su sitio cada vez que lo visitan. Y no todas las interacciones son relevantes para FID (como se mencionó en la sección anterior). Además, las primeras interacciones de algunos usuarios serán en los malos momentos (cuando el subproceso principal está ocupado durante un periodo prolongado de tiempo), y las primeras interacciones de algunos usuarios serán en los buenos momentos (cuando el subproceso principal está completamente inactivo).

Esto significa que algunos usuarios no tendrán valores FID, algunos usuarios tendrán valores FID bajos y algunos usuarios probablemente tendrán valores FID altos.

La forma en que sigue, reporta y analiza FID probablemente será bastante diferente de otras métricas a las que puede estar acostumbrado. En la siguiente sección se explica cuál es la mejor manera de hacer esto.

### ¿Por qué solo considerar la demora en la entrada?

Como se mencionó anteriormente, FID solo mide la "demora" en el procesamiento de eventos. No mide el tiempo en que se procesan los eventos perse, ni el tiempo que tarda el navegador en actualizar la interfaz del usuario después de que se ejecuten los controladores de eventos.

A pesar de que este tiempo es importante para el usuario y *afecta* a la experiencia, que no se incluye en este indicador, ya que si se hace podría incentivar a los desarrolladores a que agreguen soluciones que realmente hagan que la experiencia empeore, es decir, que puede envolver su lógica para controlar eventos en una devolución de llamada asíncrona (a través de `setTimeout()` o `requestAnimationFrame()`) para que se separe de la tarea asociada con el evento. El resultado sería una mejora en la puntuación de la métrica, pero una respuesta más lenta según lo que percibe el usuario.

Sin embargo, aunque FID solo mide la parte de la "demora" de la latencia del evento, los desarrolladores que quieran realizar un seguimiento mayor del ciclo de vida del evento pueden hacerlo mediante la [API para cronometrar eventos](https://wicg.github.io/event-timing/). Consulte la guía sobre [métricas personalizadas](/custom-metrics/#event-timing-api) para obtener más información.

## Cómo medir FID

FID es una métrica que solo se puede medir [en el campo](/user-centric-performance-metrics/#in-the-field) , ya que requiere que un usuario real interactúe con su página. Puede medir FID con las siguientes herramientas.

{% Aside %} FID requiere de un usuario real y, por lo tanto, no se puede medir en el laboratorio. Sin embargo, la métrica [Total Blocking Time: Tiempo total de bloqueo (TBT)](/tbt/) se puede medir en laboratorio, se correlaciona bien con la FID en el campo y también captura los problemas que afectan la interactividad. Las optimizaciones que mejoran el TBT en el laboratorio también deberían mejorar la FID para sus usuarios. {% endAside %}

### Herramientas de campo

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console (Core Web Vitals Report)](https://support.google.com/webmasters/answer/9205520)
- [Biblioteca de JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals)

### Cómo medir FID en JavaScript

Para medir FID en JavaScript, puede utilizar la [API para cronometrar eventos](https://wicg.github.io/event-timing). En el siguiente ejemplo se muestra cómo crear un [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) que capte las entradas [`first-input`](https://wicg.github.io/event-timing/#sec-performance-event-timing) y las registre en la consola:

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID candidate:', delay, entry);
  }
}).observe({type: 'first-input', buffered: true});
```

{% Aside 'warning' %} En este código se muestra cómo registrar las entradas `first-input` en la consola y cómo calcular su demora. Sin embargo, medir FID en JavaScript es más complicado. Consulte la información más adelante: {% endAside %}

En el ejemplo anterior, el valor de demora para la entrada `first-input` se mide al tomar la delta entre las marcas de tiempo `startTime` y `processingStart`. En la mayoría de los casos, este será el valor FID, sin embargo, no todas las `first-input` son válidas para medir FID.

La siguiente sección enumera las diferencias entre lo que informa la API y cómo se calcula la métrica.

#### Diferencias entre la métrica y la API

- La API enviará `first-input` para las páginas que se carguen en una pestaña de segundo plano, pero esas páginas deben ignorarse al calcular FID.
- La API también enviará `first-input` si la página estaba en segundo plano antes de que ocurriera la primera entrada, pero esas páginas también deben ignorarse cuando se calcula FID (las entradas solo se consideran si la página estuvo en primer plano todo el tiempo).
- La API no reporta las entradas `first-input` cuando la página se restaura desde la [caché de retroceso/avance](/bfcache/#impact-on-core-web-vitals), pero FID debe medirse en estos casos, ya que los usuarios las perciben como distintas visitas de la página.
- La API no reporta las entradas que suceden dentro de los iframes, pero para medir correctamente FID, se deben considerar. Los sub-marcos pueden usar la API para reportar sus entradas `first-input` al marco principal para su incorporación.

En vez de memorizar todas estas diferencias sutiles, los desarrolladores pueden usar la [biblioteca de JavaScript `web-vitals`](https://github.com/GoogleChrome/web-vitals) para medir FID, que maneja estas diferencias por usted (cuando sea posible):

```js
import {getFID} from 'web-vitals';

// Measure and log FID as soon as it's available.
getFID(console.log);
```

Puede consultar [el código fuente de `getFID)`](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFID.ts) para obtener un ejemplo completo de cómo medir FID en JavaScript.

{% Aside %} En algunos casos (como los iframes de origen cruzado) no es posible medir FID en JavaScript. Consulte la sección de [limitaciones](https://github.com/GoogleChrome/web-vitals#limitations) de los `web-vitals` para obtener más información. {% endAside %}

### Analizar y reportar los datos de FID

Debido a la variación esperada en los valores de FID, es fundamental que al informar sobre FID observe la distribución de valores y se concentre en los percentiles más altos.

Si bien la [elección del percentil](/defining-core-web-vitals-thresholds/#choice-of-percentile) para todos los umbrales de Core Web Vitals es el 75, para FID en particular recomendamos encarecidamente que consulte los percentiles 95 al 99, ya que corresponderán a las primeras experiencias particularmente malas que los usuarios tienen con su sitio. Y le mostrarán las áreas que necesitan más mejoras.

Esto es así incluso si segmenta sus reportes por categoría o tipo de dispositivo. Por ejemplo, si ejecuta informes separados para computadoras de escritorio y dispositivos móviles, el valor de FID que más le interesa en las computadoras de escritorio deben ser los percentiles 95 al 99 de los usuarios de computadoras de escritorio, y el valor de FID que más le interesa en los dispositivos móviles deben ser los percentiles 95 al 99 de los usuarios de dispositivos móviles.

## Cómo mejorar FID

Para aprender a mejorar FID para un sitio específico, puede ejecutar una auditoría de desempeño Lighthouse y prestar atención a cualquier [oportunidad](/lighthouse-performance/#opportunities) específica que sugiera la auditoría.

Si bien FID es una métrica de campo (y Lighthouse es una herramienta de métrica de laboratorio), la guía para mejorar FID es la misma que para mejorar la métrica de laboratorio [Total Blocking Time (TBT)](/tbt/) .

Para profundizar en cómo mejorar FID, consulte [Optimizar FID](/optimize-fid/). Para obtener orientación adicional sobre las técnicas de desempeño individual que también pueden mejorar FID, consulte:

- [Cómo reducir el impacto del código de terceros](/third-party-summary/)
- [Cómo reducir el tiempo de ejecución de JavaScript](/bootup-time/)
- [Cómo minimizar el trabajo del subproceso principal](/mainthread-work-breakdown/)
- [Cómo mantener la cantidad de solicitudes bajas y los tamaños de transferencia reducidos](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
