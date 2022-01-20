---
title: 'ResizeObserver: es similar a document.onresize para elementos'
subhead: "`ResizeObserver` le permite saber cuando cambia el tamaño de un elemento."
authors:
  - surma
  - joemedley
date: 2016-10-07
updated: 2020-05-26
hero: image/admin/WJ69aw9UMPwsc7ShYvif.jpg
alt: Cultivo de plantas en cajas.
description: "`ResizeObserver` le notifica cuando el rectángulo de contenido de un elemento cambia de tamaño para que pueda reaccionar en consecuencia."
tags:
  - blog
  - dom
  - javascript
  - layout
  - rendering
feedback:
  - api
---

Antes de `ResizeObserver`, tenía que adjuntar un oyente al evento `resize` del documento para recibir una notificación sobre cualquier cambio en las dimensiones de la ventana gráfica. En el controlador de eventos, tendría que averiguar qué elementos se vieron afectados por ese cambio e invocar una rutina específica para reaccionar de manera adecuada. Si usted necesitase las nuevas dimensiones de un elemento después de un cambio de tamaño, tendría que invocar a  `getBoundingClientRect()` o `getComputedStyle()`, lo que puede causar un desperdicio del diseño si no toma la precaución de procesar por lotes *todas* sus lecturas y *todas* sus escrituras.

Esto ni siquiera cubría los casos en los que los elementos cambian de tamaño sin que se haya cambiado el tamaño de la ventana principal. Por ejemplo, agregar nuevos elementos secundarios, establecer el estilo de `display` en `none` o acciones similares pueden cambiar el tamaño de un elemento, sus hermanos o sus predecesores.

Por eso `ResizeObserver` es una primitiva útil. Reacciona a los cambios de tamaño de cualquiera de los elementos observados, independientemente de la causa del cambio. También proporciona acceso al nuevo tamaño de los elementos observados.

## API

Todas las API con el sufijo `Observer` que mencionamos anteriormente comparten un diseño de API simple. `ResizeObserver` no es una excepción. Usted crea un objeto `ResizeObserver` y le pasa un retorno de llamada al constructor. Al retorno de llamada se le pasa una matriz de objetos `ResizeObserverEntry` (una entrada por elemento observado), que contiene las nuevas dimensiones del elemento.

```js
var ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    const cr = entry.contentRect;
    console.log('Element:', entry.target);
    console.log(`Element size: ${cr.width}px x ${cr.height}px`);
    console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
  }
});

// Observa uno o varios elementos
ro.observe(someElement);
```

## Algunos detalles

### ¿Qué se informa?

