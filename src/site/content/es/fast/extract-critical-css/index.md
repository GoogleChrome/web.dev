---
layout: post
title: Extraer CSS crítico
subhead: Aprenda a mejorar los tiempos de renderizado con la técnica de CSS crítico.
authors:
  - mihajlija
date: 2019-05-29
hero: image/admin/ZC6iWHhgnrSZtPJMfwMh.jpg
alt: Una foto cenital de llaves y destornilladores.
description: |2-

  Aprenda cómo mejorar los tiempos de renderizado con la técnica de CSS crítico y cómo elegir la mejor herramienta para su proyecto.
codelabs: codelab-extract-and-inline-critical-css
tags:
  - blog
  - performance
  - css
---

El navegador debe descargar y analizar los archivos CSS antes de poder mostrar la página, lo que convierte al CSS en un recurso de bloqueo de renderizado. Si los archivos CSS son grandes o las condiciones de la red son malas, las solicitudes de archivos CSS pueden aumentar significativamente el tiempo que tarda una página web en procesarse.

{% Aside 'key-term' %} El CSS crítico es una técnica que extrae el CSS del contenido de la mitad superior de la página para mostrar el contenido al usuario lo más rápido posible. {% endAside %}

<figure>{% Img src="image/admin/t3Kkvh265zi6naTBga41.png", alt="Una ilustración de una computadora portátil y un dispositivo móvil con páginas web que desbordan los bordes de las pantallas", width="800", height="469", class="" %}</figure>

{% Aside 'note' %} En la mitad superior de la página está todo el contenido que un espectador ve al cargar la página, antes de desplazarse. No hay una altura de pixel definida universalmente de lo que se considera contenido en la mitad superior de la página, ya que hay una gran cantidad de dispositivos y tamaños de pantalla. {% endAside %}

Insertar estilos extraídos en el `<head>` del documento HTML elimina la necesidad de realizar una solicitud adicional para obtener estos estilos. El resto del CSS se puede cargar de forma asincrónica.

<figure>{% Img src="image/admin/RVU3OphqtjlkrlAtKLEn.png", alt="Archivo HTML con CSS crítico insertado en el encabezado", width="800", height="325" %}<figcaption> CSS crítico en línea</figcaption></figure>

La mejora de los tiempos de renderizado puede marcar una gran diferencia en el [rendimiento percibido](/rail/#focus-on-the-user), especialmente en condiciones de red deficientes. En las redes móviles, la latencia alta es un problema independientemente del ancho de banda.

<figure>{% Img src="image/admin/NdQz49RVgdHoh3Fff0yr.png", alt="Comparación de vista de tira de película sobre la carga de una página con CSS que bloquea el renderizado (arriba) y la misma página con CSS crítico en línea (abajo) en una conexión 3G. La tira de película superior muestra seis fotogramas en blanco antes de mostrar finalmente el contenido. La tira de película inferior muestra contenido significativo en el primer fotograma.", width="800", height="363" %}<figcaption> Comparación de la carga de una página con CSS que bloquea el renderizado (arriba) y la misma página con CSS crítico en línea (abajo) en una conexión 3G</figcaption></figure>

Si tiene un [First Contentful Paint o FCP (primer despliegue de contenido)](/fcp/) deficiente y ve la oportunidad de "Eliminar el recurso de bloqueo de renderizado" en las auditorías de Lighthouse, es una buena idea probar el CSS crítico.

{% Img src="image/admin/0xea7menL90lWHwbjZoP.png", alt="Auditoría Lighthouse con oportunidades de 'Eliminar recurso de bloqueo de renderizado' o 'Aplazar CSS no utilizado'", width="743", height="449" %}

{% Aside 'gotchas' %} Tenga en cuenta que si inserta una gran cantidad de CSS, la transmisión del resto del documento HTML se retrasa. Si todo está priorizado, entonces no hay nada lo está. La inserción también tiene algunas desventajas, ya que evita que el navegador almacene en caché el CSS para reutilizarlo en cargas de página posteriores, por lo que es mejor usarlo con moderación. {% endAside %}

<p id="14KB">Para minimizar el número de viajes de ida y vuelta para renderizar por primera vez, intente mantener el contenido de la mitad superior de la página por debajo de <strong>14 KB</strong> (comprimido).</p>

{% Aside 'note' %} Las nuevas [conexiones TCP](https://hpbn.co/building-blocks-of-tcp/) no pueden utilizar inmediatamente todo el ancho de banda disponible entre el cliente y el servidor, todas pasan por un [inicio lento](https://hpbn.co/building-blocks-of-tcp/#slow-start) para evitar sobrecargar la conexión con más datos de los que puede transportar. En este proceso, el servidor inicia la transferencia con una pequeña cantidad de datos, y si llega al cliente en perfecto estado, duplica la cantidad en el siguiente viaje de ida y vuelta. Para la mayoría de los servidores, 10 paquetes o aproximadamente 14 KB es el máximo que se puede transferir en el primer viaje de ida y vuelta. {% endAside %}

El impacto en el rendimiento que puede lograr con esta técnica depende del tipo de su sitio web. En términos generales, cuanto más CSS tenga un sitio, mayor será el posible impacto del CSS en línea.

## Descripción general de herramientas

Hay una serie de excelentes herramientas que pueden determinar automáticamente el CSS crítico de una página. Esta es una buena noticia, porque hacerlo manualmente sería un proceso tedioso. Requiere un análisis de todo el DOM para determinar los estilos que se aplican a cada elemento en la ventana gráfica.

### Critical

[Critical](https://github.com/addyosmani/critical) extrae, minimiza e inserta CSS en la parte superior de la página y está disponible como [módulo npm](https://www.npmjs.com/package/critical). Se puede usar con Gulp (directamente) o con Grunt (como [complemento](https://github.com/bezoerb/grunt-critical)) y también hay un [complemento de webpack](https://github.com/anthonygore/html-critical-webpack-plugin).

Es una herramienta sencilla que simplifica el proceso. Ni siquiera tiene que especificar las hojas de estilo, Critical las detecta automáticamente. También admite la extracción de CSS crítico para múltiples resoluciones de pantalla.

### CriticalCSS

[CriticalCSS](https://github.com/filamentgroup/criticalCSS) es otro [módulo npm](https://www.npmjs.com/package/criticalcss) que extrae CSS de la mitad superior de la página. También está disponible como CLI.

No tiene opciones para incorporar y minimizar CSS crítico, pero permite forzar la inclusión de reglas que en realidad no pertenecen al CSS crítico y le brinda un control más granular sobre la inclusión de declaraciones `@font-face`.

### Penthouse

[Penthouse](https://github.com/pocketjoso/penthouse) es una buena opción si su sitio o aplicación tiene una gran cantidad de estilos o estilos que se inyectan dinámicamente en el DOM (común en las aplicaciones de Angular). Utiliza [Puppeteer](https://github.com/GoogleChrome/puppeteer) de manera discreta e incluso cuenta con una [versión alojada en línea](https://jonassebastianohlsson.com/criticalpathcssgenerator/).

Penthouse no detecta las hojas de estilo automáticamente, debe especificar los archivos HTML y CSS para los que desea generar CSS crítico. La ventaja es que es bueno para ejecutar muchos trabajos en paralelo.
