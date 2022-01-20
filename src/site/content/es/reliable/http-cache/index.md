---
layout: post
title: Evitar consultas de red innecesarias con HTTP Cache
authors:
  - jeffposnick
  - ilyagrigorik
date: 2018-11-05
updated: 2020-04-14
description: |2-

  ¿Cómo se puede evitar consultas de red innecesarias? El HTTP Cache del navegador es tu
  primera línea de defensa. No es necesariamente el más poderoso o flexible
  enfoque, y tiene un control limitado sobre la vida útil de las respuestas en caché,
  pero es efectivo, es compatible con todos los navegadores y no requiere mucho de
  trabajo.
codelabs:
  - codelab-http-cache
feedback:
  - api
---

Obtener recursos a través de la red es lento y costoso:

- Las respuestas grandes requieren muchos viajes de ida y vuelta entre el navegador y el servidor.
- Tu página no se cargará hasta que todos tus [recursos críticos](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) se hayan descargado por completo.
- Si una persona accede a tu sitio con un plan de datos móviles limitado, cada solicitud de red innecesaria es una pérdida de su dinero.

¿Cómo puedes evitar solicitudes de red innecesarias? El HTTP Cache del navegador es tu primera línea de defensa. No es necesariamente el enfoque más poderoso o flexible, y tiene un control limitado sobre la vida útil de las respuestas almacenadas en caché, pero es efectivo, es compatible con todos los navegadores y no requiere de mucho trabajo.

Esta guía te mostrará los conceptos básicos de una implementación eficaz de almacenamiento del HTTP Cache.

## Compatibilidad con los navegadores {: #browser-compatible }

En realidad, no existe una única API con el nombre de HTTP Cache. Este el nombre general de una colección de API de plataforma web. Esas API son compatibles con todos los navegadores:

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Browser_compatibility)
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag#Browser_compatibility)
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified#Browser_compatibility)

## Cómo funciona HTTP Cache {: #overview }

Todas las solicitudes HTTP que realiza el navegador se enrutan primero al caché del navegador para comprobar si hay una respuesta almacenada en caché que sea valida que se pueda utilizar para cumplir con la solicitud. Si hay una, la respuesta se lee de la caché, lo que elimina tanto la latencia de la red como los costos de datos en los que incurre la transferencia.

