---
layout: post
title: Experiencias más enriquecedoras sin conexión con la API de sincronización periódica en segundo plano
subhead: Sincronice los datos de su aplicación web en segundo plano para lograr una experiencia similar
authors:
  - jeffposnick
  - joemedley
date: 2019-11-10
updated: 2020-08-18
hero: image/admin/Bz7MndcsUGPLAnQwIMfJ.jpg
alt: Aviones de colores volando sincronizadamente
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/4048736065006075905"
description: La sincronización periódica en segundo plano permite a las aplicaciones web sincronizar periódicamente los datos en segundo plano, lo que acerca a las aplicaciones web al comportamiento de una aplicación iOS/Android/de escritorio.
tags:
  - capabilities
  - blog
  - progressive-web-apps
  - service-worker
  - chrome-80
feedback:
  - api
---

{% Aside %} Las aplicaciones web deberían poder hacer todo lo que pueden hacer las aplicaciones de escritorio, iOS o Android. El [proyecto Capabilities](https://developer.chrome.com/blog/capabilities/) , del cual Periodic Background Sync es solo una parte, tiene como objetivo hacer precisamente eso. Para conocer otras capacidades y mantenerse al día con su progreso, siga [Desbloqueo de nuevas capacidades para la web](https://developer.chrome.com/blog/capabilities/) . {% endAside %}

¿Alguna vez ha estado en alguna de las siguientes situaciones?

- Viajar en tren o metro con una conectividad poco confiable o nula
- Su operador le redujo la velocidad después de ver demasiados videos
- Vivir en un país en el que el ancho de banda tiene dificultades para satisfacer la demanda

Si es así, seguro que sintió la frustración de hacer ciertas cosas en la web, y se preguntó por qué las aplicaciones específicas de la plataforma a menudo son mejores en estos escenarios. Las aplicaciones específicas de la plataforma pueden buscar contenido fresco, como artículos de noticias o información meteorológica, con antelación. Incluso si no hay red en el metro, puede leer las noticias.

La sincronización periódica en segundo plano permite que las aplicaciones web sincronicen periódicamente los datos en segundo plano, lo que acerca a las aplicaciones web al comportamiento de una aplicación específica de la plataforma.

## Estado actual

En la siguiente tabla se explica el estado actual de la API de sincronización periódica en segundo plano.

<table>
<tr>
<th markdown="block">Paso</th>
<th markdown="block">Estado</th>
</tr>
<tr>
<td markdown="block">1. Crear explicador</td>
<td markdown="block"><a href="https://github.com/WICG/BackgroundSync/tree/master/explainers">Completo</a></td>
</tr>
<tr>
<td markdown="block">2. Crear borrador inicial de especificación</td>
<td markdown="block"><a href="https://wicg.github.io/periodic-background-sync/" rel="noopener">Completo</a></td>
</tr>
<tr>
<td markdown="block">3. Recopilar comentarios e iterar el diseño</td>
<td markdown="block">En curso</td>
</tr>
<tr>
<td markdown="block">4. Prueba de origen</td>
<td markdown="block">Completo</td>
</tr>
<tr>
<td markdown="block"><strong>5. Lanzamiento</strong></td>
<td markdown="block"><strong>Chrome 80</strong></td>
</tr>
</table>

## Pruébelo

Puede probar la sincronización periódica en segundo plano con la [aplicación de demostración en vivo](https://webplatformapis.com/periodic_sync/periodicSync_improved.html). Antes de utilizarla, asegúrese de que:

- Está utilizando Chrome 80 o posterior.
- Debe [instalar](https://developers.google.com/web/fundamentals/app-install-banners/) la aplicación web antes de activar la sincronización periódica en segundo plano.

## Conceptos y uso

La sincronización periódica en segundo plano permite mostrar contenido fresco cuando se lanza una aplicación web progresiva o una página respaldada por un service worker. Para ello, se descargan los datos en segundo plano cuando no se utiliza la aplicación o la página. Esto evita que el contenido de la aplicación se actualice después del lanzamiento mientras se visualiza. Mejor aún, evita que la aplicación muestre un marcador de contenido antes de actualizarse.

Sin una sincronización periódica en segundo plano, las aplicaciones web deben utilizar métodos alternativos para descargar datos. Un ejemplo común es el uso de una notificación push para activar un service worker. El usuario se interrumpe con un mensaje como "nuevos datos disponibles". La actualización de los datos es esencialmente un efecto secundario. Todavía tiene la opción de utilizar las notificaciones push para las actualizaciones verdaderamente importantes, como las noticias de última hora.

La sincronización periódica en segundo plano se confunde fácilmente con la sincronización en segundo plano. Aunque tienen nombres similares, sus casos de uso son diferentes. Entre otras cosas, la sincronización en segundo plano se utiliza más comúnmente para reenviar datos a un servidor cuando una solicitud previa falló.

### Conseguir el compromiso de los usuarios

Si se hace de forma incorrecta, la sincronización periódica en segundo plano puede suponer un derroche de recursos para los usuarios. Antes de lanzarla, Chrome la sometió a un periodo de prueba para asegurarse de que era correcta. En esta sección se explican algunas de las decisiones de diseño que tomó Chrome para que esta función fuera lo más útil posible.

La primera decisión de diseño que tomó Chrome es que una aplicación web solo puede utilizar la sincronización periódica en segundo plano después de que una persona la instale en su dispositivo y la inicie como una aplicación distinta. La sincronización periódica en segundo plano no está disponible en el contexto de una pestaña normal en Chrome.

Además, como Chrome no quiere que las aplicaciones web que no se utilizan o se utilizan poco consuman gratuitamente batería o datos, diseñó la sincronización periódica en segundo plano de forma que los desarrolladores tengan que ganársela aportando valor a sus usuarios. Concretamente, Chrome utiliza una [puntuación de compromiso del sitio](https://www.chromium.org/developers/design-documents/site-engagement) (`about://site-engagement/`) para determinar si la sincronización periódica en segundo plano puede producirse para una aplicación web determinada y con qué frecuencia. En otras palabras, un evento `periodicsync` no se activará a menos que la puntuación de compromiso sea mayor que cero, y su valor afecta a la frecuencia con la que se activa el evento `periodicsync`. Esto asegura que las únicas aplicaciones que se sincronizan en segundo plano son las que se utilizan activamente.

La sincronización periódica en segundo plano comparte algunas similitudes con las API y las prácticas existentes en plataformas populares. Por ejemplo, la sincronización en segundo plano puntual, así como las notificaciones push, permiten que la lógica de una aplicación web perdure un poco más (mediante su service worker) después de que una persona haya cerrado la página. En la mayoría de las plataformas, es habitual que la gente tenga instaladas aplicaciones que acceden periódicamente a la red en segundo plano para ofrecer una mejor experiencia de usuario en cuanto a actualizaciones críticas, precarga de contenidos, sincronización de datos, etc. Del mismo modo, la sincronización periódica en segundo plano también amplía la vida útil de la lógica de una aplicación web para que se ejecute en periodos regulares cada vez durante lo que podrían ser unos minutos.

Si el navegador permite que esto ocurra con frecuencia y sin restricciones, podría dar lugar a algunos problemas de privacidad. Así es como Chrome aborda este riesgo para la sincronización periódica en segundo plano:

- La actividad de sincronización en segundo plano solo ocurre en una red a la que el dispositivo se ha conectado previamente. Chrome recomienda conectarse solo a redes operadas por partes confiables.
- Como ocurre con todas las comunicaciones por Internet, la sincronización periódica en segundo plano revela las direcciones IP del cliente, el servidor con el que habla y el nombre del servidor. Para reducir esta exposición a aproximadamente lo que sería si la aplicación solo se sincronizara cuando estuviera en primer plano, el navegador limita la frecuencia de las sincronizaciones en segundo plano de una aplicación para alinearla con la frecuencia con la que la persona utiliza esa aplicación. Si la persona deja de interactuar frecuentemente con la aplicación, la sincronización periódica en segundo plano dejará de activarse. Esto supone una mejora neta con respecto al estado actual de las aplicaciones específicas de la plataforma.

### ¿Cuándo se puede utilizar?

Las reglas de uso varían según el navegador. En resumen, Chrome impone los siguientes requisitos a la sincronización periódica en segundo plano:

- Una puntuación particular de compromiso del usuario.
- Presencia de una red que se utilizó anteriormente.

Los desarrolladores no controlan la frecuencia de las sincronizaciones. La frecuencia de sincronización se alineará con la frecuencia de uso de la aplicación. (Tenga en cuenta que las aplicaciones específicas de la plataforma actualmente no hacen esto). Además, toma en cuenta el estado de energía y conectividad del dispositivo.

### ¿Cuándo debe utilizarse?

Cuando su service worker se activa para administrar un evento `periodicsync`, tiene la *oportunidad* de solicitar datos, pero no la *obligación* de hacerlo. Cuando administre el evento debe tener en cuenta las condiciones de la red y el almacenamiento disponible y descargar diferentes cantidades de datos como respuesta. Puede utilizar los siguientes recursos como ayuda:

- [API de información de red](https://developer.mozilla.org/docs/Web/API/Network_Information_API)
- [Detección en el modo de ahorro de datos](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/save-data/#detecting_the_save-data_setting)
- [Estimación del almacenamiento disponible](https://developers.google.com/web/updates/2017/08/estimating-available-storage-space)

### Permisos

Después de instalar el service worker, utilice la API de permisos para consultar `periodic-background-sync`. Puede hacer esto desde una ventana o desde un contexto de service worker.

```js
const status = await navigator.permissions.query({
  name: 'periodic-background-sync',
});
if (status.state === 'granted') {
  // Periodic background sync can be used.
} else {
  // Periodic background sync cannot be used.
}
```

### Cómo registrar una sincronización periódica

Como ya se mencionó, la sincronización periódica en segundo plano requiere un service worker. Recupere un `PeriodicSyncManager` utilizando `ServiceWorkerRegistration.periodicSync` y llame a `register()` sobre él. El registro necesita una etiqueta y un intervalo de sincronización mínimo (`minInterval`). La etiqueta identifica la sincronización que se registra, de modo que se pueden registrar varias sincronizaciones. En el siguiente ejemplo, el nombre de la etiqueta es `'content-sync'` y el `minInterval` es un día.

```js/3-5
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  try {
    await registration.periodicSync.register('content-sync', {
      // An interval of one day.
      minInterval: 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    // Periodic background sync cannot be used.
  }
}
```

### Verificación de un registro

Llame a `periodicSync.getTags()` para recuperar una matriz de etiquetas de registro. En el siguiente ejemplo se utilizan los nombres de las etiquetas para confirmar que la actualización del caché está activa para evitar que se actualice de nuevo.

```js/2,4
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  const tags = await registration.periodicSync.getTags();
  // Only update content if sync isn't set up.
  if (!tags.includes('content-sync')) {
    updateContentOnPageLoad();
  }
} else {
  // If periodic background sync isn't supported, always update.
  updateContentOnPageLoad();
}
```

También puede utilizar `getTags()` para mostrar una lista de registros activos en la página de configuración de su aplicación web para que los usuarios puedan activar o desactivar tipos específicos de actualizaciones.

### Respuesta a un evento de sincronización periódica en segundo plano

Para responder a un evento de sincronización periódica en segundo plano, agregue un controlador de eventos `periodicsync` a su service worker. El objeto `event` que se le pase contendrá un parámetro `tag` que coincida con el valor que se utilizó durante el registro. Por ejemplo, si se registró una sincronización periódica en segundo plano con el nombre `'content-sync'`, entonces `event.tag` será `'content-sync'`.

```js
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    // See the "Think before you sync" section for
    // checks you could perform before syncing.
    event.waitUntil(syncContent());
  }
  // Other logic for different tags as needed.
});
```

### Anular el registro de una sincronización

Para finalizar una sincronización ya registrada, llame a `periodicSync.unregister()` con el nombre de la sincronización que desea anular.

```js
const registration = await navigator.serviceWorker.ready;
if ('periodicSync' in registration) {
  await registration.periodicSync.unregister('content-sync');
}
```

## Interfaces

A continuación, presentamos un breve resumen de las interfaces que ofrece la API de sincronización periódica en segundo plano.

- `PeriodicSyncEvent`. Se transmite al controlador del evento `ServiceWorkerGlobalScope.onperiodicsync` en el momento que decida el navegador.
- `PeriodicSyncManager`. Registra y anula las sincronizaciones periódicas y proporciona etiquetas para las sincronizaciones registradas. Recupera una instancia de esta clase desde la propiedad ServiceWorkerRegistration.periodicSync`.
- `ServiceWorkerGlobalScope.onperiodicsync`. Registra un controlador para recibir el `PeriodicSyncEvent`.
- `ServiceWorkerRegistration.periodicSync` . Devuelve una referencia al `PeriodicSyncManager` .

## Ejemplo

### Actualización del contenido

El siguiente ejemplo utiliza la sincronización periódica en segundo plano para descargar y almacenar en el caché los artículos actualizados de un sitio de noticias o un blog. Tenga en cuenta el nombre de la etiqueta, que indica el tipo de sincronización que es (`'update-articles'`). La llamada a `updateArticles()` está envuelta en `event.waitUntil()` para que el service worker no termine antes de que los artículos se descarguen y se almacenen.

```js/7
async function updateArticles() {
  const articlesCache = await caches.open('articles');
  await articlesCache.add('/api/articles');
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-articles') {
    event.waitUntil(updateArticles());
  }
});
```

### Agregar una sincronización periódica en segundo plano a una aplicación web existente

[Este conjunto de cambios](https://github.com/GoogleChromeLabs/so-pwa/pull/11) fueron necesarios para añadir la sincronización periódica en segundo plano a una [PWA existente](https://so-pwa.firebaseapp.com/). Este ejemplo incluye una serie de declaraciones de registro útiles que describen el estado de la sincronización periódica en segundo plano en la aplicación web.

## Depuración

Puede ser un reto obtener una vista de extremo a extremo de la sincronización periódica en segundo plano mientras se realizan pruebas locales. La información sobre los registros activos, los intervalos de sincronización aproximados y los registros de eventos de sincronización pasados proporcionan un contexto valioso mientras se depura el comportamiento de la aplicación web. Afortunadamente, puede encontrar toda esa información mediante una función experimental en Chrome DevTools.

{% Aside %} La depuración periódica de la sincronización en segundo plano se habilita en Chrome 81 y en versiones posteriores. {% endAside %}

### Registro de la actividad local

La sección **Sincronización periódica en segundo plano** de DevTools está organizada en torno a los eventos clave del ciclo de vida de la sincronización periódica en segundo plano: registro para la sincronización, realización de una sincronización en segundo plano y anulación del registro. Para obtener información sobre estos eventos, haga clic en **Iniciar registro**.

<figure>{% Img src="image/admin/wcl5Bm6Pe9xn5Dps6IN6.png", alt="El botón de registro en DevTools", width="708", height="90" %} <figcaption> The record button in DevTools </figcaption></figure>

Mientras se graba, aparecerán entradas en DevTools correspondientes a los eventos, con el contexto y los metadatos registrados para cada uno.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/m92Art0OwiM0VyI7czFB.png", alt="Un ejemplo de datos de sincronización periódica de fondo registrados", width="800", height="357", style="max-width: 75%" %} <figcaption> Un ejemplo de datos de sincronización periódica de fondo registrados </figcaption></figure>

Después de activar el registro por primera vez, permanecerá activado hasta tres días, lo que permite a DevTools capturar información de depuración local sobre las sincronizaciones en segundo plano que puedan tener lugar, incluso horas en el futuro.

### Simulación de eventos

Aunque el registro de la actividad en segundo plano puede ser útil, hay ocasiones en las que querrá probar su controlador `periodicsync` inmediatamente, sin esperar a que se dispare un evento en su cadencia normal.

Puede hacerlo mediante la sección **Service Workers** del panel de aplicaciones en Chrome DevTools. El campo **Sincronización periódica** le permite proporcionar una etiqueta para el evento que va a utilizar, y activarlo tantas veces como desee.

{% Aside %} La activación manual de un evento `periodicsync` requiere Chrome 81 o una versión posterior. {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BQ5QdjwaRDP42cHqW98W.png", alt="La sección 'Service Workers' del panel de la aplicación muestra un campo de texto y un botón de 'Sincronización periódica'", width="800", height="321", style="max-width: 90%" %}</figure>

## Uso de la interfaz de DevTools

A partir de Chrome 81, podrás consultar una sección **Sincronización periódica en segundo plano** en el panel *Aplicación* de DevTools.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eYJtJfZ9Qo145lUQe4Ur.png", alt="El panel de la aplicación muestra la sección de Sincronización periódica en segundo plano", width="382", height="253", style="max-width: 75%" %}</figure>