Generalmente, un [`ResizeObserverEntry`](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry) informa el cuadro de contenido de un elemento mediante una propiedad llamada `contentRect`, que devuelve un objeto [`DOMRectReadOnly`](https://developer.mozilla.org/docs/Web/API/DOMRectReadOnly). El cuadro de contenido es el cuadro en el que se puede colocar el contenido. Es el cuadro del borde menos el relleno.

<figure>{% Img src ="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKxpe8LNq2CMPFdtLtVK.png", alt="Un diagrama del modelo de caja CSS.", width="727", height="562" %}</figure>

Es importante tener en cuenta que, si bien `ResizeObserver` *informa* tanto las dimensiones del `contentRect` como del relleno, solo *observa* el `contentRect`. *No* confunda `contentRect` con el cuadro delimitador del elemento. El cuadro delimitador, según lo informado por `getBoundingClientRect()`, es el cuadro que contiene el elemento completo y sus descendientes. Los SVG son una excepción a la regla, donde `ResizeObserver` informará las dimensiones del cuadro delimitador.

A partir de Chrome 84, `ResizeObserverEntry` tiene tres propiedades nuevas para proporcionar información más detallada. Cada una de estas propiedades devuelve un objeto `ResizeObserverSize` que contiene una propiedad `blockSize` y una propiedad `inlineSize`. Esta información se refiere al elemento observado en el momento en que se invoca la devolución de llamada.

- `borderBoxSize`
- `contentBoxSize`
- `devicePixelContentBoxSize`

Todos estos elementos devuelven matrices de solo lectura porque en el futuro se espera que puedan admitir elementos que tengan varios fragmentos, lo que ocurre en escenarios de varias columnas. Por ahora, estas matrices solo contendrán un elemento.

El soporte de la plataforma para estas propiedades es limitado, pero [Firefox ya admite](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry#Browser_compatibility) las dos primeras.

### ¿Cuándo se informa?

La especificación proscribe que `ResizeObserver` debería procesar todos los eventos de cambio de tamaño antes del despliegue y después del diseño. Esto hace que la devolución de llamada de un `ResizeObserver` sea el lugar ideal para realizar cambios en el diseño de su página. Debido a que `ResizeObserver` ocurre entre el diseño y el despliegue, hacerlo solo invalidará el diseño, no el despliegue.

### ¡Lo pillé!

Quizá se esté preguntando: ¿qué sucede si cambio el tamaño de un elemento observado dentro de la devolución de llamada a `ResizeObserver`? La respuesta es: activará otra invocación a la devolución de llamada de inmediato. Afortunadamente, `ResizeObserver` tiene un mecanismo para evitar bucles de devolución de llamada infinitos y dependencias cíclicas. Los cambios solo se procesarán en el mismo marco si el elemento redimensionado está más profundo en el árbol DOM que el elemento *menos profundo* procesado en la devolución de llamada anterior. De lo contrario, se aplazarán hasta el siguiente marco.

## Aplicación

Una cosa que `ResizeObserver` permite hacer es implementar consultas de medios por elemento. Al observar los elementos, puede definir imperativamente los puntos de interrupción de su diseño y cambiar los estilos de un elemento. En el siguiente [ejemplo](https://googlechrome.github.io/samples/resizeobserver/), el segundo cuadro cambiará su radio de borde de acuerdo con su ancho.

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_vp8.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_x264.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.style.borderRadius =
        Math.max(0, 250 - entry.contentRect.width) + 'px';
  }
});
// Solo observamos el segundo cuadro
ro.observe(document.querySelector('.box:nth-child(2)'));
```

Otro ejemplo interesante para analizar es una ventana de chat. El problema que surge en un diseño típico de conversación de arriba a abajo es el posicionamiento por desplazamiento. Para evitar que el usuario se confunda, es útil que la ventana permanezca al final de la conversación, donde aparecen los mensajes más nuevos. Además, cualquier tipo de cambio de diseño (piense en un teléfono que pasa de horizontal a vertical o viceversa) debería lograr lo mismo.

`ResizeObserver` permite escribir una *sola* pieza de código que se encarga de *ambos* escenarios. Cambiar el tamaño de la ventana es un evento que un `ResizeObserver` puede capturar por definición, pero invocar a `appendChild()` también cambia el tamaño de ese elemento (a menos que se establezca un elemento `overflow: hidden` ), porque necesita hacer espacio para los nuevos elementos. Si tenemos esto en cuenta, se necesitan muy pocas líneas para lograr el efecto deseado:

<figure>
 <video controls autoplay loop muted>
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_vp8.webm" type="video/webm; codecs=vp8">
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_x264.mp4" type="video/mp4; codecs=h264">
 </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  document.scrollingElement.scrollTop =
    document.scrollingElement.scrollHeight;
});

// Se observa el scrollingElement cuando la ventana se redimensione
ro.observe(document.scrollingElement);
// Se observa la línea de tiempo para procesar nuevos mensajes.
ro.observe(timeline);
```

Bastante ordenado, ¿eh?

Desde aquí, podría agregar más código para manejar el caso en el que el usuario se ha desplazado hacia arriba manualmente y quiere que el desplazamiento se mantenga en *ese* mensaje cuando llega un mensaje nuevo.

Otro caso de uso es para cualquier tipo de elemento personalizado que esté generando su propio diseño. Antes de `ResizeObserver`, no había una forma confiable de recibir notificaciones cuando cambiaban las dimensiones para que sus elementos secundarios se pudieran distribuir nuevamente.

## Conclusión

`ResizeObserver` está disponible en la [mayoría de los principales navegadores](https://developer.mozilla.org/docs/Web/API/ResizeObserver#Browser_compatibility). En algunos casos, esa disponibilidad es bastante reciente. Hay [algunos polyfills disponibles](https://github.com/WICG/ResizeObserver/issues/3), pero no es posible duplicar completamente la funcionalidad de `ResizeObserver`. Las implementaciones actuales se basan en encuestas o en agregar elementos centinela al DOM. La primera agotará la batería del móvil al mantener la CPU ocupada, mientras que la segunda modifica su DOM y podría estropear el estilo y otros códigos que dependen del DOM.

Foto de [Markus Spiske](https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) en [Unsplash](https://unsplash.com/s/photos/observe-growth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) .