El comportamiento del HTTP Cache se controla mediante una combinación de [cabeceras de consulta](https://developer.mozilla.org/docs/Glossary/Request_header) y [cabeceras de respuesta](https://developer.mozilla.org/docs/Glossary/Response_header). En un escenario ideal, tendrás control sobre el código de tu aplicación web (que determinará las cabeceras de consulta) y la configuración de tu servidor web (que determinará las cabeceras de respuesta).

Consulta el artículo de [almacenamiento en HTTP Cache](https://developer.mozilla.org/docs/Web/HTTP/Caching) de MDN para obtener una descripción conceptual más detallada.

## Consulta de cabeceras: utiliza los valores (generalmente) predeterminados {: #request-headers }

Si bien hay una serie de cabeceras importantes que deben incluirse en las solicitudes salientes de tu aplicación web, el navegador casi siempre se encarga de configurarlas en tu nombre cuando realizas solicitudes. Las cabeceras de solicitud que afectan la verificación de la actualización, como [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) y[`If-Modified-Since`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since) solo aparecen según la comprensión del navegador de los valores actuales del HTTP Cache.

Esta es una buena noticia: esto significa que puedes continuar incluyendo etiquetas como `<img src="my-image.png">` en tu HTML, y el navegador se encarga automáticamente del almacenamiento HTTP Cache por ti, sin ningún esfuerzo adicional.

{% Aside %} Los desarrolladores que necesitan más control sobre el HTTP Cache en su aplicación web tienen una alternativa: pueden "bajarse" un nivel y usar manualmente la [API de Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API), pasándole objetos de [`Request`](https://developer.mozilla.org/docs/Web/API/Request) con un conjunto override especifico de [`cache`](https://developer.mozilla.org/docs/Web/API/Request/cache). Sin embargo, eso está más allá del alcance de esta guía. {% endAside %}

## Cabeceras de respuesta: configura tu servidor web {: #response-headers }

La parte de la configuración del almacenamiento del HTTP Cache que más importa son las cabeceras que tu servidor web agrega a cada respuesta que sale. Las siguientes cabeceras influyen en el comportamiento efectivo del almacenamiento en caché:

- [`Cache-Control`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control). El servidor puede devolver un `Cache-Control` para especificar cómo, y durante cuánto tiempo, el navegador y otros cachés intermedios, deben almacenar en caché la respuesta individual.
- [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag). Cuando el navegador encuentra una respuesta en caché caducada, puede enviar un pequeño token (generalmente un hash del contenido del archivo) al servidor para verificar si el archivo ha cambiado. Si el servidor devuelve el mismo token, entonces el archivo es el mismo y no es necesario volver a descargarlo.
- [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified). Este encabezado tiene el mismo propósito que `ETag`, pero utiliza una estrategia basada en el tiempo para determinar si un recurso ha cambiado, a diferencia de la estrategia basada en contenido de `ETag`.

Algunos servidores web tienen soporte integrado para configurar esas cabeceras de forma predeterminada, mientras que otros omiten las cabeceras por completo a menos que los configuren explícitamente. Los detalles específicos sobre *cómo* configurar las cabeceras varían mucho según el servidor web que uses y debes consultar la documentación de tu servidor para obtener los detalles más precisos.

Para ahorrarte algunas búsquedas, aquí hay instrucciones sobre cómo configurar algunos servidores web populares:

- [Express](https://expressjs.com/en/api.html#express.static)
- [Apache](https://httpd.apache.org/docs/2.4/caching.html)
- [nginx](http://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Alojamiento de Firebase](https://firebase.google.com/docs/hosting/full-config)
- [Netlify](https://www.netlify.com/blog/2017/02/23/better-living-through-caching/)

Al no usar la cabecera de respuesta de `Cache-Control` no se deshabilita el HTTP Cache. En cambio, los navegadores [adivinan con eficacia](https://www.mnot.net/blog/2017/03/16/browser-caching#heuristic-freshness) qué tipo de comportamiento de almacenamiento en caché tiene más sentido para un tipo de contenido determinado. Lo más probable es que desees más control del que ofrece, así que tómate el tiempo para configurar tus cabeceras de respuesta.

## ¿Qué valores de cabecera de respuesta deberías utilizar? {: #response-header-strategies }

Hay dos escenarios importantes que se deben de cubrir al configurar las cabeceras de respuesta de tu servidor web.

### Almacenamiento en caché de larga duración para URL versionadas {: #versioned-urls }

{% Details %}
  {% DetailsSummary 'h4' %}
    Cómo las URL versionadas pueden ayudar a tu estrategia de almacenamiento en caché
    Las URL versionadas son una buena práctica porque facilitan la invalidación de respuestas almacenadas en caché.
  {% endDetailsSummary %}
    Supongamos que tu servidor indica a los navegadores que guarden en caché un archivo CSS durante 1 año (<code>Cache-Control: max-age=31536000</code>) pero tu diseñador acaba de realizar una actualización de emergencia que debe implementarse de inmediato. ¿Cómo notificas a los navegadores que actualicen la copia en caché "obsoleta" del archivo? No puedes, al menos no sin cambiar la URL del recurso. Después de que el navegador almacena en caché la respuesta, la versión en caché se usa hasta que ya no esté actualizada, según lo determinado por <code>max-age</code> o <code>expires</code>, o hasta que se expulse de la caché por alguna otra razón, por ejemplo, el usuario borra la caché de su navegador. Como resultado, diferentes usuarios pueden terminar usando diferentes versiones del archivo cuando se construye la página: los usuarios que acaban de buscar el recurso usan la nueva versión, mientras que los usuarios que almacenaron en caché una copia anterior (pero aún válida) usan una versión anterior de tu respuesta. ¿Cómo se obtiene lo mejor de ambos mundos: almacenamiento en caché del lado del cliente y actualizaciones rápidas? Cambia la URL del recurso y obliga al usuario a descargar la nueva respuesta cada vez que cambia tu contenido. Normalmente, esto se hace incrustando una huella digital del archivo, o un número de versión, en su nombre de archivo, por ejemplo, <code>style.x234dff.css</code>.
{% endDetails %}

Cuando respondes a solicitudes de URL que contengan "[huellas digitales](https://en.wikipedia.org/wiki/Fingerprint_(computing))" o información de versiones, y cuyo contenido nunca debe cambiar, agrega `Cache-Control: max-age=31536000` a tus respuestas.

Establecer este valor le dice al navegador que cuando necesita cargar la misma URL en cualquier momento durante el próximo año (31,536,000 segundos; el valor máximo admitido), puede usar inmediatamente el valor de la HTTP Cache sin tener que hacer otra solicitud de red para tu servidor web en lo absoluto. Eso es genial: ¡inmediatamente ganaste la confiabilidad y la velocidad que se obtienen al evitar la red!

Las herramientas de compilación como el webpack pueden [automatizar el proceso](https://webpack.js.org/guides/caching/#output-filenames) de asignación de huellas digitales hash a las URL de tus archivos.

{% Aside %} También puedes agregar la [propiedad de `immutable`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cache-Control#Revalidation_and_reloading) a tu `Cache-Control` como una optimización adicional, aunque se [ignorará](https://www.keycdn.com/blog/cache-control-immutable#browser-support) en algunos navegadores. {% endAside %}

### Revalidación del servidor para URL sin versión {: #unversioned-urls }

Desafortunadamente, no todas las URL que cargas están versionadas. Tal vez no puedas incluir un paso de compilación antes de implementar tu aplicación web, por lo que no puedes agregar hash a las URL de tus archivos. Y cada aplicación web necesita archivos HTML; esos archivos (¡casi!) nunca incluirán información de versiones, ya que nadie se molestará en usar tu aplicación web si necesita recordar que la URL para visitar es `https://example.com/index.34def12.html`. Entonces, ¿qué puedes hacer por esas URL?

Este es un escenario en el que debes admitir la derrota. El almacenamiento de HTTP Cache por sí solo no es lo suficientemente potente como para evitar la red por completo. (No te preocupes, ya que pronto aprenderás acerca de los [service workers](/service-workers-cache-storage/), que brindarán la ayuda que necesitamos para que la batalla se vuelva a tu favor). Pero hay algunos pasos que puedes seguir para asegurarte de que las solicitudes de red sean tan rápidas y eficiente como sean posibles.

Los siguientes valores de `Cache-Control` pueden ayudarte a ajustar dónde y cómo se almacenan en caché las URL sin versión:

- `no-cache`. Esto le indica al navegador que debe volver a validar con el servidor cada vez antes de usar una versión en caché de la URL.
- `no-store`. Esto indica al navegador y otras cachés intermedias (como los CDN) que nunca almacenen ninguna versión del archivo.
- `private`. Los navegadores pueden almacenar en caché el archivo, pero las cachés intermedias no.
- `public`. La respuesta se puede almacenar en cualquier caché.

Consulta el [Apéndice: Diagrama de flujo del `Cache-Control`](#flowchart) para visualizar el proceso de decisión de qué valor o valores de `Cache-Control` se deben de usar. Ten en cuenta también que `Cache-Control` puede aceptar una lista de directivas separadas por comas. Consulta el <a href="#examples" data-md-type="link">Apéndice: ejemplos de `Cache-Control`</a>.

Junto con eso, configurar una de los dos cabeceras de respuestas adicionales también puede ayudar: tanto como [`ETag`](https://developer.mozilla.org/docs/Web/HTTP/Headers/ETag) o como [`Last-Modified`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Last-Modified). Como se menciona en las [cabeceras de respuesta](#response-headers), `ETag` y `Last-Modified` ambos tienen el mismo propósito: determinar si el navegador necesita volver a descargar un archivo en caché que ha expirado. `ETag` es el más recomendado porque es más preciso.

{% Details %} {% DetailsSummary 'h4' %} Ejemplo de ETag {% endDetailsSummary %} Supongamos que han pasado 120 segundos desde la búsqueda inicial y el navegador ha iniciado una nueva consulta para el mismo recurso. Primero, el navegador verifica el HTTP Cache y encuentra la respuesta anterior. Desafortunadamente, el navegador no puede usar la respuesta anterior porque la respuesta ya ha expiró. En este punto, el navegador podría enviar una nueva consulta y obtener la nueva respuesta completa. Sin embargo, eso es ineficiente porque si el recurso no ha cambiado, ¡no hay razón para descargar la misma información que ya está en la caché! Ese es el problema que los tokens de validación, como se especifica en el <code>ETag</code>, están diseñados para resolver. El servidor genera y devuelve un token arbitrario, que suele ser un hash o alguna otra huella digital del contenido del archivo. El navegador no necesita saber cómo se genera la huella digital; solo necesita enviarlo al servidor en la próxima solicitud. Si la huella digital sigue siendo la misma, el recurso no ha cambiado y el navegador puede omitir la descarga. {% endDetails %}

Al configurar `ETag` o `Last-Modified`, terminarás haciendo que la solicitud de revalidación sea mucho más eficiente. Estos terminan activando los[`If-Modified-Since`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-Modified-Since) o [`If-None-Match`](https://developer.mozilla.org/docs/Web/HTTP/Headers/If-None-Match) que se mencionaron en las [cabeceras de solicitud](#request-headers).

Cuando un servidor web configurado correctamente ve esas cabeceras de solicitud entrantes, puedes confirmar si la versión del recurso que el navegador ya tiene en tu HTTP Cache coincide con la última versión en el servidor web. Si hay una coincidencia, el servidor puede responder con una [`304 Not Modified`](https://developer.mozilla.org/docs/Web/HTTP/Status/304), que es el equivalente a "¡Oye, sigue usando lo que ya tienes!". Hay muy pocos datos para transferir al enviar este tipo de respuesta, por lo que generalmente es mucho más rápido que tener que enviar una copia del recurso real que se solicita.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/e2bN6glWoVbWIcwUF1uh.png", alt="Un diagrama de un cliente que solicita un recurso y el servidor responde con una cabecera 304.", width="474", height="215" %} <figcaption> El navegador solicita <code>/file</code> del servidor e incluye el <code>If-None-Match</code> para indicarle al servidor que solo devuelva el archivo completo si la <code>ETag</code> del archivo en el servidor no coincide con el valor de <code>If-None-Match</code> del navegador. En este caso, los 2 valores coincidieron, por lo que el servidor devuelve una <code>304 Not Modified</code> con instrucciones sobre cuánto tiempo más se debe almacenar en <code>Cache-Control: max-age=120</code> ).</figcaption></figure>

## Resumen {: #summary }

El HTTP Cache es una forma eficaz de mejorar el rendimiento de la carga porque reduce las solicitudes de red innecesarias. Es compatible con todos los navegadores y su configuración no requiere de mucho esfuerzo.

Las siguientes configuraciones de `Cache-Control` son un buen comienzo:

- `Cache-Control: no-cache` para recursos que deben ser revalidados con el servidor antes de cada uso.
- `Cache-Control: no-store` para recursos que nunca deberían almacenarse en caché.
- `Cache-Control: max-age=31536000` para recursos versionados.

El `ETag` o `Last-Modified` pueden ayudarte a revalidar los recursos de caché caducados de una manera más eficiente.

{% Aside 'codelab' %} Utiliza el [codelab de HTTP Cache](/codelab-http-cache) para obtener experiencia práctica con `Cache-Control` y `ETag` en Express. {% endAside %}

## Más información {: #learn-more }

Si estás buscando ir más allá de los conceptos básicos del uso del `Cache-Control`, consulta la guía de [prácticas recomendadas de almacenamiento en caché y errores de max-age](https://jakearchibald.com/2016/caching-best-practices/) de Jake Archibald.

Consulta [Amo tu caché](/love-your-cache) para obtener orientación sobre cómo optimizar el uso de tu caché para los visitantes que regresan.

## Apéndice: más sugerencias {: #tips }

Si tienes más tiempo, aquí hay otras formas de optimizar el uso de HTTP Cache:

- Utiliza URL coherentes. Si ofreces el mismo contenido en diferentes URL, ese contenido se buscará y almacenará varias veces.
- Minimiza la deserción. Si las partes de un recurso (como un archivo CSS) se actualizan con frecuencia, mientras que el resto del archivo no (como el código de la biblioteca), considera dividir el código que se actualiza con frecuencia en un archivo separado y utilizar una estrategia de almacenamiento en caché de corta duración para las actualizaciones de código y una estrategia de larga duración de almacenamiento en caché para el código que no cambia con frecuencia.
- Consulta la nueva directiva de [`stale-while-revalidate`](/stale-while-revalidate/) si es que se acepta algún grado de obsolescencia en tu política de `Cache-Control`.

## Apéndice: Diagrama de flujo de `Cache-Control`

{% Img src="image/admin/htXr84PI8YR0lhgLPiqZ.png", alt="Flowchart", width="595", height="600" %}

## Apéndice: `Cache-Control` {: #examples }

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>Valor de <code>Cache-Control</code>
</th>
        <th>Explicación</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>max-age=86400</code></td>
        <td>Los navegadores y las cachés intermedias pueden almacenar la respuesta en caché hasta por 1 día (60 segundos x 60 minutos x 24 horas).</td>
      </tr>
      <tr>
        <td><code>private, max-age=600</code></td>
        <td>El navegador puede almacenar en caché la respuesta (pero no en cachés intermediarios) durante un máximo de 10 minutos (60 segundos x 10 minutos).</td>
      </tr>
      <tr>
        <td><code>public, max-age=31536000</code></td>
        <td>La respuesta se puede almacenar en cualquier caché durante 1 año.</td>
      </tr>
      <tr>
        <td><code>no-store</code></td>
        <td>La respuesta no puede almacenarse en caché y debe obtenerse en su totalidad en cada solicitud.</td>
      </tr>
    </tbody>
  </table>
</div>
