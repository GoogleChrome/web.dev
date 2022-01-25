---
title: Detecta usuarios inactivos con la API de detección de inactividad
subhead: Utiliza la API de detección de inactividad (Idle Detection API) para averiguar cuándo el usuario no está utilizando activamente su dispositivo.
authors:
  - thomassteiner
description: |2-

  La API de detección de inactividad notifica a los desarrolladores cuando un usuario está inactivo, indicando cosas como la falta de

  interacción con el teclado, el mouse, la pantalla, la activación de un protector de pantalla, el bloqueo de la pantalla,

  o el cambio a una pantalla diferente. Un umbral definido por el desarrollador activa la notificación.
date: 2020-05-18
updated: 2021-08-25
tags:
  - blog
  - capabilities
hero: image/admin/FXoKxeVCmPgEStieWKm2.jpg
alt: Computadora abandonada en una cama con la pierna de alguien al lado.
feedback:
  - api
---

## ¿Qué es la API de detección de inactividad? {: #what }

La API de detección de inactividad notifica a los desarrolladores cuando un usuario está inactivo, indicando cosas como falta de interacción con el teclado, el mouse, la pantalla, la activación de un protector de pantalla, el bloqueo de la pantalla o el cambio a una pantalla diferente. Un umbral definido por el desarrollador activa la notificación.

### Casos de uso sugeridos para la API de detección de inactividad {: #use-cases }

Algunos ejemplos de sitios que pueden utilizar esta API son:

- Las aplicaciones de chat o los sitios de redes sociales en línea pueden utilizar esta API para que el usuario sepa si sus contactos están disponibles actualmente.
- Las aplicaciones de kiosco expuestas públicamente, por ejemplo en los museos, pueden usar esta API para volver a la vista "de inicio" si ya nadie interactúa con el kiosco.
- Las aplicaciones que requieren cálculos costosos, por ejemplo, para dibujar gráficos, pueden limitar estos cálculos a momentos en los que el usuario interactúa con su dispositivo.

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
<td data-md-type="table_cell"><a href="https://github.com/wicg/idle-detection/blob/master/README.md" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell"><a href="https://wicg.github.io/idle-detection" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Recopilar comentarios y repetir el diseño</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">En curso</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prueba de origen</td>
<td data-md-type="table_cell">Completado</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. <strong data-md-type="double_emphasis">Iniciar</strong>
</td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">Chromium 94</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Cómo utilizar la API de detección de inactividad {: #use }

### Detección de características

Para comprobar si la API de detección de inactividad es compatible, utiliza:

```javascript
if ('IdleDetector' in window) {
  // Idle Detector API supported
}
```

### Conceptos de la API de detección de inactividad

La API de detección de inactividad asume que existe algún nivel de interacción entre el usuario, el agente de usuario (es decir, el navegador) y el sistema operativo del dispositivo en uso. Esto se representa en dos dimensiones:

- **El estado inactivo del usuario:** `active` o `idle`: el usuario ha interactuado o no con el agente de usuario durante un período de tiempo.
- **El estado inactivo de la pantalla:** `locked` o `unlocked`: el sistema tiene un bloqueo de pantalla activo (como un protector de pantalla) que evita la interacción con el agente de usuario.

