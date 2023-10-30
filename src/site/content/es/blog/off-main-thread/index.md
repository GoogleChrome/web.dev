---
title: Utilice trabajadores web para ejecutar JavaScript fuera del hilo principal del navegador
subhead: Una arquitectura fuera del hilo principal puede mejorar significativamente la confiabilidad y la experiencia del usuario de su aplicación.
description: El hilo principal del navegador está increíblemente sobrecargado de trabajo. Utilizando trabajadores web para cambiar el código del hilo principal, puede mejorar significativamente la confiabilidad y la experiencia del usuario de su aplicación.
authors:
  - surma
date: 2019-12-05
tags:
  - blog
  - performance
  - test-post
---

En los últimos 20 años, la web ha evolucionado drásticamente de documentos estáticos con algunos estilos e imágenes, a aplicaciones complejas y dinámicas. Sin embargo, una cosa se ha mantenido prácticamente sin cambios: solo tenemos un hilo por pestaña del navegador (con algunas excepciones) para hacer el trabajo de procesar nuestros sitios y ejecutar nuestro JavaScript.

Como resultado, el hilo principal se ha visto increíblemente sobrecargado de trabajo y a medida que aumenta la complejidad de las aplicaciones web, esto se convierte en un obstáculo importante para el rendimiento. Para empeorar las cosas, la cantidad de tiempo que lleva ejecutar el código en el hilo principal para un usuario dado, es **casi completamente impredecible**, porque las capacidades del dispositivo tienen un efecto masivo en el rendimiento. Esa imprevisibilidad solo aumentará a medida que los usuarios accedan a la web desde un conjunto cada vez más diverso de dispositivos, desde teléfonos con funciones hiperrestringidas hasta máquinas representativas de alta potencia y frecuencia de actualización.

Si queremos que las aplicaciones web sofisticadas cumplan con las pautas de rendimiento como el [modelo RAIL,](/rail/) que se basa en datos empíricos sobre la percepción humana y la psicología, necesitamos formas de ejecutar nuestro código **desde el thread principal (OMT)**.

{% Aside %} Si quiere saber más sobre el caso de una arquitectura OMT, a continuación, puede ver mi charla en el CDS 2019. {% endAside %}

{% YouTube '7Rrv9qFMWNM' %}

## Subprocesos con trabajadores web

Otras plataformas suelen admitir el trabajo en paralelo al permitirle asignar una función a un hilo, que se ejecuta en paralelo con el resto de su programa. Puede acceder a las mismas variables desde ambos hilos, y el acceso a estos recursos compartidos se puede sincronizar con algunos mutex y semáforos para evitar condiciones de carrera.

En JavaScript, podemos obtener una funcionalidad similar de los trabjadores web, que existen desde 2007 y son compatibles con todos los navegadores principales desde 2012. Los trabajadores web se ejecutan en paralelo con el hilo principal, pero a diferencia del hilo del sistema operativo, no pueden compartir variables.

