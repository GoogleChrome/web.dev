---
layout: post
title: Manual de instrucciones paso a paso para trabajar sin conexión
description: Algunos trucos comunes para hacer que su aplicación funcione sin conexión.
authors:
  - jakearchibald
date: 2014-12-09
updated: 2020-09-28
---

Con [Service Worker](/service-workers-cache-storage/) dejamos de intentar resolver la funcionalidad sin conexión y les dimos a los desarrolladores las herramientas para que la resolvieran ellos mismos. Esto permite obtener control sobre el almacenamiento en caché y sobre cómo se manejan las solicitudes. Eso significa que puede crear sus propios patrones. Echemos un vistazo a algunos patrones posibles de forma aislada, pero en la práctica es probable que tenga que usar varios de ellos en conjunto según la URL y el contexto.

Para ver una demostración funcional de algunos de estos patrones, consulte [Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) y [este video que](https://www.youtube.com/watch?v=px-J9Ghvcx4) muestra el impacto en el rendimiento.

## La caché: o cuándo almacenar recursos

[Service Worker le](/service-workers-cache-storage/) permite manejar solicitudes independientemente del almacenamiento en caché, por lo que realizaré una demostración por separado. Primero, ¿cuándo se debe llevar a cabo el almacenamiento en caché?

### Al instalar: como dependencia {: #on-install-as-dependency}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CLdlCeKfoOPfpYDx1s0p.png", alt="Al instalar, como dependencia", width="800", height="498" %}<figcaption> Al instalar: como dependencia.</figcaption></figure>

Service Worker ofrece un evento `install`. Puede utilizarlo para preparar cosas, como aquellas que deben estar listas antes de manejar otros eventos. Mientras esto ocurre, cualquier versión anterior de su Service Worker continúa ejecutando y sirviendo páginas, por lo que las cosas que haga aquí no interrumpirán nada de eso.

**Ideal para:** CSS, imágenes, fuentes, JS, plantillas … básicamente cualquier cosa que consideres estática para esa "versión" de tu sitio.

Se trata de cosas que harían que su sitio no funcionara en absoluto si no se pueden recuperar, cosas que una aplicación específica de la plataforma equivalente incluiría en la descarga inicial.

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(function (cache) {
      return cache.addAll([
        '/css/whatever-v3.css',
        '/css/imgs/sprites-v6.png',
        '/css/fonts/whatever-v8.woff',
        '/js/all-min-v4.js',
        // etc.
      ]);
    }),
  );
});
```

`event.waitUntil` toma una promesa para definir la duración y el éxito de la instalación. Si la promesa es rechazada, la instalación se considera un error y este Service Worker será abandonado (si se está ejecutando una versión anterior, continuará intacta). `caches.open()` y `cache.addAll()` devuelven promesas. Si alguno de los recursos no se puede recuperar, la ejecución de `cache.addAll()` rechaza la promesa.

En [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/), uso este evento para [almacenar  activos estáticos en caché](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L3).

### Al instalar, no como dependencia {: #on-install-not}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/S5L9hw95GKGWS1l0ImGl.png", alt="Al instalar, no como dependencia", width="800", height="500" %}<figcaption> Al instalar, no como dependencia.</figcaption></figure>

Esto es similar a lo anterior, pero no retrasará la finalización de la instalación y no hará que la instalación falle si el almacenamiento en caché falla.

**Ideal para:** recursos más grandes que no se necesitan de inmediato, como recursos para niveles posteriores de un juego.

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function (cache) {
      cache
        .addAll
        // levels 11–20
        ();
      return cache
        .addAll
        // core assets and levels 1–10
        ();
    }),
  );
});
```

El ejemplo anterior no pasa `cache.addAll` para los niveles 11–20 a `event.waitUntil`, por lo que incluso si falla, el juego seguirá estando disponible sin conexión. Por supuesto, tendrá que cuidar de la posible ausencia de esos niveles y volver a intentar almacenarlos en caché si no están disponibles.

El Service Worker puede finalizar mientras se descargan los niveles 11 a 20, ya que ha terminado de manejar los eventos, lo que significa que no se almacenarán en caché. En el futuro, la [API de sincronización en segundo plano](https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API) se encargará de casos como este y de descargas más grandes, como películas. Actualmente, esa API solo es compatible con las bifurcaciones de Chromium.

