---
layout: post
title: Depuración de cambios de diseño
subhead: |2-

  Aprenda a identificar y corregir los cambios de diseño.
authors:
  - katiehempenius
date: 2021-03-11
hero: image/j2RDdG43oidUy6AL6LovThjeX9c2/N65l8ccOUEDESpnnEkje.png
alt: Imagen de un cambio de diseño.
description: |2-

  Aprenda a identificar y corregir los cambios de diseño.
tags:
  - blog
  - performance
  - web-vitals
---

La primera parte de este artículo analiza las herramientas para depurar los cambios de diseño, mientras que la segunda parte analiza el proceso de pensamiento que se debe utilizar para identificar la causa de un cambio de diseño.

## Herramientas

### API de inestabilidad de diseño

La [API de Inestabilidad de diseño](https://wicg.github.io/layout-instability/) es el mecanismo del navegador para medir y reportar los cambios de diseño. Todas las herramientas para depurar los cambios de diseño, incluida DevTools, se basan en última instancia en la API de inestabilidad de diseño. Sin embargo, usar la API de inestabilidad de diseño directamente es una poderosa herramienta de depuración debido a su flexibilidad.

{% Aside %} La API de inestabilidad de diseño solo es [compatible](https://caniuse.com/mdn-api_layoutshift) con los navegadores Chromium. En este momento, no hay forma de medir o depurar los cambios de diseño en navegadores distintos a Chromium. {% endAside %}

#### Uso

El mismo [fragmento](/cls/#measure-cls-in-javascript) de código que mide el [cambio de diseño acumulativo (CLS)](/cls/) también puede servir para depurar cambios de diseño. El fragmento a continuación registra información sobre los cambios de diseño en la consola. La inspección de este registro le proporcionará información sobre cuándo, dónde y cómo ocurrió un cambio de diseño.

```javascript
let cls = 0;
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value;
      console.log('Current CLS value:', cls, entry);
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

Al ejecutar este script, tenga en cuenta que:

- La opción `buffered: true` indica que [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) debe comprobar el [búfer de entrada de rendimiento](https://www.w3.org/TR/performance-timeline-2/#dfn-performance-entry-buffer) del navegador para las entradas de rendimiento que se crearon antes de la inicialización del observador. Como resultado, `PerformanceObserver` informará los cambios de diseño que ocurrieron antes y después de que se inicializara. Tenga esto en cuenta al inspeccionar los registros de la consola. Un exceso inicial de cambios de diseño puede reflejar una acumulación de informes, en lugar de la aparición repentina de numerosos cambios de diseño.
- Para evitar afectar el rendimiento, `PerformanceObserver` espera hasta que el hilo principal esté inactivo para informar sobre los cambios de diseño. Como resultado, en función de qué tan ocupado esté el hilo principal, puede haber una pequeña demora entre el momento en que se produce un cambio de diseño y el momento en que se registra en la consola.
- Este script ignora los cambios de diseño que ocurrieron dentro de los 500 ms posteriores a la entrada del usuario y, por lo tanto, no cuentan para CLS.

La información sobre los cambios de diseño se informa mediante una combinación de dos API: las interfaces [`LayoutShift`](https://wicg.github.io/layout-instability/#layoutshift) y [`LayoutShiftAttribution`](https://wicg.github.io/layout-instability/#sec-layout-shift-attribution). Cada una de estas interfaces se explica con más detalle en las siguientes secciones.

#### LayoutShift

Cada cambio de diseño se informa mediante la interfaz `LayoutShift`. El contenido de una entrada tiene este aspecto:

```javascript
duration: 0
entryType: "layout-shift"
hadRecentInput: false
lastInputTime: 0
name: ""
sources: (3) [LayoutShiftAttribution, LayoutShiftAttribution, LayoutShiftAttribution]
startTime: 11317.934999999125
value: 0.17508567530168798
```

La entrada anterior indica un cambio de diseño durante el cual tres elementos DOM cambiaron de posición. La puntuación de cambio de diseño de este cambio de diseño en particular fue `0.175`.

Estas son las propiedades de una instancia `LayoutShift` que son más relevantes para depurar los cambios de diseño:

Propiedad | Descripción
--- | ---
`sources` | La propiedad `sources` enumera los elementos DOM que se movieron durante el cambio de diseño. Esta matriz puede contener hasta cinco fuentes. En el caso de que haya más de cinco elementos afectados por el cambio de diseño, se informan las cinco fuentes más grandes de cambios de diseño (medidas según el impacto sobre la estabilidad del diseño). Esta información se informa mediante la interfaz LayoutShiftAttribution (que se explica con más detalle a continuación).
`value` | La propiedad `value` informa la [puntuación de cambio de diseño](/cls/#layout-shift-score) para un cambio de diseño en particular.
`hadRecentInput` | La propiedad `hadRecentInput` indica si se produjo un cambio de diseño dentro de los 500 milisegundos posteriores a la entrada del usuario.
`startTime` | La propiedad `startTime` indica cuándo se produjo un cambio de diseño. `startTime` se indica en milisegundos y se mide en relación con el [momento en que se inició la carga de la página](https://www.w3.org/TR/hr-time-2/#sec-time-origin).
`duration` | La propiedad `duration` siempre se establecerá en `0`. Esta propiedad se hereda de la interfaz [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry) (la interfaz `LayoutShift` amplía la interfaz `PerformanceEntry`). Sin embargo, el concepto de duración no se aplica a los eventos de cambio de diseño, por lo que se establece en `0`. Para obtener información sobre la interfaz `PerformanceEntry`, consulte las [especificaciones](https://w3c.github.io/performance-timeline/#the-performanceentry-interface).

{% Aside %} La [extensión Web Vitals](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma) puede registrar información de cambios de diseño en la consola. Para habilitar esta función, vaya a **Opciones > Registro de consola**. {% endAside %}

#### LayoutShiftAttribution

La interfaz `LayoutShiftAttribution` describe un solo cambio de un solo elemento DOM. Si varios elementos cambian durante un cambio de diseño, la propiedad `sources` contendrá varias entradas.

Por ejemplo, el JSON a continuación corresponde a un cambio de diseño con una fuente: el cambio descendente del elemento DOM `<div id='banner'>` de `y: 76` a `y:246`.

```json
// ...
  "sources": [
    {
      "node": "div#banner",
      "previousRect": {
        "x": 311,
        "y": 76,
        "width": 4,
        "height": 18,
        "top": 76,
        "right": 315,
        "bottom": 94,
        "left": 311
      },
      "currentRect": {
        "x": 311,
        "y": 246,
        "width": 4,
        "height": 18,
        "top": 246,
        "right": 315,
        "bottom": 264,
        "left": 311
      }
    }
  ]
```

La propiedad `node` identifica el elemento HTML que cambió. Al colocar el cursor sobre esta propiedad en DevTools, se resalta el elemento de página correspondiente.

Las porpiedades `previousRect` y `currentRect` informan el tamaño y la posición del nodo.

- Las coordenadas `x` e `y` informan respectivamente la coordenada X y la coordenada Y de la esquina superior izquierda del elemento
- Las propiedades `width` y `height` informan respectivamente el ancho y alto del elemento.
- Las propiedades `top`, `right`, `bottom` y `left` informan los valores de las coordenadas X o Y correspondientes al borde dado del elemento. En otras palabras, el valor de `top` es igual a `y`; el valor de `bottom` es igual a `y+height`.

Si todas las propiedades de `previousRect` se establecen en 0, esto significa que el elemento se ha desplazado a la vista. Si todas las propiedades de `currentRect` se establecen en 0, esto significa que el elemento se ha desplazado fuera de la vista.

{% Aside 'caution' %} La API de inestabilidad de diseño actualmente no ignora los elementos que se desplazaron pero no eran visibles debido a que otro elemento se colocó frente a ellos. Utilice `display: none`, `visibility: hidden` u `opacity: 0` para evitar cambios de diseño en los casos en los que necesite ejecutar el diseño en algunos elementos antes de hacerlos visibles para el usuario. {% endAside %}

Una de las cosas más importantes que debe comprender al interpretar estos resultados es que los elementos enumerados como *fuentes* son los elementos que cambiaron durante el cambio de diseño. Sin embargo, es posible que estos elementos solo se relacionen indirectamente con la "causa principal" de la inestabilidad del diseño. Estos son algunos ejemplos.

**Ejemplo 1**

Este cambio de diseño se informaría con una fuente: el elemento B. Sin embargo, la causa principal de este cambio de diseño es el cambio en el tamaño del elemento A.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/oaM41OYL7mFtGcpIN8KF.png", alt="Ejemplo que muestra un cambio de diseño causado por un cambio en las dimensiones del elemento", width="800", height="452" %}

**Ejemplo 2**

El cambio de diseño en este ejemplo se informaría con dos fuentes: el elemento A y el elemento B. La causa principal de este cambio de diseño es el cambio en la posición del elemento A.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/AhaslIEWb5fFMMgiZcI2.png", alt="Ejemplo que muestra un cambio de diseño causado por un cambio en la posición del elemento", width="800", height="451" %}

**Ejemplo 3**

El cambio de diseño en este ejemplo se informaría con una fuente: el elemento B. El cambio de posición del elemento B resultó en este cambio de diseño.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/6zKjd4Ua6YJ94LMlqiMR.png", alt="Ejemplo que muestra un cambio de diseño causado por un cambio en la posición del elemento", width="800", height="451" %}

**Ejemplo 4**

Aunque el elemento B cambia de tamaño, no hay cambio de diseño en este ejemplo.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/ZujHWxsXI3C7tupe42oD.png", alt="Ejemplo que muestra un elemento que cambia de tamaño pero no provoca un cambio de diseño", width="800", height="446" %}

Vea una [demostración de cómo la API de inestabilidad de diseño informa los cambios de DOM](https://desert-righteous-router.glitch.me/).

### DevTools

#### Panel de rendimiento

El panel **Experiencia** del panel **Rendimiento** de DevTools muestra todos los cambios de diseño que se producen durante un seguimiento de rendimiento determinado, incluso si se producen dentro de los 500 ms posteriores a la interacción del usuario y, por lo tanto, no cuentan para CLS. Al pasar el cursor sobre un cambio de diseño particular en el panel **Experiencia**, se resalta el elemento DOM afectado.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/Uug2fnJT8mOc2YQmxo2l.png", alt="Captura de pantalla de un cambio de diseño que se muestra en el panel Red de DevTools", width="724", height="629" %}

Para ver más información sobre el cambio de diseño, haga clic en el cambio de diseño y luego abra el cajón de **Resumen**. Los cambios en las dimensiones del elemento se enumeran mediante el formato `[width, height]`. Los cambios en la posición del elemento se enumeran mediante el formato `[x,y]`. La propiedad **Tuvo una entrada reciente** indica si se produjo un cambio de diseño dentro de los 500 ms posteriores a la interacción del usuario.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/AfVjsH9Nl9w0lJwQZEjR.png", alt="Captura de pantalla de la pestaña 'Resumen' de DevTools para un cambio de diseño", width="612", height="354" %}

Para obtener información sobre la duración de un cambio de diseño, abra la pestaña **Registro de eventos.** La duración de un cambio de diseño también se puede aproximar si mira en el panel **Experiencia** la longitud del rectángulo rojo de cambio de diseño.

{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/124Dm7vV3EGM7M9fiugs.png", alt="Captura de pantalla de la pestaña 'Registro de eventos' de DevTools para un cambio de diseño", width="612", height="354" %}

{% Aside %} La duración de un cambio de diseño no tiene ningún impacto en su puntuación de cambio de diseño. {% endAside %}

Para obtener más información sobre el uso del panel **Rendimiento**, consulte el documento [Referencia de análisis de rendimiento](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/).

#### Resaltar las regiones de cambio de diseño

Resaltar las regiones de cambio de diseño puede ser una técnica útil para obtener una idea rápida y de un vistazo de la ubicación, además del momento en que se producen los cambios de diseño  en una página.

Para habilitar las Regiones de cambio de diseño en DevTools, vaya a **Configuración&gt; Más herramientas&gt; Renderizado&gt; Regiones de cambio de diseño** y luego actualice la página que desea depurar. Las áreas de cambio de diseño se resaltarán brevemente en violeta.

## Proceso de pensamiento para identificar la causa de los cambios de diseño

Puede utilizar los pasos a continuación para identificar la causa de los cambios de diseño independientemente de cuándo o cómo se produzcan. Estos pasos se pueden complementar con la ejecución de Lighthouse. Sin embargo, tenga en cuenta que Lighthouse solo puede identificar los cambios de diseño que se produjeron durante la carga de la página inicial. Además, Lighthouse solo puede proporcionar sugerencias para algunas causas de cambios de diseño, por ejemplo, elementos de imagen que no tienen ancho y alto explícitos.

### Identificar la causa de un cambio de diseño

Los cambios de diseño pueden deberse a los siguientes eventos:

- Cambios en la posición de un elemento DOM
- Cambios en las dimensiones de un elemento DOM
- Inserción o eliminación de un elemento DOM
- Animaciones que activan el diseño

En particular, el elemento DOM que precede inmediatamente al elemento desplazado es el elemento con más probabilidades de estar involucrado en "provocar" el cambio de diseño. Por lo tanto, cuando investigue por qué ocurrió un cambio de diseño, considere:

- ¿Cambiaron la posición o las dimensiones del elemento anterior?
- ¿Se insertó o eliminó un elemento DOM antes del elemento desplazado?
- ¿Se cambió explícitamente la posición del elemento desplazado?

Si el elemento anterior no provocó el cambio de diseño, continúe su búsqueda para considerar otros elementos anteriores y cercanos.

Además, la dirección y la distancia de un cambio de diseño pueden proporcionar pistas sobre la causa raíz. Por ejemplo, un gran cambio hacia abajo a menudo indica la inserción de un elemento DOM, mientras que un cambio de diseño de 1 px o 2 px a menudo indica la aplicación de estilos CSS conflictivos o la carga y aplicación de una fuente web.

<figure>{% Img src="image/j2RDdG43oidUy6AL6LovThjeX9c2/g0892nhvz3SnSaasaO1b.png", alt="Diagrama que muestra un cambio de diseño causado por un cambio de fuente", width="800", height="452" %} <figcaption> En este ejemplo, el intercambio de fuentes provocó que los elementos de la página se desplazaran cinco píxeles hacia arriba.</figcaption></figure>

Estos son algunos de los comportamientos específicos que con mayor frecuencia provocan eventos de cambio de diseño:

#### Cambios en la posición de un elemento (que no se deben al movimiento de otro elemento)

Este tipo de cambios suele ser el resultado de:

- Hojas de estilo que se cargan tarde o que sobrescriben estilos declarados previamente.
- Efectos de animación y transición.

#### Cambios en las dimensiones de un elemento

Este tipo de cambio suele ser el resultado de:

- Hojas de estilo que se cargan tarde o que sobrescriben estilos declarados previamente.
- Imágenes e iframes sin atributos `width` y `height` que se cargan después de que se ha renderizado su "ranura".
- Bloques de texto sin atributos `width` o `height` que intercambian fuentes una vez que se ha renderizado el texto.

#### La inserción o eliminación de elementos DOM

Esto suele ser el resultado de:

- Inserción de anuncios y otras incrustaciones de terceros.
- Inserción de banners, alertas y modales.
- Desplazamiento infinito y otros patrones de UX que cargan contenido adicional por encima del contenido existente.

#### Animaciones que activan el diseño

Algunos efectos de animación pueden [activar el diseño](https://gist.github.com/paulirish/5d52fb081b3570c81e3a). Un ejemplo común de esto es cuando los elementos DOM se "animan" para incrementar propiedades como `top` o `left` en lugar de usar la propiedad [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform). Lea [Cómo crear animaciones CSS de alto rendimiento](/animations-guide/) para obtener más información.

### Reproducir cambios de diseño

No puede corregir cambios de diseño que no puede reproducir. Una de las cosas más simples pero más efectivas que puede hacer para tener una mejor idea de la estabilidad del diseño de su sitio es tomar de 5 a 10 minutos para interactuar con su sitio con el objetivo de desencadenar los cambios de diseño. Mantenga la consola abierta mientras hace esto y use la API de inestabilidad de diseño para informar sobre los cambios de diseño.

Para cambios de diseño difíciles de localizar, considere la posibilidad de repetir este ejercicio con diferentes dispositivos y velocidades de conexión. En particular, el uso de una velocidad de conexión más lenta puede facilitar la identificación de cambios en el diseño. Además, puede utilizar una declaración `debugger` para facilitar la revisión de los cambios de diseño.

```javascript/4
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value;
      debugger;
      console.log('Current CLS value:', cls, entry);
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

Por último, para los problemas de diseño que no se pueden reproducir durante el desarrollo, considere usar la API de inestabilidad de diseño junto con la herramienta de registro de front-end de su elección para recopilar más información sobre estos problemas. Consulte el [código de ejemplo sobre cómo realizar un seguimiento del elemento desplazado más grande en una página](https://github.com/GoogleChromeLabs/web-vitals-report/blob/71b0879334798c732f460945ded5267cab5a36bf/src/js/analytics.js#L104-L118).
