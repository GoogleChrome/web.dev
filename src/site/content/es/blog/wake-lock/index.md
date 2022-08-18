---
title: Mantente despierto con la API de Screen Wake Lock
subhead: La API de Screen Wake Lock proporciona una forma de evitar que los dispositivos se atenúen o bloqueen la pantalla cuando una aplicación necesita seguir ejecutándose.
authors:
  - petelepage
  - thomassteiner
description: Para evitar agotar la batería, la mayoría de los dispositivos se duermen rápidamente cuando se dejan inactivos. Si bien esto está bien la mayor parte del tiempo, hay algunas aplicaciones que necesitan mantener la pantalla activa para completar el trabajo. La API de Screen Wake Lock proporciona una forma de evitar que el dispositivo se atenúe o bloquee la pantalla cuando una aplicación necesita seguir ejecutándose.
date: 2018-12-18
updated: 2021-02-23
hero: image/admin/zMncl9cgWdAc8W24yav3.jpg
hero_position: center
alt: |
  Gato durmiendo. Foto de Kate Stone Matheson en Unsplash.
tags:
  - blog
  - capabilities
feedback:
  - api
---

{% Aside 'success' %} La API Screen Wake Lock, parte del [capabilities project (proyecto de capacidades)](https://developer.chrome.com/blog/capabilities/) de Google, se lanzó en Chrome 84. {% endAside %}

## ¿Qué es la API de Screen Wake Lock? {: #what }

Para evitar agotar la batería, la mayoría de los dispositivos se duermen rápidamente cuando se dejan inactivos. Si bien esto está bien la mayor parte del tiempo, algunas aplicaciones necesitan mantener la pantalla activa para completar su trabajo. Los ejemplos incluyen aplicaciones de cocina que muestran los pasos de una receta o un juego como [Ball Puzzle](https://ball-puzzle.appspot.com/), que utiliza las API de movimiento del dispositivo como entrada.

La [API de Screen Wake Lock](https://w3c.github.io/wake-lock/) proporciona una forma de evitar que el dispositivo se atenúe y bloquee la pantalla. Esta funcionalidad permite nuevas experiencias que, hasta ahora, requerían una aplicación específica de plataforma.

La API Screen Wake Lock reduce la necesidad de soluciones del tipo hacker y potencialmente hambrientas de energía. Aborda las deficiencias de una API anterior que se limitaba simplemente a mantener la pantalla encendida y tenía una serie de problemas de seguridad y privacidad.

## Casos de uso sugeridos para la API de Screen Wake Lock {: #use-cases }

[RioRun](https://www.theguardian.com/sport/2016/aug/06/rio-running-app-marathon-course-riorun), una aplicación web desarrollada por [The Guardian](https://www.theguardian.com/), fue un caso de uso perfecto (aunque ya no está disponible). La aplicación te lleva a un recorrido de audio virtual por Río, siguiendo la ruta del maratón olímpico del 2016. Sin los wake locks, las pantallas de los usuarios se apagaban con frecuencia mientras se reproducía el recorrido, lo que dificultaba su uso.

Por supuesto, hay muchos otros casos de uso:

- Una aplicación de recetas que mantiene la pantalla encendida mientras horneas un pastel o preparas la cena
- Una aplicación de tarjeta o boleto de embarque que mantiene la pantalla encendida hasta que se escanea el código de barras
- Una aplicación estilo quiosco que mantiene la pantalla encendida continuamente
- Una aplicación de presentación basada en la web que mantiene la pantalla encendida durante una presentación.

{% Aside 'success' %} Después de implementar la API de Screen Wake Lock, *Betty Crocker*, un importante sitio de cocina de EE. UU., vio un aumento del 300% en los indicadores de intención de compra de sus usuarios. Lee más en el [estudio de caso de Betty Crocker](/betty-crocker/) 🍰. {% endAside %}

## Estado actual {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Paso</th>
<th data-md-type="table_cell">Estado</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crear un explicador</td>
<td data-md-type="table_cell">N/A</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell"><a href="https://w3c.github.io/wake-lock/" data-md-type="link">Completado</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Recopilar comentarios e iterar el diseño</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">Completado</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prueba de origen</td>
<td data-md-type="table_cell">Completado</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Lanzamiento</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">Completado</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

{% Aside %} Muchas gracias a la gente de Intel, específicamente a Mrunal Kapade y Raphael Kubo da Costa, por implementar esta API. Chrome depende de una comunidad de personas comprometidas que trabajan juntos para hacer avanzar el proyecto de Chromium. No todos los usuarios de Chromium son de Google, ¡y estos colaboradores merecen un reconocimiento especial! {% endAside %}

## Usando la API de Screen Wake Lock {: #use }

### Tipos de wake lock {: #wake-lock-types }

La API de Screen Wake Lock actualmente proporciona solo un tipo de wake lock: `screen`.

#### wake lock de `screen`

Un wake lock de `screen` evita que la pantalla del dispositivo se apague de manera que el usuario puede ver la información que se muestra en la pantalla.

{% Aside 'caution' %} Una versión anterior de la especificación permitía un `system` adicional que evita que la CPU del dispositivo ingrese al modo de espera para que tu aplicación pueda continuar ejecutándose. Hemos decidido no continuar con este tipo por el momento. {% endAside %}

### Detección de características

La compatibilidad del navegador con la API de Screen Wake Lock se puede probar de la siguiente manera:

```js
if ('wakeLock' in navigator) {
  // El API de Screen Wake Lock es compatible 🎉
}
```

### Obteniendo un screen wake lock {: #get-wake-lock }

Para solicitar un scren wake lock, necesitas llamar al método de `WakeLockSentinel` que regresa un objeto `navigator.wakeLock.request()`. Luego pasas a este método el tipo de wake lock deseado como parámetro, que *actualmente* está limitado a solo `'screen'` y, por lo tanto, es *opcional*. El navegador puede rechazar la solicitud por varias razones (por ejemplo, porque el nivel de carga de la batería es demasiado bajo), por lo que es una buena práctica envolver la llamada en una declaración de `try…catch`. El mensaje de la excepción contendrá más detalles en caso de fallar.

### Liberar un screen wake lock {: #release-wake-lock }

También necesitas una forma de liberar el screen wake lock, el cual se hace mediante el método de `release()` del objeto `WakeLockSentinel`. Si no almacenas una referencia a `WakeLockSentinel`, no hay forma de liberar el bloqueo manualmente, pero se liberará una vez que la pestaña actual sea invisible.

Si deseas liberar automáticamente el bloqueo de activación de la pantalla después de que haya pasado un cierto período de tiempo, puedes usar `window.setTimeout()` para llamar a `release()`, como se muestra en el siguiente ejemplo.

```js
// El sentinela del wake lock.
let wakeLock = null;

// Función que busca hacer un pedido al screen wake lock.
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request();
    wakeLock.addEventListener('release', () => {
      console.log('Screen Wake Lock ha sido liberado:', wakeLock.released);
    });
    console.log('Screen Wake Lock ha sido liberado:', wakeLock.released);
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

// Pide un screen wake lock…
await requestWakeLock();
// …and release it again after 5s.
window.setTimeout(() => {
  wakeLock.release();
  wakeLock = null;
}, 5000);
```

El objeto de `WakeLockSentinel` tiene una propiedad llamada `released` la cual indica si un centinela ya ha sido liberada. Su valor es inicialmente `false` y cambia a `true` una vez que se envía un evento de `"release"`. Esta propiedad ayuda a los desarrolladores web a saber cuándo se ha liberado un bloqueo para que no tengan que realizar un seguimiento de esto manualmente. Esto está disponible a partir de Chrome 87.

### El ciclo de vida de screen wake lock {: #wake-lock-lifecycle }

Cuando juegas con la [demostración de screen wake lock](https://wake-lock-demo.glitch.me/), notarás que los screen wake locks son sensibles a la [visibilidad de la página](https://developer.mozilla.org/docs/Web/API/Page_Visibility_API). Esto significa que el screen wake lock se liberará automáticamente cuando minimices una pestaña o ventana, o cuando cambies de una pestaña o ventana en la que esté activo un screen wake lock.

Para volver a adquirir el screen wake lock, escucha al evento de  [`visibilitychange`](https://developer.mozilla.org/docs/Web/API/Document/visibilitychange_event) y solicita un nuevo screen wake lock cuando ocurra:

```js
const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);
```

## Minimiza tu impacto en los recursos del sistema {: #best-practices }

¿Deberías utilizar un bloqueo de activación de pantalla en tu aplicación? El enfoque que adoptes depende de las necesidades de tu aplicación. Independientemente, debes de utilizar el enfoque más ligero posible para tu aplicación para minimizar su impacto en los recursos del sistema.

Antes de agregar un screen wake lock a tu aplicación, considera si tus casos de uso podrían resolverse con una de las siguientes soluciones alternativas:

- Si tu aplicación está realizando descargas de larga duración, considera usar [background fetch (recuperación en segundo plano)](https://developer.chrome.com/blog/background-fetch/).
- Si tu aplicación está sincronizando datos de un servidor externo, considera usar [background sync (sincronización en segundo plano)](https://developer.chrome.com/blog/background-sync/).

{% Aside %} Como la mayoría de las otras API web potentes, la API Screen Wake Lock solo está disponible cuando se sirve a través de **HTTPS** . {% endAside %}

### Demostración

Echale un vistazo a la [demostración de Screen Wake Lock](https://glitch.com/edit/#!/wake-lock-demo?path=script.js:1:0) y la [fuente de la demostración](https://wake-lock-demo.glitch.me/). Observa cómo el screen wake lock se libera automáticamente cuando cambia de pestaña o aplicación.

### Screen Wake Locks en el administrador de tareas del sistema operativo

Puedes usar el administrador de tareas de tu sistema operativo para ver si una aplicación impide que tu computadora entre en suspensión. El video a continuación muestra el [Monitor de actividad](https://support.apple.com/guide/activity-monitor/welcome/mac) de macOS que indica que Chrome tiene screen wake lock activo que mantiene el sistema despierto.

{% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/YDlxREcGrnBUGC8plN15.mp4", autplay="true", loop="true", width="800" %}

## Retroalimentación {: #feedback }

El [Grupo Comunitario de Incubadora de Plataformas Web (WICG)](https://www.w3.org/community/wicg/) y el equipo de Chrome desean conocer tus pensamientos y experiencias con la API de Screen Wake Lock.

### Cuéntanos sobre el diseño de la API

¿Hay algo en la API que no funcione como se esperaba? ¿O faltan métodos o propiedades que necesitas para implementar tu idea?

- Presenta un problema de especificación en el [repositorio de GitHub de la API de Screen Wake Lock](https://github.com/w3c/wake-lock/issues) o agrega tus pensamientos a un problema existente.

### Reporta problemas con la implementación

¿Encontró un error con la implementación en Chrome? ¿O la implementación es diferente de la especificación?

- Reporta un error en [https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EWakeLock). Asegúrate de incluir todos los detalles que puedas, proporciona instrucciones sencillas para reproducir el error y configura los *Componentes* a `Blink>WakeLock`. [Glitch](https://glitch.com) funciona muy bien para compartir reproducciones rápidas y fáciles.

### Mostrar apoyo a la API

¿Estás pensando en utilizar la API de Screen Wake Lock? Tu apoyo público ayuda al equipo de Chrome a priorizar las funciones y muestra a otros proveedores de navegadores lo importante que es brindarles compatibilidad.

- Comparte cómo planeas usar la API en el [hilo del discurso de WICG](https://discourse.wicg.io/t/wake-lock-api-suppressing-power-management-screensavers/769).
- Envía un tweet a [@ChromiumDev](https://twitter.com/chromiumdev) usando el hashtag [`#WakeLock`](https://twitter.com/search?q=%23WakeLock&src=typed_query&f=live) y déjanos saber dónde y cómo lo estás usando.

## Enlaces útiles {: #helpful }

- Especificación de la [Candidate Recommendation](https://www.w3.org/TR/wake-lock/) | [Borrador del editor](https://w3c.github.io/wake-lock/)
- [Demostración de Screen Wake Lock](https://wake-lock-demo.glitch.me/) | [Fuente de la  demostración de Screen Wake Lock](https://glitch.com/edit/#!/wake-lock-demo?path=script.js:1:0)
- [Error de seguimiento](https://bugs.chromium.org/p/chromium/issues/detail?id=257511)
- [Entrada de ChromeStatus.com](https://www.chromestatus.com/feature/4636879949398016)
- [Experimentar con la API de Wake Lock](https://medium.com/dev-channel/experimenting-with-the-wake-lock-api-b6f42e0a089f)
- Componente Blink: [`Blink>WakeLock`](https://chromestatus.com/features#component%3ABlink%3EWakeLock)

## Agradecimientos

[Imagen de héroe](https://unsplash.com/photos/uy5t-CJuIK4) de [Kate Stone Matheson](https://unsplash.com/@kstonematheson) en Unsplash. Video del administrador de tareas, cortesía de [Henry Lim](https://twitter.com/henrylim96/status/1359914993399959559) .