### Al activar {: #on-activate}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/pUH91vKtMTLXNgpHmID2.png", alt="Al activar", width="800", height="500" %}<figcaption> Al activar.</figcaption></figure>

**Ideal para:** limpieza y migración.

Una vez que se ha instalado un nuevo Service Worker y no se está utilizando una versión anterior, se activa la nueva y se obtiene un evento `activate`. Debido a que la versión anterior no está disponible, es un buen momento para manejar las [migraciones de esquemas en IndexedDB](/indexeddb-best-practices/) y también eliminar las cachés no utilizadas.

```js
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});
```

Durante la activación, otros eventos, como `fetch` se colocan en una cola, por lo que una activación prolongada podría bloquear la carga de la página. Mantenga su activación lo más escueta posible y úsela solo para cosas que *no podría* hacer mientras la versión anterior estaba activa.

En [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/), lo uso para [eliminar cachés antiguos](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L17).

### Cuando el usuario interactúa {: #on-user-interaction}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/q5uUUHvxb3Is8N5Toxja.png", alt="Durante la interacción del usuario", width="800", height="222" %}<figcaption> Durante la interacción del usuario.</figcaption></figure>

**Ideal para:** cuando no se puede desconectar todo el sitio y usted decide permitir que el usuario seleccione el contenido que quiere que esté disponible sin conexión. Por ejemplo, un video en algo como YouTube, un artículo en Wikipedia, una galería particular en Flickr.

Proporcione al usuario un botón "Leer más tarde" o "Guardar sin conexión". Cuando haga clic, busque lo que necesita de la red y colóquelo en la caché.

```js
document.querySelector('.cache-article').addEventListener('click', function (event) {
  event.preventDefault();

  var id = this.dataset.articleId;
  caches.open('mysite-article-' + id).then(function (cache) {
    fetch('/get-article-urls?id=' + id)
      .then(function (response) {
        // /get-article-urls returns a JSON-encoded array of
        // resource URLs that a given article depends on
        return response.json();
      })
      .then(function (urls) {
        cache.addAll(urls);
      });
  });
});
```

La [API de cachés](https://developer.mozilla.org/docs/Web/API/Cache) está disponible tanto en las páginas como en los service workers, lo que significa que no es necesario involucrar a este último para agregar cosas al caché.

### Cuando la red responde {: #on-network-response}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/86mv3BK2kjWi8Dm1KWpr.png", alt="Cuando la red responde", width="800", height="390" %}<figcaption> Cuando la red responde.</figcaption></figure>

**Ideal para:** recursos que actualizan con frecuencia como la bandeja de entrada de un usuario o el contenido de un artículo. También es útil para contenido no esencial como avatares, pero es necesario usarlo cuidado.

Si una solicitud no coincide con nada en la caché, obténgala de la red, envíela a la página y agréguela al caché al mismo tiempo.

Si hace esto para varios URL, como avatares, deberá tener cuidado de no inflar el almacenamiento de su origen.  Si el usuario necesita recuperar espacio en el disco, no querrá ser el principal candidato. Asegúrese de deshacerse de los elementos de la caché que ya no necesita.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    }),
  );
});
```

Para permitir el uso eficiente de la memoria, solo puede leer el cuerpo de una respuesta/solicitud una vez. El código anterior usa [`.clone()`](https://fetch.spec.whatwg.org/#dom-request-clone) para crear copias adicionales que se pueden leer por separado.

En [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/), lo uso para [almacenar imágenes de Flickr en caché](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L109).

### Obsoleto-mientras-revalida {: #stale-while-revalidate }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6GyjQkG2pI5tV1xirXSX.png", alt="Obsoleto mientras revalida", width ="800", height="388" %}<figcaption> Obsoleto mientras revalida.</figcaption></figure>

**Ideal para:** recursos que actualizan con frecuencia donde tener la última versión no es esencial. Los avatares pueden caer en esta categoría.

Si hay una versión en caché disponible, úsela, pero obtenga una actualización para la próxima vez.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
```

