---
title: Distintivos para los iconos de aplicaciones
subhead: La API de identificación de aplicaciones permite que las aplicaciones web instaladas establezcan un distintivo para toda la aplicación en el icono de la misma.
authors:
  - petelepage
description: La API de identificación de aplicaciones (App Badging API) permite a las aplicaciones web instaladas establecer un distintivo para toda la aplicación, que se muestra en un lugar específico del sistema operativo asociado a la misma, como la estantería o la pantalla de inicio. Los distintivos facilitan la notificación sutil al usuario de que hay alguna actividad nueva que podría requerir su atención, o se pueden usar para indicar una pequeña cantidad de información, como un recuento de mensajes no leídos.
date: 2018-12-11
updated: 2021-02-23
tags:
  - blog
  - capabilities
  - progressive-web-apps
  # - badging
  - notifications
hero: image/admin/AFvb0uBtN7ZX9qToptEo.jpg
alt: Letrero de neón con un corazón y un cero.
feedback:
  - api
---

## ¿Qué es la API de identificación de aplicaciones? {: #what }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/t7XqI06whZr4oJe0yawc.jpg", alt="Example of Twitter with eight notifications and another app showing a flag type badge.", width="600", height="189" %} <figcaption> Ejemplo de Twitter con ocho notificaciones y otra aplicación que muestra una bandera como distintivo.</figcaption></figure>

La API de identificación de aplicaciones permite que las aplicaciones web instaladas establezcan un distintivo para toda la aplicación, que se muestra en un lugar específico del sistema operativo asociado con la misma (como la estantería o la pantalla de inicio).

Los distintivos facilitan la notificación sutil al usuario de que hay una nueva actividad que podría requerir su atención o para indicar una pequeña cantidad de información, como un recuento de mensajes no leídos.

Los distintivos tienden a ser más fáciles de usar que las notificaciones y se pueden actualizar con una frecuencia mucho mayor, ya que no interrumpen al usuario. Y, por ese mismo motivo, no necesitan su permiso.

### Casos de uso posibles {: #use-cases }

Algunos ejemplos de sitios que pueden utilizar esta API son:

- Aplicaciones de chat, correo electrónico y redes sociales, para indicar que han llegado nuevos mensajes o para mostrar la cantidad de elementos no leídos.
- Aplicaciones de productividad, para indicar que se ha completado una tarea en segundo plano de larga duración (como la representación de una imagen o un video).
- Juegos, para señalar que se requiere una acción del jugador (por ejemplo, en el ajedrez, cuando es el turno del jugador).

## Estado actual {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Paso</th>
<th data-md-type="table_cell">Estado</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crea un explicador</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/badging/blob/master/explainer.md" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/badging/" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Recoger comentarios y repetir el diseño</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prueba de origen</td>
<td data-md-type="table_cell">Completo</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. Iniciar</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">Completo</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

La API de identificación de aplicaciones funciona en Windows y macOS, en Chrome 81 o posterior. También se ha confirmado que funciona en Edge 84 o posterior. La compatibilidad con ChromeOS está en desarrollo y estará disponible en una versión futura de Chrome. En Android, la API no es compatible. En cambio, este sistema operativo muestra automáticamente un distintivo en el icono de la aplicación web instalada cuando hay una notificación no leída, al igual que para las aplicaciones de Android.

## Pruébalo

