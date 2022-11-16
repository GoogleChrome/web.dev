---
layout: post
title: Optimización de Web Vitals con Lighthouse
subhead: Encontrar oportunidades para mejorar la experiencia del usuario con las herramientas web de Chrome.
authors:
  - addyosmani
description: |2-

  Hoy, cubriremos nuevas funciones de herramientas en Lighthouse, PageSpeed y DevTools para ayudar a identificar cómo tu sitio puede mejorar en Web Vitals.
date: 2021-05-11
hero: image/1L2RBhCLSnXjCnSlevaDjy3vba73/6GPqQDYxZnVq8qF6DJ02.jpeg
alt: Un faro iluminando el mar
tags:
  - blog
  # - fast
  - performance
  - web-vitals
---

Hoy, cubriremos nuevas funciones de herramientas en Lighthouse, PageSpeed y DevTools para ayudar a identificar cómo tu sitio puede mejorar en [Web Vitals](/vitals).

Como recordatorio de las herramientas, [Lighthouse](https://github.com/GoogleChrome/lighthouse) es una herramienta automatizada de código abierto para mejorar la calidad de las páginas web. Puedes encontrarla en el conjunto de herramientas de depuración de [Chrome DevTools](https://developer.chrome.com/docs/devtools/) y ejecutarla en cualquier página web, pública o que requiera autenticación. También puedes encontrar Lighthouse en [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fstore.google.com), [CI](https://github.com/GoogleChrome/lighthouse-ci) y [WebPageTest](https://www.webpagetest.org/easy).

Lighthouse 7.x incluye nuevas funciones, como capturas de pantalla de elementos, para facilitar la inspección visual de las partes de la interfaz de usuario que afectan las métricas de la experiencia del usuario (por ejemplo, qué nodos contribuyen al cambio de diseño).

<figure><video muted autoplay loop><source type="video/mp4" src="https://storage.googleapis.com/web-dev-uploads/video/1L2RBhCLSnXjCnSlevaDjy3vba73/3G0x4Z1dmOcsusG7j1LE.mp4" width="1920" height="1080"></source></video></figure>

También hemos enviado soporte para capturas de pantalla de elementos en PageSpeed Insights, lo que permite detectar más fácilmente los problemas de rendimiento de las páginas en una sola ocasión.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/mfkWFzyfO9XlJLYS80DE.png", alt="Element Screenshots highlighting the DOM node contributing to layout shift in the page", width="800", height="483" %}</figure>

## Medir Core Web Vitals

Lighthouse puede medir [sintéticamente](/vitals-measurement-getting-started/#measuring-web-vitals-using-lab-data) [las métricas de Core Web Vitals,](/vitals/) incluidas la [pintura con contenido más grande](/lcp/), el [cambio de diseño acumulativo](/cls/) y el [tiempo de bloqueo total](/tbt/) (un proxy de laboratorio para el [retraso de la primera entrada](/fid/)). Estas métricas reflejan la carga, la estabilidad del diseño y la preparación para la interacción. También existen otras métricas, como la [primera pintura con contenido,](/fcp/) destacada en el [futuro de Core Web Vitals (CWV).](https://developer.chrome.com/devsummit/sessions/future-of-core-web-vitals/)

La sección "Métricas" del informe Lighthouse incluye versiones de laboratorio de estas métricas. Puedes usar esto como una vista resumida de los aspectos de la experiencia del usuario que requieren tu atención.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/VkLhdNb3fxtfttFZ1S6E.png", alt="Lighthouse peformance metrics", width="800", height="485" %}</figure>

{% Aside %} Lighthouse se centra en medir la experiencia del usuario durante la carga inicial de la página en un entorno de laboratorio, emulando un teléfono lento o una máquina de escritorio. Si hay un comportamiento en tu página que pueda causar cambios en el diseño o largas tareas de JavaScript después de la carga de la página, las métricas del laboratorio no lo reflejarán. Prueba el panel DevTools Performance, [Search Console](https://search.google.com/search-console/about), la [extensión de Web Vitals](https://chrome.google.com/webstore/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma?hl=en) o [RUM](/vitals-measurement-getting-started/#measuring-web-vitals-using-rum-data) para ver las métricas después de las cargas. {% endAside %}

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/PLMoiQpi12jT7BJUvlOJ.png", alt="Web Vitals lane in the devtools performance panel", width="800", height="476" %} <figcaption> La nueva opción Web Vitals en el panel DevTools Performance muestra una pista que resalta los momentos métricos, como Layout Shift (LS) o cambio de diseño que se muestra arriba.</figcaption></figure>

[Las métricas de campo](/vitals-field-measurement-best-practices/), como las que se encuentran en [Chrome UX Report](https://developer.chrome.com/docs/crux/) o [RUM](https://developer.mozilla.org/docs/Web/Performance/Rum-vs-Synthetic), no tienen esta limitación y son un complemento valioso para los datos de laboratorio, ya que reflejan la experiencia que tienen los usuarios reales. Los datos de campo no pueden ofrecer el tipo de información de diagnóstico que se obtiene en el laboratorio, por lo que ambos van de la mano.

## Identificar dónde se puede mejorar en Web Vitals

### Identificar el elemento de pintura con contenido más grande

LCP (pintura con contenido más grande) es una medida de la experiencia de carga percibida. Marca el punto durante la carga de la página cuando el contenido principal o "más grande" se ha cargado y es visible para el usuario.

Lighthouse tiene una auditoría de "Elemento de pintura con contenido más grande" que identifica qué elemento fue la pintura con contenido más grande. Al pasar el cursor sobre el elemento, se resaltará en la ventana principal del navegador.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/qeNJwYAVxysRV0okWmf4.png", alt="Largest Contentful Paint element", width="800", height="505" %}</figure>

Si este elemento es una imagen, esta información es una sugerencia útil de que es posible que desees optimizar la carga de esta imagen. Lighthouse incluye una serie de auditorías de optimización de imágenes para ayudarte a comprender si tus imágenes podrían comprimirse, cambiarse de tamaño o entregarse mejor en un formato de imagen moderno más óptimo.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/8RVIyj6NiMfx7VDVbQmI.png", alt="Properly size images audit", width="800", height="468" %}</figure>

También puedes encontrar útil el [LCP Bookmarklet](https://gist.github.com/anniesullie/cf2982342337fd1b2be95c2d5fe5ea06) de Annie Sullivan para identificar rápidamente el elemento LCP con un rectángulo rojo con solo un clic.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/eZJdYsdfsNniDW1KRJkE.png", alt="Highlighting the LCP element with a bookmarklet", width="800", height="509" %}</figure>

### Precarga de imágenes descubiertas tardíamente para mejorar LCP

Para mejorar la pintura con contenido más grande, carga [previamente](/preload-responsive-images/) tus imágenes heroicas críticas si el navegador las descubre tarde. Un descubrimiento tardío puede ocurrir si un paquete de JavaScript necesita ser cargado antes de que la imagen sea descubrible.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/K9EPBZdSFoyXVDHoDjTx.png", alt="Preload the largest contentful paint image", width="800", height="489" %}</figure>

{% Aside %} La **precarga debe usarse con moderación**. El ancho de banda de la red es un recurso escaso y el uso de la precarga puede producirse a costa de otro recurso. Para utilizar la precarga de forma eficaz, asegúrate de que los recursos se ordenan correctamente para evitar el retroceso de otras métricas cuando otros recursos de la página también se consideran importantes (por ejemplo, CSS, JS, fuentes críticas). El [costo de la precarga](https://docs.google.com/document/d/1ZEi-XXhpajrnq8oqs5SiW-CXR3jMc20jWIzN5QRy1QA/edit) cubre esto con más detalle. {% endAside %}

Lighthouse 6.5 y superior sugiere ahora oportunidades para aplicar esta optimización.

Hay algunas preguntas comunes que nos hacen sobre la precarga de imágenes LCP que también puede valer la pena ver brevemente.

¿Se pueden precargar imágenes responsivas? [Sí](/preload-responsive-images/#imagesrcset-and-imagesizes). Digamos que tenemos una imagen heroica responsiva como se especifica usando `srcset` y `sizes` <br> como a continuación:

```html
<img src="lighthouse.jpg"
          srcset="lighthouse_400px.jpg 400w,
                  lighthouse_800px.jpg 800w,
                  lighthouse_1600px.jpg 1600w" sizes="50vw" alt="A helpful
Lighthouse">
```

Gracias a los `imagesrcset` e `imagesizes` agregados al `link`, podemos precargar una imagen responsiva usando la misma lógica de selección de imágenes utilizada por `srcset` y `sizes`:

```html
<link rel="preload" as="image" href="lighthouse.jpg"
           imagesrcset="lighthouse_400px.jpg 400w,
                        lighthouse_800px.jpg 800w,
                        lighthouse_1600px.jpg 1600w"
imagesizes="50vw">
```

¿La auditoría también destacará las oportunidades de precarga si la imagen LCP se define mediante un fondo CSS? Si.

Cualquier imagen marcada como imagen LCP, ya sea a través de fondo CSS o `<img>` es candidata si se descubre a una profundidad de cascada de tres o más.

### Identificar las contribuciones de CLS (cambio de diseño acumulativo)

El cambio de diseño acumulativo es una medida de la estabilidad visual. Cuantifica cuánto cambia visualmente el contenido de una página. Lighthouse tiene una auditoría para depurar CLS llamada "Evitar grandes cambios de diseño".

Esta auditoría destaca los elementos DOM que más contribuyen a los cambios de página. En la columna Elemento de la izquierda verás la lista de estos elementos DOM y, a la derecha, su contribución global al CLS.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/X31lkLFtfjDZdO2O7ytV.png", alt="The avoid large layout shifts audit in Lighthouse highlighting relevant DOM nodes contributing to CLS", width="800", height="525" %}</figure>

Gracias a la nueva función de capturas de pantalla de elementos de Lighthouse, podemos ver una vista previa de los elementos clave anotados en la auditoría, así como hacer clic para ampliar la vista:

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/L9geZVvkATRlAVcZA6dx.png", alt="Clicking on an Element screenshot will expand it", width="800", height="525" %}</figure>

Para el CLS posterior a la carga, puede ser útil *visualizar de forma persistente* con rectángulos qué elementos contribuyeron más al CLS. Esta es una característica que encontrarás en herramientas de terceros como el [panel de control Core Web Vitals](https://speedcurve.com/blog/web-vitals-user-experience/) de SpeedCurve y para la que me encanta usar [Layout Shift GIF Generator de Defaced](https://defaced.dev/tools/layout-shift-gif-generator/):

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/ju6XjKBYzF6G537myjUW.gif", alt="the layout shift generator highlighting shifts", width="800", height="450" %}</figure>

Para obtener una vista de todo el sitio de los problemas de cambio de diseño, aprovecho mucho [el informe Core Web Vitals de Search Console](https://support.google.com/webmasters/answer/9205520?hl=en). Esto me permite ver los tipos de páginas de mi sitio con un CLS alto (en este caso, me ayuda a identificar en qué parciales de plantilla necesito dedicar mi tiempo):

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/2Ihb2GYkbpGzYLYoZEDP.png", alt="Search Console displaying CLS issues", width="800", height="506" %}</figure>

{% Aside %} Para reducir los cambios de diseño causados por las fuentes web, no pierdas de vista el nuevo descriptor [ajuste de tamaño](https://groups.google.com/a/chromium.org/g/blink-dev/c/1PVr94hZHjU/m/J0xT8-rlAQAJ) `@font-face`. Esto permite ajustar el tamaño de las fuentes alternativas para reducir CLS. {% endAside %}

### Identificación de CLS a partir de imágenes sin dimensiones

Para [limitar](/optimize-cls/#images-without-dimensions) el cambio de diseño acumulativo causado por imágenes sin dimensiones, incluye atributos de tamaño de ancho y alto en sus imágenes y elementos de video. Este enfoque garantiza que el navegador pueda asignar la cantidad correcta de espacio en el documento mientras se carga la imagen.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/fZRkmM18rvfy6y7LB1Qx.png", alt="Audit for image elements without explicit width and height", width="800", height="489" %}</figure>

Consulta [Establecer la altura y el ancho en las imágenes es importante nuevamente](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/) para obtener un buen informe sobre la importancia de pensar en las dimensiones de la imagen y la relación de aspecto.

### Identificación de CLS a partir de anuncios

[Publisher Ads for Lighthouse](https://developers.google.com/publisher-ads-audits) te permite encontrar oportunidades para mejorar la experiencia de carga de los anuncios en tu página, incluidas las contribuciones al cambio de diseño y las tareas largas que pueden indicar qué tan pronto los usuarios pueden utilizar tu página. En Lighthouse, puedes habilitar esto a través de Community Plugins.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/kR3jgctso6Hg0OxD8xwi.png", alt="Ads related audits highlighting opportunities to reduce time to request and layout shift", width="800", height="527" %}</figure>

Recuerda que los anuncios son una de las [mayores](/optimize-cls/#ads-embeds-and-iframes-without-dimensions) contribuciones a los cambios de diseño en la web. Es importante:

- Tener cuidado al colocar anuncios no adhesivos cerca de la parte superior de la ventana gráfica
- Eliminar los cambios reservando el mayor tamaño posible para el espacio publicitario.

### Evitar las animaciones no compuestas

Las animaciones que no están compuestas pueden presentarse como basura en dispositivos de gama baja si las tareas pesadas de JavaScript mantienen ocupado el hilo principal. Estas animaciones pueden introducir cambios de diseño.

Si Chrome descubre que una animación no se pudo componer, la informa a una traza de DevTools que Lighthouse lee, lo que le permite enumerar qué elementos con animaciones no se compusieron y por qué motivo. Puedes encontrarlos en la auditoría [Evitar animaciones no compuestas.](/non-composited-animations/)

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/heGuYXKeMrUftMvfrDU7.png", alt="Audit for avoiding non-composited animations", width="800", height="528" %}</figure>

### Depurar el retardo de la primera entrada / Tiempo total de bloqueo / Tareas largas

La primera entrada mide el tiempo desde que un usuario interactúa por primera vez con una página (por ejemplo, cuando hace clic en un enlace, toca un botón o usa un control personalizado impulsado por JavaScript) hasta el momento en que el navegador puede empezar a procesar los controladores de eventos en respuesta a esa interacción. Las tareas largas de JavaScript pueden afectar a esta métrica y al proxy de esta métrica, el tiempo total de bloqueo.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/LqBCtAXdByd4fBzoNc1K.png", alt="Audit for avoiding long main thread tasks", width="800", height="485" %}</figure>

Lighthouse incluye una auditoría [Evitar las tareas largas del hilo principal](/long-tasks-devtools/) que enumera las tareas más largas en el hilo principal. Esto puede ser útil para identificar los peores contribuyentes al retraso de entrada. En la columna de la izquierda podemos ver la URL de los scripts responsables de las tareas largas del hilo principal.

A la derecha podemos ver la duración de estas tareas. Como recordatorio, las tareas largas son tareas que se ejecutan durante más de 50 milisegundos. Se considera que esto bloquea el hilo principal el tiempo suficiente para afectar la velocidad de fotogramas o la latencia de entrada.

Si considero los servicios de terceros para el monitoreo, también me gusta bastante la [línea de tiempo de ejecución del hilo principal](https://calibreapp.com/docs/features/main-thread-execution-timeline) visual que tiene Caliber para visualizar estos costos, que destaca tanto las tareas principales como las secundarias que contribuyen a tareas largas que impactan en la interactividad.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/IGENqHBjC97pHslOQYc6.png", alt="The main-thread execution timeline visual Calibre has", width="800", height="155" %}</figure>

### Bloquear solicitudes de red para ver el impacto antes / después en Lighthouse

Chrome DevTools admite el [bloqueo de solicitudes de red](https://developer.chrome.com/docs/devtools/network/#block) para ver el impacto de los recursos individuales que se eliminan o no están disponibles. Esto puede ser útil para comprender el costo que tienen los scripts individuales (por ejemplo, los rastreadores o incrustaciones de terceros) en métricas como el Tiempo de bloqueo total (TBT) y el Tiempo para interactuar.

El bloqueo de solicitudes de red también funciona con Lighthouse. Echemos un vistazo rápido al informe Lighthouse de un sitio. La puntuación de rendimiento es 63/100 con un TBT de 400 ms. Profundizando en el código, encontramos que este sitio carga un polyfill de Intersection Observer en Chrome que no es necesario. ¡Vamos a bloquearlo!

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/DPXEXhOZL0Czjm10lBox.png", alt="Network request blocking", width="800", height="508" %}</figure>

Podemos hacer clic derecho en un script en el panel de DevTools Network y hacer clic en `Block Request URL` para bloquearlo. Aquí haremos esto para el polyfill Intersection Observer.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/iWB0jAtL0PKpwkmecOPf.png", alt="Block request URLs in DevTools", width="800", height="354" %}</figure>

A continuación, podemos volver a ejecutar Lighthouse. Esta vez podemos ver que nuestra puntuación de rendimiento ha mejorado (70/100) al igual que el Tiempo de bloqueo total (400ms =&gt; 300ms).

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/LiaMMxvy4prpFBIuSgfo.png", alt="The after view of blocking costly network requests", width="800", height="508" %}</figure>

### Reemplazar las costosas incrustaciones de terceros con una fachada

Es común usar recursos de terceros para incrustar videos, publicaciones en redes sociales o widgets en páginas. De forma predeterminada, la mayoría de las incrustaciones se cargan con entusiasmo de inmediato y pueden tener costosas cargas útiles que impactan negativamente en la experiencia del usuario. Esto es un desperdicio si el tercero no es crítico (por ejemplo, si el usuario necesita desplazarse antes de verlo).

Un patrón para mejorar el rendimiento de dichos widgets es [cargarlos de forma diferida cuando el usuario interactúa con ellos](https://addyosmani.com/blog/import-on-interaction/). Esto se puede hacer renderizando una vista previa ligera del widget (una fachada) y solo se carga la versión completa si un usuario interactúa con él. Lighthouse tiene una auditoría que recomienda recursos de terceros que pueden [cargarse de forma diferida con una fachada](/third-party-facades/), como incrustaciones de videos de YouTube.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/iciXy3oVlPH7VuwN7toy.png", alt="Audit highlighting that some costly third party resources can be replaced", width="800", height="483" %}</figure>

Como recordatorio, Lighthouse [resaltará el código de terceros](/third-party-summary/) que bloquea el hilo principal durante más de 250 ms. Esto puede mostrar todo tipo de scripts de terceros (incluidos los creados por Google) que puede valer la pena diferir o cargar con retraso si lo que renderizan requiere desplazarse para verlo.

<figure>{% Img src="image/1L2RBhCLSnXjCnSlevaDjy3vba73/K0Oxmu1XEN2P3NQIknyH.png", alt="Reduce the cost of third-party JavaScript audit", width="800", height="556" %}</figure>

### Más allá de Core Web Vitals

Más allá de destacar Core Web Vitals, las versiones recientes de Lighthouse y PageSpeed Insights también intentan brindar una guía concreta que puedes seguir para mejorar la rapidez con la que se cargan las aplicaciones web con mucho JavaScript si tiene los mapas de origen activados.

Estos incluyen una creciente colección de auditorías para reducir el costo de JavaScript en tu página, como la reducción de la dependencia de polyfills y duplicados que pueden no ser necesarios para la experiencia del usuario.

Para obtener más información sobre las herramientas de Core Web Vitals, estate atento a la cuenta de Twitter del [equipo de Lighthouse](https://twitter.com/____lighthouse) y a las [novedades de DevTools](https://developers.google.com/web/updates/2020/05/devtools).

[Imagen](https://unsplash.com/photos/7I9aCavB8RI) [heroica de Mercedes Mehling](https://unsplash.com/@mrs80z) en [Unsplash](https://unsplash.com) .
