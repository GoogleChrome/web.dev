---
layout: post
title: Almacenamiento en caché del service worker y almacenamiento en caché HTTP
subhead: Las ventajas y las desventajas de utilizar una lógica de caducidad diferente o coherente en todo el caché del service worker y en las capas de caché HTTP.
authors:
  - jonchen
date: 2020-07-17
description: Las ventajas y las desventajas de utilizar una lógica de caducidad diferente o coherente en todo el caché del service worker y en las capas de caché HTTP.
tags:
  - blog
  - network
  - service-worker
  - offline
---

Si bien los service workers y las aplicaciones web progresivas (PWA) se están convirtiendo en estándares de las aplicaciones web modernas, el almacenamiento en caché de recursos se ha vuelto más complejo que nunca. Este artículo cubre el panorama general del almacenamiento en caché del navegador, el cual incluye:

- Los casos de uso y las diferencias entre el almacenamiento en caché del service worker y el almacenamiento en caché HTTP.
- Las ventajas y desventajas de las diferentes estrategias de caducidad del almacenamiento en caché de los service workers en comparación con las estrategias habituales de almacenamiento en caché de HTTP.

## Descripción general del flujo de almacenamiento en caché

En un nivel alto, un navegador sigue el orden de almacenamiento en caché a continuación cuando solicita un recurso:

1. **Caché del service worker**: El service worker comprueba si el recurso está en su caché y decide si devolver el recurso en sí en función de sus estrategias de almacenamiento en caché programadas. Ten en cuenta que esto no sucede automáticamente. Debes de crear un controlador de eventos de recuperación en tu service worker e interceptar las solicitudes de red para que las solicitudes se atiendan desde la caché del service worker en lugar de la red.
2. **Caché HTTP (también conocido como caché del navegador)**: Si el recurso se encuentra en el [caché HTTP](/http-cache) y aún no ha caducado, el navegador utiliza automáticamente el recurso del caché HTTP.
3. **Lado del servidor:** Si no se encuentra nada en la caché del service worker o en la caché HTTP, el navegador va a la red para solicitar el recurso. Si el recurso no está almacenado en caché en una Red de entrega de contenidos (CDN), la solicitud debe volver al servidor de origen.

{% Img src="image/admin/vtKWC9Bg9dAMzoFKTeAM.png", alt="Flujo de almacenamiento en caché", width="800", height="585" %}

{% Aside %} Ten en cuenta que algunos navegadores como Chrome tienen una capa de **caché de memoria** por frente al caché del service worker. Los detalles de la memoria caché dependen de la implementación de cada navegador. Desafortunadamente, todavía no hay una especificación clara para esta parte. {% endAside %}

## Capas de almacenamiento del caché

### Almacenamiento en caché del service worker

