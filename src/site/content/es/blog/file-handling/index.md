---
title: Deje que las aplicaciones web instaladas sean administradores de archivos
subhead: Cómo registrar una aplicación como administrador de archivos en el sistema operativo.
authors:
  - thomassteiner
Description: Cómo registrar una aplicación como administrador de archivos con el sistema operativo y abrir los archivos con su aplicación correspondiente.
date: 2020-10-22
updated: 2022-01-25
tags:
  - blog
  - capabilities
hero: image/admin/tf0sUZX6G7AM8PvU1t0B.jpg
alt: Carpetas de muchos colores.
---

{% Aside %} La API para administrar archivos forma parte del [proyecto funciones](https://developer.chrome.com/blog/fugu-status/) y actualmente está en desarrollo. Esta publicación se actualizará conforme avance la implementación. {% endAside %}

Ahora que las aplicaciones web son [capaces de leer y escribir archivos](/file-system-access/), el siguiente paso lógico es permitir que los desarrolladores declaren estas mismas aplicaciones web como administradores de archivos para los archivos que sus aplicaciones pueden crear y procesar. La API de administración de archivos le permite hacer exactamente esto. Después de registrar una aplicación de editor de texto como administrador de archivos y después de instalarla, puede hacer clic con el botón derecho en un archivo `.txt` en macOS y seleccionar "Obtener información" para indicar al sistema operativo que siempre debe abrir los archivos `.txt` con esta aplicación de forma predeterminada.

### Casos de uso sugeridos para la API de administración de archivos {: #use-cases }

Algunos ejemplos de sitios que pueden utilizar esta API son:

- Aplicaciones de Office como editores de texto, aplicaciones de hojas de cálculo y creadores de presentaciones de diapositivas.
- Editores gráficos y herramientas de dibujo.
- Herramientas de edición de niveles de videojuegos.

## Estado actual {: #status}

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">Paso</th>
<th data-md-type="table_cell">Estado</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. Crear un explicador</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/file-handling/blob/main/explainer.md" data-md-type="link">Completo</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. Crear borrador inicial de especificación</td>
<td data-md-type="table_cell">No empezado</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. Recopilar comentarios y repetir el diseño</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">En curso</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. Prueba de origen</td>
<td data-md-type="table_cell">Completa</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. Lanzamiento</td>
<td data-md-type="table_cell">No empezado</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## Cómo utilizar la API de administración de archivos {: #use}

### Habilitación mediante about://flags

Para experimentar con la API de administración de archivos de forma local, sin un token de prueba de origen, active el indicador `#file-handling-api` en `about://flags`.

### Mejoramiento progresivo

La API de administración de archivos por sí misma no puede ser polivalente. Sin embargo, la capacidad de abrir archivos con una aplicación web puede conseguirse por otros dos medios:

- La [API de objetivo compartido web](/web-share-target/) permite a los desarrolladores especificar su aplicación como un objetivo compartido para que los archivos puedan abrirse desde la hoja compartida del sistema operativo.
- La [API de acceso al sistema de archivos](/file-system-access/) puede integrarse con la función de arrastrar y soltar archivos, para que los desarrolladores puedan administrar los archivos soltados en la aplicación que ya está abierta.

### Detección de funciones

Para verificar si la API de administración de archivos es compatible, utilice:

```javascript
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  // The File Handling API is supported.
}
```

{% Aside %} La administración de archivos se limita actualmente a los sistemas operativos de computadoras de escritorio. {% endAside %}

### La parte declarativa de la API de administración de archivos

Como primer paso, las aplicaciones web necesitan describir de forma declarativa en su [manifiesto de aplicación web](/add-manifest/) qué tipo de archivos pueden administrar. La API de administración de archivos amplía el manifiesto de la aplicación web con una nueva propiedad llamada `"file_handlers"` que acepta una serie de, precisamente, administradores de archivos. Un administrador de archivos es un objeto con dos propiedades:

- Una propiedad `"action"` que señala como valor una URL dentro del alcance de la aplicación.
- Una propiedad `"accept"` con un objeto de tipos MIME como claves y listas de extensiones de archivos entre sus valores.
- Una propiedad `"icons"` con una serie de iconos [`ImageResource`](https://www.w3.org/TR/image-resource/). Algunos sistemas operativos permiten que una asociación con un tipo de archivo muestre un icono que no es solo el icono de la aplicación asociada, sino un icono especial relacionado con el uso de ese tipo de archivo con la aplicación.

El siguiente ejemplo, que muestra solo el fragmento correspondiente del manifiesto de la aplicación web, debería dejarlo más claro:

```json
{
  "file_handlers": [
    {
      "action": "/open-csv",
      "accept": {
        "text/csv": [".csv"]
      },
      "icons": [
        {
          "src": "csv-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    },
    {
      "action": "/open-svg",
      "accept": {
        "image/svg+xml": ".svg"
      },
      "icons": [
        {
          "src": "svg-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    },
    {
      "action": "/open-graf",
      "accept": {
        "application/vnd.grafr.graph": [".grafr", ".graf"],
        "application/vnd.alternative-graph-app.graph": ".graph"
      },
      "icons": [
        {
          "src": "graf-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    }
  ]
}
```

Esto se utiliza para una aplicación hipotética que administra archivos de valores separados por comas (`.csv`) en `/open-csv`, gráficos vectoriales escalables (`. svg`) en `/open-svg`, y un formato de archivo Grafr formado por `.grafr`, `.graf`, o `.graph` como extensión en `/open-graf`.

{% Aside %} Para que esta declaración tenga algún efecto, la aplicación debe estar instalada. Puede obtener más información en una serie de artículos de este mismo sitio sobre [cómo hacer que su aplicación se pueda instalar](/progressive-web-apps/#make-it-installable). {% endAside %}

### La parte imperativa de la API de administración de archivos

Ahora que la aplicación declaró qué archivos puede administrar en que en teoría se encuentra en la URL, necesita imperativamente hacer algo con los archivos que llegan en la práctica. Aquí es donde entra en juego el `launchQueue`. Para acceder a los archivos iniciados, un sitio necesita especificar un consumidor para el objeto `window.launchQueue`. Los inicios se ponen en fila hasta que se administran por el consumidor especificado, que se invoca exactamente una vez para cada inicio. De esta manera, cada inicio es administrado, independientemente de cuando se especificó el consumidor.

```js
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  launchQueue.setConsumer((launchParams) => {
    // Nothing to do when the queue is empty.
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      // Handle the file.
    }
  });
}
```

### Soporte de DevTools

En el momento de escribir este artículo no hay soporte para DevTools, pero presenté una [solicitud de función](https://bugs.chromium.org/p/chromium/issues/detail?id=1130552) para que se agregue al soporte.

## Demostración

Agregué soporte para la administración de archivos a [Excalidraw](https://excalidraw.com/), una aplicación de dibujo estilo caricatura. Para probarlo, primero debe instalar Excalidraw. Cuando cree un archivo con él y lo almacene en algún sitio de su sistema de archivos, puede abrir el archivo mediante un doble clic, o un clic derecho y luego seleccionar 'Excalidraw' en el menú contexto. Puede consultar la [implementación](https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code) en el código fuente.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMh8Qev0XdwgIx7jJlP5.png", alt="La ventana del buscador de macOS con un archivo Excalidraw.", width="800", height="422" %} <figcaption> Haga doble clic o haga clic derecho sobre un archivo en el explorador de archivos de su sistema operativo. </figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wCNbMl6kJ11XziG3LO65.png", alt="El menú contexto que aparece al hacer clic derecho en un archivo con la opción resaltada 'Abrir con… Excalidraw'.", width="488", height="266" %} <figcaption> Excalidraw es el administrador de archivos predeterminado para los archivos <code>.excalidraw</code>. </figcaption></figure>

## Seguridad

El equipo de Chrome diseñó e implementó la API de administración de archivos siguiendo los principios básicos definidos en [Cómo controlar el acceso a las poderosas funciones de la plataforma web](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md), incluyendo el control del usuario, la transparencia y la ergonomía.

## Permisos, persistencia de permisos y actualizaciones de los administradores de archivos

Para garantizar la confianza de los usuarios y la seguridad de sus archivos cuando se utiliza la API de administración de archivos para abrir un archivo, se mostrará una solicitud de permiso antes de que una PWA pueda visualizar un archivo. Este aviso de permiso se mostrará justo después de que el usuario seleccione la PWA para abrir un archivo, de modo que el permiso esté estrechamente vinculado a la acción de abrir un archivo utilizando la PWA, lo que lo hace más comprensible y apropiado.

Este permiso se mostrará cada vez hasta que el usuario haga clic en **Permitir** o **Bloquear** la administración de archivos para el sitio, o ignore el aviso tres veces (después de lo cual Chromium retendrá y bloqueará este permiso). La configuración seleccionada persistirá durante el cierre y la reapertura de la PWA.

Cuando se actualicen los manifiestos y los cambios en la sección `"file_handlers"`, se restablecerán los permisos.

### Desafíos relacionados con los archivos

Hay una gran categoría de vectores de ataque que se abren al permitir el acceso a los sitios web de los archivos. Estos se describen en el artículo sobre la API de acceso al sistema de archivos. La función adicional de seguridad que la API de administración de archivos proporciona sobre la API de acceso al sistema de archivos es la capacidad de conceder acceso a algunos archivos por medio de la interfaz de usuario integrada del sistema operativo, en vez de hacer uso de un selector de archivos mostrado por una aplicación web.

Aún existe el riesgo de que los usuarios concedan acceso involuntariamente a una aplicación web al abrir un archivo. Sin embargo, generalmente se considera que abrir un archivo permite a la aplicación con la que se abre leer y/o manipular ese archivo. Por lo tanto, la elección explícita por parte de un usuario de abrir un archivo en una aplicación instalada, como por ejemplo por medio del menú contexto "Abrir con…", puede leerse como una señal de confianza suficiente en la aplicación.

### Desafíos del administrador predeterminado

La excepción a esto es cuando no hay aplicaciones en el sistema host para un tipo de archivo determinado. En este caso, algunos sistemas operativos host pueden promover automáticamente el administrador recién registrado al administrador predeterminado para ese tipo de archivos, de forma silenciosa y sin ninguna intervención por parte del usuario. Esto significaría que si el usuario hace doble clic en un archivo de ese tipo, se abriría automáticamente en la aplicación web registrada. En este tipo de sistemas operativos, cuando el agente de usuario determina que no existe un administrador predeterminado para el tipo de archivo, podría necesitarse una solicitud de permiso explícita para evitar el envío accidental del contenido de un archivo a una aplicación web sin el consentimiento del usuario.

### Control del usuario

La especificación establece que los navegadores no deben registrar cada sitio que pueda administrar archivos como un administrador de archivos. En cambio, el registro de la administración de archivos debe estar limitado por la instalación y nunca debe ocurrir sin la confirmación explícita del usuario, especialmente si un sitio se convierte en el administrador predeterminado. En vez de secuestrar extensiones que ya existen, como `.json`, para las que el usuario probablemente ya tiene un administrador predeterminado registrado, los sitios deberían considerar la posibilidad de crear sus propias extensiones.

### Transparencia

Todos los sistemas operativos permiten que los usuarios cambien las asociaciones de archivos actuales. Esto está fuera del alcance del navegador.

## Comentarios {: #feedback }

El equipo de Chrome quiere conocer su experiencia con la API de administración de archivos.

### Cuéntenos sobre el diseño de la API

¿Hay algo en la API que no funciona como esperaba? ¿O faltan métodos o propiedades que necesita para implementar su idea? ¿Tiene alguna pregunta o comentario sobre el modelo de seguridad?

- Reporte un problema de especificaciones en el [repositorio de GitHub](https://github.com/WICG/file-handling/issues) correspondiente o agregue sus comentarios a un reporte existente.

### Cómo reportar un problema con la implementación

¿Encontró un error en la implementación de Chrome? ¿O la implementación es diferente a la especificación?

- Registre un error en [new.crbug.com](https://new.crbug.com). Asegúrese de incluir todos los detalles que pueda, instrucciones sencillas para reproducirlo, e introduzca `UI>Browser>WebAppInstalls>FileHandling` en la casilla **Componentes**. [Glitch](https://glitch.com/) funciona muy bien para compartir repeticiones rápidas y sencillas.

### Muestre su apoyo a la API

¿Piensa utilizar la API de administración de archivos? Su apoyo público ayuda al equipo de Chrome a priorizar las características y muestra a otros proveedores de navegadores la importancia de su apoyo.

- Comparta cómo planea utilizarlo en la [discusión de WICG](https://discourse.wicg.io/t/proposal-ability-to-register-file-handlers/3084).
- Envíe un tweet a [@ChromiumDev](https://twitter.com/ChromiumDev) utilizando el hashtag [`#FileHandling`](https://twitter.com/search?q=%23FileHandling&src=typed_query&f=live) y díganos dónde y cómo lo está utilizando.

## Enlaces útiles {: #helpful}

- [Explicador público](https://github.com/WICG/file-handling/blob/main/explainer.md)
- [Demostración de la API de administración de archivos](https://excalidraw.com/) | [Demostración de la API de administración de archivos](https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code)
- [Error de seguimiento de Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=829689)
- [Entrada de ChromeStatus.com](https://chromestatus.com/feature/5721776357113856)
- Componente Blink: [`UI>Browser>WebAppInstalls>FileHandling`](https://bugs.chromium.org/p/chromium/issues/list?q=component:UI%3EBrowser%3EWebAppInstalls%3EFileHandling)
- [Revisión de TAG](https://github.com/w3ctag/design-reviews/issues/371)
- [Posición de los estándares de Mozilla](https://github.com/mozilla/standards-positions/issues/158)

## Agradecimientos

[Eric Willigers](https://github.com/ericwilligers), [Jay Harris](https://github.com/fallaciousreasoning), y [Raymes Khoury](https://github.com/raymeskhoury) especificaron la API de administración de archivos. Este artículo fue revisado por [Joe Medley](https://github.com/jpmedley).