Distinguir entre `active` e `idle` requiere heurísticas que pueden diferir entre el usuario, el agente de usuario y el sistema operativo. También debería ser un umbral razonablemente aproximado (consulta [Seguridad y Permisos](#security-and-permissions)).

El modelo intencionadamente no distingue formalmente entre la interacción con un contenido concreto (es decir, la página web en una pestaña que utiliza la API), el agente de usuario en su conjunto o el sistema operativo; esta definición se deja al agente de usuario.

### Uso de la API de detección de inactividad

El primer paso al utilizar la API de detección de inactividad es garantizar que se conceda el permiso de `'idle-detection'` Si no se otorga el permiso, debes solicitarlo a través de `IdleDetector.requestPermission()`. Ten en cuenta que llamar a este método requiere un gesto de usuario.

```js
// Make sure 'idle-detection' permission is granted.
const state = await IdleDetector.requestPermission();
if (state !== 'granted') {
  // Need to request permission first.
  return console.log('Idle detection permission not granted.');
}
```

{% Aside %} Inicialmente, la detección de inactividad estaba detrás del permiso de notificaciones. Aunque muchos, pero no todos, los casos de uso de esta API implican notificaciones, los editores de la especificación de la detección de inactividad han decidido incluirla en un permiso de detección de inactividad dedicado. {% endAside %}

El segundo paso es crear una instancia del `IdleDetector`. El `threshold` mínimo es 60.000 milisegundos (1 minuto). Finalmente puedes iniciar la detección inactiva llamando al `IdleDetector` `start()` IdleDetector. Toma como parámetro un objeto con el `threshold` de inactividad deseado en milisegundos y una `signal` opcional con [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal) para abortar la detección de inactividad.

```js
try {
  const controller = new AbortController();
  const signal = controller.signal;

  const idleDetector = new IdleDetector();
  idleDetector.addEventListener('change', () => {
    const userState = idleDetector.userState;
    const screenState = idleDetector.screenState;
    console.log(`Idle change: ${userState}, ${screenState}.`);
  });

  await idleDetector.start({
    threshold: 60000,
    signal,
  });
  console.log('IdleDetector is active.');
} catch (err) {
  // Deal with initialization errors like permission denied,
  // running outside of top-level frame, etc.
  console.error(err.name, err.message);
}
```

Puedes abortar la detección de inactividad llamando al método [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController) [`abort()`](https://developer.mozilla.org/docs/Web/API/AbortController/abort) de AbortController.

```js
controller.abort();
console.log('IdleDetector is stopped.');
```

### Soporte de DevTools

A partir de Chromium 94, puedes emular eventos inactivos en DevTools sin estar realmente inactivo. En DevTools, abre la pestaña **Sensores** y busca **el estado Emular detector inactivo**. Puedes ver las diversas opciones en el video a continuación.

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/2OEuuTRnBdDoxARFejNN.mp4", controls=true, autoplay=true, loop=true, muted=true, playsinline=true %} <figcaption> Emulación del estado de Idle Detector en DevTools.</figcaption></figure>

### Soporte de Puppeteer

A partir de la versión 5.3.1 de Puppeteer, puedes [emular los distintos estados inactivos](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageemulateidlestateoverrides) para probar mediante programación cómo cambia el comportamiento de tu aplicación web.

### Demo

Puedes ver la API de detección de inactividad en acción con la [demo de Ephemeral Canvas](https://idle-detection.glitch.me/) que borra su contenido después de 60 segundos de inactividad. Podrías imaginarte esto desplegado en unos grandes almacenes para que los niños garabateen en ellos.

{% Img src="image/admin/n0ysuaHUCcrRRf4b7pU0.png", alt="Ephemeral Canvas demo", width="800", height="953" %}

### Polyfilling

Algunos aspectos de la API de detección de inactividad son polyfillable y existen bibliotecas de detección de inactividad como [idle.ts](https://github.com/dropbox/idle.ts), pero estos enfoques están restringidos al área de contenido de una aplicación web: la biblioteca que se ejecuta en el contexto de la aplicación web debe realizar un sondeo costoso para eventos de entrada o escuchar los cambios de visibilidad. Además, las bibliotecas no pueden saber cuándo un usuario está inactivo fuera de su área de contenido (por ejemplo, cuando un usuario está en una pestaña diferente o ha cerrado la sesión de su computadora).

## Seguridad y permisos {: #security-and-permissions }

El equipo de Chrome ha diseñado e implementado la API de detección de inactividad utilizando los principios básicos definidos en [Control del acceso a las funciones de la plataforma web de gran alcance](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), incluido el control del usuario, la transparencia y la ergonomía. La capacidad de utilizar esta API está controlada por el [permiso de `'idle-detection'`](https://w3c.github.io/permissions/#permission-registry). Para utilizar la API, una aplicación también debe ejecutarse en un [contexto seguro de nivel superior](https://www.w3.org/TR/secure-contexts/#examples-top-level).

### Control de usuario y privacidad

Siempre queremos evitar que los actores malintencionados hagan un mal uso de las nuevas APIs. Los sitios web aparentemente independientes, pero que de hecho están controlados por la misma entidad, pueden obtener información inactiva del usuario y correlacionar los datos para identificar usuarios únicos en todos los orígenes. Para mitigar este tipo de ataques, la API de detección de inactividad limita la granularidad de los eventos inactivos informados.

## Comentarios {: #feedback }

El equipo de Chrome desea conocer tus experiencias con la API de detección de inactividad.

### Contanos sobre el diseño de la API

¿Hay algo en la API que no funciona como esperabas? ¿O faltan métodos o propiedades que necesitas para implementar tu idea? ¿Tienes alguna pregunta o comentario sobre el modelo de seguridad? Presenta un problema de especificación en el [repositorio de GitHub](https://github.com/samuelgoto/idle-detection/issues) correspondiente o agrega tus ideas a un tema ya existente.

### Informar un problema con la implementación

¿Encontraste un error con la implementación de Chrome? ¿O la implementación es diferente de la especificación? Presenta un error en [new.crbug.com](https://new.crbug.com). Asegúrate de incluir todos los detalles que puedas, instrucciones simples para reproducir e ingresa `Blink>Input` en el cuadro **Componentes.** [Glitch](https://glitch.com/) funciona muy bien para compartir repros rápidos y fáciles.

### Demuestra tu apoyo a la API

¿Estás pensando en utilizar la API de detección de inactividad? Su soporte público ayuda al equipo de Chrome a priorizar las funciones y muestra a otros proveedores de navegadores lo importante que es brindarles soporte.

- Comparte cómo planeas usarlo en el [hilo del discurso de WICG](https://discourse.wicg.io/t/idle-detection-api/2959).
- Envía un tweet a [@ChromiumDev](https://twitter.com/ChromiumDev) usando el hashtag [`#IdleDetection`](https://twitter.com/search?q=%23IdleDetection&src=typed_query&f=live) y haznos saber dónde y cómo lo estás usando.

## Enlaces útiles {: #helpful }

- [Explicador público](https://github.com/wicg/idle-detection/blob/master/README.md)
- [Proyecto de especificación](https://wicg.github.io/idle-detection)
- [Demo de la API de detección de inactividad](https://idle-detection.glitch.me/) | [Fuente de demo de la API de detección inactiva](https://glitch.com/edit/#!/idle-detection)
- [Error de seguimiento](https://crbug.com/878979)
- [Entrada de ChromeStatus.com](https://chromestatus.com/feature/4590256452009984)
- Componente intermitente: [`Blink>Input`](https://chromestatus.com/features#component%3ABlink%3EInput)

## Agradecimientos

[Sam Goto](https://twitter.com/samuelgoto) implementó la API de detección de inactividad. [Maksim Sadym](https://www.linkedin.com/in/sadym/) agregó la compatibilidad con DevTools. Gracias a [Joe Medley](https://github.com/jpmedley), [Kayce Basques](https://github.com/kaycebasques) y [Reilly Grant](https://github.com/reillyeon) por sus reseñas de este artículo. La imagen heroica es de [Fernando Hernandez](https://unsplash.com/@_ferh97) en [Unsplash](https://unsplash.com/photos/8Facxtxqojc).
