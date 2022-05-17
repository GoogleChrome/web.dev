---
title: Haz las cosas rápidamente con los accesos directos de aplicaciones
subhead: Los accesos directos de aplicaciones brindan acceso rápido a un puñado de acciones comunes que los usuarios necesitan con frecuencia.
authors:
  - beaufortfrancois
  - jungkees
date: 2020-05-20
updated: 2020-10-12
hero: image/admin/1ekafMZjtzcd0G3TLQJ4.jpg
alt: Una foto de un teléfono Android que muestra un menú de accesos directos a las aplicaciones
description: Los accesos directos de aplicaciones brindan acceso rápido a un puñado de acciones comunes que los usuarios necesitan con frecuencia.
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

Para mejorar la productividad de los usuarios y facilitar la participación en tareas clave, la plataforma web ahora admite accesos directos a las aplicaciones. Permiten a los desarrolladores web proporcionar un acceso rápido a un puñado de acciones comunes que los usuarios necesitan con frecuencia.

Este artículo te enseñará a cómo definir esos accesos directos a las aplicaciones. Además, aprenderás algunas de las mejores prácticas asociadas.

## Acerca de los accesos directos de aplicaciones

Los accesos directos a las aplicaciones ayudan a los usuarios a iniciar rápidamente tareas comunes o recomendadas dentro de tu aplicación web. El fácil acceso a esas tareas desde cualquier lugar donde se muestre el icono de la aplicación mejorará la productividad de los usuarios y aumentará su compromiso con la aplicación web.

El menú de accesos directos de la aplicación se invoca haciendo clic con el botón derecho en el ícono de la aplicación en la barra de tareas (Windows) o en el dock (macOS) en el escritorio del usuario, o presionando prolongadamente el ícono del iniciador de la aplicación en Android.

<figure>{% Img src="image/admin/F4TsJNfRJNJSt2ZpqVAy.png", alt="Captura de pantalla del menú de accesos directos abierto de una aplicación en Android", width="800", height="420" %} }<figcaption> Menú de accesos directos abierto de aplicaciones en Android</figcaption></figure>

<figure>{% Img src="image/admin/RoF6k7Aw6WNvaEcsgIcb.png", alt="Captura de pantalla del menú de accesos directos abierto de una aplicación en Windows", width="800", height="420" %}<figcaption> Menú de accesos directos abierto de las aplicaciones en Windows</figcaption></figure>

El menú de accesos directos de la aplicación se muestra solo para [las aplicaciones web progresivas (PWA)](/progressive-web-apps/) que están instaladas en el escritorio o dispositivo móvil del usuario. Consulta [¿Qué se necesita para ser instalable?](/install-criteria/) para conocer los requisitos de instalación.