{% Aside %} No confunda a los trabajadores web (web workers) con los [service workers](/service-workers-cache-storage) o [worklets](https://developer.mozilla.org/docs/Web/API/Worklet). Si bien los nombres son similares, la funcionalidad y los usos son diferentes. {% endAside %}

Para crear un trabajador web, pase un archivo al constructor del trabajador, que comienza a ejecutar ese archivo en un hilo separado:

```js
const worker = new Worker("./worker.js");
```

Comuníquese con el trabajador web enviando mensajes a través de la [API `postMessage`](https://developer.mozilla.org/docs/Web/API/Window/postMessage). Pase el valor del mensaje como parámetro en la llamada `postMessage` y luego agregue un detector de eventos de mensaje al trabajador:

<!--lint disable no-duplicate-headings-in-section-->

### `main.js`

```js/1
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
```

### `worker.js`

```js
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
});
```

Para enviar un mensaje al hilo principal, use la misma API `postMessage` en el trabajador web y configure un detector de eventos en el hilo principal:

### `main.js`

```js/2-4
const worker = new Worker("./worker.js");
worker.postMessage([40, 2]);
worker.addEventListener("message", event => {
  console.log(event.data);
});
```

### `worker.js`

```js/3
addEventListener("message", event => {
  const [a, b] = event.data;
  // Do stuff with the message
  postMessage(a+b);
});
```

Es cierto que este enfoque es algo limitado. Históricamente, los trabajadores web se han utilizado primordialmente para mover una sola pieza de trabajo pesado fuera del hilo principal. Tratar de manejar múltiples operaciones con un solo trabajador web se vuelve complejo rápidamente: debe codificar no solo los parámetros sino también la operación en el mensaje, y debe llevar la contabilidad para hacer coincidir las respuestas con las solicitudes. Esa complejidad es probablemente la razón por la que los trabajadores web no han sido adoptados más ampliamente.

No obstante, si pudiéramos eliminar algunas de las dificultades de comunicación entre el hilo principal y los trabajadores web, este modelo podría ser ideal para muchos casos de uso. Y, afortunadamente, ¡hay una biblioteca que hace precisamente eso!

## Comlink: hacer que los trabajadores web trabajen menos

[Comlink](http://npm.im/comlink) es una biblioteca cuyo objetivo es permitirle utilizar trabajadores web sin tener que pensar en los detalles de `postMessage`. Comlink le permite compartir variables entre los trabajadores web y el hilo principal casi como otros lenguaje de programación que admita los hilos.

Usted configura Comlink importándolo en un trabajador web y definiendo un conjunto de funciones para exponer al hilo principal. Luego, importa Comlink en el hilo principal, envuelve el trabajador y obtiene acceso a las funciones expuestas:

### `worker.js`

```js
import {expose} from "comlink";

const api = {
  someMethod() { /* … */ }
}
expose(api);
```

### `main.js`

```js
import {wrap} from "comlink";

const worker = new Worker("./worker.js");
const api = wrap(worker);
```

La variable de la `api` en el hilo principal se comporta de la misma manera que la del trabajador web, excepto que cada función devuelve una promesa de un valor en lugar del valor en sí.

## ¿Qué código debería transferir a un trabajador web?

Los trabajadores web no tienen acceso al DOM y a muchas API como [WebUSB](https://developer.mozilla.org/docs/Web/API/USB), [WebRTC](https://developer.mozilla.org/docs/Web/API/WebRTC_API) o [Web Audio](https://developer.mozilla.org/docs/Web/API/Web_Audio_API), por lo que no puede colocar partes de su aplicación que dependan de dicho acceso en un trabajador. Aún así, cada pequeño fragmento de código que se traslada a un trabajador genera más espacio en el hilo principal para las cosas que *tienen* que estar allí, como actualizar la interfaz de usuario.

{% Aside %} Restringir el acceso de la IU al hilo principal, en realidad, es típico en otros lenguajes. De hecho, tanto iOS como Android llaman al hilo principal el hilo de la *interfaz de usuario*. {% endAside %}

Un problema para los desarrolladores web es que la mayoría de las aplicaciones web se basan en un marco de interfaz de usuario, como Vue o React, para organizar todo en la aplicación; todo es un componente del marco y, por lo tanto, está inherentemente vinculado al DOM. Eso parecería dificultar la migración a una arquitectura OMT.

Sin embargo, si cambiamos a un modelo en el que las preocupaciones sobre la interfaz de usuario están separadas de otras, como la administración del estado, los trabajadores web pueden ser bastante útiles incluso con aplicaciones basadas en marcos. Ese es exactamente el enfoque adoptado con PROXX.

## PROXX: un caso de estudio OMT

El equipo de Google Chrome desarrolló [PROXX](/load-faster-like-proxx/) como un clon de Buscaminas que cumple con los [requisitos de la aplicación web progresiva](https://developers.google.com/web/progressive-web-apps), incluyendo el trabajo sin conexión y una experiencia de usuario atractiva. Desafortunadamente, las primeras versiones del juego funcionaron mal en dispositivos restringidos, como teléfonos básicos, lo que llevó al equipo a darse cuenta de que el hilo principal era un obstáculo.

El equipo decidió utilizar trabajadores web para separar el estado visual del juego de su lógica:

- El hilo principal maneja el renderizado de animaciones y transiciones.
- Un trabajador web maneja la lógica del juego, que es puramente computacional.

{% Aside %} Este enfoque es similar al [patrón de Flux](https://facebook.github.io/flux/) Redux, por lo que muchas aplicaciones Flux pueden migrar con bastante facilidad a una arquitectura OMT. Eche un vistazo a [esta publicación del blog](http://dassur.ma/things/react-redux-comlink/) para leer más sobre cómo aplicar la OMT a una aplicación Redux. {% endAside %}

El uso de la OMT tuvo efectos interesantes en el rendimiento de PROXX en los teléfonos básicos. En la versión que no es OMT, la interfaz de usuario se congela durante seis segundos después de que el usuario interactúa con ella. No hay reatroalimentación y el usuario tiene que esperar seis segundos completos antes de poder hacer otra cosa.

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-nonomt.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>Tiempo de respuesta de la interfaz de usuario en la versión <strong>no OMT</strong> de PROXX.</figcaption></figure>

Sin embargo, en la versión OMT el juego tarda *doce* segundos en completar una actualización de la interfaz de usuario. Si bien eso parece una pérdida de rendimiento, en realidad conduce a una mayor retroalimentación para el usuario. La desaceleración se produce porque la aplicación envía más marcos que la versión que no es OMT, que no envía ningún marco. Por lo tanto, el usuario sabe que algo está sucediendo y puede continuar jugando a medida que se actualiza la interfaz de usuario, lo que hace que el juego se sienta considerablemente mejor.

<figure>
  <video controls muted style="max-width: 400px;">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/off-main-thread/proxx-omt.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
 <figcaption>Tiempo de respuesta de la interfaz de usuario en la versión <strong>OMT</strong> de PROXX.</figcaption></figure>

Esta es una compensación consciente: brindamos a los usuarios de dispositivos restringidos una experiencia que se *siente* mejor, sin penalizar a los usuarios de dispositivos de gama alta.

## Implicaciones de una arquitectura OMT

Como muestra el ejemplo de PROXX, la metodología OMT hace que su aplicación se ejecute de manera confiable en una gama más amplia de dispositivos, pero no hace que su aplicación sea más rápida:

- Simplemente está moviendo el trabajo del hilo principal, no reduciéndolo.
- La sobrecarga de comunicación adicional entre el trabajador web y el hilo principal a veces puede hacer que las cosas sean un poco más lentas.

### Considerando las compensaciones

Dado que el hilo principal es libre de procesar las interacciones del usuario, como desplazarse mientras se ejecuta JavaScript, hay menos fotogramas descartados, aunque el tiempo de espera total puede ser ligeramente más largo. Hacer que el usuario espere un poco es preferible a descartar un fotograma porque el margen de error es menor para los fotogramas descartados: el descarte de un fotograma ocurre en milisegundos, mientras que hay *cientos* de milisegundos antes de que el usuario perciba el tiempo de espera.

Debido a la imprevisibilidad del rendimiento en todos los dispositivos, el objetivo de la arquitectura OMT es realmente acerca de **reducir el riesgo** (hacer que su aplicación sea más robusta frente a condiciones de tiempo de ejecución altamente variables), no sobre los beneficios de rendimiento de la paralelización. El aumento de la resiliencia y las mejoras en UX valen la pena más que cualquier pequeña compensación en velocidad.

{% Aside %} A los desarrolladores a veces les preocupa el costo de copiar objetos complejos en el hilo principal y los trabajadores web. Hay más detalles en la charla, pero, en general, no debe romper su presupuesto de rendimiento si la representación JSON en cadena de su objeto es inferior a 10 KB. Si necesita copiar objetos más grandes, considere usar [ArrayBuffer](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) o [WebAssembly](https://webassembly.org/). Puede leer más al respecto en [esta publicación sobre el rendimiento de `postMessage`](https://dassur.ma/things/is-postmessage-slow). {% endAside %}

### Una nota sobre las herramientas

Los trabajadores web aún no son la opción más popular, por lo que la mayoría de las herramientas de módulos, como [WebPack](https://webpack.js.org/) y [Rollup,](https://github.com/rollup/rollup) no los admiten desde el primer momento. (¡Sin embargo, [Parcel](https://parceljs.org/) lo hace!) Afortunadamente, hay complementos para hacer que los trabajadores web *funcionen* con WebPack y Rollup:

- [complemento de trabajador](https://github.com/GoogleChromeLabs/worker-plugin) para WebPack
- [rollup-plugin-off-main-thread](https://github.com/surma/rollup-plugin-off-main-thread) para Rollup

## En resumen

Para asegurarnos de que nuestras aplicaciones sean lo más confiables y accesibles que se pueda, especialmente en un mercado cada vez más globalizado, deben ser compatibles con dispositivos restringidos; es la forma en que la mayoría de los usuarios acceden a la web a nivel mundial. La OMT ofrece una forma prometedora de aumentar el rendimiento en dichos dispositivos sin afectar negativamente a los usuarios de dispositivos de gama alta.

Además, la OMT tiene beneficios secundarios:

- Mueve los costos de ejecución de JavaScript a un hilo separado.
- Mueve los costos de *análisis*, lo que significa que la interfaz de usuario podría iniciarse más rápido. Eso podría reducir [First Contentful Paint](/fcp/) (primera pintura de contenido) o incluso [Time to Interactive](/tti/) (tiempo de interacción), lo que a su vez puede aumentar su puntaje [Lighthouse.](https://developer.chrome.com/docs/lighthouse/overview/)

Los trabajadores web no tienen por qué dar miedo. Herramientas como Comlink eliminan el trabajo de los trabajadores y los convierten en una opción viable para una amplia gama de aplicaciones web.