Esto es muy similar al [stale-while-revalidate](https://www.mnot.net/blog/2007/12/12/stale) del HTTP.

### Al recibir un mensaje push {: #on-push-message }

<figure>{% Img src= "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bshuBXOyD2A4zveXQMul.png", alt="Al recibir un mensaje push.", width="800", height="498" %}<figcaption> Al recibir un mensaje push.</figcaption></figure>

[Push API](/push-notifications/) es otra característica construida sobre Service Worker. Esto permite activar al Service Worker en respuesta a un mensaje del servicio de mensajería del sistema operativo. Esto sucede incluso cuando el usuario no tiene una pestaña abierta en su sitio. Solo activa al Service Worker. Solicite permiso para hacer esto desde una página y se enviará una solicitud al usuario.

**Ideal para:** contenido relacionado con una notificación, como un mensaje de chat, una noticia de última hora o un correo electrónico. También para contenido que cambia con poca frecuencia que se beneficia de la sincronización inmediata, como una actualización de la lista de tareas pendientes o una modificación del calendario.

{% YouTube '0i7YdSEQI1w' %}

El resultado final común es una notificación que, cuando se toca, abre / enfoca una página relevante, pero para la cual actualizar las cachés antes de que esto suceda es *extremadamente* importante. Obviamente, el usuario está en línea en el momento de recibir el mensaje push, pero es posible que no lo esté cuando finalmente interactúe con la notificación, por lo que es importante que este contenido esté disponible sin conexión.

Este código actualiza las cachés antes de mostrar una notificación:

```js
self.addEventListener('push', function (event) {
  if (event.data.text() == 'new-email') {
    event.waitUntil(
      caches
        .open('mysite-dynamic')
        .then(function (cache) {
          return fetch('/inbox.json').then(function (response) {
            cache.put('/inbox.json', response.clone());
            return response.json();
          });
        })
        .then(function (emails) {
          registration.showNotification('New email', {
            body: 'From ' + emails[0].from.name,
            tag: 'new-email',
          });
        }),
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  if (event.notification.tag == 'new-email') {
    // Assume that all of the resources needed to render
    // /inbox/ have previously been cached, e.g. as part
    // of the install handler.
    new WindowClient('/inbox/');
  }
});
```

### Al sincronizar en segundo plano {: #on-background-sync }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tojpjg0cvZZVvZWStG81.png", alt="Al sincronizar en segundo plano.", width="800", height="219" %}<figcaption> Al sincronizar en segundo plano.</figcaption></figure>

[La sincronización en segundo plano](https://developer.chrome.com/blog/background-sync/) es otra característica construida sobre Service Worker. Le permite solicitar la sincronización de datos en una única instancia o en un intervalo (extremadamente heurístico). Esto sucede incluso cuando el usuario no tiene una pestaña abierta en su sitio. Solo activa al Service Worker. Solicite permiso para hacer esto desde una página y se le enviará una solicitud al usuario.

**Ideal para:** actualizaciones no urgentes, especialmente aquellas que ocurren con tanta regularidad que un mensaje push por actualización sería demasiado para los usuarios, como líneas de tiempo de redes sociales o artículos de noticias.

```js
self.addEventListener('sync', function (event) {
  if (event.id == 'update-leaderboard') {
    event.waitUntil(
      caches.open('mygame-dynamic').then(function (cache) {
        return cache.add('/leaderboard.json');
      }),
    );
  }
});
```

## Persistencia en caché {: #cache-persistence }

Su origen tiene una cierta cantidad de espacio libre para hacer lo que quiera. Ese espacio libre se comparte entre todo el almacenamiento de origen: [almacenamiento (local)](https://developer.mozilla.org/docs/Web/API/Storage), [IndexedDB](https://developer.mozilla.org/docs/Glossary/IndexedDB), [acceso al sistema de archivos](/file-system-access/) y, por supuesto, las [cachés](https://developer.mozilla.org/docs/Web/API/Cache).

La cantidad de almacenamiento que recibe no está especificada. Varía según el dispositivo y las condiciones de almacenamiento. Puede averiguar cuánto tiene a través de:

```js
navigator.storageQuota.queryInfo('temporary').then(function (info) {
  console.log(info.quota);
  // Result: <quota in bytes>
  console.log(info.usage);
  // Result: <used data in bytes>
});
```

Sin embargo, al igual que todo el almacenamiento del navegador, el navegador tiene la libertad de despejar sus datos si el dispositivo está con almacenamiento limitado. Desafortunadamente, el navegador no puede distinguir entre las películas que desea conservar a cualquier costo y el juego que no le importa en lo más mínimo.

[Para solucionar](https://developer.mozilla.org/docs/Web/API/StorageManager) este problema, utilice la interfaz StorageManager:

```js
// From a page:
navigator.storage.persist()
.then(function(persisted) {
  if (persisted) {
    // Hurrah, your data is here to stay!
  } else {
   // So sad, your data may get chucked. Sorry.
});
```

Por supuesto, el usuario debe otorgar permiso. Para ello, utilice la API de permisos.

Hacer que el usuario forme parte de este flujo es importante, ya que ahora podemos esperar que tenga el control de la eliminación. Si su dispositivo se encuentra con almacenamiento limitado y borrar datos no esenciales no lo resuelve, el usuario puede escoger cuáles elementos conservar y cuáles eliminar.

Para que esto funcione, se requiere que los sistemas operativos traten los orígenes "duraderos" como equivalentes a las aplicaciones específicas de la plataforma en sus desgloses del uso de almacenamiento, en lugar de informar el navegador como un solo elemento.

## Sugerencias de servicio: responder a las solicitudes {: #serving-suggestions }

No importa cuantas cosas almacene en caché, el Service Worker no la usará a menos que le indique cuándo y cómo. A continuación, se muestran algunos patrones para manejar solicitudes:

### Solo desde caché {: #cache-only }

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ppXImAnXW7Grk4igLRTj.png", alt="Solo caché", width="800", height="272" %}<figcaption> Solo caché.</figcaption></figure>

**Ideal para:** cualquier cosa que considere estática para una "versión" particular de su sitio. Debe haberlos almacenado en caché en el evento de instalación, por lo que puede confiar en que estarán allí.

```js
self.addEventListener('fetch', function (event) {
  // If a match isn't found in the cache, the response
  // will look like a connection error
  event.respondWith(caches.match(event.request));
});
```

… aunque no necesita lidar con este caso específico de forma frecuente, [Caché primero y luego de vuelta a la red (Cache, falling back to network)](#cache-falling-back-to-network) lo cubre.

### Solo de la red {: #network-only }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5piPzi4NRGcgy1snmlEW.png", alt="Solo red", width="800", height="272" %}<figcaption> Solo red.</figcaption></figure>

**Ideal para:** cosas que no tienen equivalente sin conexión, como pings analíticos, solicitudes que no utilizan GET.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
  // or simply don't call event.respondWith, which
  // will result in default browser behavior
});
```

… aunque no necesita lidar con este caso específico de forma frecuente, [Caché primero y luego de vuelta a la red](#cache-falling-back-to-network) lo cubre.

### Caché primero y luego de vuelta a la red {: #cache-falling-back-to-network }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMXq6ya5HdjkNeGjTlAN.png", alt="Caché primero y luego de vuelta a la red.", width="800", height="395" %}<figcaption> Caché primero y luego de vuelta a la red.</figcaption></figure>

**Ideal para:** construir primero sin conexión. En tales casos, así es como manejará la mayoría de las solicitudes. Otros patrones serán excepciones basadas en la solicitud entrante.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

Esto le brinda el comportamiento de "solo desde caché" para las cosas en la caché y el comportamiento de "solo de la red" para cualquier cosa que no esté en la caché (que incluye todas las solicitudes que no utilizan GET, ya que no se pueden almacenar en caché).

### Carrera de red de caché {: #cache-and-network-race }

<figure>{% Img src = "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/j6xbmOpm4GbayBJHChNW.png", alt = "Carrera de red y caché", width="800", height="427" %}<figcaption> Carrera de red y caché.</figcaption></figure>

**Ideal para:** activos pequeños en los que busca rendimiento en dispositivos con acceso lento al disco.

Con algunas combinaciones de discos duros más antiguos, escáneres de virus y conexiones a Internet más rápidas, obtener recursos de la red puede ser más rápido que ir al disco. Sin embargo, ir a la red cuando el usuario tiene el contenido en su dispositivo puede ser un desperdicio de datos, así que téngalo en cuenta.

```js
// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map((p) => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach((p) => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b)).catch(() => reject(Error('All failed')));
  });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(promiseAny([caches.match(event.request), fetch(event.request)]));
});
```

### Red primero, luego vuelta a la caché {: #network-fallling-back-to-cache }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/efLECR7ZqNiPjmAzvEzO.png", alt="Red primero, luego vuelta a la caché", width="800", height="388" %}<figcaption> Red primero, luego vuelta a la caché.</figcaption></figure>

**Ideal para:** una solución rápida para recursos que se actualizan con frecuencia, fuera de la "versión" del sitio. Por ejemplo, artículos, avatares, líneas de tiempo de redes sociales y tablas de clasificación de juegos.

Esto significa que les brinda a los usuarios en línea el contenido más actualizado, pero los usuarios sin conexión obtienen una versión más antigua en caché. Si la solicitud de red tiene éxito, lo más probable es que desee [actualizar la entrada de la caché](#on-network-response).

Sin embargo, este método tiene inconvenientes. Si el usuario tiene una conexión lenta o intermitente, tendrá que esperar a que la red falle antes de obtener el contenido perfectamente aceptable en su dispositivo. Esto puede llevar tiempo y proporciona una experiencia de usuario frustrante. Consulte el siguiente patrón, [Caché y luego red (Cache then network)](#cache-then-network), para una mejor solución.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    }),
  );
});
```