Cada acceso directo a la aplicación expresa intención del usuario, cada uno de los cuales está asociado con una URL dentro del [alcance](/add-manifest/#scope) de tu aplicación web. La URL se abre cuando los usuarios activan el acceso directo de la aplicación. Entre los ejemplos de accesos directos a aplicaciones se incluyen los siguientes:

- Elementos de navegación de nivel superior (por ejemplo, inicio, navegación, pedidos recientes)
- Búsqueda
- Tareas de entrada de datos (por ejemplo, redactar un correo electrónico o un tweet, agregar un recibo)
- Actividades (por ejemplo, iniciar un chat con los contactos más populares)

{% Aside %} Muchas gracias a la gente de Microsoft Edge e Intel por diseñar y estandarizar los accesos directos a las aplicaciones. Chrome depende de una comunidad de personas comprometidas que trabajan juntos para hacer avanzar el proyecto de Chromium. No todos los usuarios de Chromium son de Google, ¡y estos colaboradores merecen un reconocimiento especial! {% endAside %}

## Definir accesos directos a aplicaciones en el manifiesto de la aplicación web

Los accesos directos a aplicaciones se definen opcionalmente en el [manifiesto de la aplicación web](/add-manifest), el cual es un archivo JSON que le informa al navegador sobre tu aplicación web progresiva y cómo debe comportarse cuando se instala en el escritorio o dispositivo móvil del usuario. Siendo más especifico, se declaran en el miembro de la matriz de `shortcuts`. A continuación se muestra un ejemplo de un posible manifiesto de aplicación web.

```json
{
  "name": "Player FM",
  "start_url": "https://player.fm?utm_source=homescreen",
  …
  "shortcuts": [
    {
      "name": "Open Play Later",
      "short_name": "Play Later",
      "description": "View the list of podcasts you saved for later",
      "url": "/play-later?utm_source=homescreen",
      "icons": [{ "src": "/icons/play-later.png", "sizes": "192x192" }]
    },
    {
      "name": "View Subscriptions",
      "short_name": "Subscriptions",
      "description": "View the list of podcasts you listen to",
      "url": "/subscriptions?utm_source=homescreen",
      "icons": [{ "src": "/icons/subscriptions.png", "sizes": "192x192" }]
    }
  ]
}
```

Cada miembro de la matriz de `shortcuts` es un diccionario que contiene al menos un `name` y una `url`. Los otros miembros son opcionales.

### name

La etiqueta legible por humanos para el acceso directo de la aplicación cuando se muestra al usuario.

### short_name (opcional)

La etiqueta legible por humanos utilizada donde el espacio es limitado. Se recomienda que lo proporciones, aunque sea opcional.

### description (opcional)

El propósito legible por humanos del acceso directo a la aplicación. No se usa al momento de escribir este artículo, pero puede estar expuesto a tecnología de asistencia en el futuro.

### url

La URL que se abre cuando un usuario activa el acceso directo de la aplicación. Esta URL debe existir dentro del alcance del manifiesto de la aplicación web. Si es una URL relativa, la URL base será la URL del manifiesto de la aplicación web.

### icons (opcional)

Una matriz de objetos de recursos de imágenes. Cada objeto debe incluir una propiedad de `src` y una propiedad de `sizes`. A diferencia de [los iconos de manifiesto de la aplicación web](/add-manifest/#icons), el `type` de imagen es opcional.

Los archivos SVG no son compatibles en el momento de escribir este artículo, usa PNG en su lugar.

Si deseas usar íconos con píxeles perfectos, proporciónalos en incrementos de 48dp (es decir, íconos de 36x36, 48x48, 72x72, 96x96, 144x144, 192x192 píxeles). De lo contrario, se recomienda que utilices un solo icono de 192x192 píxeles.

Como medida de calidad, los íconos deben tener al menos la mitad del tamaño ideal del dispositivo en Android, que es 48dp. Por ejemplo, para mostrarse en una [pantalla xxhdpi](https://developer.android.com/training/multiscreen/screendensities#TaskProvideAltBmp), el icono debe tener al menos 72 por 72 píxeles. (Esto se deriva de la [fórmula para convertir](https://developer.android.com/training/multiscreen/screendensities#dips-pels) unidades dp en unidades de píxeles).

## Prueba los accesos directos de tu aplicación

Para verificar que los accesos directos de su aplicación están configurados correctamente, usa el panel de **Manifiesto** en el panel de **Aplicación** de DevTools.

<figure>{% Img src="image/admin/rEL0r8lEfYHlsj0ylLSL.png", alt="Captura de pantalla de los accesos directos a las aplicaciones en DevTools", width="800", height="534" %}<figcaption> Accesos directos de aplicaciones que se muestran en DevTools</figcaption></figure>

Este panel proporciona una versión legible por humanos de muchas de las propiedades de tu manifiesto, incluidos los accesos directos a las aplicaciones. Facilita la verificación de que todos los iconos de acceso directo, si es que fueron proporcionados, se carguen correctamente.

Es posible que los accesos directos a las aplicaciones no estén disponibles de inmediato para todos los usuarios porque las actualizaciones de la aplicación web progresiva están limitadas a una vez al día. Obtén más información sobre [cómo Chrome maneja las actualizaciones del manifiesto de la aplicación web](/manifest-updates).

## Mejores prácticas

### Ordenar los accesos directos de aplicaciones por prioridad

Te recomendamos que ordenes los accesos directos a las aplicaciones por prioridad y los accesos directos a las aplicaciones más importantes aparecerán primero en la matriz de  `shortcuts` ya que el límite en la cantidad de accesos directos a las aplicaciones que se muestran varía según la plataforma. Chrome y Edge en Windows, por ejemplo, limitan la cantidad de accesos directos a aplicaciones a 10, mientras que Chrome para Android solo toma en cuenta los primeros 4 accesos directos a las aplicaciones.

{% Aside %} Chrome 92 para Android 7 ahora permite solo 3 accesos directos a aplicaciones. Se agregó un acceso directo a la configuración del sitio, tomando uno de los espacios de acceso directo disponibles para la aplicación. {% endAside %}

### Utiliza nombres distintos para los accesos directos de aplicaciones

No debes de confiar en los íconos para diferenciar los accesos directos de aplicaciones, ya que es posible que no siempre estén visibles. Por ejemplo, macOS no admite iconos en el menú de accesos directos del dock. Utiliza nombres distintos para cada acceso directo de la aplicación.

### Medir el uso de accesos directos a las aplicaciones

Deberías de anotar los accesos directos a las aplicaciones de `url` como lo haces con `start_url` para fines analíticos (por ejemplo, `url: "/myshortcut?utm_source=homescreen"`).

## Compatibilidad del navegador

Los accesos directos a aplicaciones están disponibles en Android (Chrome 84), Windows (Chrome 85 y Edge 85), ChromeOS (Chrome 92), macOS y Linux (Chrome 96 y Edge 96).

<figure>{% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/6KgvySxUcryuD0gwXa0u.png",alt="Captura de pantalla de un menú de accesos directos abierto de aplicaciones en ChromeOS", width="800", height="450" %}<figcaption> Menú de accesos directos abierto de aplicaciones en ChromeOS</figcaption></figure>

## Soporte de Trusted Web Activity

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap), la herramienta recomendada para crear aplicaciones de Android que utiliza [Trusted Web Activity (Actividades web confiables)](/using-a-pwa-in-your-android-app/), lee los accesos directos de la aplicación desde el manifiesto de la aplicación web y genera automáticamente la configuración correspondiente para la aplicación de Android. Ten en cuenta que los iconos para los accesos directos a aplicaciones son [obligatorios](https://github.com/GoogleChromeLabs/bubblewrap/issues/116) y deben tener al menos 96 por 96 píxeles en Bubblewrap.

[PWABuilder](https://www.pwabuilder.com/), una gran herramienta para convertir fácilmente una aplicación web progresiva en una Trusted Web Activity, permite accesos directos a aplicaciones con algunas [advertencias](https://github.com/pwa-builder/CloudAPK/issues/25).

Para los desarrolladores que integran Trusted Web Activity manualmente en su aplicación de Android, se pueden usar [accesos directos de aplicaciones de Android](https://developer.android.com/guide/topics/ui/shortcuts) para implementar los mismos comportamientos.

## Muestra

<figure>
  <video controls autoplay loop muted src="https://storage.googleapis.com/web-dev-assets/app-shortcuts/app-shortcuts-recording.mp4">
  </video></figure>

Consulta la [muestra de accesos directos de la aplicación](https://app-shortcuts.glitch.me) y su [fuente](https://glitch.com/edit/#!/app-shortcuts).

{% Glitch { id: 'app-shortcuts', path: 'public/manifest.json', height: 480 } %}

## Enlaces Útiles

- [Explicador](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Shortcuts/explainer.md)
- [Especificaciones](https://w3c.github.io/manifest/#shortcuts-member)
- [Muestra de accesos directos a aplicaciones](https://app-shortcuts.glitch.me) | [Fuente de muestra de accesos directos a aplicaciones](https://glitch.com/edit/#!/app-shortcuts)
- [Error de seguimiento](https://bugs.chromium.org/p/chromium/issues/detail?id=955497)
- [Entrada de ChromeStatus.com](https://chromestatus.com/feature/5706099464339456)
- Componente Blink: [`UI>Browser>WebAppInstalls`](https://crbug.com/?q=component:UI%3EBrowser%3EWebAppInstalls)
