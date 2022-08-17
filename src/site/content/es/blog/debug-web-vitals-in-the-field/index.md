---
layout: post
title: Depurar Web Vitals en el campo
subhead: Aprenda a atribuir sus datos de Web Vitals con información de depuración para ayudarlo a identificar y solucionar problemas de usuarios reales con análisis
description: Aprenda a atribuir sus datos de Web Vitals con información de depuración para ayudarlo a identificar y solucionar problemas de usuarios reales con análisis
authors:
  - philipwalton
date: 2021-04-01
updated: 2022-07-18
hero: image/eqprBhZUGfb8WYnumQ9ljAxRrA72/pOHexwZOflz5RGf6FT4P.jpg
alt: Pantalla de portátil que muestra una interfaz de análisis
tags:
  - blog
  - performance
  - web-vitals
---

Google ofrece actualmente dos categorías de herramientas para medir y depurar Web Vitals:

- **Herramientas de laboratorio:** herramientas como Lighthouse, donde su página se carga en un entorno simulado que puede imitar varias condiciones (por ejemplo, una red lenta y un dispositivo móvil de gama baja).
- **Herramientas de campo:** herramientas como el [Informe de experiencia del usuario de Chrome](https://developer.chrome.com/docs/crux/) (CrUX), que se basa en datos agregados de usuarios reales de Chrome. (Tenga en cuenta que los datos de campo informados por herramientas como [PageSpeed Insights](https://pagespeed.web.dev/) y [Search Console](https://support.google.com/webmasters/answer/9205520) se obtienen de los datos de CrUX).

Si bien las herramientas de campo ofrecen datos más precisos, datos que en realidad representan lo que experimentan los usuarios reales, las herramientas de laboratorio suelen ser mejores para ayudarlo a identificar y solucionar problemas.

Los datos de CrUX son más representativos del rendimiento real de su página, pero es poco probable que conocer sus puntuaciones de CrUX le ayude a descubrir *cómo* mejorar su rendimiento.

Lighthouse, por otro lado, identificará problemas y hará sugerencias específicas sobre cómo mejorar. Sin embargo, Lighthouse solo hará sugerencias para problemas de rendimiento que descubra en el momento de la carga de la página. No detecta problemas que solo se manifiestan como resultado de la interacción del usuario, como desplazarse o hacer clic en los botones de la página.

Esto plantea una pregunta importante: **¿cómo se puede capturar información de depuración para los datos de mediciones de Web Vitals que provienen de usuarios reales en el campo?**

Esta publicación explicará en detalle qué API puede usar para recopilar información de depuración adicional para cada una de las estadísticas actuales de Core Web Vitals y le dará ideas sobre cómo capturar estos datos en su herramienta de análisis existente.

## API para atribución y depuración

### CLS

De todas las estadísticas de Core Web Vitals, [CLS](/cls/) es quizá la más importante para la recopilación de información de depuración en el campo. CLS se mide durante toda la vida útil de la página, por lo que la forma en que un usuario interactúa con la página (qué tan lejos se desplaza, en qué hace clic, etc.) puede tener un impacto significativo en si hay cambios de diseño y qué elementos están cambiando.

Considere el siguiente informe de PageSpeed Insights para la URL: [web.dev/measure](/measure/)

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/nZjd6rXrOgW5VUsm5fyx.png", alt="Un informe de PageSpeed Insights con diferentes valores CLS", width="800", height="587" %}

El valor informado desde el laboratorio para CLS (Lighthouse) en comparación con el CLS de campo (datos CrUX) es bastante diferente, y esto tiene sentido si considera que la página [web.dev/measure](/measure/) tiene una gran cantidad de contenido interactivo que no se utiliza cuando se prueba en Lighthouse.

Pero incluso si comprende que la interacción del usuario afecta a los datos de campo, aún necesita saber qué elementos de la página están cambiando para dar como resultado una puntuación de 0,45 en el percentil 75.

La interfaz [LayoutShiftAttribution](/debug-layout-shifts/#layoutshiftattribution) lo hace posible.

#### Obtener la atribución del cambio de diseño

La interfaz [LayoutShiftAttribution](/debug-layout-shifts/#layoutshiftattribution) se expone en cada entrada de `layout-shift` que emite la [API de inestabilidad del diseño](https://wicg.github.io/layout-instability).

Para obtener una explicación detallada de estas dos interfaces, consulte [Depuración de los cambios de diseño](/debug-layout-shifts/#layoutshiftattribution). Para los propósitos de esta publicación, lo principal que debe saber es que, como desarrollador, puede observar cada cambio de diseño que ocurre en la página, así como también qué elementos están cambiando.

Éste es un código de ejemplo que registra cada cambio de diseño, así como también los elementos que cambiaron:

```js
new PerformanceObserver((list) => {
  for (const {value, startTime, sources} of list.getEntries()) {
    // Registra la cantidad de cambio y otra información de la entrada.
    console.log('Layout shift:', {value, startTime});
    if (sources) {
      for (const {node, curRect, prevRect} of sources) {
        // Registra los elementos que cambiaron.
        console.log('  Shift source:', node, {curRect, prevRect});
      }
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

Probablemente no sea práctico medir y enviar datos a su herramienta de análisis para cada cambio de diseño que se produzca. Sin embargo, al monitorear todos los cambios, puede realizar un seguimiento de los peores cambios y solo reportar la información sobre ellos.

El objetivo no es identificar y corregir cada cambio de diseño que se produzca para cada usuario, el objetivo es identificar los cambios que afectan a la mayor cantidad de usuarios y, por lo tanto, contribuyen más al CLS de su página en el percentil 75.

Además, no necesita calcular el elemento fuente más grande cada vez que haya un cambio, solo necesita hacerlo cuando esté listo para enviar el valor CLS a su herramienta de análisis.

El siguiente código toma una lista de entradas `layout-shift` que han contribuido al CLS y devuelve el elemento fuente más grande del cambio mayor:

```js
function getCLSDebugTarget(entries) {
  const largestEntry = entries.reduce((a, b) => {
    return a && a.value > b.value ? a : b;
  });
  if (largestEntry && largestEntry.sources && largestEntry.sources.length) {
    const largestSource = largestEntry.sources.reduce((a, b) => {
      return a.node && a.previousRect.width * a.previousRect.height >
          b.previousRect.width * b.previousRect.height ? a : b;
    });
    if (largestSource) {
      return largestSource.node;
    }
  }
}
```

Una vez que haya identificado el elemento más grande que contribuye al cambio mayor, puede informarlo a su herramienta de análisis.

El elemento que más contribuye al CLS para una página determinada probablemente variará de un usuario a otro, pero si agrega esos elementos entre todos los usuarios, podrá generar una lista de elementos cambiantes que afecten a la mayor cantidad de usuarios.

Una vez que haya identificado y solucionado la causa raíz de los cambios para esos elementos, su código de análisis comenzará a informar cambios más pequeños como los "peores" cambios para sus páginas. Con el tiempo, todos los cambios informados serán lo suficientemente pequeños como para que sus páginas estén dentro [del umbral "bueno" de 0,1](/cls/#what-is-a-good-cls-score).

Algunos otros metadatos que puede ser útil capturar junto con el elemento fuente del cambio mayor son:

- El momento del cambio mayor
- La ruta URL en el momento del cambio mayor (para sitios que actualizan dinámicamente la URL, como las aplicaciones de una sola página).

### LCP

Para depurar LCP en campo, la información principal que necesita es qué elemento en particular fue el elemento más grande (el elemento candidato de LCP) para esa carga de página en particular.

Tenga en cuenta que es completamente posible, de hecho, es bastante común, que el elemento candidato de LCP sea diferente de un usuario a otro, incluso para la misma página exacta.

Esto puede suceder por varias razones:

- Los dispositivos de usuario tienen diferentes resoluciones de pantalla, lo que da como resultado diferentes diseños de página y, por lo tanto, diferentes elementos visibles dentro de la ventana gráfica.
- Los usuarios no siempre cargan páginas desplazadas hasta la parte superior. A menudo, los enlaces contienen [identificadores de fragmentos](/text-fragments/#fragment-identifiers) o incluso [fragmentos de texto](/text-fragments/#text-fragments), lo que significa que es posible que sus páginas se carguen y se muestren en cualquier posición de desplazamiento de la página.
- El contenido puede estar personalizado para el usuario actual, por lo que el elemento candidato de LCP podría variar enormemente de un usuario a otro.

Esto significa que no puede hacer suposiciones sobre qué elemento o conjunto de elementos será el elemento candidato de LCP más común para una página en particular. Tiene que medirlo en función del comportamiento del usuario real.

#### Identificar el elemento candidato de LCP

Para determinar el elemento candidato de LCP en JavaScript, puede usar la [API Largest Contentful Paint](https://wicg.github.io/largest-contentful-paint/) (Despliegue del contenido más extenso), la misma API que usa para determinar el valor de tiempo de LCP.

Dada una lista de las entradas `largest-contentful-paint`, puede determinar el elemento candidato de LCP actual si mira la última entrada:

```js
function getLCPDebugTarget(entries) {
  const lastEntry = entries[entries.length - 1];
  return lastEntry.element;
}
```

{% Aside 'caution' %} Como se explica en la [documentación de las estadísticas de LCP](/lcp/), el elemento candidato de LCP puede cambiar a través de la carga de la página, por lo que se requiere más trabajo para identificar el elemento candidato de LCP "final". La forma más sencilla de identificar y medir el elemento candidato de LCP "final" es utilizar la biblioteca [web-vitals](https://github.com/GoogleChrome/web-vitals/) de JavaScript, como se muestra en el [ejemplo siguiente](#usage-with-the-web-vitals-javascript-library). {% endAside %}

Una vez que conozca el elemento candidato de LCP, puede enviarlo a su herramienta de análisis junto con el valor de la estadística. Al igual que con CLS, esto le ayudará a identificar qué elementos son más importantes para optimizarlos primero.

Algunos otros metadatos que pueden ser útil capturar junto con el elemento candidato de LCP:

- La URL de origen de la imagen (si el elemento candidato de LCP es una imagen).
- La familia de fuentes de texto (si el elemento candidato de LCP es texto y la página utiliza fuentes web).

### FID

Para depurar FID en campo, es importante recordar que FID mide [solo la porción de retardo](/fid/#fid-in-detail) de la latencia general del primer evento de entrada. Eso significa que aquello con lo que interactuó el usuario no es realmente tan importante como lo que estaba sucediendo además en el hilo principal en el momento en que interactuó.

Por ejemplo, muchas aplicaciones de JavaScript que admiten el renderizado del lado del servidor (SSR) entregarán HTML estático que se puede renderizar en la pantalla antes de que sea interactivo para la interacción del usuario, es decir, antes de que haya terminado de cargarse el JavaScript necesario para hacer que el contenido sea interactivo.

Para este tipo de aplicaciones, puede ser muy importante saber si la primera entrada ocurrió antes o después de la [hidratación](https://en.wikipedia.org/wiki/Hydration_(web_development)). Si resulta que muchas personas intentan interactuar con la página antes de que se complete la hidratación, considere la posibilidad de renderizar sus páginas en un estado de desactivación o carga en lugar de en un estado que parezca interactivo.

Si el marco de trabajo de su aplicación expone la marca de tiempo de hidratación, puede compararla fácilmente con la marca de tiempo de la entrada `first-input` para determinar si la primera entrada ocurrió antes o después de la hidratación. Si su marco no expone esa marca de tiempo, o no usa la hidratación en absoluto, otra señal útil puede ser si la entrada ocurrió antes o después de que JavaScript terminara de cargarse.

El evento `DOMContentLoaded` se activa después de que el HTML de la página se haya cargado y analizado por completo, lo que incluye esperar a que se cargue cualquier script síncrónico, diferido o de módulo (incluidos todos los módulos importados estáticamente). Por lo tanto, puede usar el momento de ese evento y compararlo con el momento en que ocurrió el FID.

El siguiente código toma una entrada `first-input` y devuelve verdadero si la primera entrada ocurrió antes del final del evento `DOMContentLoaded`:

```js
function wasFIDBeforeDCL(fidEntry) {
  const navEntry = performance.getEntriesByType('navigation')[0];
  return navEntry && fidEntry.startTime < navEntry.domContentLoadedEventStart;
}
```

{% Aside %} Si su página usa scripts `async` o `import()` dinámico para cargar JavaScript, es posible que el evento `DOMContentLoaded` no sea una señal útil. En su lugar, puede considerar el uso de `load` o, si hay una secuencia de comandos en particular que sabe que tarda un poco en ejecutarse, puede usar la entrada [Tiempo de recursos](https://developer.mozilla.org/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API) para esa secuencia de comandos. {% endAside %}

#### Identificar el elemento objetivo del FID

Otra señal de depuración potencialmente útil es el elemento con el que se interactuó. Si bien la interacción con el elemento en sí no contribuye al FID (recuerde que el FID es solo la porción de retraso de la latencia total del evento), saber con qué elementos interactúan sus usuarios puede ser útil para determinar la mejor manera de mejorar el FID.

Por ejemplo, si la gran mayoría de las primeras interacciones de su usuario son con un elemento en particular, considere incluir el código JavaScript necesario para ese elemento en el HTML y cargar de forma diferida el resto.

Para obtener el elemento asociado con el primer evento de entrada, puede hacer referencia a la propiedad `target` de la entrada `first-input`:

```js
function getFIDDebugTarget(entries) {
  return entries[0].target;
}
```

Algunos otros metadatos que puede ser útil capturar junto con el elemento de destino FID:

- El tipo de evento (como `mousedown`, `keydown`, `pointerdown`).
- Cualquier dato relevante de [atribución de tarea larga](https://w3c.github.io/longtasks/#taskattributiontiming) para la tarea larga que ocurrió al mismo tiempo que la primera entrada (útil si la página carga scripts de terceros).

## Uso con la biblioteca web-vitals de JavaScript

Las secciones anteriores ofrecen algunas sugerencias para incluir información de depuración adicional en los datos que envía a su herramienta de análisis. Cada uno de los ejemplos incluye un código que usa una o más entradas de rendimiento asociadas con una estadística de Web Vitals en particular y devuelve un elemento DOM que se puede usar para ayudar a depurar problemas que afectan esa estadística.

Estos ejemplos están diseñados para funcionar bien con la [biblioteca web-vitals JavaScript](https://github.com/GoogleChrome/web-vitals), que expone la lista de entradas de rendimiento en el objeto [`Metric`](https://github.com/GoogleChrome/web-vitals#api) que se pasa a cada función de devolución de llamada.

Si combina los ejemplos enumerados anteriormente con las funciones de estadísticas `web-vitals`, el resultado final se verá así:

```js
import {getLCP, getFID, getCLS} from 'web-vitals';

function getSelector(node, maxLen = 100) {
  let sel = '';
  try {
    while (node && node.nodeType !== 9) {
      const part = node.id ? '#' + node.id : node.nodeName.toLowerCase() + (
        (node.className && node.className.length) ?
        '.' + Array.from(node.classList.values()).join('.') : '');
      if (sel.length + part.length > maxLen - 1) return sel || part;
      sel = sel ? part + '>' + sel : part;
      if (node.id) break;
      node = node.parentNode;
    }
  } catch (err) {
    // No hace nada...
  }
  return sel;
}

function getLargestLayoutShiftEntry(entries) {
  return entries.reduce((a, b) => a && a.value > b.value ? a : b);
}

function getLargestLayoutShiftSource(sources) {
  return sources.reduce((a, b) => {
    return a.node && a.previousRect.width * a.previousRect.height >
        b.previousRect.width * b.previousRect.height ? a : b;
  });
}

function wasFIDBeforeDCL(fidEntry) {
  const navEntry = performance.getEntriesByType('navigation')[0];
  return navEntry && fidEntry.startTime < navEntry.domContentLoadedEventStart;
}

function getDebugInfo(name, entries = []) {
  // En algunos casos no habrá entradas (por ejemplo, si CLS es 0,
  // o para LCP después de restaurar la bfcache), así que es necesarios verificar primero.
  if (entries.length) {
    if (name === 'LCP') {
      const lastEntry = entries[entries.length - 1];
      return {
        debug_target: getSelector(lastEntry.element),
        event_time: lastEntry.startTime,
      };
    } else if (name === 'FID') {
      const firstEntry = entries[0];
      return {
        debug_target: getSelector(firstEntry.target),
        debug_event: firstEntry.name,
        debug_timing: wasFIDBeforeDCL(firstEntry) ? 'pre_dcl' : 'post_dcl',
        event_time: firstEntry.startTime,
      };
    } else if (name === 'CLS') {
      const largestEntry = getLargestLayoutShiftEntry(entries);
      if (largestEntry && largestEntry.sources && largestEntry.sources.length) {
        const largestSource = getLargestLayoutShiftSource(largestEntry.sources);
        if (largestSource) {
          return {
            debug_target: getSelector(largestSource.node),
            event_time: largestEntry.startTime,
          };
        }
      }
    }
  }
  // Devuelve parámetros predeterminados/vacíos en caso de que no haya entradas.
  return {
    debug_target: '(not set)',
  };
}

function sendToAnalytics({name, value, entries}) {
  navigator.sendBeacon('/analytics', JSON.stringify({
    name,
    value,
    ...getDebugInfo(name, entries)
  });
}

getLCP(sendToAnalytics);
getFID(sendToAnalytics);
getCLS(sendToAnalytics);
```

El formato específico requerido para enviar los datos variará según la herramienta de análisis, pero el código anterior debería ser suficiente para obtener los datos necesarios, independientemente de los requisitos de formato.

{% Aside %} El código anterior también incluye una función `getSelector()` (no se menciona en las secciones anteriores), que toma un nodo DOM y devuelve un selector CSS que representa ese nodo y su lugar en el DOM. También toma un parámetro de longitud máxima opcional (predeterminado en 100 caracteres) en caso de que su proveedor de análisis tenga restricciones de longitud en los datos que envía. {% endAside %}

## Informar y visualizar los datos

Una vez que haya comenzado a recopilar información de depuración junto con sus estadísticas de Web Vitals, el siguiente paso es agregar los datos de todos sus usuarios para comenzar a buscar patrones y tendencias.

Como se mencionó anteriormente, no es necesario que aborde todos los problemas que enfrentan sus usuarios, sino que debe abordar, especialmente al principio, los problemas que afectan a la mayor cantidad de usuarios, que también deberían ser los problemas que tienen el mayor impacto negativo sobre sus puntuaciones de Core Web Vitals.

### La herramienta Web Vitals Report

Si está utilizando la herramienta [Web Vitals Report](https://github.com/GoogleChromeLabs/web-vitals-report), se actualizó recientemente para admitir [informes sobre una única dimensión de depuración](https://github.com/GoogleChromeLabs/web-vitals-report#debug-dimension) para cada una de las estadísticas de Core Web Vitals.

Esta es una captura de pantalla de la sección de información de depuración de Web Vitals Report, que muestra los datos del sitio web de la herramienta Web Vitals Report:

{% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/Y49u3cmRD6RfAaZGCSmx.png", alt="Web Vitals Report que muestra información de depuración", width="800", height="535" %}

Con los datos anteriores, puede ver que lo que sea que esté causando el cambio del elemento `section.Intro` es lo que más contribuye al CLS en esta página, por lo que identificar y corregir la causa de ese cambio producirá la mayor mejora en la puntuación.

## Resumen

Esperamos que esta publicación haya ayudado a delinear las formas específicas en que puede usar las API de rendimiento existentes para obtener información de depuración para cada una de las estadísticas de Core Web Vitals basadas en interacciones de usuarios reales en campo. Si bien se centra en Core Web Vitals, los conceptos también se aplican a la depuración de cualquier estadística de rendimiento que se pueda medir en JavaScript.

Si recién está comenzando a medir el rendimiento y ya es un usuario de Google Analytics, la herramienta Web Vitals Report puede ser un buen lugar para comenzar porque ya admite la generación de informes de información de depuración para cada una de las estadísticas de Core Web Vitals.

Si usted es un proveedor de análisis y quiere mejorar sus productos y proporcionarles más información de depuración a sus usuarios, tenga en cuenta algunas de las técnicas que se describen aquí, pero no se limite *sólo* a las ideas que presentamos. Esta publicación está destinada a ser de aplicación general a todas las herramientas de análisis. Sin embargo, es probable que las herramientas de análisis individuales puedan (y deberían) capturar e informar aún más información de depuración.

Por último, si cree que existen lagunas en su capacidad para depurar estas estadísticas debido a que faltan funciones o información en las API, envíe sus comentarios a [web-vitals-feedback@googlegroups.com](mailto:web-vitals-feedback@googlegroups.com).
