---
title: Excalidraw Electron se ha declarado obsoleto para cambiar a la versión web
subhead: Conozca por qué el proyecto Excalidraw decidió declarar obsoleta su wrapper Electron en favor de la versión web.
description: Excalidraw es una pizarra virtual colaborativa que le permite dibujar fácilmente diagramas que parecen hechos a mano. En el proyecto Excalidraw, decidimos descartar Excalidraw Desktop, un wrapper de Electron para Excalidraw, en favor de la versión web que se puede encontrar desde siempre en excalidraw.com. Después de un cuidadoso análisis, decidimos que las Aplicaciones Web Progresivas (PWA) son el futuro sobre el que queremos construir.
authors:
  - thomassteiner
date: 2021-01-07
updated: 2021-11-30
canonical: "https://blog.excalidraw.com/deprecating-excalidraw-electron/"
hero: image/admin/qfK9zbKBQalqq5zdr1P1.jpg
alt: |2

  Dibujo de Excalidraw con un estilizado logo de Electron.
tags:
  - blog
  - capabilities
  - case-study
---

{% Aside %} [Excalidraw](https://excalidraw.com/) es una pizarra virtual colaborativa que le permite dibujar fácilmente diagramas que parecen hechos a mano. Este artículo se publicó y apareció por primera vez en el [blog de Excalidraw](https://blog.excalidraw.com/deprecating-excalidraw-electron/). {% endAside %}

En el [proyecto Excalidraw](https://github.com/excalidraw), hemos decidido declarar obsoleto [Excalidraw Desktop](https://github.com/excalidraw/excalidraw-desktop), un wrapper de [Electron](https://www.electronjs.org/) para Excalidraw, a favor de la versión web que se ha podido encontrar desde siempre en [excalidraw.com](https://excalidraw.com/). Después de un análisis cuidadoso, hemos decidido que las [Aplicaciones Web Progresivas](/pwa/) (PWA) son el futuro sobre el que queremos construir. Siga leyendo para saber por qué.

## Cómo nació Excalidraw Desktop

Poco después de que [@vjeux](https://twitter.com/vjeux) creara la versión inicial de Excalidraw en enero de 2020 y escribiera en su [blog al respecto](https://blog.excalidraw.com/reflections-on-excalidraw/), propuso lo siguiente en el [número 561](https://github.com/excalidraw/excalidraw/issues/561#issue-555138343):

> Sería genial incluir Excalidraw en Electron (o equivalente) y publicarlo como una aplicación [específica de la plataforma] en las distintas tiendas de aplicaciones.

La reacción inmediata de [@voluntadpear](https://github.com/voluntadpear) fue sugerir:

> ¿Qué hay de convertirlo en una PWA en vez de eso? Actualmente, Android admite agregarlos a Play Store como Trusted Web Activities y, con suerte, iOS hará lo mismo pronto. En las computadoras de escritorio, Chrome permite descargar un acceso directo del escritorio a una PWA.

La decisión que [tomó @vjeux](https://github.com/vjeux) al final fue simple:

> Deberíamos hacer ambas :)

Si bien [@voluntadpear](https://github.com/voluntadpear) y más tarde otros comenzaron a trabajar para convertir la versión de Excalidraw en una PWA, [@lipis](https://github.com/lipis) [siguió adelante](https://github.com/excalidraw/excalidraw/issues/561#issuecomment-579573783) de forma independiente y creó un [repositorio separado](https://github.com/excalidraw/excalidraw-desktop) para Excalidraw Desktop.

Hasta el día de hoy, el objetivo inicial establecido por [@vjeux](https://github.com/vjeux), es decir, enviar Excalidraw a las distintas tiendas de aplicaciones, aún no se ha alcanzado. Honestamente, nadie ha iniciado el proceso de envío a ninguna de las tiendas. Pero, ¿por qué? Antes de responder, veamos Electron, la plataforma.

## ¿Qué es Electron?

El aspecto más llamatico de [Electron](https://www.electronjs.org/) es que le permite *"crear aplicaciones de escritorio multiplataforma con JavaScript, HTML y CSS"*. Las aplicaciones creadas con Electron son *"compatibles con Mac, Windows y Linux"*, es decir, *"las aplicaciones de Electron se crean y se ejecutan en tres plataformas"*. Según la página de inicio, las dificultades que Electron facilita son las [actualizaciones automáticas](https://www.electronjs.org/docs/api/auto-updater), los [menús y notificaciones a nivel del sistema](https://www.electronjs.org/docs/api/menu), los [informes de fallas](https://www.electronjs.org/docs/api/crash-reporter), la [depuración y la creación de perfiles](https://www.electronjs.org/docs/api/content-tracing), y los [instaladores de Windows](https://www.electronjs.org/docs/api/auto-updater#windows). Resulta que algunas de las características prometidas necesitan un estudio más profundo de las letras pequeñas.

- Por ejemplo, las actualizaciones automáticas *"[actualmente] solo [son compatibles] en macOS y Windows. No hay soporte integrado para el actualizador automático en Linux, por lo que se recomienda usar el administrador de paquetes de la distribución para actualizar su aplicación"*.

- Los desarrolladores pueden crear menús a nivel del sistema llamando a `Menu.setApplicationMenu(menu)`. En Windows y Linux, el menú se configurará como el menú superior de cada ventana, mientras que en macOS hay muchos menús estándar definidos por el sistema, como el menú [Servicios](https://developer.apple.com/documentation/appkit/nsapplication/1428608-servicesmenu?language=objc). Para que su propio menú sea un menú estándar, los desarrolladores deben establecer el `rol` de su menú en consecuencia, y Electron los reconocerá y los convertirá en menús estándar. Esto significa que una gran cantidad de código relacionado con el menú utilizará la siguiente verificación de plataforma: `const isMac = process.platform === 'darwin'`.

- Los instaladores de Windows se pueden crear con [windows-installer](https://github.com/electron/windows-installer). El archivo README del proyecto destaca que *"para una aplicación de producción, debe firmar su aplicación. El filtro SmartScreen de Internet Explorer bloqueará la descarga de su aplicación y muchos proveedores de antivirus considerarán su aplicación como malware a menos que obtenga un certificado válido"*[sic].

Observando solo estos tres ejemplos, está claro que Electron está lejos del principio  "escribir una vez, ejecutar en todas partes". La distribución de una aplicación en las tiendas de aplicaciones requiere la [firma de código](https://www.electronjs.org/docs/tutorial/code-signing), una tecnología de seguridad para certificar la propiedad de la aplicación. Empaquetar una aplicación requiere el uso de herramientas como [electron-forge](https://github.com/electron-userland/electron-forge) y pensar dónde alojar los paquetes para las actualizaciones de la aplicación. Se vuelve complejo con relativa rapidez, especialmente cuando el objetivo es realmente el soporte multiplataforma. Quiero señalar que es *absolutamente* posible crear aplicaciones de Electron impresionantes con suficiente esfuerzo y dedicación. Para Excalidraw Desktop, no era lo que queríamos.

## Donde quedó Excalidraw Desktop

Excalidraw Desktop hasta ahora es básicamente la aplicación web Excalidraw empaquetada como un archivo [`.asar`](https://github.com/electron/asar) agrgándole una ventana **Acerca de Excalidraw**. La apariencia de la aplicación es casi idéntica a la versión web.

<figure>{% Img  src="image/admin/oR9usELiRYTSu8V7i7vj.png", alt="La aplicación Excalidraw Desktop ejecutándose en un contenedor Electron.", width="800", height="601" %}<figcaption> Excalidraw Desktop es casi indistinguible de la versión web</figcaption></figure>

<figure>{% Img src="image/admin/y9d4nWR3p0VjvHcnP0iq.png", alt="La ventana 'Acerca de' de Excalidraw Desktop que muestra la versión del contenedor de Electron y la aplicación web.", width="400", height="330" %}<figcaption> El menú <strong>Acerca de Excalibur</strong> que da información sobre las versiones.</figcaption></figure>

En macOS, ahora hay un menú de nivel de sistema en la parte superior de la aplicación, pero como ninguna de las acciones del menú, aparte de **Cerrar ventana** y **Acerca de Excalidraw**, está conectada a nada, el menú es, en su estado actual, bastante inútil. Mientras tanto, todas las acciones se pueden realizar, por supuesto, a través de las barras de herramientas normales de Excalidraw y el menú contextual.

<figure>{% Img src="image/admin/akQQgmMKo66quqeVDdAH.png", alt="La barra de menú de Excalidraw Desktop en macOS con el elemento de menú 'Archivo', 'Cerrar ventana' seleccionado.", width="736", height="138" %}<figcaption> La barra de menú de Excalidraw Desktop en macOS</figcaption></figure>

Usamos [electron-builder](https://github.com/electron-userland/electron-builder), que admite [asociaciones de tipos de archivos](https://www.electron.build/configuration/configuration#PlatformSpecificBuildOptions-fileAssociations). Al hacer doble clic en un `.excalidraw`, lo ideal sería que se abriera la aplicación Excalidraw Desktop. El extracto relevante de nuestro archivo `electron-builder.json` ve así:

```json
{
  "fileAssociations": [
    {
      "ext": "excalidraw",
      "name": "Excalidraw",
      "description": "Excalidraw file",
      "role": "Editor",
      "mimeType": "application/json"
    }
  ]
}
```

Desafortunadamente, en la práctica, esto no siempre funciona como se esperaba, ya que, dependiendo del tipo de instalación (para el usuario actual, para todos los usuarios), las aplicaciones en Windows 10 no tienen los derechos para asociar un tipo de archivo a sí mismas.

Estas deficiencias y el trabajo pendiente para hacer que la experiencia sea realmente similar a una aplicación en *todas* las plataformas (lo cual, nuevamente, con el esfuerzo suficiente *es* posible) fueron un fuerte argumento para que reconsideremos lo invertido en Excalidraw Desktop. Sin embargo, el argumento más importante para nosotros fue que prevemos que para *nuestro* caso de uso, no necesitamos todas las características que ofrece Electron. El creciente conjunto de capacidades de la web nos es igualmente útil, si no mejor.

## Cómo nos sirve la web hoy y en el futuro

Incluso en 2020, [jQuery](https://jquery.com/) sigue siendo [increíblemente popular](https://almanac.httparchive.org/en/2020/javascript#libraries). Para muchos desarrolladores se ha convertido en un hábito usarlo, a pesar de que hoy en día [puede que no necesiten jQuery](http://youmightnotneedjquery.com/). Existe un recurso similar para Electron, acertadamente llamado [You Might Not Need Electron](https://youmightnotneedelectron.com/). Permítanme esbozar por qué creemos que no necesitamos Electron.

### Aplicación web progresiva instalable

Excalidraw hoy es una aplicación web progresiva [instalable](/installable/) con un [trabajador de servicio](https://excalidraw.com/service-worker.js) y un [manifiesto de aplicación web](https://excalidraw.com/manifest.json). Almacena todos sus recursos en dos cachés, uno para fuentes y CSS relacionado con fuentes, y otro para todo lo demás.

<figure>{% Img src="image/admin/tTo7miHIREZRySv8aoBd.png", alt="Pestaña de la aplicación Chrome DevTools que muestra los dos cachés de Excalidraw.", width="800", height="569" %}<figcaption> Contenido de la caché de Excalidraw</figcaption></figure>

Esto significa que la aplicación está completamente habilitada sin conexión y puede ejecutarse sin una conexión de red. Los navegadores basados en Chromium, tanto en computadoras de escritorio como en dispositivos móviles, solicitan al usuario que instale la aplicación. Puede ver el mensaje de instalación en la siguiente captura de pantalla.

<figure>{% Img src="image/admin/be3EQLezj3776w6SHLPi.png", alt="Excalidraw solicita al usuario que instale la aplicación en Chrome en macOS.", width="400", height="258" %}<figcaption> El cuadro de diálogo de instalación de Excalidraw en Chrome</figcaption></figure>

Excalidraw está configurado para ejecutarse como una aplicación independiente, por lo que cuando lo instala, obtiene una aplicación que se ejecuta en su propia ventana. Está completamente integrado en la interfaz de usuario multitarea del sistema operativo y tiene su propio ícono de aplicación en la pantalla de inicio, el Dock o la barra de tareas; dependiendo de la plataforma donde lo instale.

<figure>{% Img src="image/admin/MbMgQlGSBeNcX7Y362jV.png", alt="Excalidraw ejecutándose en su propia ventana", width="800", height="584" %}<figcaption> La PWA Excalidraw en una ventana independiente</figcaption></figure>

<figure>{% Img src="image/admin/7ncf98ZQZcg4g3UP2s7F.png", alt="Icono de Excalidraw en macOS Dock.", width="400", height="167" %}<figcaption> El icono de Excalidraw en macOS Dock</figcaption></figure>

### Acceso al sistema de archivos

Excalidraw utiliza [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) para acceder al sistema de archivos del sistema operativo. En los navegadores compatibles, esto permite un verdadero flujo de trabajo abrir → editar → guardar y también guardar sobreescribiendo y "guardar como", con un respaldo transparente para otros navegadores. Puede obtener más información sobre esta función en la publicación de mi blog [Lectura y escritura de archivos y directorios con la biblioteca browser-fs-access](/browser-fs-access/).

### Soporte de arrastrar y soltar

Los archivos se pueden arrastrar y soltar en la ventana de Excalidraw al igual que en las aplicaciones específicas de la plataforma. En un navegador que admita la [API File System Access](/file-system-access/), un archivo arrastrado se puede editar inmediatamente y las modificaciones se pueden guardar en el archivo original. Esto es tan intuitivo que a veces nos olvidamos de que se trata de una aplicación web.

### Acceso al portapapeles

Excalidraw funciona bien con el portapapeles del sistema operativo. Se pueden copiar y pegar dibujos completos de Excalidraw o solo objetos individuales en formatos `image/png` e `image/svg+xml`, lo que permite una fácil integración con otras herramientas específicas de la plataforma como [Inkscape](https://inkscape.org/) o herramientas basadas en web como [SVGOMG](https://jakearchibald.github.io/svgomg/).

<figure>{% Img src="image/admin/90gLbYTtkKtDfun4fiRM.png", alt="Menú contextual de Excalidraw que muestra los elementos de menú 'copiar al portapapeles como SVG' y 'copiar al portapapeles como PNG'.", width="800", height="746" %}<figcaption> El menú contextual de Excalidraw que ofrece acciones del portapapeles</figcaption></figure>

### Manejo de archivos

Excalidraw ya es compatible con la [API File Handling](/file-handling/) experimental, lo que significa que los archivos `.excalidraw` pueden recibir doble clic en el administrador de archivos del sistema operativo y sere abiertos directamente en la aplicación Excalidraw, ya que Excalidraw se registra como un manejador de archivos `.excalidraw` en el sistema operativo.

### Captura de enlaces declarativos

Los dibujos de Excalidraw se pueden compartir mediante un enlace. He aquí un [ejemplo](https://excalidraw.com/#json=4646308765761536,jwZJW8JsOM75vdhqG2nBgA). En el futuro, si las personas tienen Excalidraw instalado como PWA, dichos enlaces no se abrirán en una pestaña del navegador, sino que lanzarán una nueva ventana independiente. Esto funcionará, cuando se termine de implementar, gracias a la [captura de enlaces declarativos](https://github.com/WICG/sw-launch/blob/master/declarative_link_capturing.md), una propuesta de vanguardia en el momento de escribir este artículo para una nueva función de plataforma web.

## Conclusión

La web ha recorrido un largo camino, con más y más funciones que llegan a navegadores, funciones que hace solo un par de años o incluso meses eran impensables en la web y exclusivos para aplicaciones específicas de la plataforma. Excalidraw está a la vanguardia de lo que es posible en el navegador, a la vez que reconoce que no todos los navegadores en todas las plataformas son compatibles con cada función que usamos. Al apostar por una estrategia de mejora progresiva, disfrutamos de lo mejor y más reciente siempre que sea posible, pero sin dejar a nadie atrás. Se ve mejor en *cualquier* navegador.

Electron nos ha servido bien, pero en 2020 y más allá, podemos vivir sin él. Ah, y sobre ese objetivo de [@vjeux](https://github.com/vjeux): dado que Android Play Store ahora acepta PWA en un formato de contenedor llamado [Trusted Web Activity](/using-a-pwa-in-your-android-app/) y dado que [Microsoft Store también admite PWA](https://docs.microsoft.com/microsoft-edge/progressive-web-apps-edgehtml/microsoft-store), podrá ver a Excalidraw en estas tiendas en un futuro no muy lejano. Mientras tanto, siempre puede usar e instalar [Excalidraw en y desde el navegador](https://excalidraw.com/).

## Agradecimientos

Este artículo fue revisado por [@lipis](https://github.com/lipis), [@dwelle](https://github.com/dwelle) y [Joe Medley](https://github.com/jpmedley).
