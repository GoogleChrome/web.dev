---
title: Activadores de notificaciones
subhead: Los activadores de notificaciones le permiten programar las notificaciones locales que no requieren una conexión de red, lo que los hace ideales para casos de uso como aplicaciones de calendario.
authors:
  - thomassteiner
description: |-
  La API de activadores de notificaciones permite que los desarrolladores programen las notificaciones locales que no requieren
  una conexión de red, lo que los hace ideales para casos de uso como aplicaciones de calendario.
date: 2019-10-24
updated: 2021-12-03
hero: image/admin/6ZuVN2HFiIqTVrmjN5XC.jpg
hero_position: center
tags:
  - blog
  - capabilities
feedback:
  - api
---

{% Aside 'warning' %} Ya no se persigue el desarrollo de la API de activadores de notificaciones, que forma parte del [proyecto de capacidades](https://developer.chrome.com/blog/capabilities/) de Google. El panorama de notificaciones en todos los sistemas operativos se está moviendo con bastante rapidez y no está claro que podamos brindar una experiencia sólida, consistente y confiable en todas las plataformas.

Además de eso, para crear una buena experiencia, debe haber un mecanismo para poder eliminar las notificaciones programadas obsoletas o invalidadas, por ejemplo, eventos de calendario cancelados, sin depender de que la pestaña esté abierta. Hemos escuchado comentarios respecto a que la frecuencia en la que se puede usar la <a href="/periodic-background-sync/">sincronización periódica en segundo plano</a> no es suficiente para esto y que, ya que se requiere mostrar una notificación, la API Push tampoco es una buena solución. {% endAside %}

## ¿Qué son los activadores de notificaciones? {: #what }

Los desarrolladores web pueden mostrar notificaciones mediante la [API de notificaciones web](https://www.w3.org/TR/notifications/). Esta función se utiliza a menudo con la [API Push](https://w3c.github.io/push-api/) para informarle al usuario sobre información urgente, como noticias de última hora o mensajes recibidos. Las notificaciones se muestran al ejecutar JavaScript en el dispositivo del usuario.

El problema con la API Push es que no es confiable para activar notificaciones que *deben* mostrarse cuando se cumple una condición particular, como la hora o la ubicación. Un ejemplo de una *condición basada en el tiempo* es una notificación de calendario que le recuerda una reunión importante con su jefe a las 2 p.m. Un ejemplo de una *condición basada en la ubicación* es una notificación que le recuerda que debe comprar leche cuando ingresa en las cercanías de su supermercado. La conectividad de red o las funciones de conservación de la batería, como el modo de optimización de batería, pueden retrasar la entrega de notificaciones push.

Los activadores de notificaciones resuelven este problema al permitirle programar las notificaciones con su condición de activación por adelantado, de modo que el sistema operativo entregue la notificación en el momento adecuado incluso si no hay conectividad de red o el dispositivo está en modo de ahorro de batería.

{% Aside %} Por ahora, Chrome solo admite *activadores basados en el tiempo*. Es posible que se agreguen activadores adicionales, como los activadores basados en la ubicación, en el futuro según la demanda de los desarrolladores. {% endAside %}

### Casos de uso {: #use-cases }

Las aplicaciones de calendario pueden utilizar activadores de notificación basados en el tiempo para recordarle a un usuario las próximas reuniones. El esquema de notificación predeterminado para una aplicación de calendario podría ser mostrar una primera notificación una hora antes de una reunión y luego otra notificación más urgente cinco minutos antes.

Un canal de televisión puede recordarles a los usuarios que su programa de televisión favorito está a punto de comenzar o que está a punto de comenzar una transmisión en vivo de una conferencia.

Los sitios de conversión de zona horaria pueden utilizar activadores de notificación basados en el tiempo para permitir que sus usuarios programen alarmas para conferencias telefónicas o videollamadas.

## Estado actual {: #status }

Paso | Estado
--- | ---
1. Crea un explicador | [Completo](https://github.com/beverloo/notification-triggers/blob/master/README.md)
2. Crear el borrador inicial de especificación | Sin empezar
3. **Recopilar comentarios y repetir el diseño.** | **[En curso](#feedback)**
4. Prueba de origen | Completa
5. Lanzamiento | Sin empezar

## Cómo usar los activadores de notificaciones {: #use }

### Habilitación a través de about://flags

Para experimentar con la API de activadores de notificaciones localmente, sin un token de prueba de origen, habilite la marca `#enable-experimental-web-platform-features` en `about://flags`.

{% Aside %} Dos pruebas de origen anteriores para la función, que les dieron a los desarrolladores la oportunidad de probar la API propuesta, se ejecutaron desde Chrome 80 al 83 y desde Chrome 86 al 88. Puede leer el resumen de los [comentarios obtenidos](https://docs.google.com/document/d/1Nl1emEqxjTzPLNIAPiS26Vtq3mBdNyCxfMY6QwaD45s/edit) hasta ahora. {% endAside %}

### Detección de características

Puede averiguar si el navegador es compatible con los activadores de notificaciones si comprueba la existencia de la propiedad `showTrigger`:

```js
if ('showTrigger' in Notification.prototype) {
  /* Se admiten los activadores de notificación */
}
```

### Programar una notificación

Programar una notificación es similar a mostrar una notificación push regular, excepto que debe pasar una propiedad de condición `showTrigger` con un objeto `TimestampTrigger` como valor para el objeto de `options` de la notificación.

```js/5
const createScheduledNotification = async (tag, title, timestamp) => {
  const registration = await navigator.serviceWorker.getRegistration();
  registration.showNotification(title, {
    tag: tag,
    body: 'Esta notificación se programó hace 30 segundos',
    showTrigger: new TimestampTrigger(timestamp + 30 * 1000),
  });
};
```

{% Aside %} En equipos de escritorio, las notificaciones se activan solo si Chrome se está ejecutando. En Android, se activan independientemente. {% endAside %}

### Cancelar una notificación programada

Para cancelar las notificaciones programadas, primero solicite una lista de todas las notificaciones que coincidan con una determinada etiqueta mediante `ServiceWorkerRegistration.getNotifications()`. Tenga en cuenta que debe pasar la marca `includeTriggered` para que las notificaciones programadas se incluyan en la lista:

```js/4
const cancelScheduledNotification = async (tag) => {
  const registration = await navigator.serviceWorker.getRegistration();
  const notifications = await registration.getNotifications({
    tag: tag,
    includeTriggered: true,
  });
  notifications.forEach((notification) => notification.close());
};
```

### Depuración

Puede utilizar el [panel de notificaciones de Chrome DevTools](https://developers.google.com/web/updates/2019/07/devtools#backgroundservices) para depurar las notificaciones. Para iniciar la depuración, presione **Iniciar grabación de eventos** {% Img src="image/admin/vf1pad201b4NM9WjgNQh.png", alt="Iniciar grabación de eventos", width="24", height="24" %} o <kbd>Control</kbd> + <kbd>E</kbd> (<kbd>Comando</kbd> + <kbd>E</kbd> en Mac). Chrome DevTools registra todos los eventos de notificación, incluidas las notificaciones programadas, mostradas y cerradas, durante tres días, incluso cuando DevTools esté cerrado.

<figure data-size="full">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Fcyc3iFPdNexgqh1peA8.png", alt="Se registró un evento de notificación programado en el panel de notificaciones de Chrome DevTools, que se encuentra en el panel de aplicaciones.", width="800", height="247" %}<figcaption>Una notificación programada.</figcaption></figure>

<figure data-size="full">% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7Sj2NxYKbSXv4P894aLh.png", alt=""Se registró un evento de notificación mostrado en el panel de notificaciones de Chrome DevTools.", width="800", height="247" %} <figcaption> Una notificación mostrada.</figcaption></figure>

### Demostración

Puede ver los activadores de notificaciones en acción en la [demostración](https://notification-triggers.glitch.me/), que le permite programar notificaciones, enumerar las notificaciones programadas y cancelarlas. El código fuente está disponible en [Glitch](https://glitch.com/edit/#!/notification-triggers).

<figure data-size="full">{% Img src="image/admin/WVlem3Tf2GEEFwNVA2L1.png", alt="Una captura de pantalla de la aplicación web de demostración de activadores de notificaciones.", width="800", height="525" %} <figcaption> <a href="https://notification-triggers.glitch.me/">Demostración</a> de los activadores de notificaciones.</figcaption></figure>

## Seguridad y permisos

El equipo de Chrome ha diseñado e implementado la API de activadores de notificaciones mediante los principios básicos definidos en [Control del acceso a las funciones potentes de la plataforma web](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), incluido el control del usuario, la transparencia y la ergonomía. Debido a que esta API requiere service workers, también requiere un contexto seguro. El uso de la API requiere el mismo permiso que las notificaciones push habituales.

### Control de usuario

Esta API solo está disponible en el contexto de un parámetro `ServiceWorkerRegistration`. Esto implica que todos los datos requeridos se almacenan en el mismo contexto y se eliminan automáticamente cuando se elimina el service worker o cuando el usuario elimina todos los datos del sitio para el origen. El bloqueo de cookies también evita que los service workers se instalen en Chrome y, por lo tanto, evita que se utilice esta API. El usuario siempre puede desactivar las notificaciones para el sitio en la configuración del sitio.

### Transparencia

A diferencia de la API Push, esta API no depende de la red, lo que implica que las notificaciones programadas necesitan todos los datos necesarios de antemano, incluidos los recursos de imagen a los que hacen referencia los atributos `badge`, `icon` e `image`. Esto significa que mostrar una notificación programada no es observable por el desarrollador y no implica despertar al service worker hasta que el usuario interactúe con la notificación. En consecuencia, actualmente no existe una forma conocida para que el desarrollador pueda obtener información sobre el usuario a través de enfoques potencialmente invasores de la privacidad, como la búsqueda por geolocalización de direcciones IP. Este diseño también permite que la función aproveche opcionalmente los mecanismos de programación proporcionados por el sistema operativo, como [`AlarmManager`](https://developer.android.com/reference/android/app/AlarmManager) de Android, que ayuda a ahorrar batería.

## Retroalimentación {: #feedback }

El equipo de Chrome desea conocer sus experiencias con los activadores de notificaciones.

### Cuéntenos sobre el diseño de la API

¿Hay algo en la API que no funciona como esperaba? ¿Faltan métodos o propiedades que necesita para implementar su idea? ¿Tiene alguna pregunta o comentario sobre el modelo de seguridad? Presente un problema de especificación en el [Repositorio de GitHub de activadores de notificaciones](https://github.com/beverloo/notification-triggers/issues) o agregue sus consideraciones a un problema existente.

### ¿Tiene problemas con la implementación?

¿Encontró un error con la implementación de Chrome? ¿O la implementación es diferente de la especificación? Presente un error en [new.crbug.com](https://new.crbug.com/). Asegúrese de incluir todos los detalles que pueda, instrucciones simples para la reproducción y configure los Componentes en `UI>Notifications`. Glitch funciona muy bien para compartir reproducciones de errores de forma rápida y sencilla.

### ¿Pienza utilizar la API?

¿Piensa utilizar los activadores de notificaciones en su sitio? Su apoyo público nos ayuda a priorizar las funciones y les muestra a otros proveedores de navegadores lo importante que es darles soporte. Envíe un tuit a [@ChromiumDev](https://twitter.com/chromiumdev) mediante el hashtag [`#NotificationTriggers`](https://twitter.com/search?q=%23NotificationTriggers&src=typed_query&f=live) y háganos saber dónde y cómo los está usando.

## Enlaces útiles {: #helpful }

- [Explicador público](https://github.com/beverloo/notification-triggers/blob/master/README.md)
- [Demostración de activadores de notificaciones](https://notification-triggers.glitch.me/) | [Fuente de la demostración de los activadores de notificaciones](https://glitch.com/edit/#!/notification-triggers)
- [Seguimiento de errores](https://bugs.chromium.org/p/chromium/issues/detail?id=891339)
- [Entrada de ChromeStatus.com](https://www.chromestatus.com/feature/5133150283890688)
- Componente Blink: `UI>Notifications`

## Agradecimientos

Los activadores de notificaciones fueron implementados por [Richard Knoll](https://uk.linkedin.com/in/richardknoll) y el explicador fue escrito por [Peter Beverloo](https://twitter.com/beverloo?lang=en), con contribuciones de Richard. Las siguientes personas revisaron el artículo: [Joe Medley](https://twitter.com/medleyjp), [Pete LePage](https://twitter.com/petele), así como tmbién Richard y Peter. [Imagen hero](https://unsplash.com/photos/UAvYasdkzq8) de [Lukas Blazek](https://unsplash.com/@goumbik) en Unsplash.