### Caché luego red {: #cache-then-network }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BjxBlbCf14ed9FBQRS6E.png", alt="Caché luego red", width="800", height="478" %}<figcaption> Caché luego red.</figcaption></figure>

**Ideal para:** contenido que se actualiza con frecuencia. Por ejemplo, artículos, líneas de tiempo de redes sociales y tablas de clasificación de juegos.

Esto requiere que la página realice dos solicitudes, una a la caché y otra a la red. La idea es mostrar primero los datos almacenados en caché y luego actualizar la página cuando lleguen los datos de la red.

A veces, puede simplemente reemplazar los datos actuales cuando llegan nuevos datos (por ejemplo, en tablas de clasificación de juegos), pero eso puede ser problemático con piezas de contenido más grandes. Básicamente, no "desaparezca" algo que el usuario pueda estar leyendo o con lo que esté interactuando.

Twitter agrega el contenido nuevo por encima del contenido anterior y ajusta la posición de desplazamiento para que el usuario no sea interrumpido. Esto es posible porque Twitter principalmente conserva un orden mayoritariamente lineal del contenido. Yo copié este patrón en [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) para que el contenido aparezca en la pantalla lo más rápido posible, mientras muestra el contenido actualizado tan pronto como llega.

**Código en la página:**

```js
var networkDataReceived = false;

startSpinner();

// fetch fresh data
var networkUpdate = fetch('/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    updatePage(data);
  });

// fetch cached data
caches
  .match('/data.json')
  .then(function (response) {
    if (!response) throw Error('No data');
    return response.json();
  })
  .then(function (data) {
    // don't overwrite newer network data
    if (!networkDataReceived) {
      updatePage(data);
    }
  })
  .catch(function () {
    // we didn't get cached data, the network is our last hope:
    return networkUpdate;
  })
  .catch(showErrorMessage)
  .then(stopSpinner);
```

