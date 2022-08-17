---
title: Optimice Largest Contentful Paint
subhead: Cómo renderizar su contenido principal más rápido.
authors:
  - houssein
date: 2020-05-05
updated: 2022-07-18
hero: image/admin/qqTKhxUFqdLXnST2OFWN.jpg
alt: Optimizar el banner LCP
description: Largest Contentful Paint (LCP) se puede utilizar para determinar cuándo el contenido principal de la página se terminó de renderizar en la pantalla. Aprenda a optimizar LCP mejorando los tiempos de respuesta lentos del servidor, los tiempos de carga de recursos y renderización del lado del cliente.
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='1073' %}

<blockquote>
  <p>No puedo ver ningún contenido útil. ¿Por qué tarda tanto en cargar? 😖</p>
</blockquote>

Uno de los factores que contribuyen a una mala experiencia de usuario es el tiempo que tarda el usuario en ver cualquier contenido renderizado en la pantalla. [First Contentful Paint: Primer despliegue del contenido](/fcp) (FCP) mide el tiempo que tarda en renderizarse el contenido del DOM inicial, pero no captura el tiempo que tarda en renderizarse el contenido más grande (generalmente más significativo) de la página.

[Largest Contentful Paint : Despliegue del contenido más extenso](/lcp) (LCP) es una métrica de [Core Web Vitals](/vitals/) y mide cuándo se hace visible el elemento de contenido más grande en la ventana de visualización. Puede utilizarse para determinar cuándo el contenido principal de la página terminó la renderización en la pantalla.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9trpfS9wruEPGekHqBdn.svg", alt="Los valores buenos de LCP son 2,5 segundos, los valores malos son superiores a 4,0 segundos y cualquier cosa intermedia necesita mejora", width="384", height="96" %}
</picture>

Las causas más comunes de una LCP deficiente son:

- [Tiempos de respuesta lentos del servidor](#slow-servers)
- [JavaScript y CSS bloquean la renderización](#render-blocking-resources)
- [Tiempos de carga de recursos lentos](#slow-resource-load-times)
- [Renderización del lado del cliente](#client-side-rendering)

## Tiempos de respuesta lentos del servidor {: #slow-servers}

Cuanto más tarda un navegador en recibir el contenido del servidor, más tiempo tarda en renderizar cualquier cosa en la pantalla. Un tiempo de respuesta del servidor más rápido mejora directamente cada métrica de carga de la página, incluido el LCP.

Antes que nada, mejore cómo y dónde su servidor maneja su contenido. Utilice [**Time to First Byte: Tiempo hasta el primer byte**](/ttfb/) (TTFB) para medir los tiempos de respuesta de su servidor. Puede mejorar su TTFB de varias formas:

- <a>Optimizar su servidor</a>
- Enrutar a los usuarios a una CDN cercana
- Activos del caché
- Publicar las páginas HTML en cache-first
- Establecer conexiones con terceros con anticipación
- Utilizar intercambios firmados

### Optimizar su servidor

¿Ejecuta consultas costosas que le toman a su servidor una cantidad significativa de tiempo en completar? ¿O hay otras operaciones complejas en el lado del servidor que retrasan el proceso para devolver el contenido de la página? Analizar y mejorar la eficiencia de su código del lado del servidor mejorará directamente el tiempo que tarda el navegador en recibir los datos.

En vez de publicar inmediatamente una página estática cuando el navegador la solicita, muchos frameworks web del lado del servidor necesitan crear la página web de forma dinámica. En otras palabras, en vez de enviar un archivo HTML completo que ya está listo cuando el navegador lo solicita, los frameworks necesitan ejecutar la lógica para crear la página. Esto podría deberse a los resultados pendientes de una consulta a la base de datos o incluso porque los componentes se deben generar en el marcado por un framework de interfaz de usuario (como [React](https://reactjs.org/docs/react-dom-server.html)). Muchos frameworks web que se ejecutan en el servidor tienen una guía de rendimiento que se puede utilizar para acelerar este proceso.

{% Aside %} Consulte [Cómo reparar un servidor sobrecargado](/overloaded-server/), para obtener más sugerencias. {% endAside %}

### Enrutar a los usuarios a una CDN cercana

Una Red de distribución de contenidos (CDN) es una red de servidores que se distribuyen en diferentes ubicaciones. Si el contenido de su página web se aloja en un solo servidor, su sitio web se cargará más lentamente para los usuarios que se encuentren geográficamente más lejos, porque las solicitudes de su navegador literalmente tienen que viajar por todo el mundo. Considere la posibilidad de utilizar una CDN para garantizar que sus usuarios nunca tengan que esperar las solicitudes de red a servidores lejanos.

### Activos del caché

Si su HTML es estática y no necesita cambiar en cada solicitud, el almacenamiento en caché puede evitar que se vuelva a crear innecesariamente. Al almacenar una copia del HTML generado en el disco, el almacenamiento en el caché del lado del servidor puede reducir la TTFB y minimizar el uso de los recursos.

Dependiendo de su cadena de herramientas, hay muchas maneras diferentes de aplicar el almacenamiento en el caché del servidor:

- Configure proxies inversos ([Varnish](https://varnish-cache.org/), [nginx](https://www.nginx.com/)) para publicar contenido en el caché o actuar como un servidor del caché cuando se instala frente a un servidor de aplicaciones
- Configure y administre el comportamiento del caché de su proveedor en la nube ([Firebase](https://firebase.google.com/docs/hosting/manage-cache), [AWS](https://aws.amazon.com/caching/), [Azure)](https://docs.microsoft.com/azure/architecture/best-practices/caching))
- Utilice una CDN que proporcione servidores perimetrales para que su contenido se almacene en el caché y esté más cerca de sus usuarios

### Publicar las páginas HTML en cache-first

Cuando se instala, un [service worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) se ejecuta en segundo plano del navegador y puede interceptar las solicitudes del servidor. Este nivel de control programático del caché permite almacenar en el caché parte o todo el contenido de la página HTML y solo actualizar el caché cuando el contenido cambió.

En la siguiente gráfica se muestra cómo se han reducido las distribuciones de LCP en un sitio utilizando este patrón:

<figure>
  {% Img
    src="image/admin/uB0Sm56R88MRF16voQ1k.png",
    alt="Las distribuciones de Largest Contentful Paint antes y después de utilizar el almacenamiento en el caché de HTML",
    width="800",
    height="495"
  %}
  <figcaption>
    La distribución Contentful Paint más grande, para cargas de páginas mediante, y sin utilizar, un service worker -
    <a href="https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/">philipwalton.com</a>
  </figcaption>
</figure>

En la gráfica se muestra la distribución de la LCP de un solo sitio durante los últimos 28 días, segmentado por el estado del service worker. Observe cómo muchas más cargas de páginas tienen un valor de LCP más rápido después de que se introdujo el servicio de páginas HTML cache-first en el service worker (parte azul de la gráfica).

{% Aside %} Para obtener más información sobre las técnicas para publicar páginas HTML completas o parciales en cache-first, eche un vistazo a [Cargas útiles HTML más pequeñas con Service Workers](https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/) {% endAside %}

### Establecer conexiones con terceros con anticipación

Las solicitudes del servidor a orígenes de terceros también pueden afectar a LCP, especialmente si son necesarias para mostrar contenido crítico en la página. Utilice `rel="preconnect"` para informar al navegador que su página tiene la intención de establecer una conexión lo antes posible.

```html
<link rel="preconnect" href="https://example.com" />
```

También puede utilizar `dns-prefetch` para resolver las búsquedas de DNS de forma más rápida.

```html
<link rel="dns-prefetch" href="https://example.com" />
```

Aunque ambas sugerencias funcionan de manera diferente, considere utilizar `dns-prefetch` como alternativa para los navegadores que no admiten `preconnect`.

```html
<head>
  …
  <link rel="preconnect" href="https://example.com" />
  <link rel="dns-prefetch" href="https://example.com" />
</head>
```

{% Aside %} Obtenga más información leyendo [Establecer conexiones de red con anticipación para mejorar la velocidad que se percibe en la página](/preconnect-and-dns-prefetch/) {% endAside %}

### Utilizar intercambios firmados (SXG)

[Los intercambios firmados (SXG)](/signed-exchanges) son un mecanismo de entrega que permite experiencias de usuario más rápidas al proporcionar contenido en un formato que se puede almacenar en el caché fácilmente. Específicamente, la [Google Search](https://developers.google.com/search/docs/advanced/experience/signed-exchange) almacenará en el caché y, a veces, buscará previamente los SXG. Para los sitios que reciben una gran parte de su tráfico de Google Search, los SXG pueden ser una herramienta importante para mejorar LCP. Para obtener más información, consulte [Intercambios firmados](/signed-exchanges).

## Renderización que bloquea JavaScript y CSS {: #render-blocking-resources }

Antes de que un navegador pueda renderizar cualquier contenido, necesita analizar el marcado HTML en un árbol DOM. El analizador HTML se detendrá si encuentra hojas de estilo externas (`<link rel="stylesheet">`) o etiquetas de JavaScript sincrónicas (`<script src="main.js">`).

Los scripts y las hojas de estilo son recursos que bloquean la renderización y retrasan la FCP y, como consecuencia, la LCP. Retrasa cualquier JavaScript y CSS no crítico para acelerar la carga del contenido principal de su página web.

### Reducir el tiempo de bloqueo de CSS

Asegúrese de que solo la cantidad mínima de CSS necesaria esté bloqueando la renderización en su sitio con lo siguiente:

- Minificar CSS
- Retrasar CSS no crítico
- CSS crítico con estilos integrados en el código

### Minificar CSS

Para facilitar la legibilidad, los archivos CSS pueden contener caracteres como espaciado, sangría o comentarios. Todos estos caracteres son innecesarios para el navegador, y la minificación de estos archivos garantizará que se eliminen. En última instancia, reducir la cantidad de CSS de bloqueo siempre mejorará el tiempo que se tarda en renderizar completamente el contenido principal de la página (LCP).

Si utiliza un agrupador de módulos o una herramienta de compilación, incluya un complemento adecuado para minificar los archivos CSS en cada compilación:

- Para webpack: [optimice-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)
- Para Gulp: [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
- Para Rollup: [rollup-plugin-css-porter](https://www.npmjs.com/package/rollup-plugin-css-porter)

<figure>{% Img src="image/admin/vQXSKrY1Eq3CKkNbu9Td.png", alt="Ejemplo de mejora de LCP: antes y después de minificar CSS", width="800", height="139" %}<figcaption> Ejemplo de mejora de LCP: antes y después de minificar CSS</figcaption></figure>

{% Aside %} Para obtener más información, consulte la guía [Minify CSS](/minify-css/). {% endAside %}

### Retrasar CSS no crítico

Utilice la pestaña [Coverage](https://developer.chrome.com/docs/devtools/coverage/) de Chrome DevTools para encontrar cualquier CSS que no utilice en su página web.

{% Img src="image/admin/wjS4NrU5EsJeCuvK0zhn.png", alt="Pestaña Coverage de Chrome DevTools", width="800", height="559" %}

Para optimizar:

- Elimine por completo cualquier CSS que no utilice o muévalo a otra hoja de estilo si se utiliza en una página separada de su sitio.

- Para cualquier CSS que no sea necesaria para la renderización inicial, utilice [loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md) para cargar los archivos de forma asincrónica, lo que aprovecha `rel="preload"` y `onload`.

```html
<link rel="preload" href="stylesheet.css" as="style" onload="this.rel='stylesheet'">
```

<figure>{% Img src="image/admin/2fcwrkXQRQrM8w1qyy3P.png", alt="Ejemplo de como mejorar LCP: antes y después de aplazar CSS no crítico", width="800", height="139" %} <figcaption> Ejemplo de como mejorar LCP: antes y después de aplazar CSS no crítico </figcaption></figure>

{% Aside %} Para obtener más información, consulte la guía [Retrasar CSS no crítico](/defer-non-critical-css/). {% endAside %}

### CSS crítico con estilos integrados en el código

Estilos integrados en el código de cualquier CSS de ruta crítica que se utilice para el contenido de la mitad superior de la página que lo incluya directamente en el `<head>.`

<figure>{% Img src="image/admin/m0n0JsLpH9JsNnXywSwz.png", alt="CSS crítico con estilos integrados en el código", width="800", height="325" %} <figcaption>CSS crítico con estilos integrados en el código</figcaption></figure>

La inserción de estilos importantes elimina la necesidad de realizar una solicitud de ida y vuelta para obtener CSS crítico. Retrasar el resto minimiza el tiempo de bloqueo de CSS.

Si no puede agregar manualmente estilos integrados en el código a su sitio, utilice una biblioteca para automatizar el proceso. Algunos ejemplos son:

- [Critical](https://github.com/addyosmani/critical) , [CriticalCSS](https://github.com/filamentgroup/criticalCSS) y [Penthouse](https://github.com/pocketjoso/penthouse) son paquetes que extraen e incorporan estilos integrados en el código de CSS, en la parte superior de la página.
- [Critters](https://github.com/GoogleChromeLabs/critters) es un complemento de webpack que integra estilos integrados en el código de CSS crítico y carga diferida de REST

<figure>{% Img src="image/admin/L8sc51bd3ckxwnUfczC4.png", alt="Ejemplo de como mejorar LCP antes y después de incorporar estilos integrados en el código de CSS crítico", width="800", height="175" %} <figcaption> Ejemplo de como mejorar LCP antes y después de incorporar estilos integrados en el código de CSS crítico </figcaption></figure>

{% Aside %} Eche un vistazo a la guía sobre [Cómo extraer CSS crítico](/extract-critical-css/) para obtener más información. {% endAside %}

### Reducir el tiempo de bloqueo de JavaScript

Descargue y publique la cantidad mínima de JavaScript necesaria a los usuarios. La reducción de la cantidad que JavaScript bloquea el sitio se traduce en una renderización más rápida y, en consecuencia, en una mejor LCP.

Esto se puede lograr optimizando sus scripts de diferentes formas:

- [Minificar y comprimir archivos JavaScript](/reduce-network-payloads-using-text-compression/)
- [Retrasar JavaScript no utilizado](/reduce-javascript-payloads-with-code-splitting/)
- [Minimice los polyfills no utilizados](/serve-modern-code-to-modern-browsers/)

{% Aside %} La guía [Optimizar First Input Delay](/optimize-fid/) cubre todas las técnicas necesarias para reducir el tiempo de bloqueo de JavaScript con un poco más de detalle. {% endAside %}

## Tiempos de carga de recursos lentos {: #slow-resource-load-times}

Aunque un aumento en el tiempo de bloqueo de CSS o JavaScript se traduce directamente en un peor rendimiento, el tiempo que se tarda en cargar muchos otros tipos de recursos también puede afectar los tiempos de despliegue. Los tipos de elementos que afectan a LCP son:

- `<img>` elementos
- `<image>` elementos dentro de un elemento `<svg>`
- `<video>` elementos (la imagen del [cartel](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster) se utilizan para medir LCP)
- Un elemento con una imagen de segundo plano que se carga a través de la función [`url()`](https://developer.mozilla.org/docs/Web/CSS/url()) (a diferencia de un <a>gradiente CSS</a>)
- Elementos a [nivel de bloque](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements) que contienen nodos de texto u otros elementos de texto con estilos integrados en el código.

El tiempo que se tarda en cargar estos elementos si se renderizan en la mitad superior de la página tendrá un efecto directo en LCP. Hay algunas formas de garantizar que estos archivos se carguen lo más rápido posible:

- Optimizar y comprimir imágenes
- Precargar recursos importantes
- Comprimir archivos de texto
- Entregar diferentes activos basados en la conexión de la red (servicio adaptable)
- Almacenar activos en el caché con un service worker

### Optimizar y comprimir imágenes

En muchos sitios, las imágenes son el elemento más grande a la vista cuando la página terminó de cargarse. En las imágenes hero los grandes carruseles o los banners son ejemplos comunes de esto.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/unWra6cq0hPJJJT7Y3ye.png", alt="", width="459", height="925" %} <figcaption>Imagen como elemento más grande de la página: <a href="https://design.google/">design.google</a></figcaption></figure>

Mejorar el tiempo que se tarda en cargar y renderizar este tipo de imágenes acelerará directamente la LCP. Para hacer esto:

- En primer lugar, considere la posibilidad de no utilizar una imagen. Si no es relevante para el contenido, elimínela.
- Comprima imágenes (por ejemplo con [Imagemin](/use-imagemin-to-compress-images))
- Convierta imágenes a formatos más nuevos (JPEG 2000, JPEG XR o WebP)
- Utilice imágenes responsive
- Considere utilizar una imagen CDN

{% Aside %} Eche un vistazo a [Optimice sus imágenes](/fast/#optimize-your-images) para obtener guías y recursos que expliquen todas estas técnicas en detalle. {% endAside %}

### Precargar recursos importantes

A veces, los recursos importantes que se declaran o utilizan en un determinado archivo CSS o JavaScript pueden recuperarse más tarde de lo que le gustaría, como una fuente escondida en uno de los muchos archivos CSS de una aplicación.

Si sabe que un recurso en particular debe ser prioritario, utilice `<link rel="preload">` para recuperarlo antes. [Se pueden precargar muchos tipos de recursos](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#What_types_of_content_can_be_preloaded), pero debería centrarse primero en [precargar activos críticos](/preload-critical-assets/), como fuentes, imágenes o videos en la mitad superior de la página, y CSS o JavaScript de ruta crítica.

```html
<link rel="preload" as="script" href="script.js" />
<link rel="preload" as="style" href="style.css" />
<link rel="preload" as="image" href="img.png" />
<link rel="preload" as="video" href="vid.webm" type="video/webm" />
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

Desde Chrome 73, la precarga se puede utilizar junto con [imágenes responsivas](/preload-responsive-images/) para combinar ambos patrones y conseguir una carga de imágenes mucho más rápida.

```html
<link
  rel="preload"
  as="image"
  href="wolf.jpg"
  imagesrcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w"
  imagesizes="50vw"
/>
```

### Comprimir archivos de texto

Los algoritmos de compresión, como [Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) y [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html), pueden reducir significativamente el tamaño de los archivos de texto (HTML, CSS, JavaScript) conforme se transfieren entre el servidor y el navegador. Gzip efectivamente es compatible con todos los navegadores y Brotli, que proporciona resultados de compresión aún mejores, [se puede utilizar en casi todos los navegadores más recientes](https://caniuse.com/#feat=brotli).

La compresión de sus recursos minimizará su tamaño de entrega, mejorando los tiempos de carga y, en consecuencia, la LCP.

1. En primer lugar, verifique si su servidor ya comprime archivos automáticamente. La mayoría de las plataformas de alojamiento, CDN y servidores proxy inversos codifican activos con compresión de forma predeterminada o le permiten configurarlos fácilmente.
2. Si necesita modificar su servidor para comprimir los archivos, considere la posibilidad de utilizar Brotli en vez de gzip, ya que puede proporcionar mejores índices de compresión.
3. Una vez que elija un algoritmo de compresión, comprima los activos con anticipación durante el proceso de creación en vez de hacerlo sobre la marcha, según lo solicite el navegador. Esto minimiza la sobrecarga del servidor y se evitan retrasos en las solicitudes, especialmente cuando se utilizan índices de compresión elevados.

<figure>{% Img src="image/admin/Ckh2Jjkoh7ojLj5Wxeqc.png", alt="Ejemplo de como mejorar LCP: antes y después de utilizar la compresión Brotli", width="800", height="139" %} <figcaption> Ejemplo de como mejorar LCP: antes y después de utilizar la compresión Brotli </figcaption></figure>

{% Aside %} Para obtener más información, consulte la guía [Minificar y comprimir cargas útiles de la red](/reduce-network-payloads-using-text-compression/). {% endAside %}

### Servicio adaptativo

Cuando se cargan los recursos que conforman el contenido principal de una página, puede ser efectivo obtener de forma condicional diferentes activos dependiendo del dispositivo del usuario o de las condiciones de la red. Esto se puede hacer utilizando las API [Información de la red](https://wicg.github.io/netinfo/), [Memoria del dispositivo](https://www.w3.org/TR/device-memory/) y [Concurrencia del hardware](https://html.spec.whatwg.org/multipage/workers.html#navigator.hardwareconcurrency).

Si tienes activos grandes que son críticos para la renderización inicial, puedes utilizar diferentes variaciones del mismo recurso dependiendo de la conexión o el dispositivo del usuario. Por ejemplo, puedes mostrar una imagen en vez de un video para cualquier velocidad de conexión inferior a 4G:

```js
if (navigator.connection && navigator.connection.effectiveType) {
  if (navigator.connection.effectiveType === '4g') {
    // Load video
  } else {
    // Load image
  }
}
```

Una lista de propiedades útiles que puede utilizar son:

- `navigator.connection.effectiveType`: tipo de conexión efectiva
- `navigator.connection.saveData`: ahorro de datos habilitado/deshabilitado
- `navigator.hardwareConcurrency`: recuento de núcleos del CPU
- `navigator.deviceMemory`: memoria del dispositivo

{% Aside %} Para obtener más información, consulte [Servicio adaptativo basado en la calidad de la red](/adaptive-serving-based-on-network-quality/). {% endAside %}

### Almacenar activos en el caché con un service worker

Los service workers se pueden utilizar para muchas tareas útiles, incluyendo publicar respuestas en HTML más pequeñas como se mencionó anteriormente en este artículo. También se pueden utilizar para almacenar en el caché cualquier recurso estático que se pueda publicar en el navegador en vez de desde la red en solicitudes repetidas.

El almacenamiento previo en el caché de recursos críticos mediante un service worker puede reducir sus tiempos de carga de manera significativa, especialmente para los usuarios que recargan la página web con una conexión más débil (o incluso acceden a ella sin conexión). Las librerías como [Workbox](https://developer.chrome.com/docs/workbox/) pueden hacer que el proceso de actualización de activos almacenados previamente en el caché sea más fácil que escribir en un service worker personalizado para que lo maneje usted mismo.

{% Aside %} Eche un vistazo a la [confiabilidad de la red](/reliable/) para obtener más información sobre los service workers y Workbox. {% endAside %}

## Representación del lado del cliente {: #client-side-rendering}

Muchos sitios utilizan la lógica de JavaScript del lado del cliente para renderizar las páginas directamente en el navegador. Los frameworks y las librerías, como [React](https://reactjs.org/), [Angular](https://angular.io/) y [Vue](https://vuejs.org/), han facilitado la creación de aplicaciones de una sola página que manejan diferentes facetas de una página web completamente en el cliente y no en el servidor.

Si está creando un sitio que se renderiza principalmente en el lado del cliente, debe tener cuidado con el efecto que puede tener en LCP si se utiliza un gran paquete de JavaScript. Si no se implementan optimizaciones para evitarlo, es posible que los usuarios no vean ni interactúen con ningún contenido de la página hasta que todo el JavaScript crítico haya terminado de descargarse y ejecutarse.

Al crear un sitio renderizado del lado del cliente, considere las siguientes optimizaciones:

- Minimizar JavaScript crítico
- Utilizar la renderización del lado del servidor
- Utilizar la renderización previa

### Minimizar JavaScript crítico

Si el contenido de su sitio solo se vuelve visible, o se puede interactuar con él, después de que se descargue una cierta cantidad de JavaScript: es aún más importante reducir el tamaño de su paquete tanto como sea posible. Esto se puede hacer al:

- Minificar JavaScript
- Retrasar JavaScript no utilizado
- Minimizar los polyfills no utilizados

Vuelva a la sección [Reducir el tiempo de bloqueo de JavaScript](#reduce-javascript-blocking-time) para obtener más información sobre estas optimizaciones.

### Utilizar la renderización del lado del servidor

Minimizar la cantidad de JavaScript siempre debe ser lo primero en lo que se debe centrar para los sitios que en su mayoría se renderizan por el cliente. Sin embargo, también debería considerar la posibilidad de combinar una experiencia de renderizado en el servidor para mejorar la LCP tanto como sea posible.

Este concepto funciona utilizando el servidor para renderizar la aplicación en HTML, donde el cliente luego "[hidrata](https://www.gatsbyjs.org/docs/react-hydration/)" todo el JavaScript y los datos requeridos en el mismo contenido DOM. Esto puede mejorar la LCP al garantizar que el contenido principal de la página se renderice primero en el servidor en vez de solo en el lado del cliente, pero hay algunos inconvenientes:

- Mantener la misma aplicación renderizada en JavaScript en el servidor y el cliente puede aumentar la complejidad.
- Ejecutar JavaScript para renderizar un archivo HTML en el servidor siempre aumentará los tiempos de respuesta del servidor (TTFB) en comparación con solo publicar páginas estáticas desde el servidor.
- Puede parecer que se puede interactuar con una página renderizada por el servidor, pero no puede responder a ninguna entrada del usuario hasta que se haya ejecutado todo el JavaScript del lado del cliente. En resumen, puede hacer que el [**Time to Interactive: Tiempo de Interacción**](/tti/) (TTI) empeore.

### Utilizar la renderización previa

La renderización previa es una técnica independiente que es menos compleja que la renderización del lado del servidor y también proporciona una forma de mejorar LCP en su aplicación. Se utiliza un navegador sin encabezado, el cual es un navegador sin interfaz de usuario, para generar archivos HTML estáticos de cada ruta durante el tiempo de la creación. Estos archivos se pueden enviar junto con los paquetes de JavaScript necesarios para la aplicación.

Con la renderización previa, la TTI sigue teniendo un impacto negativo, pero los tiempos de respuesta del servidor no se ven tan afectados como lo harían con una solución de la renderización del lado del servidor que renderiza dinámicamente cada página solo después de que se solicita.

<figure>{% Img src="image/admin/sm9s16UHfh8a5MDEWjxa.png", alt="Ejemplo de como mejorar LCP: antes y después de hacer una renderización previa", width="800", height="139" %} <figcaption> Ejemplo de como mejorar LCP: antes y después de hacer una renderización previa </figcaption></figure>

{% Aside %} Para profundizar en las diferentes arquitecturas de renderización de servidores, eche un vistazo a la [Renderización en la web](/rendering-on-the-web/). {% endAside %}

## Herramientas para desarrolladores

Hay varias herramientas disponibles para medir y depurar LCP:

- [Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/) incluye soporte para medir LCP en un entorno de laboratorio.

    {% Img src="image/admin/Sar3Pa7TDe9ibny6sfq4.jpg", alt="Lighthouse 6.0", width="800", height="309" %}

- La sección de **sincronizaciones** del [rendimiento](https://developer.chrome.com/docs/devtools/evaluate-performance/) en el panel en Chrome DevTools incluye un marcador de LCP y muestra qué elemento se asocia con LCP cuando se pasa sobre el campo **Nodo relacionado**.

    {% Img src="image/admin/sxczQPKH0cvMBsNCx5uH.png", alt="LCP en Chrome DevTools", width="800", height="509" %}

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) proporciona valores de LCP del mundo real agregados a nivel de origen.

*Agradecemos a Philip Walton, Katie Hempenius, Kayce Basques e Ilya Grigorik por sus comentarios.*