1. Con Chrome 81 o posterior en Windows o Mac, abre la [demo de la API de identificación de aplicaciones](https://badging-api.glitch.me/).
2. Cuando se te solicite, haz clic en **Instalar** para instalar la aplicación o usa el menú de Chrome para proceder con la instalación.
3. Ábrela como una PWA instalada. Ten en cuenta que debe ejecutarse como una PWA instalada (en la barra de tareas o en el dock).
4. Haz clic en el botón **Establecer** o **Borrar** para configurar o borrar el distintivo del icono de la aplicación. También puedes proporcionar un número para el *valor del Distintivo*.

## Cómo utilizar la API de identificación de aplicaciones {: #use }

Para utilizar la API de identificación de aplicaciones, tu aplicación web debe cumplir con [los criterios de instalación de Chrome](/install-criteria/#criteria) y los usuarios deben agregarla a sus pantallas de inicio.

La API consta de dos métodos en el `navigator`:

- `setAppBadge(` *`number`* `)`: establece el distintivo de la aplicación. Si se proporciona un valor, establece el distintivo en el valor proporcionado; de lo contrario, muestra un punto blanco simple (u otra bandera según la plataforma). Establecer el *`number`* en `0` es lo mismo que llamar a `clearAppBadge()`.
- `clearAppBadge()`: elimina el distintivo de la aplicación.

Ambos devuelven promesas vacías que puedes utilizar para el manejo de errores.

El distintivo se puede configurar desde la página actual o desde el trabajador de servicio registrado. Para configurar o borrar el distintivo (ya sea en la página en primer plano o en el trabajador de servicio), llama a:

```js
// Set the badge
const unreadCount = 24;
navigator.setAppBadge(unreadCount).catch((error) => {
  //Do something with the error.
});

// Clear the badge
navigator.clearAppBadge().catch((error) => {
  // Do something with the error.
});
```

En algunos casos, es posible que el sistema operativo no permita la representación exacta del distintivo. En tales casos, el navegador intentará proporcionar la mejor representación para ese dispositivo. Por ejemplo, debido a que la API de identificación de aplicaciónes no es compatible con Android, éste solo muestra un punto en lugar de un valor numérico.

No asumas nada sobre cómo el agente de usuario muestra el distintivo. Algunos de ellos pueden tomar un número como "4000" y reescribirlo como "99+". Si saturas el distintivo tu mismo (por ejemplo, configurándola en "99"), el "+" no aparecerá. No importa el número real, simplemente llama a `setAppBadge(unreadCount)` y deja que el agente de usuario se encargue de mostrarlo como corresponde.

Si bien la API de identificación de aplicaciones *en Chrome* requiere una aplicación instalada, no debes realizar llamadas a la API de identificación en función del estado de instalación. Simplemente llama a la API cuando exista, ya que otros navegadores pueden mostrar el distintivo en otros lugares. Si funciona, funciona. Si no es así, simplemente no lo hace.

## Configurar y borrar el distintivo en segundo plano de un trabajador de servicio

También puedes establecer el distintivo de la aplicación en segundo plano utilizando el trabajador de servicios, lo que permite que se actualicen incluso cuando la aplicación no está abierta. Hazlo a través de la API Push, la sincronización periódica en segundo plano o una combinación de ambas.

### Sincronización periódica en segundo plano

[La sincronización periódica en segundo plano](/periodic-background-sync/) permite a un trabajador de servicio sondear periódicamente el servidor, que podría usarse para obtener un estado actualizado, y llamar a `navigator.setAppBadge()`.

Sin embargo, la frecuencia con la que se llama a la sincronización no es perfectamente fiable y se llama a discreción del navegador.

### API Web Push

La [API Push](https://www.w3.org/TR/push-api/) permite a los servidores enviar mensajes a los trabajadores de servicio, que pueden ejecutar código JavaScript incluso cuando no se está ejecutando ninguna página en primer plano. Por lo tanto, un servidor push podría actualizar el distintivo llamando a `navigator.setAppBadge()`.

Sin embargo, la mayoría de los navegadores, incluido Chrome, requieren que se muestre una notificación cada vez que se recibe un mensaje push. Esto está bien para algunos casos de uso (por ejemplo, mostrar una notificación al actualizar el distintivo) pero hace que sea imposible actualizar sutilmente el distintivo sin mostrar una notificación.

Además, los usuarios deben otorgar el permiso de notificación de su sitio para recibir mensajes push.

### Una combinación de ambos

Si bien no es perfecto, el uso de la API Push y la sincronización periódica en segundo plano brindan una buena solución. La información de alta prioridad se entrega a través de API Push, mostrando una notificación y actualizando el distintivo. Y la información de menor prioridad se entrega actualizando el distintivo, ya sea cuando la página está abierta o mediante una sincronización periódica en segundo plano.

### En el futuro

El equipo de Chrome está investigando formas de [actualizar de manera más confiable el distintivo de la aplicación en segundo plano](https://github.com/w3c/badging/blob/master/explainer.md#background-updates) y quiere saber tu opinión. Házles saber qué funciona mejor para tu caso de uso comentando sobre el tema [Actualizaciones en segundo plano de las notificaciones](https://github.com/w3c/badging/issues/28).

## Comentarios {: #feedback }

El equipo de Chrome desea conocer tus experiencias con la API de identificación de aplicaciones.

### Contanos sobre el diseño de la API

¿Hay algo en la API que no funciona como esperabas? ¿O faltan métodos o propiedades que necesitas para implementar tu idea? ¿Tienes alguna pregunta o comentario sobre el modelo de seguridad?

- Presenta un problema de especificación en el [repositorio de GitHub de la API de identificación de aplicaciones](https://github.com/WICG/badging/issues) o agrega tus ideas a un tema ya existente.

### Informar un problema con la implementación

¿Encontraste un error con la implementación de Chrome? ¿O la implementación es diferente de la especificación?

- Presenta el error en [https://new.crbug.com](https://new.crbug.com). Asegúrate de incluir todos los detalles que puedas, instrucciones simples para reproducir y configura **Componentes** en `UI>Browser>WebAppInstalls`. [Glitch](https://glitch.com) funciona muy bien para compartir reproducciones rápidas y fáciles.

### Demuestra tu apoyo a la API

¿Planeas utilizar la API de identificación de aplicaciones en tu sitio? Su soporte público ayuda al equipo de Chrome a priorizar funciones y muestra a otros proveedores de navegadores lo importante que es brindarles soporte.

- Envía un tweet a [@ChromiumDev](https://twitter.com/chromiumdev) usando el hashtag [`#BadgingAPI`](https://twitter.com/search?q=%23BadgingAPI&src=typed_query&f=live) y háznos saber dónde y cómo lo estás usando.

## Enlaces útiles {: #helpful }

- [Explicador público](https://github.com/WICG/badging/blob/master/explainer.md)
- [Demo de la API de identificación de aplicaciones](https://badging-api.glitch.me/) | [Fuente de demo de la API de identificación de aplicaciones](https://glitch.com/edit/#!/badging-api?path=demo.js)
- [Error de seguimiento](https://bugs.chromium.org/p/chromium/issues/detail?id=719176)
- [Entrada de ChromeStatus.com](https://www.chromestatus.com/feature/6068482055602176)
- Componente Blink: `UI>Browser>WebAppInstalls`

[Foto de](https://unsplash.com/photos/xv7-GlvBLFw) héroe de [Prateek](https://unsplash.com/@prateekkatyal) [Katyal](https://unsplash.com/) en Unsplash