**Código en el Service Worker:**

Siempre debe ir a la red y actualizar la caché sobre la marcha.

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      });
    }),
  );
});
```

En [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) pude resolver esto usando [XHR en lugar de fetch](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/utils.js#L3), y abusando del encabezado Accept para comunicarle al Service Worker de dónde obtener el resultado ([código de la página](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/index.js#L70), [código del Service Worker](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L61)).

### Método de respaldo genérico {: #generic-fallback }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URF7IInbQtWL6GZK9GW3.png", alt="Método de respaldo genérico.", width="800", height="389" %}<figcaption> Método de respaldo genérico.</figcaption></figure>

Si no puede proporcionar algún contenido de la caché o la red, es posible que deba proporcionar un respaldo genérico.

**Ideal para:** imágenes secundarias como avatares, solicitudes POST fallidas y una página de "No disponible sin conexión".

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // Try the cache
    caches
      .match(event.request)
      .then(function (response) {
        // Fall back to network
        return response || fetch(event.request);
      })
      .catch(function () {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html');
        // However, in reality you'd have many different
        // fallbacks, depending on URL and headers.
        // Eg, a fallback silhouette image for avatars.
      }),
  );
});
```

Es probable que el elemento al que recurra sea una [dependencia de instalación (install dependency)](#on-install-as-dependency).

Si su página está publicando un correo electrónico, el Service Worker puede recurrir a almacenar el correo electrónico en una 'bandeja de salida' IndexedDB y responder informando a la página que el envío falló, pero que los datos se guardaron correctamente.

### Plantillas del lado del Service Worker {: #Service Worker-side-templating }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/o5SqtDczlvhw6tPJkr2z.png", alt="Plantillas del lado del Service Worker.", width="800", height="463" %}<figcaption> Plantillas del lado del Service Worker.</figcaption></figure>

**Ideal para:** páginas que no pueden almacenar la respuesta del servidor en caché.

[La representación de páginas en el servidor agiliza](https://jakearchibald.com/2013/progressive-enhancement-is-faster/), pero puede incluir datos de estado que pueden no tener sentido en la caché, por ejemplo, "Conectado como…". Si su página es controlada por un Service Worker, puede optar por solicitar datos JSON junto con una plantilla y representarlos en vez de ello.

```js
importScripts('templating-engine.js');

self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url);

  event.respondWith(
    Promise.all([
      caches.match('/article-template.html').then(function (response) {
        return response.text();
      }),
      caches.match(requestURL.path + '.json').then(function (response) {
        return response.json();
      }),
    ]).then(function (responses) {
      var template = responses[0];
      var data = responses[1];

      return new Response(renderTemplate(template, data), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }),
  );
});
```

## Poner todo en orden

No está limitado a solo uno de estos métodos. De hecho, es probable que utilice varios de ellos según la URL de la solicitud. Por ejemplo, [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) utiliza:

- [cache on install](#on-install-as-dependency), para la interfaz de usuario estática y el comportamiento
- [cache on network response](#on-network-response), para las imágenes de Flickr y los datos
- [fetch from cache, falling back to network](#cache-falling-back-to-network), para la mayoría de las solicitudes
- [fetch from cache, then network](#cache-then-network), para los resultados de búsqueda de Flickr

Solo verifique la solicitud y decida qué hacer:

```js
self.addEventListener('fetch', function (event) {
  // Parse the URL:
  var requestURL = new URL(event.request.url);

  // Handle requests to a particular host specifically
  if (requestURL.hostname == 'api.example.com') {
    event.respondWith(/* some combination of patterns */);
    return;
  }
  // Routing for local URLs
  if (requestURL.origin == location.origin) {
    // Handle article URLs
    if (/^\/article\//.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/\.webp$/.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (request.method == 'POST') {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/cheese/.test(requestURL.pathname)) {
      event.respondWith(
        new Response('Flagrant cheese error', {
          status: 512,
        }),
      );
      return;
    }
  }

  // A sensible default pattern
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

¿Comprendes, Mendes?

### Creditos

… por los encantadores íconos:

- [Code](http://thenounproject.com/term/code/17547/) de buzzyrobot
- [Calendar](http://thenounproject.com/term/calendar/4672/) de Scott Lewis
- [Network](http://thenounproject.com/term/network/12676/) de Ben Rizzo
- [SD](http://thenounproject.com/term/sd-card/6185/) de Thomas Le Bas
- [CPU](http://thenounproject.com/term/cpu/72043/) de iconsmind.com
- [Trash](http://thenounproject.com/term/trash/20538/) de trasnik
- [Notification](http://thenounproject.com/term/notification/32514/) de @daosme
- [Layout](http://thenounproject.com/term/layout/36872/) de Mister Pixel
- [Cloud](http://thenounproject.com/term/cloud/2788/) de P.J. Onori

Y gracias a [Jeff Posnick](https://twitter.com/jeffposnick) por detectar un monte de errores grotescos antes de que hice clic en "publicar".

### Más información

- [Introducción a los Service Workers](/service-workers-cache-storage/)
- [¿Service Worker está listo?](https://jakearchibald.github.io/isserviceworkerready/): Sigue el estado de implementación en los principales navegadores
- [Promesas de JavaScript: una introducción](/promises) : guía sobre Promesas