Un service worker intercepta consultas HTTP de tipo red y utiliza una [estrategia de almacenamiento](/offline-cookbook/#serving-suggestions) en caché para determinar qué recursos deben devolverse al navegador. La caché del service worker y la caché HTTP tienen el mismo propósito general, pero la caché del service worker ofrece más capacidades de almacenamiento en caché, como un control detallado sobre exactamente lo que se almacena en caché y cómo se realiza el almacenamiento en caché.

#### Controlar la caché del service worker

Un service worker intercepta solicitudes HTTP con [oyentes de eventos](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19) (generalmente utilizando el evento de `fetch`). Este [fragmento de código](https://github.com/mdn/sw-test/blob/gh-pages/sw.js#L19) demuestra la lógica de una estrategia de almacenamiento en caché con el nombre de [Cache-First](https://developer.chrome.com/docs/workbox/modules/workbox-strategies/#cache-first-cache-falling-back-to-network).

{% Img src="image/admin/INLfnhEpmL4KpMmFXnTL.png", alt="Un diagrama que muestra cómo los service worker interceptan las consultas HTTP", width="800", height="516" %}

Es muy recomendable utilizar [Workbox](https://developer.chrome.com/docs/workbox/) para evitar reinventar la rueda. Por ejemplo, puedes [registrar rutas de URL de recursos con una sola línea de código regex](https://developer.chrome.com/docs/workbox/modules/workbox-routing/#how-to-register-a-regular-expression-route).

```js
import {registerRoute} from 'workbox-routing';

registerRoute(new RegExp('styles/.*\\.css'), callbackHandler);
```

#### Casos de uso y estrategias de almacenamiento en caché de los service worker

La siguiente tabla describe las estrategias comunes de almacenamiento en caché de los service worker y cuándo es útil cada estrategia.

<table>
<thead><tr>
<th><strong>Estrategias</strong></th>
<th><strong>Justificación</strong></th>
<th><strong>Casos de uso</strong></th>
</tr></thead>
<tbody>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-only">Solo red</a></p></strong></td>
<td>El contenido debe estar actualizado en todo momento.</td>
<td><ul>
<li>Pagos</li>
<li>Declaraciones de saldo</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#network-falling-back-to-cache">Red usando al caché como respaldo</a></p></strong></td>
<td>Es preferible servir el contenido más reciente. Sin embargo, si la red falla o es inestable, es aceptable ofrecer contenido con poca antigüedad.</td>
<td><ul>
<li>Datos oportunos</li>
<li>Precios y tarifas (requiere descargos de responsabilidad)</li>
<li>Estados de los pedidos</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="/stale-while-revalidate/">stale-while-revalidate</a></p></strong></td>
<td>Está bien entregar contenido en caché de inmediato, pero el contenido en caché actualizado debe usarse en el futuro.</td>
<td><ul>
<li>Noticias</li>
<li>Páginas de listado de productos</li>
<li>Mensajes</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-then-network">Caché primero, respaldo en la red</a></p></strong></td>
<td>El contenido no es crítico y se puede servir desde la caché para mejorar el rendimiento, pero el service worker debe buscar actualizaciones de vez en cuando.</td>
<td><ul>
<li>Shell de las aplicaciones</li>
<li>Recursos comunes</li>
</ul></td>
</tr>
<tr>
<td><strong><p data-md-type="paragraph"><a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-only">Solo caché</a></p></strong></td>
<td>El contenido rara vez cambia.</td>
<td><ul><li>Contenido estático</li></ul></td>
</tr>
</tbody>
</table>

#### Beneficios adicionales del almacenamiento en caché del service worker

Además del control detallado de la lógica del almacenamiento en caché, el almacenamiento en caché del service worker también proporciona:

- **Más memoria y espacio de almacenamiento para tu origen:** El navegador asigna recursos de caché HTTP por [origen](/same-site-same-origin/#origin). En otras palabras, si tienes varios subdominios, todos comparten la misma caché HTTP. No hay garantía de que el contenido de tu origen y/o dominio permanezca en la caché HTTP durante mucho tiempo. Por ejemplo, un usuario puede purgar manualmente la caché limpiando desde la interfaz de usuario de configuración de un navegador o activando una recarga completa en una página. Con una caché de service worker, tienes una probabilidad mucho mayor de que tu contenido almacenado en caché permanezca en la caché. Consulta [Almacenamiento persistente](/persistent-storage/) para obtener más información.
- **Mayor flexibilidad con redes inestables o experiencias fuera de línea:** Con la caché HTTP solo tienes una opción binaria: el recurso se almacena en la caché o no. Con el almacenamiento en caché del service worker puedes mitigar los pequeños "contratiempos" de una manera más sencilla (con la estrategia de "stale-while-revalidate"), ofrecer una experiencia completa fuera de línea (con la estrategia de "Solo caché") o incluso algo intermedio, como IU personalizadas con partes de la página que provienen de la caché del service worker y algunas partes excluidas (con la estrategia "Establecer controlador de captura") cuando corresponda.

### Almacenamiento en caché HTTP

La primera vez que un navegador carga una página web y recursos relacionados, almacena estos recursos en su caché HTTP. La caché HTTP generalmente se habilita automáticamente por los navegadores, a menos que el usuario final la haya deshabilitado explícitamente.

El uso del almacenamiento en caché HTTP significa confiar en el servidor para determinar cuándo almacenar en caché un recurso y durante cuánto tiempo.

#### Controla la caducidad de la caché HTTP con cabeceras de respuesta HTTP

Cuando un servidor responde a una consulta del navegador de un recurso, el servidor usa las cabeceras de respuesta HTTP para decirle al navegador cuánto tiempo debe almacenar en caché el recurso. Consulta [Cabeceras de respuesta: configura tu servidor web](/http-cache/#response-headers) para obtener más información.

#### Estrategias de almacenamiento en caché HTTP y casos de uso

El almacenamiento en caché HTTP es mucho más simple que el almacenamiento en caché del service worker, porque el almacenamiento en caché HTTP solo se ocupa de la lógica de caducidad de recursos basada en el tiempo (TTL). Consulta [¿Qué valores de cabecera de respuesta debería usar?](/http-cache/#response-header-strategies) y [Resumen](/http-cache/#summary) para obtener más información sobre las estrategias de almacenamiento en caché HTTP.

## Diseñando la lógica de caducidad de tu caché

En esta sección se explican las ventajas y desventajas de utilizar una lógica de caducidad coherente en la caché del service worker y las capas del caché HTTP, así como las ventajas y desventajas de la lógica de caducidad separada en estas capas.

El siguiente error demuestra cómo el almacenamiento en caché del service worker y el almacenamiento en caché HTTP funcionan en acción en diferentes escenarios:

{% Glitch { id: 'compare-sw-and-http-caching', height: 480 } %}

### Lógica de caducidad coherente para todas las capas de caché

Para demostrar las ventajas y desventajas, analizaremos 3 escenarios: a largo, mediano y corto plazo.

<table>
<thead><tr>
<th>Escenarios</th>
<th>Almacenamiento en caché a largo plazo</th>
<th>Almacenamiento en caché a mediano plazo</th>
<th>Almacenamiento en caché a corto plazo</th>
</tr></thead>
<tbody>
<tr>
<td>Estrategia de almacenamiento en caché del service worker</td>
<td>Caché, respaldo en la red</td>
<td>Stale-while-revalidate</td>
<td>Red usando al caché como respaldo</td>
</tr>
<tr>
<td>Tiempo de vida (TTL) de caché de service worker</td>
<td><strong>30 dias</strong></td>
<td><strong>1 día</strong></td>
<td><strong>10 minutos</strong></td>
</tr>
<tr>
<td>Máxima edad del caché HTTP</td>
<td><strong>30 dias</strong></td>
<td><strong>1 día</strong></td>
<td><strong>10 minutos</strong></td>
</tr>
</tbody>
</table>

#### Escenario: Almacenamiento en caché a largo plazo (caché, respaldo en la red)

- Cuando un recurso almacenado en caché es válido (&lt;= 30 días): El service worker devuelve el recurso almacenado en caché inmediatamente sin ir a la red.
- Cuando un recurso almacenado en caché caduca (&gt; 30 días): El service worker va a la red para buscar el recurso. El navegador no tiene una copia del recurso en su caché HTTP, por lo que pasa al lado del servidor para el recurso.

Desventaja: En este escenario, el almacenamiento en caché HTTP proporciona menos valor porque el navegador siempre pasará la solicitud al lado del servidor cuando la caché del service worker expire.

#### Escenario: Almacenamiento en caché a mediano plazo (Stale-while-revalidate)

- Cuando un recurso almacenado en caché es válido (&lt;= 1 día): El service worker devuelve el recurso almacenado en caché inmediatamente y va a la red para buscar el recurso. El navegador tiene una copia del recurso en su caché HTTP, por lo que devuelve esa copia al service worker.
- Cuando un recurso almacenado en caché caduca (&gt; 1 día): El service worker devuelve el recurso almacenado en caché inmediatamente y va a la red para buscar el recurso. El navegador no tiene una copia del recurso en su caché HTTP, por lo que va del lado del servidor para buscar el recurso.

Desventaja: El service worker requiere una eliminación de caché adicional para anular la caché HTTP con el fin de aprovechar al máximo el paso de "revalidate (revalidación)".

#### Escenario: Almacenamiento en caché a corto plazo (la red recurre a la caché)

- Cuando un recurso almacenado en caché es válido (&lt;= 10 minutos): El service worker va a la red para buscar el recurso. El navegador tiene una copia del recurso en su caché HTTP, por lo que se lo devuelve al service worker sin pasar al lado del servidor.
- Cuando un recurso en caché caduca (&gt; 10 minutos): El service worker devuelve el recurso en caché inmediatamente y va a la red para buscar el recurso. El navegador no tiene una copia del recurso en su caché HTTP, por lo que va del lado del servidor para buscar el recurso.

Desventaja: Similar al escenario de almacenamiento en caché a mediano plazo, el service worker requiere una lógica adicional de eliminación de caché para anular la caché HTTP con el fin de obtener el último recurso del lado del servidor.

#### Service worker en todos los escenarios

En todos los escenarios, la caché del service worker aún puede devolver recursos almacenados en caché cuando la red es inestable. Por otro lado, la caché HTTP no es confiable cuando la red es inestable o inactiva.

### Diferente lógica de caducidad de caché en la caché del service worker y las capas HTTP

Para demostrar las ventajas y desventajas, analizaremos 3 escenarios: a largo, mediano y corto plazo.

<table>
<thead><tr>
<th>Escenarios</th>
<th>Almacenamiento en caché a largo plazo</th>
<th>Almacenamiento en caché a mediano plazo</th>
<th>Almacenamiento en caché a corto plazo</th>
</tr></thead>
<tbody>
<tr>
<td>Estrategia de almacenamiento en caché del service worker</td>
<td>Caché, respaldo en la red</td>
<td>Stale-while-revalidate</td>
<td>Red usando al caché como respaldo</td>
</tr>
<tr>
<td>Tiempo de vida (TTL) de caché de service worker</td>
<td><strong>90 dias</strong></td>
<td><strong>30 dias</strong></td>
<td><strong>1 día</strong></td>
</tr>
<tr>
<td>Máxima edad del caché HTTP</td>
<td><strong>30 dias</strong></td>
<td><strong>1 día</strong></td>
<td><strong>10 minutos</strong></td>
</tr>
</tbody>
</table>

#### Escenario: Almacenamiento en caché a largo plazo (caché, respaldo en la red)

- Cuando un recurso almacenado en caché es válido en el caché del service worker (&lt;= 90 días): El service worker devuelve el recurso almacenado en caché inmediatamente.
- Cuando un recurso almacenado en caché caduca en el caché del service worker (&gt; 90 días): El service worker va a la red para buscar el recurso. El navegador no tiene una copia del recurso en su caché HTTP, por lo que pasa al lado del servidor.

Ventajas y desventajas:

- Ventaja: Los usuarios experimentan una respuesta instantánea ya que el service worker devuelve los recursos almacenados en caché de manera inmediata.
- Ventaja: El service worker tiene un control más detallado de cuándo usar su caché y cuándo solicitar nuevas versiones de recursos.
- Desventaja: Se requiere una estrategia de almacenamiento en el caché del service worker bien definida.

#### Escenario: Almacenamiento en caché a mediano plazo (Stale-while-revalidate)

- Cuando un recurso almacenado en caché es válido en el caché del service worker (&lt;= 30 días): El service worker devuelve el recurso almacenado en caché inmediatamente.
- Cuando un recurso almacenado en caché caduca en el caché del service worker (&gt; 30 días): El service worker va a la red en busca del recurso. El navegador no tiene una copia del recurso en su caché HTTP, por lo que pasa al lado del servidor.

Ventajas y desventajas:

- Ventaja: Los usuarios experimentan una respuesta instantánea ya que el service worker devuelve los recursos almacenados en caché de inmediato.
- Ventaja: El service worker puede asegurarse de que la **próxima** solicitud para una URL determinada utilice una respuesta nueva de la red, gracias a la revalidación que ocurre "en segundo plano".
- Desventaja: Se requiere una estrategia de almacenamiento en el caché del service worker bien definida.

#### Escenario: Almacenamiento en caché a corto plazo (Respaldo en la red)

- Cuando un recurso almacenado en caché es válido en la memoria caché del service worker (&lt;= 1 día): El service worker va a la red en busca del recurso. El navegador devuelve el recurso de la caché HTTP si está allí. Si la red no funciona, el service worker devuelve el recurso de la caché del service worker.
- Cuando un recurso almacenado en caché caduca en el caché del service worker (&gt; 1 día): El service worker va a la red para buscar el recurso. El navegador recupera los recursos a través de la red cuando la versión almacenada en caché en su caché HTTP ha caducado.

Ventajas y desventajas:

- Ventaja: Cuando la red es inestable o inactiva, el service worker devuelve los recursos almacenados en caché de manera inmediata.
- Desventaja: El service worker requiere una eliminación de caché adicional para anular la caché HTTP y realizar consultas de "Network first (Primero en la red)".

## Conclusión

Dada la complejidad de la combinación de escenarios de almacenamiento en caché, no es posible diseñar una regla que cubra todos los casos. Sin embargo, según los resultados de las secciones anteriores, hay algunas sugerencias para tener en cuenta al diseñar tus estrategias de caché:

- La lógica de almacenamiento en caché del service worker no necesita ser coherente con la lógica de caducidad del almacenamiento en caché HTTP. Si es posible, utiliza una lógica de caducidad más larga en el service worker para otorgarle más control al mismo.
- El almacenamiento en caché HTTP todavía juega un papel importante, pero no es confiable cuando la red está inestable o inactiva.
- Revisa tus estrategias de almacenamiento en caché para cada recurso para asegurarte de que la estrategia de almacenamiento en caché de tu service worker proporciona su valor, sin entrar en conflicto con la caché HTTP.

## Aprende más

- [Confiabilidad de la red](/reliable/)
- [Evitar consultas de red innecesarias con HTTP Cache](/http-cache)
- [Codelab de caché HTTP](/codelab-http-cache/)
- [Medir el impacto en el desempeño de los service workers en el mundo real](https://developers.google.com/web/showcase/2016/service-worker-perf)
- [Cache-Control contra Expires](https://stackoverflow.com/questions/5799906/what-s-the-difference-between-expires-and-cache-control-headers)
